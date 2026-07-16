import { describe, it, expect } from 'bun:test';

import {
    asCollection,
    coerceArrayQueryParam,
    coerceBodyFlag,
    createStreamRenderer,
    explainApiError,
    formatCollection,
    formatObjectSummary,
    formatStreamSource,
    isPlainObject,
    normalizeChangesMarkdown,
    normalizeMarkdown,
    presentSummaryFields,
    resolveFormat,
    summaryCell,
} from './output';

// Capture everything the renderer writes to stdout during `fn`.
function captureStdout(fn: () => void): string {
    const original = process.stdout.write.bind(process.stdout);
    let buffer = '';
    (process.stdout as unknown as { write: (chunk: unknown) => boolean }).write = (chunk) => {
        buffer += String(chunk);
        return true;
    };
    try {
        fn();
    } finally {
        (process.stdout as unknown as { write: typeof original }).write = original;
    }
    return buffer;
}

describe('coerceBodyFlag', () => {
    it('parses an array flag string into a real array', () => {
        const result = coerceBodyFlag('[{"op":"add"}]', 'array');
        expect(Array.isArray(result)).toBe(true);
        expect(result).toEqual([{ op: 'add' }]);
    });

    it('parses an array of strings (e.g. --users)', () => {
        expect(coerceBodyFlag('["user_x","user_y"]', 'array')).toEqual(['user_x', 'user_y']);
    });

    it('throws a legible error when an array flag is not valid JSON', () => {
        expect(() => coerceBodyFlag('not json', 'array')).toThrow(/not valid JSON/);
    });

    it('throws when a JSON value parses but is not an array', () => {
        expect(() => coerceBodyFlag('{"a":1}', 'array')).toThrow(/parsed a object/);
    });

    it('coerces a number flag string into a number', () => {
        expect(coerceBodyFlag('42', 'number')).toBe(42);
        expect(coerceBodyFlag('3.14', 'number')).toBe(3.14);
    });

    it('throws when a number flag is not numeric', () => {
        expect(() => coerceBodyFlag('abc', 'number')).toThrow(/Expected a number/);
        expect(() => coerceBodyFlag('', 'number')).toThrow(/Expected a number/);
    });

    it('passes string and boolean values through untouched', () => {
        expect(coerceBodyFlag('hello', 'string')).toBe('hello');
        expect(coerceBodyFlag(true, 'boolean')).toBe(true);
    });
});

describe('asCollection', () => {
    it('treats a { items } envelope as a collection', () => {
        expect(asCollection({ items: [1, 2], next: { page: 'x' }, count: 9 })).toEqual({
            items: [1, 2],
            next: { page: 'x' },
            count: 9,
        });
    });

    it('treats a bare array as a collection', () => {
        expect(asCollection([1, 2])).toEqual({ items: [1, 2] });
    });

    it('returns null for a plain object without items', () => {
        expect(asCollection({ id: 'a', title: 'b' })).toBeNull();
    });

    it('returns null for scalars', () => {
        expect(asCollection('hello')).toBeNull();
        expect(asCollection(null)).toBeNull();
    });
});

describe('summaryCell', () => {
    it('returns null for absent (undefined) values', () => {
        expect(summaryCell(undefined)).toBeNull();
    });

    it('renders null as an em dash', () => {
        expect(summaryCell(null)).toBe('—');
    });

    it('returns null for object/array values (skipped, not rendered inline)', () => {
        expect(summaryCell({ a: 1 })).toBeNull();
        expect(summaryCell([1, 2])).toBeNull();
    });

    it('truncates long strings to 60 chars with an ellipsis', () => {
        const long = 'a'.repeat(100);
        const cell = summaryCell(long)!;
        expect(cell.length).toBe(60);
        expect(cell.endsWith('…')).toBe(true);
    });
});

describe('formatCollection — uniform list', () => {
    const orgs = {
        items: [
            { object: 'organization', id: 'abc123', title: 'Acme Corp' },
            { object: 'organization', id: 'def456', title: 'Open Docs' },
        ],
        next: { page: 'NEXTCURSOR' },
        count: 57,
    };

    it('renders one line per item with id + label, dropping the per-line type', () => {
        const out = formatCollection(orgs);
        expect(out).toContain('abc123  Acme Corp');
        expect(out).toContain('def456  Open Docs');
        expect(out).not.toContain('(organization)'); // uniform → no per-line tag
    });

    it('names the type and count in the footer, and the pagination cursor as a flag', () => {
        const out = formatCollection(orgs);
        const footer = out.trim().split('\n').at(-1)!;
        expect(footer).toContain('2 organizations');
        expect(footer).toContain('57 total');
        expect(footer).toContain('next page: --page NEXTCURSOR');
    });
});

describe('formatCollection — heterogeneous list', () => {
    it('tags each line with its object type', () => {
        const out = formatCollection({
            items: [
                { object: 'space', id: 's1', title: 'Docs' },
                { object: 'collection', id: 'c1', title: 'Group' },
            ],
        });
        expect(out).toContain('s1  Docs  (space)');
        expect(out).toContain('c1  Group  (collection)');
        expect(out).toContain('2 items'); // mixed → generic "items"
    });
});

describe('formatCollection — extra disambiguators & missing fields', () => {
    it('appends visibility/path after the label', () => {
        const out = formatCollection({
            items: [{ object: 'space', id: 's1', title: 'Docs', visibility: 'private' }],
        });
        expect(out).toContain('s1  Docs  private');
    });

    it('still renders whatever identifiers an item has when others are missing', () => {
        const out = formatCollection({
            items: [{ object: 'space', id: 'only-id' }],
        });
        expect(out).toContain('only-id');
    });
});

describe('formatCollection — empty', () => {
    it('shows (no items) and still surfaces count', () => {
        const out = formatCollection({ items: [], count: 0 });
        expect(out).toContain('(no items)');
        expect(out).toContain('0 items');
    });

    it('omits the pagination part when there is no next page', () => {
        const out = formatCollection({ items: [{ object: 'space', id: 's1' }] });
        expect(out).not.toContain('next page');
    });
});

describe('formatObjectSummary', () => {
    it('shows only identifying fields plus the --full hint', () => {
        const out = formatObjectSummary({
            object: 'organization',
            id: 'abc123',
            title: 'Acme Corp',
            plan: { tier: 'free' }, // non-identifying / nested → omitted
        });
        expect(out).toContain('object: organization');
        expect(out).toContain('id: abc123');
        expect(out).toContain('title: Acme Corp');
        expect(out).not.toContain('plan');
        expect(out).toContain('(use --full to show all fields)');
    });

    it('falls back to a full dump when no identifying fields exist', () => {
        const out = formatObjectSummary({ foo: 'bar', plan: 'enterprise' });
        expect(out).toContain('foo: bar');
        expect(out).toContain('plan: enterprise');
        expect(out).not.toContain('(use --full');
    });
});

describe('presentSummaryFields', () => {
    it('returns present scalar fields in SUMMARY_FIELDS order', () => {
        expect(presentSummaryFields({ title: 't', id: 'i', visibility: 'public' })).toEqual([
            'id',
            'title',
            'visibility',
        ]);
    });
});

describe('resolveFormat', () => {
    it('honors explicit flags over everything', () => {
        expect(resolveFormat({ json: true })).toBe('json');
        expect(resolveFormat({ yaml: true })).toBe('yaml');
        expect(resolveFormat({ pretty: true })).toBe('pretty');
    });
});

describe('isPlainObject', () => {
    it('distinguishes plain objects from arrays and null', () => {
        expect(isPlainObject({})).toBe(true);
        expect(isPlainObject([])).toBe(false);
        expect(isPlainObject(null)).toBe(false);
    });
});

describe('coerceArrayQueryParam', () => {
    it('wraps a bare scalar into a one-element array', () => {
        expect(coerceArrayQueryParam('gitbook:agent')).toEqual(['gitbook:agent']);
    });

    it('splits a comma-separated list and trims', () => {
        expect(coerceArrayQueryParam('a, b ,c')).toEqual(['a', 'b', 'c']);
    });

    it('parses a JSON array', () => {
        expect(coerceArrayQueryParam('["x","y"]')).toEqual(['x', 'y']);
    });

    it('passes an existing array through as strings', () => {
        expect(coerceArrayQueryParam(['a', 'b'])).toEqual(['a', 'b']);
    });

    it('throws when a JSON-looking value is not valid JSON', () => {
        expect(() => coerceArrayQueryParam('[oops')).toThrow(/not valid JSON/);
    });
});

describe('explainApiError', () => {
    it('appends a hint on a schema-union validation failure', () => {
        const msg =
            'GitBook API failed with [422] /x: body.changes.0: expected to match exactly one';
        const out = explainApiError(msg);
        expect(out).toContain(msg);
        expect(out).toMatch(/markdown/);
    });

    it('leaves unrelated errors untouched', () => {
        expect(explainApiError('GitBook API failed with [404] /x: not found')).toBe(
            'GitBook API failed with [404] /x: not found',
        );
    });
});

describe('normalizeMarkdown', () => {
    it('strips a duplicated leading H1 and one trailing blank line', () => {
        expect(normalizeMarkdown('# Title\n\nBody text')).toBe('Body text');
    });

    it('leaves an H2 and non-leading H1 alone', () => {
        expect(normalizeMarkdown('## Section\n\nBody')).toBe('## Section\n\nBody');
        expect(normalizeMarkdown('Intro\n\n# Later')).toBe('Intro\n\n# Later');
    });

    it('collapses a multi-line {% %} block onto one line', () => {
        const input = '{% @mermaid/diagram content="\ngraph TD\nA-->B\n" %}';
        expect(normalizeMarkdown(input)).toBe(
            '{% @mermaid/diagram content="\\ngraph TD\\nA-->B\\n" %}',
        );
    });

    it('leaves a single-line block untouched', () => {
        const input = '{% hint style="info" %}';
        expect(normalizeMarkdown(input)).toBe(input);
    });
});

describe('normalizeChangesMarkdown', () => {
    it('normalizes document.markdown across operations in place', () => {
        const changes: unknown[] = [
            { operation: 'update_page', page: 'p1', document: { markdown: '# Title\n\nBody' } },
            { operation: 'delete_page', page: 'p2' },
        ];
        normalizeChangesMarkdown(changes);
        expect((changes[0] as any).document.markdown).toBe('Body');
        expect(changes[1]).toEqual({ operation: 'delete_page', page: 'p2' });
    });

    it('is a no-op on a non-array', () => {
        expect(() => normalizeChangesMarkdown(undefined)).not.toThrow();
    });
});

describe('createStreamRenderer', () => {
    it('--json emits one NDJSON record per event', () => {
        const out = captureStdout(() => {
            const r = createStreamRenderer({ json: true });
            r.write({ question: 'a' });
            r.write({ question: 'b' });
            r.end();
        });
        expect(out).toBe('{"question":"a"}\n{"question":"b"}\n');
    });

    it('--yaml emits one YAML document per event, marker-delimited', () => {
        const out = captureStdout(() => {
            const r = createStreamRenderer({ yaml: true });
            r.write({ a: 1 });
            r.write({ b: 2 });
            r.end();
        });
        expect(out).toBe('---\na: 1\n---\nb: 2\n');
    });

    it('pretty renders a recommended-question stream as bullets', () => {
        const out = captureStdout(() => {
            const r = createStreamRenderer({ pretty: true });
            r.write({ question: 'How do I start?' });
            r.write({ question: 'What is X?' });
            r.end();
        });
        expect(out).toBe('• How do I start?\n• What is X?\n');
    });

    it('pretty prints answer text incrementally, then sources and follow-ups', () => {
        const out = captureStdout(() => {
            const r = createStreamRenderer({ pretty: true });
            // Each event carries the answer so far; only the new suffix prints.
            r.write({ type: 'answer', answer: { answer: 'Hello', sources: [], followupQuestions: [] } });
            r.write({
                type: 'answer',
                answer: {
                    answer: 'Hello world',
                    sources: [{ type: 'page', page: 'p1', space: 's1' }],
                    followupQuestions: ['Tell me more?'],
                },
            });
            r.end();
        });
        expect(out).toBe(
            'Hello world\n\nSources:\n  - page p1  space s1\n\nFollow-up questions:\n  - Tell me more?\n',
        );
    });

    it('pretty renders agent-response events as concise status lines', () => {
        const out = captureStdout(() => {
            const r = createStreamRenderer({ pretty: true });
            r.write({ type: 'response_start', messageId: 'm1' });
            r.write({ type: 'response_document', operation: 'insert', blocks: [{}, {}] });
            r.write({ type: 'response_finish', messageId: 'm1', response: {} });
            r.end();
        });
        expect(out).toBe(
            '[response_start]\n[response_document] insert — 2 block(s)\n[response_finish]\n',
        );
    });
});

describe('formatStreamSource', () => {
    it('renders a page source with reason', () => {
        expect(formatStreamSource({ type: 'page', page: 'p1', space: 's1', reason: 'covers it' })).toBe(
            'page p1  space s1  — covers it',
        );
    });

    it('renders a context-record source with title and url', () => {
        expect(
            formatStreamSource({ type: 'record', title: 'Guide', url: 'https://x/guide' }),
        ).toBe('Guide  https://x/guide');
    });
});
