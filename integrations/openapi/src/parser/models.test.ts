import { describe, expect, it } from 'bun:test';
import { dereferenceOpenAPISpec } from './spec';
import assert from 'assert';
import { getModelsDocument } from './models';

const rawSpec = await Bun.file(new URL('../__fixtures__/petstore3.yml', import.meta.url)).text();

describe('#getModelsDocument', () => {
    it('generates a document from a specificaton', async () => {
        const schema = await dereferenceOpenAPISpec(rawSpec);
        const specContent = {
            schema,
            url: 'http://example.com',
            slug: 'petstore',
        };
        const document = getModelsDocument({ specContent });
        assert('document' in document);
        expect(document.document.nodes).toHaveLength(2);
        expect(document.document.nodes[1].type).toBe('openapi-schemas');
        expect(document.document.nodes[1].data).toMatchObject({
            schemas: [
                'Order',
                'Customer',
                'Address',
                'Category',
                'User',
                'Tag',
                'Pet',
                'ApiResponse',
            ],
            ref: {
                kind: 'openapi',
                spec: 'petstore',
            },
        });
    });
});
