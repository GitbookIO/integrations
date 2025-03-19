import { describe, expect, it } from 'bun:test';
import { getDereferencedSchema } from '../dereference';
import { getRootPages } from './operations';

const petstore = await Bun.file(
    new URL('../../__fixtures__/petstore3.yml', import.meta.url),
).text();
const petstoreWithNestedTags = await Bun.file(
    new URL('../../__fixtures__/petstore3-with-nested-tags.yml', import.meta.url),
).text();

describe('Operations', () => {
    describe('#getRootPages', () => {
        it('divides the OpenAPI specification schema into a set of tree', async () => {
            const schema = await getDereferencedSchema(petstore);
            const tree = getRootPages(schema);
            expect(tree).toHaveLength(3);
            expect(tree[0].id).toBe('tag-pet');
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
            const schema = await getDereferencedSchema(petstore);
            // Change the order of tags
            schema.tags = [{ name: 'store' }, { name: 'pet' }, { name: 'unknown' }];
            const tree = getRootPages(schema);
            expect(tree).toHaveLength(2);
            expect(tree[0].id).toBe('tag-store');
            expect(tree[0].tag).toEqual({ name: 'store' });
            expect(tree[1].id).toBe('tag-pet');
            expect(tree[1].tag).toEqual({ name: 'pet' });
        });

        it('supports nested tags', async () => {
            const schema = await getDereferencedSchema(petstoreWithNestedTags);
            const tree = getRootPages(schema);
            expect(tree).toHaveLength(2);
            expect(tree[0].id).toBe('tag-root');
            expect(tree[0].pages).toHaveLength(1);
            expect(tree[0].pages![0].id).toBe('tag-pet');
            expect(tree[0].pages![0].pages![0].id).toBe('tag-store');
            expect(tree[1].id).toBe('tag-user');
            expect(tree[1].title).toBe('User');
            expect(tree[1].tag).toEqual({
                name: 'user',
                description: 'Operations about user',
            });
        });

        it('supports x-displayName and x-page-title has precendence', async () => {
            const schema = await getDereferencedSchema(petstoreWithNestedTags);
            schema.tags![0]['x-displayName'] = 'Awesome root';
            schema.tags![4]['x-displayName'] = 'Bad user';
            schema.tags![4]['x-page-title'] = 'Awesome user';
            const tree = getRootPages(schema);
            expect(tree[0].id).toBe('tag-root');
            expect(tree[0].title).toBe('Awesome root');
            expect(tree[1].id).toBe('tag-user');
            expect(tree[1].title).toBe('Awesome user');
        });

        it('exposes all operations on a page', async () => {
            const schema = await getDereferencedSchema(petstore);
            const tree = getRootPages(schema);
            const { operations } = tree[0];
            expect(operations).toHaveLength(8);
            expect(operations[0]).toEqual({ method: 'post', path: '/pet' });
            expect(operations[1]).toEqual({ method: 'put', path: '/pet' });
        });
    });
});
