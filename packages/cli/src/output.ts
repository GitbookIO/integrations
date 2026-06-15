/**
 * Output formatting for the `gitbook2` CLI.
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
