export async function mailchimp(path: string, options: { access_token: string; server: string }) {
    return fetch(`${base}/lists`);
}
