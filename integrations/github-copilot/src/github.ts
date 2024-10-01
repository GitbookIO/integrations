import { Octokit } from "octokit";

/**
 * List all the installations on the GitHub side for the given token.
 */
export async function fetchGitHubInstallations(token: string) {
    const octokit = getOctokit(token);

    const res = await octokit.request('GET /user/installations', {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

    return res.data.installations;
}

function getOctokit(token: string) {
    return new Octokit({
        auth: token,
    });
}
