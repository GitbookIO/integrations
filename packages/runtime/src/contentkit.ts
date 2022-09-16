/**
 * JSX createElement function, to be exported from the main package entry point.
 * See https://esbuild.github.io/api/#jsx-import-source
 */
export function createElement(type, attributes, ...children) {
    return {
        type,
        children,
        ...attributes,
    };
}
