import { describe, expect, it } from 'bun:test';
import { getRevisionFromSpec } from './revision';
import { InputPageDocument } from '@gitbook/api';
import { getDereferencedSchema } from './dereference';

const petstore = await Bun.file(new URL('../__fixtures__/petstore3.yml', import.meta.url)).text();
const petstoreWithNestedTags = await Bun.file(
    new URL('../__fixtures__/petstore3-with-nested-tags.yml', import.meta.url),
).text();

describe('#getRevisionFromSpec', () => {
    it('generates a revision from the spec', async () => {
        const schema = await getDereferencedSchema(petstore);
        const revision = await getRevisionFromSpec({
            specContent: {
                schema,
                url: 'http://example.com',
                slug: 'petstore',
            },
            props: {},
        });
        expect(revision.pages).toHaveLength(3);
        expect(revision.pages![0]).toEqual({
            computed: {
                dependencies: {
                    spec: {
                        ref: {
                            kind: 'openapi',
                            spec: 'petstore',
                        },
                    },
                },
                props: {
                    doc: 'operations',
                    page: 'tag-pet',
                },
                type: 'generate',
            },
            description: '',
            icon: undefined,
            title: 'Pet',
            type: 'document',
            id: 'd028ae04f21cfbda361fa9f78f733d76f96ad0f6',
        });
    });

    it('generates nested pages', async () => {
        const schema = await getDereferencedSchema(petstoreWithNestedTags);
        const revision = await getRevisionFromSpec({
            specContent: {
                schema,
                url: 'http://example.com',
                slug: 'petstore',
            },
            props: {},
        });
        expect(revision.pages).toHaveLength(2);
        expect(revision.pages![0]).toEqual({
            computed: undefined,
            description: '',
            icon: undefined,
            pages: [
                {
                    computed: {
                        dependencies: {
                            spec: {
                                ref: {
                                    kind: 'openapi',
                                    spec: 'petstore',
                                },
                            },
                        },
                        props: {
                            doc: 'operations',
                            page: 'tag-pet',
                        },
                        type: 'generate',
                    },
                    description: '',
                    icon: undefined,
                    pages: [
                        {
                            computed: {
                                dependencies: {
                                    spec: {
                                        ref: {
                                            kind: 'openapi',
                                            spec: 'petstore',
                                        },
                                    },
                                },
                                props: {
                                    doc: 'operations',
                                    page: 'tag-store',
                                },
                                type: 'generate',
                            },
                            description: '',
                            icon: undefined,
                            pages: undefined,
                            title: 'Store',
                            type: 'document',
                            id: 'f428951c7433fb01868928bc37eaf009ab42045b',
                        },
                    ],
                    title: 'Pet',
                    type: 'document',
                    id: 'd028ae04f21cfbda361fa9f78f733d76f96ad0f6',
                },
            ],
            title: 'Root',
            type: 'document',
            id: '237181e75895f80491f1fd21cf0c4fb91654134a',
        });
    });

    it('parses icon', async () => {
        const schema = await getDereferencedSchema(petstore);
        // Add star icon to the first tag
        schema.tags![0]['x-page-icon'] = 'star';

        const revision = await getRevisionFromSpec({
            specContent: {
                schema,
                url: 'http://example.com',
                slug: 'petstore',
            },
            props: {},
        });
        // @ts-expect-error fix it by adding icon to InputPageDocument
        expect((revision.pages![0] as InputPageDocument).icon).toBe('star');
    });

    it('parses description', async () => {
        const schema = await getDereferencedSchema(petstore);
        // Add star icon to the first tag
        schema.tags![0]['x-page-description'] = 'My description';

        const revision = await getRevisionFromSpec({
            specContent: {
                schema,
                url: 'http://example.com',
                slug: 'petstore',
            },
            props: {},
        });
        expect((revision.pages![0] as InputPageDocument).description).toBe('My description');
    });
});
