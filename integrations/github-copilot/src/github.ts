import { Octokit, RequestError } from 'octokit';
import { IntegrationError } from '@gitbook/runtime';

/**
 * List all the installations on the GitHub side for the given token.
 */
export async function fetchGitHubInstallations(token: string) {
    const octokit = getOctokit(token);

    try {
        const res = await octokit.request('GET /user/installations', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
        return res.data.installations;
    } catch (error) {
        if (error instanceof RequestError) {
            if (error.status === 401) {
                throw new IntegrationError('authentication_required');
            }
        }
        throw error;
    }
}

function getOctokit(token: string) {
    return new Octokit({
        auth: token,
    });
}
