
/**
 * Execute an API request.
 */
export async function executeGitlabAPIRequest(method: 'GET' | 'POST', pathname: string, params: Record<string, any> = {}) {
    const gitlabEndpoint = environment.spaceInstallation.configuration.host || 'https://gitlab.com';
    const accessToken = environment.spaceInstallation.configuration.auth_token;
    const url = new URL(
        `${gitlabEndpoint}/api/v4/${pathname}`
    );

    const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
    };

    let body;
    if (method === 'GET') {
        url.search = new URLSearchParams(params).toString();
    } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(params);
    }

    const response = await fetch(url.toString(), {
        method,
        headers,
        body,
    });

    let data = await response.json();

    if (!response.ok) {
        throw new Error('error');
    }

    return data;
}

