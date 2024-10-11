import { describe, it, expect } from 'bun:test';
import { deepExtract, deepMerge } from './utils';

describe('deepMerge', () => {
    it('should replace values', () => {
        expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
    });

    it('should preserve other values', () => {
        expect(deepMerge({ a: 1, c: 3 }, { a: 2 })).toEqual({ a: 2, c: 3 });
    });

    it('should recurse over objects', () => {
        expect(deepMerge({ a: { b: 1, c: 3 } }, { a: { b: 2 } })).toEqual({ a: { b: 2, c: 3 } });
    });

    it('should recurse over array', () => {
        expect(
            deepMerge({ a: [{ b: 1 }, { b: 2 }, { b: 3 }] }, { a: [{ b: 4 }, { b: 5 }, { b: 6 }] }),
        ).toEqual({ a: [{ b: 4 }, { b: 5 }, { b: 6 }] });
    });
});

it('should merge back as expected', () => {
    const inputs = {
        pages: [
            {
                id: '1',
                title: 'title 1',
                description: 'description 1',
                pages: [
                    {
                        id: '2',
                        title: 'title 2',
                        description: 'description 2',
                        pages: [
                            {
                                id: '3',
                                title: 'title 3',
                                description: 'description 3',
                                pages: [],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const extracted = deepExtract(inputs, (input) => {
        return {
            ...('title' in input ? { title: input.title } : {}),
            ...('description' in input ? { description: input.description } : {}),
        };
    });

    expect(extracted).toEqual({
        pages: [
            {
                title: 'title 1',
                description: 'description 1',
                pages: [
                    {
                        title: 'title 2',
                        description: 'description 2',
                        pages: [
                            {
                                title: 'title 3',
                                description: 'description 3',
                            },
                        ],
                    },
                ],
            },
        ],
    });

    // Test with an a non-modified extracted object
    const merged = deepMerge(inputs, extracted);
    expect(merged).toEqual(inputs);

    // Modify the extracted object
    extracted.pages[0].title = 'new title';
    const merged2 = deepMerge(inputs, extracted);
    expect(merged2).not.toEqual(inputs);
    expect(merged2.pages[0].title).toEqual('new title');
});
