export function contentKitHyperscript(type, attributes, ...children) {
    return {
        type,
        children,
        ...attributes,
    };
}
