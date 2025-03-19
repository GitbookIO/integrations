import { describe, expect, it } from 'bun:test';
import { getDereferencedSchema } from '../dereference';
import { getRootPages } from './info';

const infoFilesystem = await Bun.file(
    new URL('../../__fixtures__/rich-info-filesystem.json', import.meta.url),
).text();

describe('Info', () => {
    describe('#getRootPages', () => {
        it('divides the OpenAPI specification schema into a set of tree', async () => {
            const schema = await getDereferencedSchema(JSON.parse(infoFilesystem));
            const tree = getRootPages(schema);
            expect(tree).toMatchSnapshot();
        });
    });
});
