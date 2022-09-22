// https://esbuild.github.io/api/#jsx-import-source
// https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md

export function Fragment() {
    // TODO
}

/**
 * JSX factory function, to be exported from the JSX package entry point.
 */
export function jsx(type: string | typeof Fragment, props: object) {
    let { children } = props;

    if (typeof children !== 'undefined' && !Array.isArray(children)) {
        children = [children];
    }
    if (children) {
        children = children.flat().filter((child) => child !== null);
    }

    if (type === Fragment) {
        return children;
    }

    return {
        type,
        ...props,
        children,
    };
}

export const jsxs = jsx;

export const jsxDEV = jsx;
