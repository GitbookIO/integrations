import { it, expect } from 'bun:test';
import { deepExtract, deepMerge } from './utils';

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

    const merged = deepMerge(inputs, extracted);

    expect(merged).toEqual(inputs);
});
