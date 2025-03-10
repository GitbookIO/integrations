import { describe, expect, it } from 'bun:test';
import { dereferenceOpenAPISpec, getOpenAPITree } from './spec';
import { getOpenAPIPageDocument } from './page';
import assert from 'assert';
import * as doc from '@gitbook/document';
import { JSONDocument } from '@gitbook/api';

const rawSpec = await Bun.file(new URL('../__fixtures__/petstore3.yml', import.meta.url)).text();

describe('#getOpenAPIPageDocument', () => {
    it('generates a document from a group', async () => {
        const schema = await dereferenceOpenAPISpec(rawSpec);
        const specContent = {
            schema,
            url: 'http://example.com',
            slug: 'petstore',
        };
        const pages = getOpenAPITree(schema);
        const document = getOpenAPIPageDocument({ page: pages[0], specContent });
        assert('document' in document);
        // First node is the tag description
        expect(document.document.nodes[0]).toEqual({
            data: {},
            nodes: [
                {
                    leaves: [
                        {
                            marks: [],
                            object: 'leaf',
                            text: 'Everything about your Pets',
                        },
                    ],
                    object: 'text',
                },
            ],
            object: 'block',
            type: 'paragraph',
        });

        // Other nodes are operations
        expect(document.document.nodes).toHaveLength(9);
        expect(document.document.nodes[1]).toEqual({
            data: {
                method: 'post',
                path: '/pet',
                ref: {
                    kind: 'openapi',
                    spec: 'petstore',
                },
            },
            isVoid: true,
            object: 'block',
            type: 'openapi-operation',
        });
    });

    it('supports x-gitbook-description-document', async () => {
        const schema = await dereferenceOpenAPISpec(rawSpec);
        const specContent = {
            schema,
            url: 'http://example.com',
            slug: 'petstore',
        };
        const pages = getOpenAPITree(schema);
        pages[0].tag!['x-gitbook-description-document'] = (
            doc.document([doc.paragraph(doc.text('Hello')), doc.paragraph(doc.text('World'))]) as {
                document: JSONDocument;
            }
        ).document;
        const document = getOpenAPIPageDocument({ page: pages[0], specContent });
        assert('document' in document);
        // First nodes are the spread of the previous document
        expect(document.document.nodes[0]).toEqual({
            data: {},
            nodes: [
                {
                    leaves: [
                        {
                            marks: [],
                            object: 'leaf',
                            text: 'Hello',
                        },
                    ],
                    object: 'text',
                },
            ],
            object: 'block',
            type: 'paragraph',
        });
        expect(document.document.nodes[1]).toEqual({
            data: {},
            nodes: [
                {
                    leaves: [
                        {
                            marks: [],
                            object: 'leaf',
                            text: 'World',
                        },
                    ],
                    object: 'text',
                },
            ],
            object: 'block',
            type: 'paragraph',
        });

        // Other nodes are operations
        expect(document.document.nodes).toHaveLength(10);
        expect(document.document.nodes[2]).toEqual({
            data: {
                method: 'post',
                path: '/pet',
                ref: {
                    kind: 'openapi',
                    spec: 'petstore',
                },
            },
            isVoid: true,
            object: 'block',
            type: 'openapi-operation',
        });
    });
});
