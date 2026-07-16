/**
 * Output formatting for the `gitbook` CLI.
 *
 * This module is the single source of truth for how API responses are rendered.
 * `scripts/generate-commands.ts` imports `printResult` from here rather than
 * inlining it, so the formatting logic can be unit-tested directly (see
 * output.test.ts) without going through a live API call.
 */

import * as jsyaml from 'js-yaml';

export type OutputOptions = { json?: boolean; yaml?: boolean; pretty?: boolean; full?: boolean };

// Explicit flags win; otherwise default to human-readable on a TTY and
// machine-readable (YAML) when piped or redirected — so agents and scripts
// get structured output for free while humans get something legible.
export function resolveFormat(options: OutputOptions): 'json' | 'yaml' | 'pretty' {
    if (options.json) return 'json';
    if (options.yaml) return 'yaml';
    if (options.pretty) return 'pretty';
    return process.stdout.isTTY ? 'pretty' : 'yaml';
}

// ─── Request body flag coercion ────────────────────────────────────────────────

// Commander hands every `--flag <value>` option to us as a string, but the
// OpenAPI schema says what the request body field actually expects. The
// generated commands route array- and number-typed body flags through this
// helper so e.g. `--changes '[{...}]'` ships a real JSON array (not the literal
// string "[{...}]", which the API would reject). String and boolean flags pass
// through untouched — booleans arrive from commander already as real booleans.
// Throws a legible Error (surfaced by the CLI's top-level handler) when an
// array flag isn't valid JSON or a number flag isn't numeric.
export function coerceBodyFlag(
    value: unknown,
    type: 'string' | 'number' | 'boolean' | 'array',
): unknown {
    if (type === 'array') {
        if (typeof value !== 'string') return value;
        let parsed: unknown;
        try {
            parsed = JSON.parse(value);
        } catch {
            throw new Error(`Expected a JSON array but the value is not valid JSON: ${value}`);
        }
        if (!Array.isArray(parsed)) {
            throw new Error(`Expected a JSON array but parsed a ${typeof parsed}: ${value}`);
        }
        return parsed;
    }
    if (type === 'number') {
        if (typeof value !== 'string') return value;
        const n = Number(value);
        if (value.trim() === '' || Number.isNaN(n)) {
            throw new Error(`Expected a number but got: ${value}`);
        }
        return n;
    }
    return value;
}

// Coerce a `type: array` query flag (e.g. `comments list --authors`) to a real
// string[] so the API client serializes it as repeated `key=v1&key=v2`. Plain
// String() flattened the array to one comma-joined value the API rejected (500).
// Accepts either a comma-separated list (`a,b`) or a JSON array (`'["a","b"]'`);
// a bare value becomes a one-element array. Query IDs are simple scalars, so the
// comma form is friendlier than coerceBodyFlag's strict-JSON requirement.
export function coerceArrayQueryParam(value: unknown): string[] {
    if (Array.isArray(value)) return value.map(String);
    if (typeof value !== 'string') return [String(value)];
    const trimmed = value.trim();
    if (trimmed.startsWith('[')) {
        let parsed: unknown;
        try {
            parsed = JSON.parse(trimmed);
        } catch {
            throw new Error(`Expected a JSON array but the value is not valid JSON: ${value}`);
        }
        if (!Array.isArray(parsed)) {
            throw new Error(`Expected a JSON array but parsed a ${typeof parsed}: ${value}`);
        }
        return parsed.map(String);
    }
    return trimmed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

// ─── API error explanation ─────────────────────────────────────────────────────

// The API client already surfaces the server's error message (GitBookAPIError
// carries `body.error.message`). This adds an actionable hint for the one error
// whose raw text is famously unactionable: a schema-union validation failure
// (e.g. pushing the node `document` tree to update_page, which only accepts
// `{ "markdown": "…" }`). The server says only "expected to match … one"; we
// name the accepted shape and point at --help for the operation list.
export function explainApiError(message: string): string {
    if (/expected to match (?:exactly )?one/i.test(message)) {
        return (
            `${message}\n` +
            `Hint: a request field didn't match any accepted shape. For change operations, ` +
            `update_page.document must be { "markdown": "…" } (the node tree from 'page get' ` +
            `is not accepted), and insert_page.into is optional (omit = space root). ` +
            `Run the command with --help to see the accepted operations.`
        );
    }
    return message;
}

// ─── Request timeout ────────────────────────────────────────────────────────────

// Generated commands abort a request that produces no response — for streams, no
// next event — within this many ms, so the CLI fails loudly instead of hanging on
// an unresponsive endpoint. Configurable via GITBOOK_CLI_TIMEOUT_MS (0 disables).
export const CLI_TIMEOUT_MS: number = ((): number => {
    const raw = process.env.GITBOOK_CLI_TIMEOUT_MS;
    if (raw === undefined) return 60_000;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : 60_000;
})();

export interface RequestTimeout {
    signal: AbortSignal;
    // Reset the idle timer — called per streamed event so a long but live
    // response is never cut off; a buffered request just lets it run once.
    bump: () => void;
    clear: () => void;
}

// An abort signal that fires after CLI_TIMEOUT_MS of inactivity, or null when
// timeouts are disabled (CLI_TIMEOUT_MS === 0). The generated command passes
// `signal` to the client, calls `bump()` on each event, and `clear()` when done.
export function createRequestTimeout(): RequestTimeout | null {
    if (!CLI_TIMEOUT_MS) return null;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const bump = () => {
        clearTimeout(timer);
        timer = setTimeout(() => controller.abort(), CLI_TIMEOUT_MS);
    };
    const clear = () => clearTimeout(timer);
    bump();
    return { signal: controller.signal, bump, clear };
}

export function explainTimeout(): string {
    return (
        `Timed out after ${CLI_TIMEOUT_MS / 1000}s with no response from the server. ` +
        `The endpoint may be slow or unavailable for this content. ` +
        `Set GITBOOK_CLI_TIMEOUT_MS (milliseconds; 0 disables) to change.`
    );
}

// ─── Markdown round-trip normalization ──────────────────────────────────────────

// Make page-document markdown safe to push back via update_page/insert_page.
// Two deterministic fixups, both surfaced via the --normalize flag:
//   1. Strip a duplicated leading H1. `page get --format markdown` emits the page
//      title as a leading `# …` line, but the operations store the title
//      separately, so pushing that markdown back creates a second, in-body
//      heading. We drop a single leading ATX H1 (and one trailing blank line).
//   2. Collapse multi-line `{% … %}` integration blocks onto one physical line.
//      A multi-line `content="…"` block re-escapes to literal text on push (it
//      renders as text, not the integration); the single-line form round-trips.
export function normalizeMarkdown(markdown: string): string {
    return collapseMultilineBlocks(stripLeadingTitleHeading(markdown));
}

function stripLeadingTitleHeading(markdown: string): string {
    const lines = markdown.split('\n');
    let i = 0;
    while (i < lines.length && lines[i].trim() === '') i++;
    // Only an H1 (`# `), not `##`/`###`; require a non-space after the hash.
    if (i < lines.length && /^#\s+\S/.test(lines[i])) {
        lines.splice(0, i + 1);
        if (lines.length > 0 && lines[0].trim() === '') lines.shift();
        return lines.join('\n');
    }
    return markdown;
}

function collapseMultilineBlocks(markdown: string): string {
    // Join any `{% … %}` span that straddles newlines into one line; newlines
    // inside it become `\n` escapes so a quoted content="…" value survives.
    return markdown.replace(/\{%[\s\S]*?%\}/g, (block) =>
        block.includes('\n') ? block.replace(/\r?\n/g, '\\n') : block,
    );
}

// Apply normalizeMarkdown to each operation's `document.markdown` in a `changes`
// array (update_page/insert_page). Mutates in place; tolerant of an unknown —
// non-conforming entries are skipped, so it is safe to call on a --body payload.
export function normalizeChangesMarkdown(changes: unknown): void {
    if (!Array.isArray(changes)) return;
    for (const change of changes) {
        if (!isPlainObject(change)) continue;
        const doc = change.document;
        if (isPlainObject(doc) && typeof doc.markdown === 'string') {
            doc.markdown = normalizeMarkdown(doc.markdown);
        }
    }
}

export function formatScalar(value: unknown): string {
    if (value === null || value === undefined) return '—';
    return String(value);
}

export function formatPretty(data: unknown, indent = 0): string {
    const pad = '  '.repeat(indent);
    if (data === null || data === undefined) return pad + '—';
    if (Array.isArray(data)) {
        if (data.length === 0) return pad + '(empty)';
        return data
            .map((item) =>
                item !== null && typeof item === 'object'
                    ? pad + '-\n' + formatPretty(item, indent + 1)
                    : pad + '- ' + formatScalar(item),
            )
            .join('\n');
    }
    if (typeof data === 'object') {
        const entries = Object.entries(data as Record<string, unknown>);
        if (entries.length === 0) return pad + '(empty)';
        return entries
            .map(([key, value]) =>
                value !== null && typeof value === 'object'
                    ? pad + key + ':\n' + formatPretty(value, indent + 1)
                    : pad + key + ': ' + formatScalar(value),
            )
            .join('\n');
    }
    return pad + formatScalar(data);
}

// ─── Compact summaries (pretty mode default; bypassed by --full) ───────────────

// Ordered, generic identifying fields — earliest = most identifying. No
// per-resource hardcoding; we keep whichever are present as scalars.
const SUMMARY_FIELDS = [
    'id',
    'title',
    'name',
    'label',
    'key',
    'slug',
    'path',
    'visibility',
    'emoji',
] as const;
const MAX_CELL_LEN = 60;

export function isPlainObject(v: unknown): v is Record<string, unknown> {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// A GitBook list response is an envelope { items, next?, count? }; we also
// accept a bare top-level array. Returns null for anything else.
export function asCollection(
    data: unknown,
): { items: unknown[]; next?: unknown; count?: unknown } | null {
    if (Array.isArray(data)) return { items: data };
    if (isPlainObject(data) && Array.isArray(data.items)) {
        return { items: data.items, next: data.next, count: data.count };
    }
    return null;
}

// Render a scalar field for a summary cell; null for absent/non-scalar (so
// object/array-valued fields are skipped rather than breaking the one-liner).
export function summaryCell(value: unknown): string | null {
    if (value === undefined) return null;
    if (value === null) return '—';
    if (typeof value === 'object') return null;
    let s = String(value);
    if (s.length > MAX_CELL_LEN) s = s.slice(0, MAX_CELL_LEN - 1) + '…';
    return s;
}

// The identifying fields present (as scalars) on an object, in SUMMARY_FIELDS order.
export function presentSummaryFields(obj: Record<string, unknown>): string[] {
    return SUMMARY_FIELDS.filter((f) => summaryCell(obj[f]) !== null);
}

function pluralizeType(t: string): string {
    return t.endsWith('s') ? t : t + 's';
}

// One line per item: id + human label + a couple of disambiguators. When every
// item shares one `object` type the per-line type is dropped and named in the
// footer; otherwise each line is tagged with its type.
export function formatCollection(coll: {
    items: unknown[];
    next?: unknown;
    count?: unknown;
}): string {
    const { items, next, count } = coll;

    const types = new Set(
        items
            .filter(isPlainObject)
            .map((o) => o.object)
            .filter((v): v is string => typeof v === 'string'),
    );
    const uniformType = types.size === 1 ? [...types][0] : null;

    const lines = items.map((item) => {
        if (!isPlainObject(item)) return formatScalar(item);
        const cells: string[] = [];
        const id = summaryCell(item.id);
        if (id) cells.push(id);
        const labelField = ['title', 'name', 'label', 'key', 'slug'].find(
            (f) => summaryCell(item[f]) !== null,
        );
        if (labelField) cells.push(summaryCell(item[labelField])!);
        for (const f of ['visibility', 'path']) {
            const c = summaryCell(item[f]);
            if (c) cells.push(c);
        }
        if (!uniformType && typeof item.object === 'string') cells.push(`(${item.object})`);
        return cells.length ? cells.join('  ') : formatPretty(item);
    });

    const footerParts: string[] = [];
    footerParts.push(
        uniformType ? `${items.length} ${pluralizeType(uniformType)}` : `${items.length} items`,
    );
    if (typeof count === 'number') footerParts.push(`${count} total`);
    const page = isPlainObject(next) ? next.page : undefined;
    if (page !== undefined && page !== null) footerParts.push(`next page: --page ${String(page)}`);

    const body = items.length === 0 ? '(no items)' : lines.join('\n');
    return body + '\n\n' + footerParts.join('  ·  ');
}

// Single object: a compact key: value block of just the identifying fields.
export function formatObjectSummary(obj: Record<string, unknown>): string {
    const fields = presentSummaryFields(obj);
    if (fields.length === 0) return formatPretty(obj);
    const out = fields.map((f) => `${f}: ${summaryCell(obj[f])}`);
    if (typeof obj.object === 'string') out.unshift(`object: ${obj.object}`);
    out.push('', '(use --full to show all fields)');
    return out.join('\n');
}

export function printResult(data: unknown, options: OutputOptions): void {
    switch (resolveFormat(options)) {
        case 'json':
            console.log(JSON.stringify(data, null, 2));
            break;
        case 'yaml':
            console.log(jsyaml.dump(data, { indent: 2, lineWidth: 120 }));
            break;
        case 'pretty': {
            if (options.full) {
                console.log(formatPretty(data));
                break;
            }
            const coll = asCollection(data);
            if (coll) console.log(formatCollection(coll));
            else if (isPlainObject(data)) console.log(formatObjectSummary(data));
            else console.log(formatPretty(data));
            break;
        }
    }
}

// ─── Streaming output ──────────────────────────────────────────────────────────

// The SSE endpoints (organization/site `ask`, recommended `questions`, and the
// site agent `ai-response`) yield a sequence of events rather than one response,
// so they can't go through printResult. A StreamRenderer consumes those events as
// they arrive: `write` per event, `end` once the stream closes (or errors).
export interface StreamRenderer {
    write(event: unknown): void;
    end(): void;
}

// Machine formats stream one record per event so a consumer can parse the output
// incrementally: NDJSON for --json (one compact object per line), a stream of
// YAML documents for --yaml (each introduced by the `---` marker). Pretty mode
// renders progressively (see createPrettyStreamRenderer). Format resolution — and
// the piped-defaults-to-YAML behaviour — is shared with printResult.
export function createStreamRenderer(options: OutputOptions): StreamRenderer {
    const format = resolveFormat(options);
    if (format === 'json') {
        return {
            write: (event) => process.stdout.write(`${JSON.stringify(event)}\n`),
            end: () => {},
        };
    }
    if (format === 'yaml') {
        return {
            write: (event) =>
                process.stdout.write(`---\n${jsyaml.dump(event, { indent: 2, lineWidth: 120 })}`),
            end: () => {},
        };
    }
    return createPrettyStreamRenderer();
}

// Human-readable streaming. The three event shapes these endpoints emit are each
// rendered on the fly:
//   - recommended-question events (`{ question }`)   → one bullet per question
//   - answer snapshots (`{ type: 'answer', answer }`) → the answer text, printed
//     incrementally as the snapshot grows, then its sources as citations at end
//   - agent-response events (`{ type: 'response_*' }`) → a concise status line
// Unknown shapes fall back to a compact block so nothing is silently dropped.
function createPrettyStreamRenderer(): StreamRenderer {
    let printedAnswerLen = 0; // chars of the (string) answer already written
    let midLine = false; // last write left the cursor mid-line
    let sources: unknown[] | null = null;
    let followups: unknown[] | null = null;

    const out = (s: string) => {
        if (s.length === 0) return;
        process.stdout.write(s);
        midLine = !s.endsWith('\n');
    };
    const line = (s: string) => {
        process.stdout.write(`${s}\n`);
        midLine = false;
    };

    return {
        write(event: unknown): void {
            if (typeof event === 'string') {
                out(event);
                return;
            }
            if (!isPlainObject(event)) {
                line(formatScalar(event));
                return;
            }
            // Recommended-question stream: one `{ question }` per event.
            if (typeof event.question === 'string' && event.type === undefined) {
                line(`• ${event.question}`);
                return;
            }
            // Answer stream: progressive `{ type: 'answer', answer }` snapshots.
            // Each event carries the answer so far, so we print only the new
            // suffix; sources/followups from the latest snapshot render at end.
            if (event.type === 'answer' && isPlainObject(event.answer)) {
                const answer = event.answer;
                if (Array.isArray(answer.sources)) sources = answer.sources;
                if (Array.isArray(answer.followupQuestions)) followups = answer.followupQuestions;
                const text = streamAnswerText(answer.answer);
                if (text !== undefined) {
                    if (text.length >= printedAnswerLen) out(text.slice(printedAnswerLen));
                    else out(`\n${text}`); // shrank unexpectedly: reprint whole
                    printedAnswerLen = text.length;
                }
                return;
            }
            // Agent-response stream (AIStreamResponse): a status line per event,
            // except the JSON-object chunks which are raw text to concatenate.
            if (typeof event.type === 'string') {
                if (typeof event.jsonChunk === 'string') {
                    out(event.jsonChunk);
                    return;
                }
                line(streamStatusLine(event));
                return;
            }
            line(formatPretty(event));
        },
        end(): void {
            if (midLine) {
                process.stdout.write('\n');
                midLine = false;
            }
            if (sources && sources.length > 0) {
                line('');
                line('Sources:');
                for (const s of sources) line(`  - ${formatStreamSource(s)}`);
            }
            if (followups && followups.length > 0) {
                line('');
                line('Follow-up questions:');
                for (const q of followups) line(`  - ${formatScalar(q)}`);
            }
        },
    };
}

// Renderable text for an answer field. `--format markdown` yields a string; the
// default `document` form has no direct text rendering here, so it is skipped
// (its sources still render as citations once the stream ends).
function streamAnswerText(answer: unknown): string | undefined {
    if (typeof answer === 'string') return answer;
    if (isPlainObject(answer) && typeof answer.markdown === 'string') return answer.markdown;
    return undefined;
}

// One-line status for an AIStreamResponse event, keyed by its `type`.
function streamStatusLine(event: Record<string, unknown>): string {
    const type = String(event.type);
    if (type === 'response_document' || type === 'response_reasoning') {
        const n = Array.isArray(event.blocks) ? event.blocks.length : 0;
        return `[${type}] ${formatScalar(event.operation)} — ${n} block(s)`;
    }
    return `[${type}]`;
}

// A citation line for a SearchAIAnswerSource (a page or a context record).
export function formatStreamSource(source: unknown): string {
    if (!isPlainObject(source)) return formatScalar(source);
    const parts: string[] = [];
    if (source.type === 'record') {
        if (typeof source.title === 'string') parts.push(source.title);
        if (typeof source.url === 'string') parts.push(source.url);
        else if (typeof source.record === 'string') parts.push(`record ${source.record}`);
    } else {
        if (typeof source.page === 'string') parts.push(`page ${source.page}`);
        if (typeof source.space === 'string') parts.push(`space ${source.space}`);
    }
    if (typeof source.reason === 'string' && source.reason) parts.push(`— ${source.reason}`);
    return parts.length ? parts.join('  ') : formatPretty(source);
}
