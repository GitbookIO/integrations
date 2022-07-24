import { Router } from 'itty-router';

import { executeGitlabAPIRequest } from './api';

const router = Router({
    base: new URL(
        environment.spaceInstallation?.urls.publicEndpoint ||
        environment.installation?.urls.publicEndpoint ||
        environment.integration.urls.publicEndpoint
    ).pathname,
});

/**
 * List all projects accessible by the current auth token.
 */
router.get('/projects', async (request) => {
    const projects = await executeGitlabAPIRequest('GET', 'projects' , { membership: true });

    const completions = projects.map(project => {

        return {
            label: project.name,
            value: `${project.id}`,
        };
    })

    return new Response(JSON.stringify(completions), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
});

/**
 * List all branches accessible in the currently selected project.
 */
 router.get('/branches', async (request) => {
    const project = environment.spaceInstallation?.configuration.project;
    if (!project) {
        return new Response('No project selected', {
            status: 400,
        });
    }

    const branches = await executeGitlabAPIRequest('GET', `projects/${project}/repository/branches`);

    const completions = branches.map(branch => {
        return {
            label: branch.name + (branch.protected ? ' (protected)' : ''),
            value: `refs/heads/${branch.name}`,
        };
    })

    return new Response(JSON.stringify(completions), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
});

addEventListener('fetch', (event, eventContext) => {
    event.respondWith(router.handle(event.request, eventContext));
});

/*
 * Handle content being updated: start exporting content to GitHub.
 */
addEventListener('space_content_updated', async (event) => {
    // Start export
});

