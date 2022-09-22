import { executeGitLabAPIRequest } from './api';

/**
 * List all GitLab projects accessible by the current auth token.
 */
export async function listGitLabProjects() {
    const { configuration } = environment.spaceInstallation;

    if (!configuration?.auth_token) {
        return new Response('No auth token provided', {
            status: 400,
        });
    }

    const gitlabConfig = {
        projectId: configuration.project,
        authToken: configuration.auth_token,
        gitlabHost: configuration.gitlab_host,
    };
    const data = await executeGitLabAPIRequest(
        'GET',
        'projects',
        { membership: true },
        gitlabConfig
    );

    const projects = data.map((project) => {
        return {
            label: project.name,
            value: `${project.id}`,
        };
    });

    return new Response(JSON.stringify(projects), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

/**
 * List all branches associated with the selected project.
 */
export async function listGitLabProjectBranches() {
    const { configuration } = environment.spaceInstallation;

    if (!configuration?.project || !configuration?.auth_token) {
        return new Response('No GitLab project or auth token provided', {
            status: 400,
        });
    }

    const gitlabConfig = {
        projectId: configuration.project,
        authToken: configuration.auth_token,
        gitlabHost: configuration.gitlab_host,
    };
    const data = await executeGitLabAPIRequest(
        'GET',
        `projects/${gitlabConfig.projectId}/repository/branches`,
        {},
        gitlabConfig
    );

    const branches = data.map((branch) => {
        return {
            label: branch.name + (branch.protected ? ' (protected)' : ''),
            value: `refs/heads/${branch.name}`,
        };
    });

    return new Response(JSON.stringify(branches), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
