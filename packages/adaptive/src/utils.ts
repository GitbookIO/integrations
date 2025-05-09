import Cookies from 'js-cookie';

export const GITBOOK_VISITOR_PUBLIC_PREFIX = 'gitbook-visitor-public' as const;

/**
 * Write a client-side cookie for the GitBook visitor.
 */
export function writeGitBookVisitorCookie(name: string, value: unknown) {
    const COOKIE_NAME = `${GITBOOK_VISITOR_PUBLIC_PREFIX}-${name}`;
    const COOKIE_VALUE = (() => {
        try {
            return typeof value === 'string' ? value : JSON.stringify(value);
        } catch (e) {
            console.error('Error serializing value for cookie: ', e);
            throw e;
        }
    })();

    Cookies.set(COOKIE_NAME, COOKIE_VALUE, {
        secure: true,
    });
}
