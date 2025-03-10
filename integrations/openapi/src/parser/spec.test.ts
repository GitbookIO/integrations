import { describe, expect, it } from 'bun:test';
import { dereferenceOpenAPISpec, extractPageOperations, getOpenAPITree } from './spec';

const petstore = await Bun.file(new URL('../__fixtures__/petstore3.yml', import.meta.url)).text();
const petstoreWithNestedTags = await Bun.file(
    new URL('../__fixtures__/petstore3-with-nested-tags.yml', import.meta.url),
).text();

describe('#getOpenAPITree', () => {
    it('divides the OpenAPI specification schema into a set of tree', async () => {
        const schema = await dereferenceOpenAPISpec(petstore);
        const tree = getOpenAPITree(schema);
        expect(tree).toHaveLength(3);
        expect(tree[0].id).toBe('pet');
        expect(tree[0].tag).toEqual({
            name: 'pet',
            description: 'Everything about your Pets',
            externalDocs: {
                description: 'Find out more',
                url: 'http://swagger.io',
            },
        });
    });

    it('respects the tags', async () => {
        const schema = await dereferenceOpenAPISpec(petstore);
        // Change the order of tags
        schema.tags = [{ name: 'store' }, { name: 'pet' }, { name: 'unknown' }];
        const tree = getOpenAPITree(schema);
        expect(tree).toHaveLength(2);
        expect(tree[0].id).toBe('store');
        expect(tree[0].tag).toEqual({ name: 'store' });
        expect(tree[1].id).toBe('pet');
        expect(tree[1].tag).toEqual({ name: 'pet' });
    });

    it.only('supports nested tags', async () => {
        const schema = await dereferenceOpenAPISpec(petstoreWithNestedTags);
        const tree = getOpenAPITree(schema);
        expect(tree).toHaveLength(2);
        expect(tree[0].id).toBe('root');
        expect(tree[0].pages).toHaveLength(1);
        expect(tree[0].pages![0].id).toBe('pet');
        expect(tree[0].pages![0].pages![0].id).toBe('store');
        expect(tree[1].id).toBe('user');
        expect(tree[1].title).toBe('User');
        expect(tree[1].tag).toEqual({
            name: 'user',
            description: 'Operations about user',
        });
    });
});

describe('#extractPageOperations', () => {
    it('extracts all operations from a group', async () => {
        const schema = await dereferenceOpenAPISpec(petstore);
        const tree = getOpenAPITree(schema);
        const operations = extractPageOperations(tree[0]);
        expect(operations).toHaveLength(8);
        expect(operations[0]).toEqual({ method: 'post', path: '/pet' });
        expect(operations[1]).toEqual({ method: 'put', path: '/pet' });
    });
});
