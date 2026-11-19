import { describe, expect, it } from 'bun:test';

import { extractNodeFromURL } from '../src/figma';

describe('extractNodeFromURL', () => {
    it('extracts the file and node from a design URL', () => {
        expect(
            extractNodeFromURL('https://www.figma.com/design/AbC123/My-File?node-id=12-34'),
        ).toEqual({ fileId: 'AbC123', nodeId: '12:34' });
    });

    it('extracts the file and node from a legacy file URL', () => {
        expect(
            extractNodeFromURL('https://www.figma.com/file/AbC123/My-File?node-id=12-34'),
        ).toEqual({ fileId: 'AbC123', nodeId: '12:34' });
    });

    it('ignores other Figma URLs', () => {
        expect(extractNodeFromURL('https://www.figma.com/community/file/AbC123')).toBeUndefined();
        expect(extractNodeFromURL('https://example.com/design/AbC123')).toBeUndefined();
    });
});
