/**
 * generate-commands.ts
 *
 * Build-time script. Reads packages/api/spec/openapi.json and emits
 * packages/cli/src/generated-commands.ts — a Commander registration
 * file with one command per public API operation.
 *
 * Usage
 * -----
 *   bun run scripts/generate-commands.ts
 *
 * Filtering
 * ---------
 * Operations are excluded when their `security` array contains ONLY
 * user-internal / user-staff / user-internal-or-staff entries, plus an
 * explicit EXCLUDE list for runtime-internal endpoints (ContentKit render).
 *
 * Naming (path-driven)
 * --------------------
 * Command structure is derived from the URL path, not the operationId or tag:
 *
 *   - The command GROUP chain is the chain of collection segments in the path,
 *     nested arbitrarily deep, e.g.
 *        GET /spaces/{spaceId}/change-requests/{crId}/comments
 *          -> spaces change-requests comments list <spaceId> <crId>
 *
 *   - P1 (scope-flag merge): when a path is a strict collection/{id} alternation
 *     ending in a TOP-LEVEL resource (one that has its own /{resource}/{id} path),
 *     the parent(s) collapse into scope FLAGS and all such variants merge into a
 *     single `list`/`create` command that dispatches on which scope flag is set:
 *        GET /orgs/{orgId}/spaces           -> spaces list --organization <orgId>
 *        GET /collections/{cId}/spaces      -> spaces list --collection <cId>
 *     A merged command errors unless exactly one scope is supplied (unless a
 *     parent-less variant exists, e.g. GET /integrations).
 *
 *   - P2 (nest): everything else nests under the first top-level resource in the
 *     path (or the first collection when there is none).
 *
 * The VERB comes from the operationId's leading word (createSpace -> create,
 * duplicateSpace -> duplicate), normalized so a GET over a collection is `list`.
 * A trailing path segment that duplicates the verb (…/duplicate) is dropped from
 * the group. A small OVERRIDES table handles the handful of endpoints the
 * mechanical rule names poorly.
 *
 * Output format
 * -------------
 * human-readable ("pretty") by default on a TTY, YAML when piped/redirected,
 * overridable with --pretty / --yaml / --json.
 *
 * Shell completion
 * ----------------
 * The command tree is also emitted as bash/zsh/fish completion scripts, exposed
 * via `gitbook completion <shell>`.
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OpenAPISpec {
    paths: Record<string, PathItem>;
    components?: {
        schemas?: Record<string, SchemaObject>;
        parameters?: Record<string, ParameterObject>;
    };
    tags?: TagObject[];
    security?: SecurityRequirement[];
}

interface PathItem {
    get?: Operation;
    post?: Operation;
    put?: Operation;
    patch?: Operation;
    delete?: Operation;
}

interface Operation {
    operationId?: string;
    summary?: string;
    description?: string;
    tags?: string[];
    security?: SecurityRequirement[];
    parameters?: (ParameterObject | RefObject)[];
    requestBody?: RequestBody;
    responses?: Record<string, { content?: Record<string, unknown> }>;
}

interface TagObject {
    name: string;
    'x-parent'?: string;
}

interface SecurityRequirement {
    [scheme: string]: string[];
}

interface ParameterObject {
    name: string;
    in: 'path' | 'query' | 'header' | 'cookie';
    required?: boolean;
    description?: string;
    schema?: SchemaObject;
}

interface RefObject {
    $ref: string;
}

interface RequestBody {
    content?: {
        'application/json'?: { schema?: SchemaObject };
    };
}

interface SchemaObject {
    type?: string;
    properties?: Record<string, SchemaObject>;
    required?: string[];
    description?: string;
    $ref?: string;
    allOf?: SchemaObject[];
    oneOf?: SchemaObject[];
    anyOf?: SchemaObject[];
    deprecated?: boolean;
    items?: SchemaObject;
    enum?: unknown[];
    default?: unknown;
    discriminator?: { propertyName?: string; mapping?: Record<string, string> };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RESTRICTED_SCHEMES = new Set(['user-internal', 'user-staff', 'user-internal-or-staff']);

const HTTP_VERBS = ['get', 'post', 'put', 'patch', 'delete'] as const;

// Operations excluded from the CLI even though they are public: runtime-internal
// endpoints that aren't meaningful as a manual command. Keyed by `METHOD path`.
const EXCLUDE = new Set([
    'GET /integrations/{integrationName}/render',
    'POST /integrations/{integrationName}/render',
]);

// Hand-written commands that live outside the spec-derived tree (registered by
// registerCustomCommands in api-commands.ts and the auth/completion commands in
// cli.ts). The generator can't see them, so shell completion would otherwise miss
// them and their subcommands. Keep this in sync with those files as hand-written
// commands change; the CLI has no runtime introspection to derive it from.
//   ''  → tokens that complete at the top level (the hand-written groups + auth).
//   'x' → subcommands that complete under the hand-written group `x`.
const HAND_WRITTEN_COMPLETIONS: Record<string, string[]> = {
    '': ['login', 'logout', 'auth', 'whoami', 'completion', 'integration', 'openapi', 'help'],
    integration: ['new', 'dev', 'publish', 'unpublish', 'tail', 'check'],
    openapi: ['publish'],
};

// Top-level resources: those reachable directly as /{resource}/{id}. These are
// the only resources eligible for the P1 scope-flag merge.
const TIER1 = new Set([
    'organizations',
    'spaces',
    'collections',
    'integrations',
    'users',
    'subdomains',
    'custom-hostnames',
]);

// Path-segment aliases (the spec is inconsistent: /orgs vs /org, /user vs /users).
const SEGMENT_ALIAS: Record<string, string> = {
    orgs: 'organizations',
    org: 'organizations',
    user: 'users',
};

// Singular form used for scope-flag names (--organization, --integration, …).
const SINGULAR: Record<string, string> = {
    organizations: 'organization',
    collections: 'collection',
    integrations: 'integration',
    installations: 'installation',
    members: 'member',
    spaces: 'space',
    sites: 'site',
    users: 'user',
};

// Cosmetic fixes for an operationId's leading word when it is a poor verb.
const VERB_FIX: Record<string, string> = {
    bulk: 'replace', // bulkUpsertSiteRedirects -> replace
};

// Structural overrides for endpoints the mechanical rule names poorly. Keyed by
// `METHOD path`; value is the explicit { group, verb }. Positional args are still
// derived from the path params.
const OVERRIDES: Record<string, { group: string[]; verb: string }> = {
    'GET /': { group: ['system'], verb: 'info' },
    'GET /user': { group: ['users'], verb: 'whoami' },
    'POST /spaces/{spaceId}/change-requests/{changeRequestId}/update': {
        group: ['spaces', 'change-requests'],
        verb: 'pull-content',
    },
    // "install on space" reads as a space-create under the mechanical rule; it is
    // really an integration-installation operation.
    'POST /integrations/{integrationName}/installations/{installationId}/spaces': {
        group: ['integrations', 'installations', 'spaces'],
        verb: 'install',
    },
    // PUT create-or-update at a slug collides with the POST create; name it `set`.
    'PUT /orgs/{organizationId}/openapi/{specSlug}': {
        group: ['organizations', 'openapi'],
        verb: 'set',
    },
    // The /ads/* operationIds carry a product prefix ("adsListSites") that the
    // leading-word rule mistakes for the verb.
    'GET /ads/sites': { group: ['ads', 'sites'], verb: 'list' },
    'PATCH /ads/sites/{siteId}': { group: ['ads', 'sites'], verb: 'update' },
};

// ─── Spec loading ─────────────────────────────────────────────────────────────

function loadSpec(specPath: string): OpenAPISpec {
    const raw = fs.readFileSync(specPath, 'utf8');
    return JSON.parse(raw) as OpenAPISpec;
}

// ─── $ref resolution ──────────────────────────────────────────────────────────

function resolveRef(ref: string, spec: OpenAPISpec): SchemaObject | ParameterObject | null {
    const match = ref.match(/^#\/components\/(schemas|parameters)\/(.+)$/);
    if (!match) return null;
    const [, section, name] = match;
    if (section === 'schemas') return spec.components?.schemas?.[name] ?? null;
    if (section === 'parameters') return spec.components?.parameters?.[name] ?? null;
    return null;
}

function resolveSchema(schema: SchemaObject, spec: OpenAPISpec, depth = 0): SchemaObject {
    if (depth > 6) return schema;
    if (schema.$ref) {
        const resolved = resolveRef(schema.$ref, spec) as SchemaObject | null;
        return resolved ? resolveSchema(resolved, spec, depth + 1) : schema;
    }
    return schema;
}

function resolveParameter(
    param: ParameterObject | RefObject,
    spec: OpenAPISpec,
): ParameterObject | null {
    if ('$ref' in param) {
        return resolveRef(param.$ref, spec) as ParameterObject | null;
    }
    return param as ParameterObject;
}

// ─── Filtering ────────────────────────────────────────────────────────────────

function isPublicOperation(operation: Operation, globalSecurity: SecurityRequirement[]): boolean {
    const security = operation.security ?? globalSecurity;
    if (!security || security.length === 0) return true;
    const schemes = security.map((req) => Object.keys(req)[0]).filter(Boolean);
    return !schemes.every((s) => RESTRICTED_SCHEMES.has(s));
}

// SSE endpoints (text/event-stream). Their generated client methods return an
// EventIterator rather than a Promise<HttpResponse>, so they don't fit the
// one-response-per-command model this CLI emits — consuming a stream needs
// dedicated handling. They're skipped for now (they were never usable here
// anyway: the previous JSON.parse(response.text()) path chokes on SSE framing).
function isStreamingOperation(operation: Operation): boolean {
    for (const response of Object.values(operation.responses ?? {})) {
        if (response.content && 'text/event-stream' in response.content) return true;
    }
    return false;
}

// ─── Path parsing ───────────────────────────────────────────────────────────--

interface Seg {
    lit: boolean; // literal collection segment (vs {param})
    v: string; // normalized value (alias-resolved) for literals; param name for ids
}

function parsePath(apiPath: string): Seg[] {
    return apiPath
        .split('/')
        .filter(Boolean)
        .map((s) =>
            s.startsWith('{')
                ? { lit: false, v: s.slice(1, -1) }
                : { lit: true, v: SEGMENT_ALIAS[s] ?? s },
        );
}

const singular = (s: string): string => SINGULAR[s] ?? (s.endsWith('s') ? s.slice(0, -1) : s);

// Literal segments that are ever immediately followed by an {id} anywhere in the
// spec — i.e. genuine collections (as opposed to singletons or action segments).
function buildCollectionSet(spec: OpenAPISpec): Set<string> {
    const collections = new Set<string>();
    for (const apiPath of Object.keys(spec.paths)) {
        const raw = apiPath.split('/').filter(Boolean);
        for (let i = 0; i < raw.length - 1; i++) {
            if (!raw[i].startsWith('{') && raw[i + 1].startsWith('{')) {
                collections.add(SEGMENT_ALIAS[raw[i]] ?? raw[i]);
            }
        }
    }
    return collections;
}

// Literal segments that act as a grouping namespace somewhere — i.e. are followed
// by another literal (e.g. /ask/questions makes "ask" a namespace). A terminal
// /ask must then nest *inside* that group rather than becoming a bare verb that
// would collide with the subgroup name.
function buildNamespaceSet(spec: OpenAPISpec): Set<string> {
    const namespaces = new Set<string>();
    for (const apiPath of Object.keys(spec.paths)) {
        const raw = apiPath.split('/').filter(Boolean);
        for (let i = 0; i < raw.length - 1; i++) {
            if (!raw[i].startsWith('{') && !raw[i + 1].startsWith('{')) {
                namespaces.add(SEGMENT_ALIAS[raw[i]] ?? raw[i]);
            }
        }
    }
    return namespaces;
}

const leadingVerb = (operationId: string): string => {
    const word = operationId
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .split(' ')[0]
        .toLowerCase();
    return VERB_FIX[word] ?? word;
};

// ─── Command naming ───────────────────────────────────────────────────────────

interface Naming {
    group: string[];
    verb: string;
    // scope flags (P1 merge variants only); empty for ordinary commands
    scope: { flag: string; idParam: string }[];
}

function computeNaming(
    method: string,
    apiPath: string,
    operationId: string,
    collections: Set<string>,
    namespaces: Set<string>,
): Naming {
    const override = OVERRIDES[`${method} ${apiPath}`];
    if (override) {
        return { group: override.group, verb: override.verb, scope: [] };
    }

    const segs = parsePath(apiPath);
    const last = segs[segs.length - 1];
    let verb = leadingVerb(operationId);

    // P1: strict collection/{id} alternation ending in a top-level resource.
    const strictAlternation =
        segs.length % 2 === 1 &&
        segs.every((s, i) => (i % 2 === 0 ? s.lit : !s.lit)) &&
        last.lit &&
        TIER1.has(last.v);

    if (strictAlternation) {
        const scope: { flag: string; idParam: string }[] = [];
        for (let i = 0; i < segs.length - 1; i += 2) {
            scope.push({ flag: singular(segs[i].v), idParam: segs[i + 1].v });
        }
        return {
            group: [last.v],
            verb: method === 'GET' ? 'list' : 'create',
            scope,
        };
    }

    // P2: nest under the first top-level resource (or first collection).
    let root = segs.findIndex((s) => s.lit && TIER1.has(s.v));
    if (root < 0) root = segs.findIndex((s) => s.lit);
    if (root < 0) root = 0;

    // A GET whose operationId says "get" but whose path tail is a collection is a
    // list (e.g. getReviewsByChangeRequestId -> reviews list).
    if (method === 'GET' && verb === 'get' && last.lit && collections.has(last.v)) {
        verb = 'list';
    }

    // A trailing literal that duplicates the verb is the action itself
    // (…/duplicate with verb "duplicate") — unless that token also names a
    // subgroup elsewhere (…/ask + …/ask/questions), in which case it must nest.
    const trailingIsAction = last.lit && last.v === verb;
    const trailingIsNamespace = trailingIsAction && namespaces.has(last.v);

    const group: string[] = [];
    for (let i = root; i < segs.length; i++) {
        const s = segs[i];
        if (!s.lit) continue; // ids become positionals, handled separately
        if (i === segs.length - 1 && trailingIsAction && !trailingIsNamespace) continue;
        group.push(s.v);
    }

    if (trailingIsNamespace) {
        // The action token is also a group; nest it and fall back to a method verb.
        verb =
            method === 'GET'
                ? 'get'
                : method === 'DELETE'
                  ? 'delete'
                  : method === 'POST'
                    ? 'create'
                    : 'update';
    }

    return { group, verb, scope: [] };
}

// ─── Schema → flag analysis ───────────────────────────────────────────────────

interface BodyFlag {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array';
    required: boolean;
    description: string;
    deprecated: boolean;
    // For array fields whose items are a discriminated oneOf (e.g. `changes`),
    // the discriminator mapping keys — the accepted operation names. Surfaced in
    // --help so callers know what operations exist without reading the spec.
    arrayOps?: string[];
    // True when those item variants carry a `document` (page content) — the
    // commands that benefit from --normalize's markdown round-trip fixes.
    hasMarkdownDoc?: boolean;
}

function extractBodyFlags(schema: SchemaObject, spec: OpenAPISpec): BodyFlag[] | null {
    const resolved = resolveSchema(schema, spec);
    if (resolved.oneOf || resolved.anyOf) return null;
    if (resolved.allOf) return mergeAllOfFlags(resolved.allOf, spec);
    if (resolved.type === 'object' || resolved.properties)
        return flattenObjectFlags(resolved, spec);
    return null;
}

function mergeAllOfFlags(schemas: SchemaObject[], spec: OpenAPISpec): BodyFlag[] | null {
    const merged: BodyFlag[] = [];
    for (const s of schemas) {
        const resolved = resolveSchema(s, spec);
        if (resolved.oneOf || resolved.anyOf || resolved.allOf) return null;
        if (resolved.type === 'object' || resolved.properties) {
            const flags = flattenObjectFlags(resolved, spec);
            if (flags === null) return null;
            merged.push(...flags);
        }
    }
    return merged;
}

// True when any variant of a (discriminated) oneOf item schema has a `document`
// property — i.e. the array carries page content (update_page/insert_page). Used
// to decide whether a command gets the --normalize markdown round-trip flag.
function variantsCarryDocument(items: SchemaObject, spec: OpenAPISpec): boolean {
    const variants = items.oneOf ?? items.anyOf ?? [items];
    return variants.some((v) => {
        const resolved = resolveSchema(v, spec);
        return !!resolved.properties && 'document' in resolved.properties;
    });
}

function flattenObjectFlags(schema: SchemaObject, spec: OpenAPISpec): BodyFlag[] | null {
    const props = schema.properties ?? {};
    const required = new Set(schema.required ?? []);
    const flags: BodyFlag[] = [];
    for (const [name, propSchema] of Object.entries(props)) {
        const resolved = resolveSchema(propSchema, spec);
        if (resolved.type === 'object' || resolved.allOf || resolved.oneOf) continue;
        let type: BodyFlag['type'] = 'string';
        if (resolved.type === 'integer' || resolved.type === 'number') type = 'number';
        else if (resolved.type === 'boolean') type = 'boolean';
        else if (resolved.type === 'array') type = 'array';
        // Pull the accepted operation names off a discriminated-oneOf item schema
        // (e.g. `changes` → update_page/insert_page/delete_page) for the help text,
        // and note whether those operations carry a page `document` (→ --normalize).
        let arrayOps: string[] | undefined;
        let hasMarkdownDoc = false;
        if (type === 'array' && resolved.items) {
            const items = resolveSchema(resolved.items, spec);
            const mapping = items.discriminator?.mapping;
            if (mapping) arrayOps = Object.keys(mapping);
            hasMarkdownDoc = variantsCarryDocument(items, spec);
        }
        flags.push({
            name,
            type,
            required: required.has(name),
            description: resolved.description ?? '',
            deprecated: resolved.deprecated ?? false,
            arrayOps,
            hasMarkdownDoc,
        });
    }
    return flags;
}

// ─── Code generation helpers ──────────────────────────────────────────────────

function camelize(s: string): string {
    return s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

// Map an operationId to the method name on the generated GitBookAPI client.
// swagger-typescript-api names methods with a lodash.camelCase, which folds
// acronym runs into single-capital words: getSpacePDF → getSpacePdf,
// listOpenAPISpecs → listOpenApiSpecs, setUserAsSSOMember → setUserAsSsoMember.
// (getSpaceById etc. are already in this form and pass through unchanged.)
function toClientMethod(operationId: string): string {
    const words = operationId.match(/[A-Z]{2,}(?=[A-Z][a-z]|\b)|[A-Z][a-z]+|[A-Z]+|[a-z]+|[0-9]+/g);
    if (!words) return operationId;
    return words
        .map((w, i) => {
            const lower = w.toLowerCase();
            return i === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('');
}

function escapeStr(s: string): string {
    return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ').trim();
}

// ─── Route + command model ──────────────────────────────────────────────────--

interface Route {
    method: string;
    apiPath: string;
    operationId: string;
    summary: string;
    pathParams: ParameterObject[]; // ordered, siteShareKey excluded
    queryParams: ParameterObject[];
    bodyFlags: BodyFlag[] | null;
    hasBody: boolean;
    naming: Naming;
}

// A merged P1 variant: one API path reachable by a specific set of scope flags.
interface Variant {
    scopeKey: string; // sorted, comma-joined flag names ("" for parent-less)
    scope: { flag: string; idParam: string }[];
    apiPath: string;
    method: string;
    operationId: string;
    summary: string;
    queryParams: ParameterObject[];
    bodyFlags: BodyFlag[] | null;
    hasBody: boolean;
}

type Command =
    | { kind: 'simple'; group: string[]; verb: string; route: Route }
    | {
          kind: 'merged';
          group: string[];
          verb: string;
          summary: string;
          variants: Variant[];
          queryParams: ParameterObject[]; // union
          allowNoScope: boolean;
      };

function buildRoutes(spec: OpenAPISpec): Route[] {
    const collections = buildCollectionSet(spec);
    const namespaces = buildNamespaceSet(spec);
    const globalSecurity = spec.security ?? [];
    const routes: Route[] = [];

    for (const [apiPath, pathItem] of Object.entries(spec.paths)) {
        for (const method of HTTP_VERBS) {
            const operation = pathItem[method];
            if (!operation?.operationId) continue;
            if (!isPublicOperation(operation, globalSecurity)) continue;
            if (isStreamingOperation(operation)) continue;
            const upper = method.toUpperCase();
            if (EXCLUDE.has(`${upper} ${apiPath}`)) continue;

            const allParams = (operation.parameters ?? [])
                .map((p) => resolveParameter(p, spec))
                .filter((p): p is ParameterObject => p !== null);
            const pathParams = allParams.filter(
                // siteShareKey is an optional ambient param — not a real positional
                (p) => p.in === 'path' && p.name !== 'siteShareKey',
            );
            // Resolve each query param's schema up front so the emitters can read
            // its type/enum/default directly (orderBy et al. are $ref'd). Without
            // this, array-typed params (e.g. comments `authors`) can't be told
            // apart from scalars and get String()'d into a single value → API 500.
            const queryParams = allParams
                .filter((p) => p.in === 'query')
                .map((p) => (p.schema ? { ...p, schema: resolveSchema(p.schema, spec) } : p));

            const bodySchema = operation.requestBody?.content?.['application/json']?.schema;
            const hasBody = !!bodySchema;
            const bodyFlags = bodySchema ? extractBodyFlags(bodySchema, spec) : null;

            routes.push({
                method: upper,
                apiPath,
                operationId: operation.operationId,
                summary: operation.summary ?? '',
                pathParams,
                queryParams,
                bodyFlags,
                hasBody,
                naming: computeNaming(
                    upper,
                    apiPath,
                    operation.operationId,
                    collections,
                    namespaces,
                ),
            });
        }
    }

    return routes;
}

// Group routes by full command key (group + verb) and fold P1 scope-variants into
// a single merged command. Throws on any genuine name collision.
function buildCommands(routes: Route[]): Command[] {
    const byKey = new Map<string, Route[]>();
    for (const r of routes) {
        const key = [...r.naming.group, r.naming.verb].join(' ');
        if (!byKey.has(key)) byKey.set(key, []);
        byKey.get(key)!.push(r);
    }

    const commands: Command[] = [];
    for (const [key, group] of byKey) {
        if (group.length === 1) {
            const r = group[0];
            commands.push({ kind: 'simple', group: r.naming.group, verb: r.naming.verb, route: r });
            continue;
        }

        const isMerge =
            group.every((r) => r.naming.scope.length > 0 || r.naming.verb === 'list') &&
            (group.every((r) => r.naming.verb === 'list') ||
                group.every((r) => r.naming.verb === 'create'));
        const scopeKeys = group.map((r) =>
            r.naming.scope
                .map((s) => s.flag)
                .sort()
                .join(','),
        );
        const distinctScopes = new Set(scopeKeys).size === scopeKeys.length;

        if (!isMerge || !distinctScopes) {
            const detail = group
                .map((r) => `      ${r.method} ${r.apiPath} [${r.operationId}]`)
                .join('\n');
            throw new Error(`Command name collision on "${key}":\n${detail}`);
        }

        const variants: Variant[] = group.map((r, i) => ({
            scopeKey: scopeKeys[i],
            scope: r.naming.scope,
            apiPath: r.apiPath,
            method: r.method,
            operationId: r.operationId,
            summary: r.summary,
            queryParams: r.queryParams,
            bodyFlags: r.bodyFlags,
            hasBody: r.hasBody,
        }));
        // Union query params across variants (dedupe by name).
        const queryByName = new Map<string, ParameterObject>();
        for (const v of variants) for (const q of v.queryParams) queryByName.set(q.name, q);

        commands.push({
            kind: 'merged',
            group: group[0].naming.group,
            verb: group[0].naming.verb,
            summary: group.find((r) => r.summary)?.summary ?? '',
            variants,
            queryParams: [...queryByName.values()],
            allowNoScope: variants.some((v) => v.scope.length === 0),
        });
    }

    return commands;
}

// ─── Command tree ──────────────────────────────────────────────────────────--─

interface GroupNode {
    name: string;
    children: Map<string, GroupNode>;
    commands: Command[];
}

function buildTree(commands: Command[]): GroupNode {
    const root: GroupNode = { name: '', children: new Map(), commands: [] };
    for (const cmd of commands) {
        let node = root;
        for (const g of cmd.group) {
            if (!node.children.has(g)) {
                node.children.set(g, { name: g, children: new Map(), commands: [] });
            }
            node = node.children.get(g)!;
        }
        node.commands.push(cmd);
    }
    assertNoVerbGroupClash(root, []);
    return root;
}

// A leaf command's verb must not equal a sibling subgroup name — Commander would
// register two subcommands with the same name and one would silently shadow the
// other. computeNaming's namespace handling prevents this; assert it holds.
function assertNoVerbGroupClash(node: GroupNode, prefix: string[]): void {
    const subgroups = new Set(node.children.keys());
    for (const cmd of node.commands) {
        if (subgroups.has(cmd.verb)) {
            throw new Error(
                `"${[...prefix, cmd.verb].join(' ')}" is both a command and a subgroup`,
            );
        }
    }
    for (const [name, child] of node.children) {
        assertNoVerbGroupClash(child, [...prefix, name]);
    }
}

// ─── Emitters ─────────────────────────────────────────────────────────────────

function emitOutputFlags(I: string): string[] {
    return [
        `${I}    .option('--json', 'Output as JSON (machine-readable)')`,
        `${I}    .option('--yaml', 'Output as YAML (machine-readable)')`,
        `${I}    .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')`,
        `${I}    .option('--full', 'Show all fields (disable compact summaries in pretty mode)')`,
    ];
}

// The namespace an operation's method lives under on the generated GitBookAPI
// client. swagger-typescript-api groups methods by the first URL path segment
// (camelized): /orgs/… → api.orgs.*, /custom-hostnames/… → api.customHostnames.*.
// `GET /` has no segment and its method sits at the top level (api.getApiInformation).
function clientNamespace(apiPath: string): string {
    const first = apiPath.split('/').filter(Boolean)[0];
    return first ? camelize(first) : '';
}

// Emit the API call + response handling. Rather than hand-rolling api.request()
// with a raw path, we call the generated typed method (api.<ns>.<operationId>),
// which already resolves the path, sends `format: 'json'`, and returns the parsed
// body on `.data`. Path params are positional; a body (`data`) and query object
// follow, matching the generated signatures. `args` are the pre-built arg exprs.
function emitRequest(
    I: string,
    opts: { namespace: string; method: string; args: string[] },
): string[] {
    const target = opts.namespace ? `api.${opts.namespace}.${opts.method}` : `api.${opts.method}`;
    const lines: string[] = [];
    lines.push(`${I}        try {`);
    lines.push(`${I}            const response = await ${target}(${opts.args.join(', ')});`);
    lines.push(`${I}            if (response.data != null) {`);
    lines.push(`${I}                printResult(response.data, options);`);
    lines.push(`${I}            }`);
    lines.push(`${I}        } catch (error) {`);
    // A successful response with an empty body (e.g. 204/205 from a delete) makes
    // the client's `format: 'json'` parse reject with a SyntaxError — that's not
    // an API error, so there's simply nothing to print.
    lines.push(`${I}            if (error instanceof SyntaxError) return;`);
    lines.push(`${I}            console.error(explainApiError((error as Error).message));`);
    lines.push(`${I}            process.exit(1);`);
    lines.push(`${I}        }`);
    return lines;
}

function emitBodyOption(f: BodyFlag, I: string): string {
    const notes = f.required ? ' (required)' : '';
    // Array fields take a JSON string on the command line (e.g. --changes
    // '[{...}]'); signal that in both the placeholder and the description so the
    // help text doesn't suggest a bare scalar.
    let placeholder = '<value>';
    let typeHint = '';
    if (f.type === 'array') {
        placeholder = '<json>';
        typeHint = ' [JSON array]';
        // Name the accepted operations for a discriminated-oneOf array (e.g.
        // `changes` → "set 'operation' to: update_page, insert_page, delete_page").
        // The shape of each operation's fields stays in the API error path: a bad
        // shape 422s with the field-level reason (see explainApiError).
        if (f.arrayOps?.length) {
            typeHint += ` — set "operation" to one of: ${f.arrayOps.join(', ')}`;
        }
    } else if (f.type === 'number') {
        placeholder = '<number>';
    }
    const desc = escapeStr((f.description + notes + typeHint).trim());
    const flagStr = f.type === 'boolean' ? `--${f.name}` : `--${f.name} ${placeholder}`;
    return `${I}    .option('${flagStr}', '${desc}')`;
}

// RHS expression for assigning a body flag, with type-aware coercion. Commander
// gives us strings; array/number fields are coerced via coerceBodyFlag so the
// JSON body carries the right type. String/boolean pass through untouched.
function bodyFlagExpr(f: BodyFlag): string {
    const opt = `options.${camelize(f.name)}`;
    if (f.type === 'array' || f.type === 'number') {
        return `coerceBodyFlag(${opt}, '${f.type}')`;
    }
    return opt;
}

const queryParamIsArray = (qp: ParameterObject): boolean => qp.schema?.type === 'array';

// `.option(...)` line for a query param. Enriches the description with the
// accepted enum values (e.g. --orderBy) and a repeatable-list hint for arrays,
// both of which --help would otherwise omit.
function emitQueryOption(qp: ParameterObject, I: string): string {
    const bracket = qp.required ? `<${qp.name}>` : `[${qp.name}]`;
    let desc = qp.description ?? '';
    const append = (s: string) => {
        desc = desc ? `${desc} ${s}` : s;
    };
    if (queryParamIsArray(qp)) {
        // Array query params accept either a comma-separated list or a JSON array;
        // see coerceArrayQueryParam. Each value ships as a repeated key.
        append('[repeatable: comma-separated or a JSON array]');
    }
    const enumVals = (qp.schema?.enum ?? []).map((v) => String(v));
    if (enumVals.length > 0) {
        const def =
            qp.schema?.default !== undefined ? `, default ${String(qp.schema.default)}` : '';
        append(`[one of: ${enumVals.join(', ')}${def}]`);
    }
    return `${I}    .option('--${qp.name} ${bracket}', '${escapeStr(desc)}')`;
}

// Assignment line that puts a query param onto the `query` object. Array-typed
// params (the spec's `type: array`) are coerced to a real string[] so the API
// client serializes them as repeated `key=v1&key=v2`; everything else is a
// scalar String(). Plain String() on an array yielded a single comma-joined
// value the API rejected with a 500.
function emitQueryAssign(qp: ParameterObject, I: string): string {
    const accessor = `options[${JSON.stringify(camelize(qp.name))}]`;
    const rhs = queryParamIsArray(qp)
        ? `coerceArrayQueryParam(${accessor})`
        : `String(${accessor})`;
    return `${I}        if (${accessor} !== undefined) query['${qp.name}'] = ${rhs};`;
}

function emitSimpleCommand(
    cmd: Extract<Command, { kind: 'simple' }>,
    parentVar: string,
    I: string,
): string {
    const { route, verb } = cmd;
    const lines: string[] = [];
    const argStr = route.pathParams.map((p) => `<${p.name}>`).join(' ');
    const fullCmd = argStr ? `${verb} ${argStr}` : verb;

    lines.push(`${I}${parentVar}`);
    lines.push(`${I}    .command('${fullCmd}')`);
    lines.push(`${I}    .description('${escapeStr(route.summary)}')`);

    for (const qp of route.queryParams) {
        lines.push(emitQueryOption(qp, I));
    }
    if (route.hasBody) {
        const liveFlags = (route.bodyFlags ?? []).filter((f) => !f.deprecated);
        if (liveFlags.length > 0) {
            for (const f of liveFlags) {
                lines.push(emitBodyOption(f, I));
            }
            // Escape hatch: a field named 'body' would collide with this flag,
            // so only offer it otherwise. --body lets callers reach fields the
            // generator can't model as flags (object-typed properties are
            // dropped in flattenObjectFlags); typed flags merge on top of it.
            if (!liveFlags.some((f) => camelize(f.name) === 'body')) {
                lines.push(
                    `${I}    .option('--body <json>', 'Full request body as JSON; any typed flags above are merged on top')`,
                );
            }
        } else {
            lines.push(`${I}    .option('--body <json>', 'Request body as a JSON string')`);
        }
        // Page-document operations only: offer the markdown round-trip fixups.
        if ((route.bodyFlags ?? []).some((f) => f.hasMarkdownDoc)) {
            lines.push(
                `${I}    .option('--normalize', 'Make page-document markdown round-trip safe before sending: strip a duplicated leading H1 title and collapse multi-line {% ... %} blocks onto one line')`,
            );
        }
    }
    lines.push(...emitOutputFlags(I));

    const paramNames = route.pathParams.map((p) => camelize(p.name));
    const actionArgs = [...paramNames, 'options'].join(', ');
    lines.push(`${I}    .action(async (${actionArgs}) => {`);
    lines.push(`${I}        const api = await getAPIClient(true);`);

    if (route.queryParams.length > 0) {
        lines.push(`${I}        const query: Record<string, string | string[]> = {};`);
        for (const qp of route.queryParams) {
            lines.push(emitQueryAssign(qp, I));
        }
    }
    if (route.hasBody) {
        const liveFlags = (route.bodyFlags ?? []).filter((f) => !f.deprecated);
        if (liveFlags.length > 0) {
            // Seed from --body (the escape hatch) when offered, then let typed
            // flags override; otherwise start empty.
            if (liveFlags.some((f) => camelize(f.name) === 'body')) {
                lines.push(`${I}        const body: Record<string, unknown> = {};`);
            } else {
                lines.push(
                    `${I}        const body: Record<string, unknown> = options.body ? JSON.parse(options.body) : {};`,
                );
            }
            for (const f of liveFlags) {
                lines.push(
                    `${I}        if (options.${camelize(f.name)} !== undefined) body['${f.name}'] = ${bodyFlagExpr(f)};`,
                );
            }
            // Opt-in markdown round-trip fixups on the page-document array, after
            // the body (incl. any --body seed) is fully assembled.
            const docFlag = liveFlags.find((f) => f.hasMarkdownDoc);
            if (docFlag) {
                lines.push(
                    `${I}        if (options.normalize) normalizeChangesMarkdown(body['${docFlag.name}']);`,
                );
            }
        } else {
            lines.push(
                `${I}        const body = options.body ? JSON.parse(options.body) : undefined;`,
            );
        }
    }

    // Typed-method args: path params (positional), then the body (`data`) and the
    // query object, matching the generated signatures. The dynamically-built body
    // and query are cast (`as never`) past the method's strict param types — the
    // CLI assembles them from string flags, so they can't be statically typed.
    const callArgs = [...paramNames];
    if (route.hasBody) callArgs.push('body as never');
    if (route.queryParams.length > 0) callArgs.push('query as never');

    lines.push(
        ...emitRequest(I, {
            namespace: clientNamespace(route.apiPath),
            method: toClientMethod(route.operationId),
            args: callArgs,
        }),
    );
    lines.push(`${I}    });`);
    lines.push('');
    return lines.join('\n');
}

function emitMergedCommand(
    cmd: Extract<Command, { kind: 'merged' }>,
    parentVar: string,
    I: string,
): string {
    const lines: string[] = [];
    // All scope flags across variants, deduped, in stable order.
    const scopeFlags: { flag: string; idParam: string }[] = [];
    const seen = new Set<string>();
    for (const v of cmd.variants) {
        for (const s of v.scope) {
            if (!seen.has(s.flag)) {
                seen.add(s.flag);
                scopeFlags.push(s);
            }
        }
    }

    lines.push(`${I}${parentVar}`);
    lines.push(`${I}    .command('${cmd.verb}')`);
    lines.push(`${I}    .description('${escapeStr(cmd.summary)}')`);
    for (const s of scopeFlags) {
        lines.push(`${I}    .option('--${s.flag} <value>', 'Scope: ${escapeStr(s.idParam)}')`);
    }
    for (const qp of cmd.queryParams) {
        lines.push(emitQueryOption(qp, I));
    }
    lines.push(...emitOutputFlags(I));

    lines.push(`${I}    .action(async (options) => {`);
    lines.push(`${I}        const api = await getAPIClient(true);`);
    // Determine which variant the supplied scope flags select.
    lines.push(
        `${I}        const scopeFlags = [${scopeFlags.map((s) => `'${s.flag}'`).join(', ')}];`,
    );
    lines.push(
        `${I}        const provided = scopeFlags.filter((f) => (options as Record<string, unknown>)[f] !== undefined).sort().join(',');`,
    );

    const hasQuery = cmd.queryParams.length > 0;
    if (hasQuery) {
        lines.push(`${I}        const query: Record<string, string | string[]> = {};`);
        for (const qp of cmd.queryParams) {
            lines.push(emitQueryAssign(qp, I));
        }
    }

    // Each scope selects a different API operation, so the typed call lives inside
    // the branch. Path args are the scope ids (options.<flag>); the query object,
    // when present, follows and is cast past the method's strict param type.
    lines.push(`${I}        try {`);
    lines.push(`${I}            let data: unknown;`);
    let first = true;
    for (const v of cmd.variants) {
        lines.push(`${I}            ${first ? 'if' : 'else if'} (provided === '${v.scopeKey}') {`);
        const callArgs = v.scope.map((s) => `options.${s.flag}`);
        if (hasQuery) callArgs.push('query as never');
        const ns = clientNamespace(v.apiPath);
        const method = toClientMethod(v.operationId);
        const target = ns ? `api.${ns}.${method}` : `api.${method}`;
        lines.push(`${I}                data = (await ${target}(${callArgs.join(', ')})).data;`);
        lines.push(`${I}            }`);
        first = false;
    }
    const flagList = scopeFlags.map((s) => `--${s.flag}`).join(', ');
    const noScopeNote = cmd.allowNoScope ? ' (or none for all)' : '';
    lines.push(`${I}            else {`);
    lines.push(
        `${I}                console.error('Specify a valid scope${noScopeNote}: ${escapeStr(flagList)}. Some scopes require a combination (e.g. --integration with --installation).');`,
    );
    lines.push(`${I}                process.exit(1);`);
    lines.push(`${I}            }`);
    lines.push(`${I}            if (data != null) {`);
    lines.push(`${I}                printResult(data, options);`);
    lines.push(`${I}            }`);
    lines.push(`${I}        } catch (error) {`);
    lines.push(`${I}            if (error instanceof SyntaxError) return;`);
    lines.push(`${I}            console.error(explainApiError((error as Error).message));`);
    lines.push(`${I}            process.exit(1);`);
    lines.push(`${I}        }`);
    lines.push(`${I}    });`);
    lines.push('');
    return lines.join('\n');
}

function varNameForPath(pathParts: string[]): string {
    return (pathParts.map(camelize).join('_') || 'root') + 'Cmd';
}

function emitNode(node: GroupNode, pathParts: string[], lines: string[]): void {
    const parentVar = pathParts.length === 0 ? 'program' : varNameForPath(pathParts);

    for (const cmd of node.commands) {
        lines.push(
            cmd.kind === 'simple'
                ? emitSimpleCommand(cmd, parentVar, '    ')
                : emitMergedCommand(cmd, parentVar, '    '),
        );
    }

    for (const [name, child] of node.children) {
        const childParts = [...pathParts, name];
        const childVar = varNameForPath(childParts);
        lines.push(`    const ${childVar} = ${parentVar}`);
        lines.push(`        .command('${name}')`);
        lines.push(`        .description('Manage ${childParts.join(' ')}');`);
        lines.push('');
        emitNode(child, childParts, lines);
    }
}

function emitFile(tree: GroupNode, completions: Record<string, string>): string {
    const lines: string[] = [];
    lines.push(`/**`);
    lines.push(` * AUTO-GENERATED — DO NOT EDIT`);
    lines.push(` *`);
    lines.push(` * Source:    packages/api/spec/openapi.json`);
    lines.push(` * Generator: scripts/generate-commands.ts`);
    lines.push(` *`);
    lines.push(` * Re-generate: npm run generate-commands (from monorepo root)`);
    lines.push(` */`);
    lines.push(``);
    lines.push(`/* eslint-disable */`);
    lines.push(``);
    lines.push(`import { Command } from 'commander';`);
    lines.push(`import { getAPIClient } from './remote';`);
    lines.push(`// Output formatting lives in ./output (a real, unit-tested module) rather than`);
    lines.push(`// being inlined here, so the rendering logic has a single source of truth.`);
    lines.push(
        `import { printResult, coerceBodyFlag, coerceArrayQueryParam, explainApiError, normalizeChangesMarkdown } from './output';`,
    );
    lines.push(``);
    lines.push(`export function registerGeneratedCommands(program: Command): void {`);

    emitNode(tree, [], lines);

    lines.push(`}`);
    lines.push(``);
    lines.push(`// Shell completion scripts, generated from the command tree.`);
    lines.push(
        `export const COMPLETIONS: Record<string, string> = ${JSON.stringify(completions, null, 4)};`,
    );
    lines.push(``);
    return lines.join('\n');
}

// ─── Completion script generation ──────────────────────────────────────────────

// Flatten the tree into "node path -> child tokens" for static completion. A
// node's tokens are its subgroup names plus its command verbs.
function completionMap(commands: Command[]): Map<string, string[]> {
    const map = new Map<string, string[]>();
    const add = (key: string, token: string) => {
        if (!map.has(key)) map.set(key, []);
        const arr = map.get(key)!;
        if (!arr.includes(token)) arr.push(token);
    };
    // Top-level group "completion" command lives alongside the generated tree.
    for (const cmd of commands) {
        // Register each group prefix so its children complete.
        for (let i = 0; i < cmd.group.length; i++) {
            const parent = cmd.group.slice(0, i).join(' ');
            add(parent, cmd.group[i]);
        }
        add(cmd.group.join(' '), cmd.verb);
    }
    return map;
}

function generateCompletions(commands: Command[]): Record<string, string> {
    const map = completionMap(commands);
    // Merge in the hand-written commands (top-level groups + their subcommands)
    // so `gitbook integration <TAB>`, `gitbook openapi <TAB>`, etc. complete too.
    for (const [key, tokens] of Object.entries(HAND_WRITTEN_COMPLETIONS)) {
        if (!map.has(key)) map.set(key, []);
        const arr = map.get(key)!;
        for (const token of tokens) {
            if (!arr.includes(token)) arr.push(token);
        }
    }

    // bash: a `case`-based child lookup (portable to bash 3.2; no associative
    // arrays). Keys are space-joined group paths; the root is the "/" sentinel.
    const arms = [...map.entries()]
        .map(([k, v]) => `    '${k === '' ? '/' : k}') echo '${v.join(' ')}' ;;`)
        .join('\n');
    const bash = `# gitbook bash completion. Install: gitbook completion bash >> ~/.bashrc
_gb_children() {
  case "\$1" in
${arms}
    *) echo '' ;;
  esac
}
_gitbook_complete() {
  local cur key next i token
  key="/"
  for ((i=1; i<COMP_CWORD; i++)); do
    token="\${COMP_WORDS[i]}"
    [[ "\$token" == -* ]] && continue
    if [[ "\$key" == "/" ]]; then next="\$token"; else next="\$key \$token"; fi
    if [[ -n "\$(_gb_children "\$next")" ]]; then key="\$next"; fi
  done
  cur="\${COMP_WORDS[COMP_CWORD]}"
  COMPREPLY=( \$(compgen -W "\$(_gb_children "\$key")" -- "\$cur") )
}
complete -F _gitbook_complete gitbook
`;

    // zsh: reuse the bash function via bashcompinit.
    const zsh = `# gitbook zsh completion. Install: gitbook completion zsh >> ~/.zshrc
# Initialise the completion system if the host shell hasn't already.
if ! whence compdef >/dev/null 2>&1; then autoload -Uz compinit && compinit; fi
autoload -U +X bashcompinit && bashcompinit
${bash}`;

    // fish: one `complete` line per node path.
    const fishLines: string[] = [
        '# gitbook fish completion. Install: gitbook completion fish > ~/.config/fish/completions/gitbook.fish',
    ];
    for (const [key, tokens] of map) {
        const depth = key === '' ? 0 : key.split(' ').length;
        const cond =
            key === ''
                ? `test (count (commandline -opc)) -eq 1`
                : `__fish_seen_subcommand_from ${key.split(' ').join(' ')}`;
        for (const t of tokens) {
            fishLines.push(
                `complete -c gitbook -n '${depth === 0 ? 'test (count (commandline -opc)) -eq 1' : cond}' -f -a '${t}'`,
            );
        }
    }

    return { bash, zsh, fish: fishLines.join('\n') + '\n' };
}

// ─── Entry point ──────────────────────────────────────────────────────────────

const SPEC_PATH = path.resolve(__dirname, '../packages/api/spec/openapi.json');
const OUT_PATH = path.resolve(__dirname, '../packages/cli/src/generated-commands.ts');

console.log('Reading spec from', SPEC_PATH);
const spec = loadSpec(SPEC_PATH);

const routes = buildRoutes(spec);
const commands = buildCommands(routes); // throws on collisions
const tree = buildTree(commands);
const completions = generateCompletions(commands);

const merged = commands.filter((c) => c.kind === 'merged').length;
const complexBody = routes.filter((r) => r.hasBody && r.bodyFlags === null).length;

console.log(`  ${routes.length} public operations included`);
console.log(`  ${commands.length} commands (${merged} merged scope-flag commands)`);
console.log(`  ${complexBody} operations using --body fallback (complex schema)`);

fs.writeFileSync(OUT_PATH, emitFile(tree, completions), 'utf8');
console.log('Written to', OUT_PATH);
