import type * as api from '@gitbook/api';


export function document(nodes: api.DocumentBlocksTopLevels[]): api.JSONDocument {
    return {
        object: 'document',
        nodes,
        data: {},
    };
}

export const paragraph = blockFactory<api.DocumentBlockParagraph>('paragraph');
export const heading1 = blockFactory<api.DocumentBlockHeading>('heading-1');
export const heading2 = blockFactory<api.DocumentBlockHeading>('heading-2');
export const heading3 = blockFactory<api.DocumentBlockHeading>('heading-3');
export const listOrdered = blockFactory<api.DocumentBlockListOrdered>('list-ordered');
export const listUnordered = blockFactory<api.DocumentBlockListUnordered>('list-unordered');
export const listTasks = blockFactory<api.DocumentBlockListTasks>('list-tasks');
export const quote = blockFactory<api.DocumentBlockQuote>('blockquote');
export const hint = blockFactory<api.DocumentBlockHint>('hint');
export const images = blockFactory<api.DocumentBlockImages>('images');

export const divider = voidBlockFactory<api.DocumentBlockDivider>('divider');
export const file = voidBlockFactory<api.DocumentBlockFile>('file');
export const openapi = voidBlockFactory<api.DocumentBlockOpenAPI>('swagger');

export function text(text: string | api.DocumentTextLeaf[]): api.DocumentText {
    return {
        object: 'text',
        leaves: typeof text === 'string' ? [textLeaf(text)] : text,
    };
}

export function textLeaf(text: string, marks?: api.DocumentTextMark[]): api.DocumentTextLeaf {
    return {
        object: 'leaf',
        text,
        marks: marks ?? [],
    };
}

export function bold() {
    return {
        object: 'mark',
        type: 'bold',
    }
}

function blockFactory<Block extends {
    object: 'block';
    type: string;
    nodes: any[];
    data?: object;
}>(type: Block['type']) {
    // @ts-ignore
    return (nodes: Block['nodes'] | Block['nodes'][0], data?: Block['data']): Block => ({
        object: 'block',
        type,
        nodes: Array.isArray(nodes) ? nodes : [nodes],
        data,
    });
}

function voidBlockFactory<Block extends {
    object: 'block';
    type: string;
    data?: object;
}>(type: Block['type']) {
    // @ts-ignore
    return (data?: Block['data']): Block => ({
        object: 'block',
        isVoid: true,
        type,
        data,
    });
}

