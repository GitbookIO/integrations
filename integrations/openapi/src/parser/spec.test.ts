import { describe, expect, it } from 'bun:test';
import { dereferenceOpenAPISpec, divideOpenAPISpecSchema, extractGroupOperations } from './spec';

const rawSpec = await Bun.file(new URL('../__fixtures__/petstore3.yml', import.meta.url)).text();

describe('#divideOpenAPISpecSchema', () => {
    it('divides the OpenAPI specification schema into a set of groups', async () => {
        const schema = await dereferenceOpenAPISpec(rawSpec);
        const groups = divideOpenAPISpecSchema(schema);
        expect(groups).toHaveLength(3);
        expect(groups[0].id).toBe('pet');
        expect(groups[0].tag).toEqual({
            name: 'pet',
            description: 'Everything about your Pets',
            externalDocs: {
                description: 'Find out more',
                url: 'http://swagger.io',
            },
        });
    });

    it('respects the tags', async () => {
        const schema = await dereferenceOpenAPISpec(rawSpec);
        // Change the order of tags
        schema.tags = [{ name: 'store' }, { name: 'pet' }];
        const groups = divideOpenAPISpecSchema(schema);
        expect(groups).toHaveLength(2);
        expect(groups[0].id).toBe('store');
        expect(groups[0].tag).toEqual({ name: 'store' });
        expect(groups[1].id).toBe('pet');
        expect(groups[1].tag).toEqual({ name: 'pet' });
    });
});

describe('#extractGroupOperations', () => {
    it('extracts all operations from a group', async () => {
        const schema = await dereferenceOpenAPISpec(rawSpec);
        const groups = divideOpenAPISpecSchema(schema);
        const operations = extractGroupOperations(groups[0]);
        expect(operations).toHaveLength(8);
        expect(operations[0]).toEqual({ method: 'post', path: '/pet' });
        expect(operations[1]).toEqual({ method: 'put', path: '/pet' });
    });
});
