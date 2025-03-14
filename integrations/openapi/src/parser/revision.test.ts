import { describe, expect, it } from 'bun:test';
import { dereferenceOpenAPISpec } from './spec';
import { getRevisionFromSpec } from './revision';
import { InputPageDocument } from '@gitbook/api';

const petstore = await Bun.file(new URL('../__fixtures__/petstore3.yml', import.meta.url)).text();
const petstoreWithNestedTags = await Bun.file(
    new URL('../__fixtures__/petstore3-with-nested-tags.yml', import.meta.url),
).text();

describe('#getRevisionFromSpec', () => {
    it('generates a revision from the spec', async () => {
        const schema = await dereferenceOpenAPISpec(petstore);
        const revision = getRevisionFromSpec({
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
                integration: 'openapi',
                props: {
                    doc: 'operations',
                    page: 'pet',
                },
                source: 'generate',
            },
            description: '',
            icon: undefined,
            title: 'Pet',
            type: 'document',
            id: 'tag-pet',
        });
    });

    it('generates nested pages', async () => {
        const schema = await dereferenceOpenAPISpec(petstoreWithNestedTags);
        const revision = getRevisionFromSpec({
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
                        integration: 'openapi',
                        props: {
                            doc: 'operations',
                            page: 'pet',
                        },
                        source: 'generate',
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
                                integration: 'openapi',
                                props: {
                                    doc: 'operations',
                                    page: 'store',
                                },
                                source: 'generate',
                            },
                            description: '',
                            icon: undefined,
                            pages: undefined,
                            title: 'Store',
                            type: 'document',
                            id: 'tag-store',
                        },
                    ],
                    title: 'Pet',
                    type: 'document',
                    id: 'tag-pet',
                },
            ],
            title: 'Root',
            type: 'document',
            id: 'tag-root',
        });
    });

    it('parses icon', async () => {
        const schema = await dereferenceOpenAPISpec(petstore);
        // Add star icon to the first tag
        schema.tags![0]['x-page-icon'] = 'star';

        const revision = getRevisionFromSpec({
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
        const schema = await dereferenceOpenAPISpec(petstore);
        // Add star icon to the first tag
        schema.tags![0]['x-page-description'] = 'My description';

        const revision = getRevisionFromSpec({
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
