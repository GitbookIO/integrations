/**
 * AUTO-GENERATED — DO NOT EDIT
 *
 * Source:    packages/api/spec/openapi.yaml
 * Generator: scripts/generate-commands.ts
 *
 * Re-generate: npm run generate-commands (from monorepo root)
 */

/* eslint-disable */

import { Command } from 'commander';
import { ContentType } from '@gitbook/api';
import { getAPIClient } from './remote';
// Output formatting lives in ./output (a real, unit-tested module) rather than
// being inlined here, so the rendering logic has a single source of truth.
import { printResult } from './output';

export function registerGeneratedCommands(program: Command): void {
    const systemCmd = program
        .command('system')
        .description('Manage system');

    systemCmd
        .command('info')
        .description('Get API information')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (options) => {
            const api = await getAPIClient(true);
            const path = '/';
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const usersCmd = program
        .command('users')
        .description('Manage users');

    usersCmd
        .command('whoami')
        .description('Get profile of authenticated user')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (options) => {
            const api = await getAPIClient(true);
            const path = '/user';
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    usersCmd
        .command('get <userId>')
        .description('Get a user by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (userId, options) => {
            const api = await getAPIClient(true);
            const path = `/users/${userId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    usersCmd
        .command('update <userId>')
        .description('Update a user by its ID')
        .option('--displayName <value>', 'Full name for the user')
        .option('--photoURL <value>', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (userId, options) => {
            const api = await getAPIClient(true);
            const path = `/users/${userId}`;
            const body: Record<string, unknown> = {};
            if (options.displayName !== undefined) body['displayName'] = options.displayName;
            if (options.photoURL !== undefined) body['photoURL'] = options.photoURL;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spacesCmd = program
        .command('spaces')
        .description('Manage spaces');

    spacesCmd
        .command('get <spaceId>')
        .description('Get a space by its ID')
        .option('--shareKey [shareKey]', 'For sites published via share-links, the share key is useful to resolve published URLs.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}`;
            const query: Record<string, string> = {};
            if (options["shareKey"] !== undefined) query['shareKey'] = String(options["shareKey"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spacesCmd
        .command('update <spaceId>')
        .description('Update a space')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spacesCmd
        .command('delete <spaceId>')
        .description('Delete a space')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spacesCmd
        .command('duplicate <spaceId>')
        .description('Duplicate a space')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/duplicate`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spacesCmd
        .command('restore <spaceId>')
        .description('Restore a deleted space')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/restore`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spacesCmd
        .command('move <spaceId>')
        .description('Move a space to a new position')
        .option('--parent <value>', 'The unique id of the parent collection')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/move`;
            const body: Record<string, unknown> = {};
            if (options.parent !== undefined) body['parent'] = options.parent;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spacesCmd
        .command('search <spaceId>')
        .description('Search content in a space')
        .option('--query <query>', '')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/search`;
            const query: Record<string, string> = {};
            if (options["query"] !== undefined) query['query'] = String(options["query"]);
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spacesCmd
        .command('list')
        .description('List all collection spaces')
        .option('--collection <value>', 'Scope: collectionId')
        .option('--integration <value>', 'Scope: integrationName')
        .option('--installation <value>', 'Scope: installationId')
        .option('--organization <value>', 'Scope: organizationId')
        .option('--member <value>', 'Scope: userId')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--externalId [externalId]', 'External Id to filter by')
        .option('--extended [extended]', 'If true, returns the space object in each items. If false, returns the space ID in each items.')
        .option('--order [order]', 'An order for the items in the list')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (options) => {
            const api = await getAPIClient(true);
            const scopeFlags = ['collection', 'integration', 'installation', 'organization', 'member'];
            const provided = scopeFlags.filter((f) => (options as Record<string, unknown>)[f] !== undefined).sort().join(',');
            let path: string;
            if (provided === 'collection') {
                path = `/collections/${options.collection}/spaces`;
            }
            else if (provided === 'integration') {
                path = `/integrations/${options.integration}/spaces`;
            }
            else if (provided === 'installation,integration') {
                path = `/integrations/${options.integration}/installations/${options.installation}/spaces`;
            }
            else if (provided === 'member,organization') {
                path = `/orgs/${options.organization}/members/${options.member}/spaces`;
            }
            else if (provided === 'organization') {
                path = `/orgs/${options.organization}/spaces`;
            }
            else {
                console.error('Specify a valid scope: --collection, --integration, --installation, --organization, --member. Some scopes require a combination (e.g. --integration with --installation).');
                process.exit(1);
            }
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["externalId"] !== undefined) query['externalId'] = String(options["externalId"]);
            if (options["extended"] !== undefined) query['extended'] = String(options["extended"]);
            if (options["order"] !== undefined) query['order'] = String(options["order"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spacesCmd
        .command('create <organizationId>')
        .description('Create a space')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/spaces`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_embedCmd = spacesCmd
        .command('embed')
        .description('Manage spaces embed');

    spaces_embedCmd
        .command('get <spaceId>')
        .description('Resolve a URL to an embed in a given space')
        .option('--url <url>', 'URL to resolve')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/embed`;
            const query: Record<string, string> = {};
            if (options["url"] !== undefined) query['url'] = String(options["url"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_gitCmd = spacesCmd
        .command('git')
        .description('Manage spaces git');

    spaces_gitCmd
        .command('import <spaceId>')
        .description('Import a Git repository')
        .option('--url <value>', 'URL of the Git repository to import. It can contain basic auth credentials. (required)')
        .option('--ref <value>', 'Git ref to import in the format "refs/heads/main" (required)')
        .option('--repoTreeURL <value>', 'URL to use as a prefix for external file references.')
        .option('--repoCommitURL <value>', 'URL to use as a prefix for the commit URL.')
        .option('--repoProjectDirectory <value>', 'Path to a root directory for the project in the repository.')
        .option('--timestamp <value>', '')
        .option('--force', '')
        .option('--standalone', 'If true, the import will generate a revision without updating the space primary content.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/git/import`;
            const body: Record<string, unknown> = {};
            if (options.url !== undefined) body['url'] = options.url;
            if (options.ref !== undefined) body['ref'] = options.ref;
            if (options.repoTreeURL !== undefined) body['repoTreeURL'] = options.repoTreeURL;
            if (options.repoCommitURL !== undefined) body['repoCommitURL'] = options.repoCommitURL;
            if (options.repoProjectDirectory !== undefined) body['repoProjectDirectory'] = options.repoProjectDirectory;
            if (options.timestamp !== undefined) body['timestamp'] = options.timestamp;
            if (options.force !== undefined) body['force'] = options.force;
            if (options.standalone !== undefined) body['standalone'] = options.standalone;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_gitCmd
        .command('export <spaceId>')
        .description('Export the to a Git repository')
        .option('--url <value>', 'URL of the Git repository to export to. It can contain basic auth credentials. (required)')
        .option('--ref <value>', 'Git ref to push the commit to in the format "refs/heads/main" (required)')
        .option('--commitMessage <value>', 'Message for the commit generated by the export (required)')
        .option('--repoTreeURL <value>', 'URL to use as a prefix for external file references.')
        .option('--repoCommitURL <value>', 'URL to use as a prefix for the commit URL.')
        .option('--repoProjectDirectory <value>', 'Path to a root directory for the project in the repository.')
        .option('--timestamp <value>', '')
        .option('--force', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/git/export`;
            const body: Record<string, unknown> = {};
            if (options.url !== undefined) body['url'] = options.url;
            if (options.ref !== undefined) body['ref'] = options.ref;
            if (options.commitMessage !== undefined) body['commitMessage'] = options.commitMessage;
            if (options.repoTreeURL !== undefined) body['repoTreeURL'] = options.repoTreeURL;
            if (options.repoCommitURL !== undefined) body['repoCommitURL'] = options.repoCommitURL;
            if (options.repoProjectDirectory !== undefined) body['repoProjectDirectory'] = options.repoProjectDirectory;
            if (options.timestamp !== undefined) body['timestamp'] = options.timestamp;
            if (options.force !== undefined) body['force'] = options.force;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_git_infoCmd = spaces_gitCmd
        .command('info')
        .description('Manage spaces git info');

    spaces_git_infoCmd
        .command('get <spaceId>')
        .description('Get space Git info')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/git/info`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_permissionsCmd = spacesCmd
        .command('permissions')
        .description('Manage spaces permissions');

    spaces_permissionsCmd
        .command('invite <spaceId>')
        .description('Invite a user or a team to a space')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/permissions`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_permissions_teamsCmd = spaces_permissionsCmd
        .command('teams')
        .description('Manage spaces permissions teams');

    spaces_permissions_teamsCmd
        .command('update <spaceId> <teamId>')
        .description('Update an org team\'s permission in a space')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, teamId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/permissions/teams/${teamId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_permissions_teamsCmd
        .command('remove <spaceId> <teamId>')
        .description('Remove an org team from a space')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, teamId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/permissions/teams/${teamId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_permissions_teamsCmd
        .command('list <spaceId>')
        .description('List an org team\'s permission in a space')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/permissions/teams`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_permissions_usersCmd = spaces_permissionsCmd
        .command('users')
        .description('Manage spaces permissions users');

    spaces_permissions_usersCmd
        .command('list <spaceId>')
        .description('List space user permissions')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/permissions/users`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_permissions_usersCmd
        .command('update <spaceId> <userId>')
        .description('Update space user permissions')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/permissions/users/${userId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_permissions_usersCmd
        .command('remove <spaceId> <userId>')
        .description('Remove a space user')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/permissions/users/${userId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_permissions_aggregateCmd = spaces_permissionsCmd
        .command('aggregate')
        .description('Manage spaces permissions aggregate');

    spaces_permissions_aggregateCmd
        .command('list <spaceId>')
        .description('List all space users permissions')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--role [role]', 'If defined, only members with this role will be returned.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/permissions/aggregate`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["role"] !== undefined) query['role'] = String(options["role"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_contentCmd = spacesCmd
        .command('content')
        .description('Manage spaces content');

    spaces_contentCmd
        .command('get <spaceId>')
        .description('Get a space current revision')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_templateCmd = spaces_contentCmd
        .command('template')
        .description('Manage spaces content template');

    spaces_content_templateCmd
        .command('apply <spaceId>')
        .description('Apply a template to a space.')
        .option('--id <value>', 'The ID of the template to use for the space (required)')
        .option('--changeRequestId <value>', 'The ID of the change request to apply the template to. If not provided, the template is applied to the main content.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/template`;
            const body: Record<string, unknown> = {};
            if (options.id !== undefined) body['id'] = options.id;
            if (options.changeRequestId !== undefined) body['changeRequestId'] = options.changeRequestId;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_pagesCmd = spaces_contentCmd
        .command('pages')
        .description('Manage spaces content pages');

    spaces_content_pagesCmd
        .command('list <spaceId>')
        .description('List all space pages')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/pages`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_filesCmd = spaces_contentCmd
        .command('files')
        .description('Manage spaces content files');

    spaces_content_filesCmd
        .command('list <spaceId>')
        .description('List all space files')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/files`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_content_filesCmd
        .command('get <spaceId> <fileId>')
        .description('Get a space file by its ID')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, fileId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/files/${fileId}`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_files_backlinksCmd = spaces_content_filesCmd
        .command('backlinks')
        .description('Manage spaces content files backlinks');

    spaces_content_files_backlinksCmd
        .command('list <spaceId> <fileId>')
        .description('List all space file backlink locations')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, fileId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/files/${fileId}/backlinks`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_pageCmd = spaces_contentCmd
        .command('page')
        .description('Manage spaces content page');

    spaces_content_pageCmd
        .command('get <spaceId> <pageId>')
        .description('Get a space page by its ID')
        .option('--format [format]', 'Output format for the content.')
        .option('--format.markdown.refs [format.markdown.refs]', 'Controls how content references are formatted in markdown output. Ignored unless `format=markdown`.  - `relative`: Format page references as relative links from the current page. Other references might not be handled. - `stable`: Format content references as stable idempotent refs containing their identifiers.')
        .option('--evaluated [evaluated]', 'Controls whether the document should be evaluated. - When set to `true`, the entire document will be evaluated. - When set to `deterministic-only`, only expressions that depend   exclusively on deterministic inputs will be evaluated.')
        .option('--dereferenced [dereferenced]', 'Controls whether the document should be deferenced (eference to other content will be resolved and expanded). - When set to `true`, the entire document will be deferenced - When set to `reusable-contents`, only reusable contents will be deferenced.')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, pageId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/page/${pageId}`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            if (options["format.markdown.refs"] !== undefined) query['format.markdown.refs'] = String(options["format.markdown.refs"]);
            if (options["evaluated"] !== undefined) query['evaluated'] = String(options["evaluated"]);
            if (options["dereferenced"] !== undefined) query['dereferenced'] = String(options["dereferenced"]);
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_page_linksCmd = spaces_content_pageCmd
        .command('links')
        .description('Manage spaces content page links');

    spaces_content_page_linksCmd
        .command('list <spaceId> <pageId>')
        .description('List all space page links')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--status [status]', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, pageId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/page/${pageId}/links`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["status"] !== undefined) query['status'] = String(options["status"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_page_backlinksCmd = spaces_content_pageCmd
        .command('backlinks')
        .description('Manage spaces content page backlinks');

    spaces_content_page_backlinksCmd
        .command('list <spaceId> <pageId>')
        .description('List all space page backlink locations')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, pageId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/page/${pageId}/backlinks`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_page_metaLinksCmd = spaces_content_pageCmd
        .command('meta-links')
        .description('Manage spaces content page meta-links');

    spaces_content_page_metaLinksCmd
        .command('list <spaceId> <pageId>')
        .description('List all meta links for a space page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, pageId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/page/${pageId}/meta-links`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_pathCmd = spaces_contentCmd
        .command('path')
        .description('Manage spaces content path');

    spaces_content_pathCmd
        .command('get <spaceId> <pagePath>')
        .description('Get a space page by its path')
        .option('--format [format]', 'Output format for the content.')
        .option('--format.markdown.refs [format.markdown.refs]', 'Controls how content references are formatted in markdown output. Ignored unless `format=markdown`.  - `relative`: Format page references as relative links from the current page. Other references might not be handled. - `stable`: Format content references as stable idempotent refs containing their identifiers.')
        .option('--evaluated [evaluated]', 'Controls whether the document should be evaluated. - When set to `true`, the entire document will be evaluated. - When set to `deterministic-only`, only expressions that depend   exclusively on deterministic inputs will be evaluated.')
        .option('--dereferenced [dereferenced]', 'Controls whether the document should be deferenced (eference to other content will be resolved and expanded). - When set to `true`, the entire document will be deferenced - When set to `reusable-contents`, only reusable contents will be deferenced.')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, pagePath, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/path/${pagePath}`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            if (options["format.markdown.refs"] !== undefined) query['format.markdown.refs'] = String(options["format.markdown.refs"]);
            if (options["evaluated"] !== undefined) query['evaluated'] = String(options["evaluated"]);
            if (options["dereferenced"] !== undefined) query['dereferenced'] = String(options["dereferenced"]);
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_reusableContentsCmd = spaces_contentCmd
        .command('reusable-contents')
        .description('Manage spaces content reusable-contents');

    spaces_content_reusableContentsCmd
        .command('get <spaceId> <reusableContentId>')
        .description('Get a space reusable content by its ID')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, reusableContentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/reusable-contents/${reusableContentId}`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_computedCmd = spaces_contentCmd
        .command('computed')
        .description('Manage spaces content computed');

    const spaces_content_computed_documentCmd = spaces_content_computedCmd
        .command('document')
        .description('Manage spaces content computed document');

    spaces_content_computed_documentCmd
        .command('get <spaceId>')
        .description('Get a space computed document')
        .option('--schema [schema]', 'Version of the schema used for the document.')
        .option('--seed <value>', 'Seed to use for the generation of IDs. (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/computed/document`;
            const query: Record<string, string> = {};
            if (options["schema"] !== undefined) query['schema'] = String(options["schema"]);
            const body: Record<string, unknown> = {};
            if (options.seed !== undefined) body['seed'] = options.seed;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    query,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_content_computed_revisionCmd = spaces_content_computedCmd
        .command('revision')
        .description('Manage spaces content computed revision');

    spaces_content_computed_revisionCmd
        .command('get <spaceId>')
        .description('Get a space computed revision')
        .option('--seed <value>', 'Seed to use for the generation of IDs. (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/content/computed/revision`;
            const body: Record<string, unknown> = {};
            if (options.seed !== undefined) body['seed'] = options.seed;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_documentsCmd = spacesCmd
        .command('documents')
        .description('Manage spaces documents');

    spaces_documentsCmd
        .command('get <spaceId> <documentId>')
        .description('Get a space document by its ID')
        .option('--schema [schema]', 'Version of the schema used for the document.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, documentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/documents/${documentId}`;
            const query: Record<string, string> = {};
            if (options["schema"] !== undefined) query['schema'] = String(options["schema"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequestsCmd = spacesCmd
        .command('change-requests')
        .description('Manage spaces change-requests');

    spaces_changeRequestsCmd
        .command('list <spaceId>')
        .description('List all change requests')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--status [status]', 'If defined, only change requests matching this status will be returned.')
        .option('--creator [creator]', 'If defined, only change requests created by this user will be returned.')
        .option('--contributor [contributor]', 'If defined, only change requests with contributions from this user will be returned.')
        .option('--requestedReviewer [requestedReviewer]', 'If defined, only change requests with a requested reviewer for this user will be returned.')
        .option('--topic [topic]', 'If defined, only change requests linked to this site topic will be returned.')
        .option('--orderBy [orderBy]', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["status"] !== undefined) query['status'] = String(options["status"]);
            if (options["creator"] !== undefined) query['creator'] = String(options["creator"]);
            if (options["contributor"] !== undefined) query['contributor'] = String(options["contributor"]);
            if (options["requestedReviewer"] !== undefined) query['requestedReviewer'] = String(options["requestedReviewer"]);
            if (options["topic"] !== undefined) query['topic'] = String(options["topic"]);
            if (options["orderBy"] !== undefined) query['orderBy'] = String(options["orderBy"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequestsCmd
        .command('create <spaceId>')
        .description('Create a change request')
        .option('--subject <value>', 'Subject of the change-request')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests`;
            const body: Record<string, unknown> = {};
            if (options.subject !== undefined) body['subject'] = options.subject;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequestsCmd
        .command('get <spaceId> <changeRequestId>')
        .description('Get a change request by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequestsCmd
        .command('update <spaceId> <changeRequestId>')
        .description('Update a change request')
        .option('--subject <value>', 'Subject of the change request')
        .option('--links <value>', 'External links associated with the change request.')
        .option('--status <value>', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}`;
            const body: Record<string, unknown> = {};
            if (options.subject !== undefined) body['subject'] = options.subject;
            if (options.links !== undefined) body['links'] = options.links;
            if (options.status !== undefined) body['status'] = options.status;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequestsCmd
        .command('merge <spaceId> <changeRequestId>')
        .description('Merge a change request')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/merge`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequestsCmd
        .command('pull-content <spaceId> <changeRequestId>')
        .description('Pull primary content into the change request')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/update`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_reviewsCmd = spaces_changeRequestsCmd
        .command('reviews')
        .description('Manage spaces change-requests reviews');

    spaces_changeRequests_reviewsCmd
        .command('list <spaceId> <changeRequestId>')
        .description('List all change request reviews')
        .option('--format [format]', 'Output format for the content.')
        .option('--outdated [outdated]', 'Filter reviews marked as outdated.')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/reviews`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            if (options["outdated"] !== undefined) query['outdated'] = String(options["outdated"]);
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_reviewsCmd
        .command('submit <spaceId> <changeRequestId>')
        .description('Submit a change request review')
        .option('--status <value>', 'Status of a change request review. (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/reviews`;
            const body: Record<string, unknown> = {};
            if (options.status !== undefined) body['status'] = options.status;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_reviewsCmd
        .command('get <spaceId> <changeRequestId> <reviewId>')
        .description('Get a change request review by its ID')
        .option('--format [format]', 'Output format for the content.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, reviewId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/reviews/${reviewId}`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_requestedReviewersCmd = spaces_changeRequestsCmd
        .command('requested-reviewers')
        .description('Manage spaces change-requests requested-reviewers');

    spaces_changeRequests_requestedReviewersCmd
        .command('list <spaceId> <changeRequestId>')
        .description('Get all change request reviewers')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/requested-reviewers`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_requestedReviewersCmd
        .command('request <spaceId> <changeRequestId>')
        .description('Request change request reviewers')
        .option('--users <value>', 'An array of user ids that will be requested. (required)')
        .option('--subject <value>', 'Optionally, update the subject of the change request when requesting reviewers.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/requested-reviewers`;
            const body: Record<string, unknown> = {};
            if (options.users !== undefined) body['users'] = options.users;
            if (options.subject !== undefined) body['subject'] = options.subject;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_requestedReviewersCmd
        .command('remove <spaceId> <changeRequestId> <userId>')
        .description('Remove a reviewer from a change request')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/requested-reviewers/${userId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_conversationsCmd = spaces_changeRequestsCmd
        .command('conversations')
        .description('Manage spaces change-requests conversations');

    spaces_changeRequests_conversationsCmd
        .command('list <spaceId> <changeRequestId>')
        .description('List the agent conversations of a change request')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/conversations`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_conversationsCmd
        .command('update <spaceId> <changeRequestId> <conversationId>')
        .description('Update an agent conversation')
        .option('--title <value>', 'The new title of the conversation. (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, conversationId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/conversations/${conversationId}`;
            const body: Record<string, unknown> = {};
            if (options.title !== undefined) body['title'] = options.title;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_conversationsCmd
        .command('delete <spaceId> <changeRequestId> <conversationId>')
        .description('Delete an agent conversation')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, conversationId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/conversations/${conversationId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_linksCmd = spaces_changeRequestsCmd
        .command('links')
        .description('Manage spaces change-requests links');

    spaces_changeRequests_linksCmd
        .command('list <spaceId> <changeRequestId>')
        .description('List all change request links')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--status [status]', '')
        .option('--brokenContext [brokenContext]', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/links`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["status"] !== undefined) query['status'] = String(options["status"]);
            if (options["brokenContext"] !== undefined) query['brokenContext'] = String(options["brokenContext"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_commentsCmd = spaces_changeRequestsCmd
        .command('comments')
        .description('Manage spaces change-requests comments');

    spaces_changeRequests_commentsCmd
        .command('list <spaceId> <changeRequestId>')
        .description('List all change request comments')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--order [order]', 'An order for the items in the list')
        .option('--format [format]', 'Output format for the content.')
        .option('--status [status]', 'When provided, only comments with the given status are returned. Defaults to "all".')
        .option('--targetPage [targetPage]', 'The target page of the comment')
        .option('--authors [authors]', 'User IDs to filter queried comments on')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/comments`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["order"] !== undefined) query['order'] = String(options["order"]);
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            if (options["status"] !== undefined) query['status'] = String(options["status"]);
            if (options["targetPage"] !== undefined) query['targetPage'] = String(options["targetPage"]);
            if (options["authors"] !== undefined) query['authors'] = String(options["authors"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_commentsCmd
        .command('post <spaceId> <changeRequestId>')
        .description('Create a change request comment')
        .option('--node <value>', 'The node to which the comment is posted, if any.')
        .option('--page <value>', 'The page to which the comment is posted, if any.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/comments`;
            const body: Record<string, unknown> = {};
            if (options.node !== undefined) body['node'] = options.node;
            if (options.page !== undefined) body['page'] = options.page;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_commentsCmd
        .command('get <spaceId> <changeRequestId> <commentId>')
        .description('Get a change request comment')
        .option('--format [format]', 'Output format for the content.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, commentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/comments/${commentId}`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_commentsCmd
        .command('update <spaceId> <changeRequestId> <commentId>')
        .description('Update a change request comment')
        .option('--resolved', 'Whether the comment is resolved or not.')
        .option('--addedReactions <value>', 'Reactions to add to the comment.')
        .option('--removedReactions <value>', 'Reactions to remove from the comment.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, commentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/comments/${commentId}`;
            const body: Record<string, unknown> = {};
            if (options.resolved !== undefined) body['resolved'] = options.resolved;
            if (options.addedReactions !== undefined) body['addedReactions'] = options.addedReactions;
            if (options.removedReactions !== undefined) body['removedReactions'] = options.removedReactions;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_commentsCmd
        .command('delete <spaceId> <changeRequestId> <commentId>')
        .description('Delete a change request comment')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, commentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/comments/${commentId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_comments_repliesCmd = spaces_changeRequests_commentsCmd
        .command('replies')
        .description('Manage spaces change-requests comments replies');

    spaces_changeRequests_comments_repliesCmd
        .command('list <spaceId> <changeRequestId> <commentId>')
        .description('List all change request comment replies')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--format [format]', 'Output format for the content.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, commentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/comments/${commentId}/replies`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_comments_repliesCmd
        .command('post <spaceId> <changeRequestId> <commentId>')
        .description('Create a change request comment reply')
        .option('--format [format]', 'Output format for the content.')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, commentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/comments/${commentId}/replies`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    query,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_comments_repliesCmd
        .command('get <spaceId> <changeRequestId> <commentId> <commentReplyId>')
        .description('Get a change request comment reply')
        .option('--format [format]', 'Output format for the content.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, commentId, commentReplyId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/comments/${commentId}/replies/${commentReplyId}`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_comments_repliesCmd
        .command('update <spaceId> <changeRequestId> <commentId> <commentReplyId>')
        .description('Update a change request comment reply')
        .option('--resolved', 'Whether the comment is resolved or not.')
        .option('--addedReactions <value>', 'Reactions to add to the comment.')
        .option('--removedReactions <value>', 'Reactions to remove from the comment.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, commentId, commentReplyId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/comments/${commentId}/replies/${commentReplyId}`;
            const body: Record<string, unknown> = {};
            if (options.resolved !== undefined) body['resolved'] = options.resolved;
            if (options.addedReactions !== undefined) body['addedReactions'] = options.addedReactions;
            if (options.removedReactions !== undefined) body['removedReactions'] = options.removedReactions;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_comments_repliesCmd
        .command('delete <spaceId> <changeRequestId> <commentId> <commentReplyId>')
        .description('Delete a change request comment reply')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, commentId, commentReplyId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/comments/${commentId}/replies/${commentReplyId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_contributorsCmd = spaces_changeRequestsCmd
        .command('contributors')
        .description('Manage spaces change-requests contributors');

    spaces_changeRequests_contributorsCmd
        .command('get <spaceId> <changeRequestId>')
        .description('Get all contribors of a change request')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/contributors`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_contentCmd = spaces_changeRequestsCmd
        .command('content')
        .description('Manage spaces change-requests content');

    spaces_changeRequests_contentCmd
        .command('get <spaceId> <changeRequestId>')
        .description('Get a change request the latest content revision')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_contentCmd
        .command('update <spaceId> <changeRequestId>')
        .description('Update the content of a change request')
        .option('--changes <value>', '(required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content`;
            const body: Record<string, unknown> = {};
            if (options.changes !== undefined) body['changes'] = options.changes;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_content_pagesCmd = spaces_changeRequests_contentCmd
        .command('pages')
        .description('Manage spaces change-requests content pages');

    spaces_changeRequests_content_pagesCmd
        .command('list <spaceId> <changeRequestId>')
        .description('List all change request pages')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content/pages`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_content_filesCmd = spaces_changeRequests_contentCmd
        .command('files')
        .description('Manage spaces change-requests content files');

    spaces_changeRequests_content_filesCmd
        .command('list <spaceId> <changeRequestId>')
        .description('List all change request files')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content/files`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_changeRequests_content_filesCmd
        .command('get <spaceId> <changeRequestId> <fileId>')
        .description('Get a change request file by its ID')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, fileId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content/files/${fileId}`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_content_files_backlinksCmd = spaces_changeRequests_content_filesCmd
        .command('backlinks')
        .description('Manage spaces change-requests content files backlinks');

    spaces_changeRequests_content_files_backlinksCmd
        .command('list <spaceId> <changeRequestId> <fileId>')
        .description('List all backlink locations of a change request file')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, fileId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content/files/${fileId}/backlinks`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_content_pageCmd = spaces_changeRequests_contentCmd
        .command('page')
        .description('Manage spaces change-requests content page');

    spaces_changeRequests_content_pageCmd
        .command('get <spaceId> <changeRequestId> <pageId>')
        .description('Get a change request page by its ID')
        .option('--format [format]', 'Output format for the content.')
        .option('--format.markdown.refs [format.markdown.refs]', 'Controls how content references are formatted in markdown output. Ignored unless `format=markdown`.  - `relative`: Format page references as relative links from the current page. Other references might not be handled. - `stable`: Format content references as stable idempotent refs containing their identifiers.')
        .option('--evaluated [evaluated]', 'Controls whether the document should be evaluated. - When set to `true`, the entire document will be evaluated. - When set to `deterministic-only`, only expressions that depend   exclusively on deterministic inputs will be evaluated.')
        .option('--dereferenced [dereferenced]', 'Controls whether the document should be deferenced (eference to other content will be resolved and expanded). - When set to `true`, the entire document will be deferenced - When set to `reusable-contents`, only reusable contents will be deferenced.')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, pageId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content/page/${pageId}`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            if (options["format.markdown.refs"] !== undefined) query['format.markdown.refs'] = String(options["format.markdown.refs"]);
            if (options["evaluated"] !== undefined) query['evaluated'] = String(options["evaluated"]);
            if (options["dereferenced"] !== undefined) query['dereferenced'] = String(options["dereferenced"]);
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_content_page_linksCmd = spaces_changeRequests_content_pageCmd
        .command('links')
        .description('Manage spaces change-requests content page links');

    spaces_changeRequests_content_page_linksCmd
        .command('list <spaceId> <changeRequestId> <pageId>')
        .description('List all change request links')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, pageId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content/page/${pageId}/links`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_content_page_backlinksCmd = spaces_changeRequests_content_pageCmd
        .command('backlinks')
        .description('Manage spaces change-requests content page backlinks');

    spaces_changeRequests_content_page_backlinksCmd
        .command('list <spaceId> <changeRequestId> <pageId>')
        .description('List all backlink locations of a change request page')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, pageId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content/page/${pageId}/backlinks`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_content_page_metaLinksCmd = spaces_changeRequests_content_pageCmd
        .command('meta-links')
        .description('Manage spaces change-requests content page meta-links');

    spaces_changeRequests_content_page_metaLinksCmd
        .command('list <spaceId> <changeRequestId> <pageId>')
        .description('List all meta links of a change request page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, pageId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content/page/${pageId}/meta-links`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_content_reusableContentsCmd = spaces_changeRequests_contentCmd
        .command('reusable-contents')
        .description('Manage spaces change-requests content reusable-contents');

    spaces_changeRequests_content_reusableContentsCmd
        .command('get <spaceId> <changeRequestId> <reusableContentId>')
        .description('Get a change request reusable content by its ID')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, reusableContentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content/reusable-contents/${reusableContentId}`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_content_pathCmd = spaces_changeRequests_contentCmd
        .command('path')
        .description('Manage spaces change-requests content path');

    spaces_changeRequests_content_pathCmd
        .command('get <spaceId> <changeRequestId> <pagePath>')
        .description('Get a change request page by its path')
        .option('--format [format]', 'Output format for the content.')
        .option('--format.markdown.refs [format.markdown.refs]', 'Controls how content references are formatted in markdown output. Ignored unless `format=markdown`.  - `relative`: Format page references as relative links from the current page. Other references might not be handled. - `stable`: Format content references as stable idempotent refs containing their identifiers.')
        .option('--evaluated [evaluated]', 'Controls whether the document should be evaluated. - When set to `true`, the entire document will be evaluated. - When set to `deterministic-only`, only expressions that depend   exclusively on deterministic inputs will be evaluated.')
        .option('--dereferenced [dereferenced]', 'Controls whether the document should be deferenced (eference to other content will be resolved and expanded). - When set to `true`, the entire document will be deferenced - When set to `reusable-contents`, only reusable contents will be deferenced.')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, pagePath, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/content/path/${pagePath}`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            if (options["format.markdown.refs"] !== undefined) query['format.markdown.refs'] = String(options["format.markdown.refs"]);
            if (options["evaluated"] !== undefined) query['evaluated'] = String(options["evaluated"]);
            if (options["dereferenced"] !== undefined) query['dereferenced'] = String(options["dereferenced"]);
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_changesCmd = spaces_changeRequestsCmd
        .command('changes')
        .description('Manage spaces change-requests changes');

    spaces_changeRequests_changesCmd
        .command('get <spaceId> <changeRequestId>')
        .description('Get change request semantic changes')
        .option('--limit [limit]', 'Limit the number of changes returned')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/changes`;
            const query: Record<string, string> = {};
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_pdfCmd = spaces_changeRequestsCmd
        .command('pdf')
        .description('Manage spaces change-requests pdf');

    spaces_changeRequests_pdfCmd
        .command('get <spaceId> <changeRequestId>')
        .description('Get a URL of the content of a change request as PDF')
        .option('--only [only]', 'Generate a PDF only for the provided page.')
        .option('--page [page]', 'ID of a specific page to generate a PDF for.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/pdf`;
            const query: Record<string, string> = {};
            if (options["only"] !== undefined) query['only'] = String(options["only"]);
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_changeRequests_commentersCmd = spaces_changeRequestsCmd
        .command('commenters')
        .description('Manage spaces change-requests commenters');

    spaces_changeRequests_commentersCmd
        .command('list <spaceId> <changeRequestId>')
        .description('List all users who commented in a CR')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, changeRequestId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/change-requests/${changeRequestId}/commenters`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_revisionsCmd = spacesCmd
        .command('revisions')
        .description('Manage spaces revisions');

    spaces_revisionsCmd
        .command('get <spaceId> <revisionId>')
        .description('Get a space revision')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, revisionId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/revisions/${revisionId}`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_revisions_changesCmd = spaces_revisionsCmd
        .command('changes')
        .description('Manage spaces revisions changes');

    spaces_revisions_changesCmd
        .command('get <spaceId> <revisionId>')
        .description('Get space revision semantic changes')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--limit [limit]', 'Limit the number of changes returned')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, revisionId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/revisions/${revisionId}/changes`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_revisions_pagesCmd = spaces_revisionsCmd
        .command('pages')
        .description('Manage spaces revisions pages');

    spaces_revisions_pagesCmd
        .command('list <spaceId> <revisionId>')
        .description('List all pages in a space revision')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, revisionId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/revisions/${revisionId}/pages`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_revisions_filesCmd = spaces_revisionsCmd
        .command('files')
        .description('Manage spaces revisions files');

    spaces_revisions_filesCmd
        .command('list <spaceId> <revisionId>')
        .description('List all space revision files')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, revisionId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/revisions/${revisionId}/files`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_revisions_filesCmd
        .command('get <spaceId> <revisionId> <fileId>')
        .description('Get a space revision file by its ID')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, revisionId, fileId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/revisions/${revisionId}/files/${fileId}`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_revisions_pageCmd = spaces_revisionsCmd
        .command('page')
        .description('Manage spaces revisions page');

    spaces_revisions_pageCmd
        .command('get <spaceId> <revisionId> <pageId>')
        .description('Get a space revision page by its ID')
        .option('--format [format]', 'Output format for the content.')
        .option('--format.markdown.refs [format.markdown.refs]', 'Controls how content references are formatted in markdown output. Ignored unless `format=markdown`.  - `relative`: Format page references as relative links from the current page. Other references might not be handled. - `stable`: Format content references as stable idempotent refs containing their identifiers.')
        .option('--evaluated [evaluated]', 'Controls whether the document should be evaluated. - When set to `true`, the entire document will be evaluated. - When set to `deterministic-only`, only expressions that depend   exclusively on deterministic inputs will be evaluated.')
        .option('--dereferenced [dereferenced]', 'Controls whether the document should be deferenced (eference to other content will be resolved and expanded). - When set to `true`, the entire document will be deferenced - When set to `reusable-contents`, only reusable contents will be deferenced.')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, revisionId, pageId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/revisions/${revisionId}/page/${pageId}`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            if (options["format.markdown.refs"] !== undefined) query['format.markdown.refs'] = String(options["format.markdown.refs"]);
            if (options["evaluated"] !== undefined) query['evaluated'] = String(options["evaluated"]);
            if (options["dereferenced"] !== undefined) query['dereferenced'] = String(options["dereferenced"]);
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_revisions_page_documentCmd = spaces_revisions_pageCmd
        .command('document')
        .description('Manage spaces revisions page document');

    spaces_revisions_page_documentCmd
        .command('get <spaceId> <revisionId> <pageId>')
        .description('Get the document of a page in a revision')
        .option('--evaluated [evaluated]', 'Controls whether the document should be evaluated. - When set to `true`, the entire document will be evaluated. - When set to `deterministic-only`, only expressions that depend   exclusively on deterministic inputs will be evaluated.')
        .option('--dereferenced [dereferenced]', 'Controls whether the document should be deferenced (eference to other content will be resolved and expanded). - When set to `true`, the entire document will be deferenced - When set to `reusable-contents`, only reusable contents will be deferenced.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, revisionId, pageId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/revisions/${revisionId}/page/${pageId}/document`;
            const query: Record<string, string> = {};
            if (options["evaluated"] !== undefined) query['evaluated'] = String(options["evaluated"]);
            if (options["dereferenced"] !== undefined) query['dereferenced'] = String(options["dereferenced"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_revisions_page_metaLinksCmd = spaces_revisions_pageCmd
        .command('meta-links')
        .description('Manage spaces revisions page meta-links');

    spaces_revisions_page_metaLinksCmd
        .command('list <spaceId> <revisionId> <pageId>')
        .description('List all meta links for a revision page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, revisionId, pageId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/revisions/${revisionId}/page/${pageId}/meta-links`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_revisions_pathCmd = spaces_revisionsCmd
        .command('path')
        .description('Manage spaces revisions path');

    spaces_revisions_pathCmd
        .command('get <spaceId> <revisionId> <pagePath>')
        .description('Get a space revision page by its path')
        .option('--format [format]', 'Output format for the content.')
        .option('--format.markdown.refs [format.markdown.refs]', 'Controls how content references are formatted in markdown output. Ignored unless `format=markdown`.  - `relative`: Format page references as relative links from the current page. Other references might not be handled. - `stable`: Format content references as stable idempotent refs containing their identifiers.')
        .option('--evaluated [evaluated]', 'Controls whether the document should be evaluated. - When set to `true`, the entire document will be evaluated. - When set to `deterministic-only`, only expressions that depend   exclusively on deterministic inputs will be evaluated.')
        .option('--dereferenced [dereferenced]', 'Controls whether the document should be deferenced (eference to other content will be resolved and expanded). - When set to `true`, the entire document will be deferenced - When set to `reusable-contents`, only reusable contents will be deferenced.')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, revisionId, pagePath, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/revisions/${revisionId}/path/${pagePath}`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            if (options["format.markdown.refs"] !== undefined) query['format.markdown.refs'] = String(options["format.markdown.refs"]);
            if (options["evaluated"] !== undefined) query['evaluated'] = String(options["evaluated"]);
            if (options["dereferenced"] !== undefined) query['dereferenced'] = String(options["dereferenced"]);
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_revisions_reusableContentsCmd = spaces_revisionsCmd
        .command('reusable-contents')
        .description('Manage spaces revisions reusable-contents');

    spaces_revisions_reusableContentsCmd
        .command('get <spaceId> <revisionId> <reusableContentId>')
        .description('Get a space revision reusable content by its ID')
        .option('--metadata [metadata]', 'If `false` is passed, "git" mutable metadata will not returned. Passing `false` can optimize performances of the lookup.')
        .option('--computed [computed]', 'If `false` is passed, content will not be computed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, revisionId, reusableContentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/revisions/${revisionId}/reusable-contents/${reusableContentId}`;
            const query: Record<string, string> = {};
            if (options["metadata"] !== undefined) query['metadata'] = String(options["metadata"]);
            if (options["computed"] !== undefined) query['computed'] = String(options["computed"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_revisions_reusableContents_documentCmd = spaces_revisions_reusableContentsCmd
        .command('document')
        .description('Manage spaces revisions reusable-contents document');

    spaces_revisions_reusableContents_documentCmd
        .command('get <spaceId> <revisionId> <reusableContentId>')
        .description('Get the document of a reusable content in a revision')
        .option('--evaluated [evaluated]', 'Controls whether the document should be evaluated. - When set to `true`, the entire document will be evaluated. - When set to `deterministic-only`, only expressions that depend   exclusively on deterministic inputs will be evaluated.')
        .option('--dereferenced [dereferenced]', 'Controls whether the document should be deferenced (eference to other content will be resolved and expanded). - When set to `true`, the entire document will be deferenced - When set to `reusable-contents`, only reusable contents will be deferenced.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, revisionId, reusableContentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/revisions/${revisionId}/reusable-contents/${reusableContentId}/document`;
            const query: Record<string, string> = {};
            if (options["evaluated"] !== undefined) query['evaluated'] = String(options["evaluated"]);
            if (options["dereferenced"] !== undefined) query['dereferenced'] = String(options["dereferenced"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_commentsCmd = spacesCmd
        .command('comments')
        .description('Manage spaces comments');

    spaces_commentsCmd
        .command('list <spaceId>')
        .description('List all space comments')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--order [order]', 'An order for the items in the list')
        .option('--status [status]', 'When provided, only comments with the given status are returned. Defaults to "all".')
        .option('--format [format]', 'Output format for the content.')
        .option('--targetPage [targetPage]', 'The target page of the comment')
        .option('--authors [authors]', 'User IDs to filter queried comments on')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/comments`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["order"] !== undefined) query['order'] = String(options["order"]);
            if (options["status"] !== undefined) query['status'] = String(options["status"]);
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            if (options["targetPage"] !== undefined) query['targetPage'] = String(options["targetPage"]);
            if (options["authors"] !== undefined) query['authors'] = String(options["authors"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_commentsCmd
        .command('post <spaceId>')
        .description('Create a space comment')
        .option('--node <value>', 'The node to which the comment is posted, if any.')
        .option('--page <value>', 'The page to which the comment is posted, if any.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/comments`;
            const body: Record<string, unknown> = {};
            if (options.node !== undefined) body['node'] = options.node;
            if (options.page !== undefined) body['page'] = options.page;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_commentsCmd
        .command('get <spaceId> <commentId>')
        .description('Get a space comment')
        .option('--format [format]', 'Output format for the content.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, commentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/comments/${commentId}`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_commentsCmd
        .command('update <spaceId> <commentId>')
        .description('Update a space comment')
        .option('--resolved', 'Whether the comment is resolved or not.')
        .option('--addedReactions <value>', 'Reactions to add to the comment.')
        .option('--removedReactions <value>', 'Reactions to remove from the comment.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, commentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/comments/${commentId}`;
            const body: Record<string, unknown> = {};
            if (options.resolved !== undefined) body['resolved'] = options.resolved;
            if (options.addedReactions !== undefined) body['addedReactions'] = options.addedReactions;
            if (options.removedReactions !== undefined) body['removedReactions'] = options.removedReactions;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_commentsCmd
        .command('delete <spaceId> <commentId>')
        .description('Delete a space comment')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, commentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/comments/${commentId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_comments_repliesCmd = spaces_commentsCmd
        .command('replies')
        .description('Manage spaces comments replies');

    spaces_comments_repliesCmd
        .command('list <spaceId> <commentId>')
        .description('List all space comment replies')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--format [format]', 'Output format for the content.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, commentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/comments/${commentId}/replies`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_comments_repliesCmd
        .command('post <spaceId> <commentId>')
        .description('Create a space comment reply')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, commentId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/comments/${commentId}/replies`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_comments_repliesCmd
        .command('get <spaceId> <commentId> <commentReplyId>')
        .description('Get a space comment reply')
        .option('--format [format]', 'Output format for the content.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, commentId, commentReplyId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/comments/${commentId}/replies/${commentReplyId}`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_comments_repliesCmd
        .command('update <spaceId> <commentId> <commentReplyId>')
        .description('Update a space comment reply')
        .option('--addedReactions <value>', 'Reactions to add to the comment.')
        .option('--removedReactions <value>', 'Reactions to remove from the comment.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, commentId, commentReplyId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/comments/${commentId}/replies/${commentReplyId}`;
            const body: Record<string, unknown> = {};
            if (options.addedReactions !== undefined) body['addedReactions'] = options.addedReactions;
            if (options.removedReactions !== undefined) body['removedReactions'] = options.removedReactions;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    spaces_comments_repliesCmd
        .command('delete <spaceId> <commentId> <commentReplyId>')
        .description('Delete a space comment reply')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, commentId, commentReplyId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/comments/${commentId}/replies/${commentReplyId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_commentersCmd = spacesCmd
        .command('commenters')
        .description('Manage spaces commenters');

    spaces_commentersCmd
        .command('list <spaceId>')
        .description('List all users who commented in a space')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/commenters`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_integrationBlocksCmd = spacesCmd
        .command('integration-blocks')
        .description('Manage spaces integration-blocks');

    spaces_integrationBlocksCmd
        .command('list <spaceId>')
        .description('List all space integrations blocks')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/integration-blocks`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_pdfCmd = spacesCmd
        .command('pdf')
        .description('Manage spaces pdf');

    spaces_pdfCmd
        .command('get <spaceId>')
        .description('Get a URL of the content of a space as PDF')
        .option('--only [only]', 'Generate a PDF only for the provided page.')
        .option('--page [page]', 'ID of a specific page to generate a PDF for.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/pdf`;
            const query: Record<string, string> = {};
            if (options["only"] !== undefined) query['only'] = String(options["only"]);
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const spaces_linksCmd = spacesCmd
        .command('links')
        .description('Manage spaces links');

    spaces_linksCmd
        .command('list <spaceId>')
        .description('Get all links in a space including their status and location where they appear.')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--status [status]', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/spaces/${spaceId}/links`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["status"] !== undefined) query['status'] = String(options["status"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const integrationsCmd = program
        .command('integrations')
        .description('Manage integrations');

    integrationsCmd
        .command('list')
        .description('List integrations enabled in a space')
        .option('--space <value>', 'Scope: spaceId')
        .option('--organization <value>', 'Scope: organizationId')
        .option('--site <value>', 'Scope: siteId')
        .option('--search [search]', 'A search string to filter integrations by name')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--category [category]', 'Filter the integrations by category')
        .option('--blockDomain [blockDomain]', 'Filter the integrations by block\'s domains')
        .option('--blocks [blocks]', 'If true, returns only integrations with blocks. If false, returns only integrations without blocks.')
        .option('--contentSources [contentSources]', 'If true, returns only integrations with contentSources. If false, returns only integrations without contentSources.')
        .option('--owner [owner]', 'If defined, only list integrations owned by the given organization.')
        .option('--scope [scope]', 'Filter the integrations by scope')
        .option('--target [target]', 'Filter the integrations by target')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (options) => {
            const api = await getAPIClient(true);
            const scopeFlags = ['space', 'organization', 'site'];
            const provided = scopeFlags.filter((f) => (options as Record<string, unknown>)[f] !== undefined).sort().join(',');
            let path: string;
            if (provided === 'space') {
                path = `/spaces/${options.space}/integrations`;
            }
            else if (provided === '') {
                path = '/integrations';
            }
            else if (provided === 'organization') {
                path = `/orgs/${options.organization}/integrations`;
            }
            else if (provided === 'organization,site') {
                path = `/orgs/${options.organization}/sites/${options.site}/integrations`;
            }
            else {
                console.error('Specify a valid scope (or none for all): --space, --organization, --site. Some scopes require a combination (e.g. --integration with --installation).');
                process.exit(1);
            }
            const query: Record<string, string> = {};
            if (options["search"] !== undefined) query['search'] = String(options["search"]);
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["category"] !== undefined) query['category'] = String(options["category"]);
            if (options["blockDomain"] !== undefined) query['blockDomain'] = String(options["blockDomain"]);
            if (options["blocks"] !== undefined) query['blocks'] = String(options["blocks"]);
            if (options["contentSources"] !== undefined) query['contentSources'] = String(options["contentSources"]);
            if (options["owner"] !== undefined) query['owner'] = String(options["owner"]);
            if (options["scope"] !== undefined) query['scope'] = String(options["scope"]);
            if (options["target"] !== undefined) query['target'] = String(options["target"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrationsCmd
        .command('get <integrationName>')
        .description('Get an integration by its name')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrationsCmd
        .command('publish <integrationName>')
        .description('Publish an integration')
        .option('--runtime <value>', 'The runtime version to use for the integration. If not specified, the integration will use the default runtime.')
        .option('--icon <value>', 'Base64 content of the icon')
        .option('--title <value>', 'Title of the integration (required)')
        .option('--description <value>', 'Description of the integration (required)')
        .option('--summary <value>', 'Long form markdown summary of the integration')
        .option('--previewImages <value>', '')
        .option('--visibility <value>', '')
        .option('--target <value>', 'The target on which the integration can operate and needs to be configured for')
        .option('--scopes <value>', 'Permissions that should be granted to the integration (required)')
        .option('--categories <value>', 'Categories for which the integration is listed in the marketplace')
        .option('--blocks <value>', 'Custom blocks defined by this integration.')
        .option('--contentSources <value>', '')
        .option('--externalLinks <value>', 'External urls configured by the developer of the integration')
        .option('--script <value>', 'Content of the script to use (required)')
        .option('--organization <value>', 'The ID or subdomain of the organization under which the integration should be published (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}`;
            const body: Record<string, unknown> = {};
            if (options.runtime !== undefined) body['runtime'] = options.runtime;
            if (options.icon !== undefined) body['icon'] = options.icon;
            if (options.title !== undefined) body['title'] = options.title;
            if (options.description !== undefined) body['description'] = options.description;
            if (options.summary !== undefined) body['summary'] = options.summary;
            if (options.previewImages !== undefined) body['previewImages'] = options.previewImages;
            if (options.visibility !== undefined) body['visibility'] = options.visibility;
            if (options.target !== undefined) body['target'] = options.target;
            if (options.scopes !== undefined) body['scopes'] = options.scopes;
            if (options.categories !== undefined) body['categories'] = options.categories;
            if (options.blocks !== undefined) body['blocks'] = options.blocks;
            if (options.contentSources !== undefined) body['contentSources'] = options.contentSources;
            if (options.externalLinks !== undefined) body['externalLinks'] = options.externalLinks;
            if (options.script !== undefined) body['script'] = options.script;
            if (options.organization !== undefined) body['organization'] = options.organization;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrationsCmd
        .command('unpublish <integrationName>')
        .description('Unpublish an integration')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const integrations_installationsCmd = integrationsCmd
        .command('installations')
        .description('Manage integrations installations');

    integrations_installationsCmd
        .command('list <integrationName>')
        .description('List all integration installations')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--externalId [externalId]', 'External Id to filter by')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["externalId"] !== undefined) query['externalId'] = String(options["externalId"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_installationsCmd
        .command('install <integrationName>')
        .description('Install an integration')
        .option('--organization <value>', '(required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations`;
            const body: Record<string, unknown> = {};
            if (options.organization !== undefined) body['organization'] = options.organization;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_installationsCmd
        .command('get <integrationName> <installationId>')
        .description('Get an integration installation by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_installationsCmd
        .command('update <integrationName> <installationId>')
        .description('Update an integration installation')
        .option('--externalIds <value>', 'External IDs assigned by the integration.')
        .option('--space_selection <value>', 'Describe whether all spaces have been selected or there\'s a selection involved')
        .option('--site_selection <value>', 'Describe whether all sites have been selected or there\'s a selection involved')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}`;
            const body: Record<string, unknown> = {};
            if (options.externalIds !== undefined) body['externalIds'] = options.externalIds;
            if (options.space_selection !== undefined) body['space_selection'] = options.space_selection;
            if (options.site_selection !== undefined) body['site_selection'] = options.site_selection;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_installationsCmd
        .command('uninstall <integrationName> <installationId>')
        .description('Uninstall an integration')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const integrations_installations_tokensCmd = integrations_installationsCmd
        .command('tokens')
        .description('Manage integrations installations tokens');

    integrations_installations_tokensCmd
        .command('create <integrationName> <installationId>')
        .description('Create an integration installation API token')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}/tokens`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const integrations_installations_spacesCmd = integrations_installationsCmd
        .command('spaces')
        .description('Manage integrations installations spaces');

    integrations_installations_spacesCmd
        .command('install <integrationName> <installationId>')
        .description('Install an integration on a space')
        .option('--extended [extended]', 'If true, returns the space object in each items. If false, returns the space ID in each items.')
        .option('--space <value>', 'ID of the space to install the integration on (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}/spaces`;
            const query: Record<string, string> = {};
            if (options["extended"] !== undefined) query['extended'] = String(options["extended"]);
            const body: Record<string, unknown> = {};
            if (options.space !== undefined) body['space'] = options.space;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    query,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_installations_spacesCmd
        .command('get <integrationName> <installationId> <spaceId>')
        .description('Get an integration space installation')
        .option('--extended [extended]', 'If true, returns the space object in each items. If false, returns the space ID in each items.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}/spaces/${spaceId}`;
            const query: Record<string, string> = {};
            if (options["extended"] !== undefined) query['extended'] = String(options["extended"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_installations_spacesCmd
        .command('update <integrationName> <installationId> <spaceId>')
        .description('Update an integration space installation')
        .option('--extended [extended]', 'If true, returns the space object in each items. If false, returns the space ID in each items.')
        .option('--externalIds <value>', 'External IDs assigned by the integration.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}/spaces/${spaceId}`;
            const query: Record<string, string> = {};
            if (options["extended"] !== undefined) query['extended'] = String(options["extended"]);
            const body: Record<string, unknown> = {};
            if (options.externalIds !== undefined) body['externalIds'] = options.externalIds;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    query,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_installations_spacesCmd
        .command('uninstall <integrationName> <installationId> <spaceId>')
        .description('Uninstall an integration from a space')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, spaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}/spaces/${spaceId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const integrations_installations_sitesCmd = integrations_installationsCmd
        .command('sites')
        .description('Manage integrations installations sites');

    integrations_installations_sitesCmd
        .command('list <integrationName> <installationId>')
        .description('List all site integration installations')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--extended [extended]', 'If true, returns the site object in each items. If false, returns the site ID in each items.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}/sites`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["extended"] !== undefined) query['extended'] = String(options["extended"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_installations_sitesCmd
        .command('install <integrationName> <installationId>')
        .description('Install an integration on a site')
        .option('--extended [extended]', 'If true, returns the site object in each items. If false, returns the site ID in each items.')
        .option('--siteId <value>', 'ID of the site to install the integration on (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}/sites`;
            const query: Record<string, string> = {};
            if (options["extended"] !== undefined) query['extended'] = String(options["extended"]);
            const body: Record<string, unknown> = {};
            if (options.siteId !== undefined) body['siteId'] = options.siteId;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    query,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_installations_sitesCmd
        .command('get <integrationName> <installationId> <siteId>')
        .description('Get an integration site installation')
        .option('--extended [extended]', 'If true, returns the site object in each items. If false, returns the site ID in each items.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}/sites/${siteId}`;
            const query: Record<string, string> = {};
            if (options["extended"] !== undefined) query['extended'] = String(options["extended"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_installations_sitesCmd
        .command('update <integrationName> <installationId> <siteId>')
        .description('Update an integration site installation')
        .option('--extended [extended]', 'If true, returns the site object in each items. If false, returns the site ID in each items.')
        .option('--externalIds <value>', 'External IDs assigned by the integration.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}/sites/${siteId}`;
            const query: Record<string, string> = {};
            if (options["extended"] !== undefined) query['extended'] = String(options["extended"]);
            const body: Record<string, unknown> = {};
            if (options.externalIds !== undefined) body['externalIds'] = options.externalIds;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    query,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_installations_sitesCmd
        .command('uninstall <integrationName> <installationId> <siteId>')
        .description('Uninstall an integration from a site')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, installationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/installations/${installationId}/sites/${siteId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const integrations_eventsCmd = integrationsCmd
        .command('events')
        .description('Manage integrations events');

    integrations_eventsCmd
        .command('list <integrationName>')
        .description('List all integration events')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/events`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_eventsCmd
        .command('get <integrationName> <eventId>')
        .description('Get an integration event by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, eventId, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/events/${eventId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const integrations_sitesCmd = integrationsCmd
        .command('sites')
        .description('Manage integrations sites');

    integrations_sitesCmd
        .command('list <integrationName>')
        .description('List all integration site installations')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--externalId [externalId]', 'External ID to filter by')
        .option('--extended [extended]', 'If true, returns the site object in each items. If false, returns the site ID in each items.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/sites`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["externalId"] !== undefined) query['externalId'] = String(options["externalId"]);
            if (options["extended"] !== undefined) query['extended'] = String(options["extended"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const integrations_devCmd = integrationsCmd
        .command('dev')
        .description('Manage integrations dev');

    integrations_devCmd
        .command('set <integrationName>')
        .description('Enable integration dev mode')
        .option('--tunnelUrl <value>', 'URL of the tunnel to dispatch integration events to (required)')
        .option('--all', 'If set to true, all requests will be forwarded to the tunnel, not just from the owning organization.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/dev`;
            const body: Record<string, unknown> = {};
            if (options.tunnelUrl !== undefined) body['tunnelUrl'] = options.tunnelUrl;
            if (options.all !== undefined) body['all'] = options.all;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    integrations_devCmd
        .command('disable <integrationName>')
        .description('Disable integration dev mode')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/dev`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const integrations_tasksCmd = integrationsCmd
        .command('tasks')
        .description('Manage integrations tasks');

    integrations_tasksCmd
        .command('queue <integrationName>')
        .description('Queue an integration task')
        .option('--schedule <value>', 'Number of seconds to wait before executing the task, defaults to 0')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (integrationName, options) => {
            const api = await getAPIClient(true);
            const path = `/integrations/${integrationName}/tasks`;
            const body: Record<string, unknown> = {};
            if (options.schedule !== undefined) body['schedule'] = options.schedule;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const collectionsCmd = program
        .command('collections')
        .description('Manage collections');

    collectionsCmd
        .command('get <collectionId>')
        .description('Get a collection by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    collectionsCmd
        .command('update <collectionId>')
        .description('Update a collection')
        .option('--title <value>', 'Title of the collection')
        .option('--description <value>', 'Description of the collection')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}`;
            const body: Record<string, unknown> = {};
            if (options.title !== undefined) body['title'] = options.title;
            if (options.description !== undefined) body['description'] = options.description;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    collectionsCmd
        .command('delete <collectionId>')
        .description('Delete a collection')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    collectionsCmd
        .command('move <collectionId>')
        .description('Move a collection to a new position.')
        .option('--parent <value>', 'The unique id of the parent collection')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}/move`;
            const body: Record<string, unknown> = {};
            if (options.parent !== undefined) body['parent'] = options.parent;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    collectionsCmd
        .command('transfer <collectionId>')
        .description('Transfer a collection')
        .option('--organization <value>', 'The unique id of the target organization (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}/transfer`;
            const body: Record<string, unknown> = {};
            if (options.organization !== undefined) body['organization'] = options.organization;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    collectionsCmd
        .command('list <organizationId>')
        .description('List all collections')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--nested [nested]', 'If true, all nested collections will be listed')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/collections`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["nested"] !== undefined) query['nested'] = String(options["nested"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    collectionsCmd
        .command('create <organizationId>')
        .description('Create a collection')
        .option('--title <value>', '')
        .option('--parent <value>', 'ID of a parent collection')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/collections`;
            const body: Record<string, unknown> = {};
            if (options.title !== undefined) body['title'] = options.title;
            if (options.parent !== undefined) body['parent'] = options.parent;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const collections_permissionsCmd = collectionsCmd
        .command('permissions')
        .description('Manage collections permissions');

    collections_permissionsCmd
        .command('invite <collectionId>')
        .description('Invite to a collection')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}/permissions`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const collections_permissions_teamsCmd = collections_permissionsCmd
        .command('teams')
        .description('Manage collections permissions teams');

    collections_permissions_teamsCmd
        .command('list <collectionId>')
        .description('List an org team\'s permission in collection')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}/permissions/teams`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    collections_permissions_teamsCmd
        .command('update <collectionId> <teamId>')
        .description('Update an org team\'s permission in a collection')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, teamId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}/permissions/teams/${teamId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    collections_permissions_teamsCmd
        .command('remove <collectionId> <teamId>')
        .description('Remove an org team from a collection')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, teamId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}/permissions/teams/${teamId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const collections_permissions_usersCmd = collections_permissionsCmd
        .command('users')
        .description('Manage collections permissions users');

    collections_permissions_usersCmd
        .command('list <collectionId>')
        .description('List collection user permissions')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}/permissions/users`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    collections_permissions_usersCmd
        .command('update <collectionId> <userId>')
        .description('Update a collection user permission')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}/permissions/users/${userId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    collections_permissions_usersCmd
        .command('remove <collectionId> <userId>')
        .description('Remove a user from a collection')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}/permissions/users/${userId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const collections_permissions_aggregateCmd = collections_permissionsCmd
        .command('aggregate')
        .description('Manage collections permissions aggregate');

    collections_permissions_aggregateCmd
        .command('list <collectionId>')
        .description('List all collections users permissions')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--role [role]', 'If defined, only members with this role will be returned.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (collectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/collections/${collectionId}/permissions/aggregate`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["role"] !== undefined) query['role'] = String(options["role"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizationsCmd = program
        .command('organizations')
        .description('Manage organizations');

    organizationsCmd
        .command('list')
        .description('Get the list of organizations for the currently authenticated user')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (options) => {
            const api = await getAPIClient(true);
            const path = '/orgs';
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizationsCmd
        .command('get <organizationId>')
        .description('Get an organization by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizationsCmd
        .command('update <organizationId>')
        .description('Update an organization')
        .option('--title <value>', 'Name of the organization')
        .option('--emailDomains <value>', '')
        .option('--hostname <value>', 'Default hostname for the organization\'s public content, e.g. <org-hostname>.gitbook.io')
        .option('--sso', '')
        .option('--ai', '')
        .option('--inviteLinks', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}`;
            const body: Record<string, unknown> = {};
            if (options.title !== undefined) body['title'] = options.title;
            if (options.emailDomains !== undefined) body['emailDomains'] = options.emailDomains;
            if (options.hostname !== undefined) body['hostname'] = options.hostname;
            if (options.sso !== undefined) body['sso'] = options.sso;
            if (options.ai !== undefined) body['ai'] = options.ai;
            if (options.inviteLinks !== undefined) body['inviteLinks'] = options.inviteLinks;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizationsCmd
        .command('join <organizationId>')
        .description('Join an organization')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/join`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizationsCmd
        .command('search <organizationId>')
        .description('Search content in an organization')
        .option('--query <query>', '')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/search`;
            const query: Record<string, string> = {};
            if (options["query"] !== undefined) query['query'] = String(options["query"]);
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_membersCmd = organizationsCmd
        .command('members')
        .description('Manage organizations members');

    organizations_membersCmd
        .command('list <organizationId>')
        .description('List all organization members')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--order [order]', 'An order for the items in the list')
        .option('--role [role]', 'The role to filter the list by')
        .option('--search [search]', 'A query to filter the list by display name and email')
        .option('--sort [sort]', 'The property to sort the list by')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/members`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["order"] !== undefined) query['order'] = String(options["order"]);
            if (options["role"] !== undefined) query['role'] = String(options["role"]);
            if (options["search"] !== undefined) query['search'] = String(options["search"]);
            if (options["sort"] !== undefined) query['sort'] = String(options["sort"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_membersCmd
        .command('get <organizationId> <userId>')
        .description('Get an organization member by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/members/${userId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_membersCmd
        .command('update <organizationId> <userId>')
        .description('Update an organization member')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/members/${userId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_membersCmd
        .command('remove <organizationId> <userId>')
        .description('Delete an organization member')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/members/${userId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_members_ssoCmd = organizations_membersCmd
        .command('sso')
        .description('Manage organizations members sso');

    organizations_members_ssoCmd
        .command('set <organizationId> <userId>')
        .description('Set a user as an SSO member of an organization')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/members/${userId}/sso`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_members_teamsCmd = organizations_membersCmd
        .command('teams')
        .description('Manage organizations members teams');

    organizations_members_teamsCmd
        .command('list <organizationId> <userId>')
        .description('List all organization member teams')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--title [title]', 'If provided, only teams whose name contains the given parameter will be returned. Case insensitive.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/members/${userId}/teams`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["title"] !== undefined) query['title'] = String(options["title"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_pingCmd = organizationsCmd
        .command('ping')
        .description('Manage organizations ping');

    organizations_pingCmd
        .command('update <organizationId>')
        .description('Update an organization member last seen at')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/ping`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_teamsCmd = organizationsCmd
        .command('teams')
        .description('Manage organizations teams');

    organizations_teamsCmd
        .command('list <organizationId>')
        .description('List all teams')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--owner [owner]', 'The unique identifier of a member of the organization. Only teams they can manage will be returned.')
        .option('--title [title]', 'If provided, only teams whose name contains the given parameter will be returned. Case insensitive.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/teams`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["owner"] !== undefined) query['owner'] = String(options["owner"]);
            if (options["title"] !== undefined) query['title'] = String(options["title"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_teamsCmd
        .command('create <organizationId>')
        .description('Create a team')
        .option('--title <value>', 'Title of the team (required)')
        .option('--members <value>', 'A list of organization member identifiers')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/teams`;
            const body: Record<string, unknown> = {};
            if (options.title !== undefined) body['title'] = options.title;
            if (options.members !== undefined) body['members'] = options.members;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_teamsCmd
        .command('get <organizationId> <teamId>')
        .description('Get a team')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, teamId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/teams/${teamId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_teamsCmd
        .command('update <organizationId> <teamId>')
        .description('Update a team')
        .option('--title <value>', 'Title of the team (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, teamId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/teams/${teamId}`;
            const body: Record<string, unknown> = {};
            if (options.title !== undefined) body['title'] = options.title;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_teamsCmd
        .command('remove <organizationId> <teamId>')
        .description('Delete a team')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, teamId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/teams/${teamId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_teams_membersCmd = organizations_teamsCmd
        .command('members')
        .description('Manage organizations teams members');

    organizations_teams_membersCmd
        .command('list <organizationId> <teamId>')
        .description('List all team members')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, teamId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/teams/${teamId}/members`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_teams_membersCmd
        .command('update <organizationId> <teamId>')
        .description('Updates members of a team')
        .option('--add <value>', '')
        .option('--remove <value>', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, teamId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/teams/${teamId}/members`;
            const body: Record<string, unknown> = {};
            if (options.add !== undefined) body['add'] = options.add;
            if (options.remove !== undefined) body['remove'] = options.remove;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_teams_membersCmd
        .command('add <organizationId> <teamId> <userId>')
        .description('Add a team member')
        .option('--role <value>', '"The role of a team member. "owner": Can manage team members. "member": Is a member of the team.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, teamId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/teams/${teamId}/members/${userId}`;
            const body: Record<string, unknown> = {};
            if (options.role !== undefined) body['role'] = options.role;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_teams_membersCmd
        .command('delete <organizationId> <teamId> <userId>')
        .description('Delete a team member')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, teamId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/teams/${teamId}/members/${userId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_invitesCmd = organizationsCmd
        .command('invites')
        .description('Manage organizations invites');

    organizations_invitesCmd
        .command('invite <organizationId>')
        .description('Invite users in an organization')
        .option('--emails <value>', '(required)')
        .option('--sso', 'If true, invites the user as an SSO user of the organization. Defaults to false.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/invites`;
            const body: Record<string, unknown> = {};
            if (options.emails !== undefined) body['emails'] = options.emails;
            if (options.sso !== undefined) body['sso'] = options.sso;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_invitesCmd
        .command('join <organizationId> <inviteId>')
        .description('Join an organization with an invite')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, inviteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/invites/${inviteId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_linkInvitesCmd = organizationsCmd
        .command('link-invites')
        .description('Manage organizations link-invites');

    organizations_linkInvitesCmd
        .command('list <organizationId>')
        .description('List organization invites')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/link-invites`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_linkInvitesCmd
        .command('create <organizationId>')
        .description('Create an organization invite')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/link-invites`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_linkInvitesCmd
        .command('get <organizationId> <inviteId>')
        .description('Get an organization by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, inviteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/link-invites/${inviteId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_linkInvitesCmd
        .command('update <organizationId> <inviteId>')
        .description('Update an organization invite')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, inviteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/link-invites/${inviteId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_linkInvitesCmd
        .command('delete <organizationId> <inviteId>')
        .description('Deletes an organization invite.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, inviteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/link-invites/${inviteId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_changeRequestsCmd = organizationsCmd
        .command('change-requests')
        .description('Manage organizations change-requests');

    organizations_changeRequestsCmd
        .command('list <organizationId>')
        .description('List all change requests in an organization')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--status [status]', '')
        .option('--creator [creator]', 'If defined, only change requests created by this user will be returned.')
        .option('--contributor [contributor]', 'If defined, only change requests with contributions from this user will be returned.')
        .option('--requestedReviewer [requestedReviewer]', 'If defined, only change requests with a requested reviewer for this user will be returned.')
        .option('--site [site]', 'If defined, only change requests linked to this site will be returned.')
        .option('--space [space]', 'If defined, only change requests from this space will be returned.')
        .option('--topic [topic]', 'If defined, only change requests linked to this site topic will be returned.')
        .option('--finding [finding]', 'Controls whether change requests from triage are included. Pass `none` to exclude change requests from triage, or `all` to include them. Default is `none`.')
        .option('--orderBy [orderBy]', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/change-requests`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["status"] !== undefined) query['status'] = String(options["status"]);
            if (options["creator"] !== undefined) query['creator'] = String(options["creator"]);
            if (options["contributor"] !== undefined) query['contributor'] = String(options["contributor"]);
            if (options["requestedReviewer"] !== undefined) query['requestedReviewer'] = String(options["requestedReviewer"]);
            if (options["site"] !== undefined) query['site'] = String(options["site"]);
            if (options["space"] !== undefined) query['space'] = String(options["space"]);
            if (options["topic"] !== undefined) query['topic'] = String(options["topic"]);
            if (options["finding"] !== undefined) query['finding'] = String(options["finding"]);
            if (options["orderBy"] !== undefined) query['orderBy'] = String(options["orderBy"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_integrationsCmd = organizationsCmd
        .command('integrations')
        .description('Manage organizations integrations');

    const organizations_integrations_installation_statusCmd = organizations_integrationsCmd
        .command('installation_status')
        .description('Manage organizations integrations installation_status');

    organizations_integrations_installation_statusCmd
        .command('get <organizationId> <integrationName>')
        .description('Get the status of an integration')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, integrationName, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/integrations/${integrationName}/installation_status`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_integrations_installationsStatusCmd = organizations_integrationsCmd
        .command('installations-status')
        .description('Manage organizations integrations installations-status');

    organizations_integrations_installationsStatusCmd
        .command('list <organizationId>')
        .description('List all integration statuses')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--target [target]', 'Filter installations by their target (organization, space, or site). When not provided, defaults to organization-level installations for backwards compatibility')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/integrations/installations-status`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["target"] !== undefined) query['target'] = String(options["target"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_installationsCmd = organizationsCmd
        .command('installations')
        .description('Manage organizations installations');

    organizations_installationsCmd
        .command('list <organizationId>')
        .description('List all integration installations')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--search [search]', 'A search string to filter integrations by name')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/installations`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["search"] !== undefined) query['search'] = String(options["search"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_samlCmd = organizationsCmd
        .command('saml')
        .description('Manage organizations saml');

    organizations_samlCmd
        .command('list <organizationId>')
        .description('List all SAML providers')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/saml`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_samlCmd
        .command('create <organizationId>')
        .description('Create a new SAML provider')
        .option('--label <value>', '(required)')
        .option('--entityID <value>', '')
        .option('--certificate <value>', '')
        .option('--ssoURL <value>', '')
        .option('--defaultTeam <value>', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/saml`;
            const body: Record<string, unknown> = {};
            if (options.label !== undefined) body['label'] = options.label;
            if (options.entityID !== undefined) body['entityID'] = options.entityID;
            if (options.certificate !== undefined) body['certificate'] = options.certificate;
            if (options.ssoURL !== undefined) body['ssoURL'] = options.ssoURL;
            if (options.defaultTeam !== undefined) body['defaultTeam'] = options.defaultTeam;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_samlCmd
        .command('get <organizationId> <samlProviderId>')
        .description('Get a SAML provider by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, samlProviderId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/saml/${samlProviderId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_samlCmd
        .command('update <organizationId> <samlProviderId>')
        .description('Update a SAML provider')
        .option('--label <value>', '')
        .option('--entityID <value>', '')
        .option('--certificate <value>', '')
        .option('--ssoURL <value>', '')
        .option('--defaultTeam <value>', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, samlProviderId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/saml/${samlProviderId}`;
            const body: Record<string, unknown> = {};
            if (options.label !== undefined) body['label'] = options.label;
            if (options.entityID !== undefined) body['entityID'] = options.entityID;
            if (options.certificate !== undefined) body['certificate'] = options.certificate;
            if (options.ssoURL !== undefined) body['ssoURL'] = options.ssoURL;
            if (options.defaultTeam !== undefined) body['defaultTeam'] = options.defaultTeam;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_samlCmd
        .command('delete <organizationId> <samlProviderId>')
        .description('Delete a SAML provider')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, samlProviderId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/saml/${samlProviderId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_ssoCmd = organizationsCmd
        .command('sso')
        .description('Manage organizations sso');

    organizations_ssoCmd
        .command('list <organizationId>')
        .description('List all SSO provider login infos')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sso`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_askCmd = organizationsCmd
        .command('ask')
        .description('Manage organizations ask');

    organizations_askCmd
        .command('create <organizationId>')
        .description('Ask a question in an organization')
        .option('--format [format]', 'Output format for the content.')
        .option('--details [details]', 'Return query details in the result')
        .option('--query <value>', '(required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/ask`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            if (options["details"] !== undefined) query['details'] = String(options["details"]);
            const body: Record<string, unknown> = {};
            if (options.query !== undefined) body['query'] = options.query;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    query,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_askCmd
        .command('stream <organizationId>')
        .description('Ask a question in an organization (streamed)')
        .option('--query <query>', '')
        .option('--format [format]', 'Output format for the content.')
        .option('--details [details]', 'Return query details in the result')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/ask/stream`;
            const query: Record<string, string> = {};
            if (options["query"] !== undefined) query['query'] = String(options["query"]);
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            if (options["details"] !== undefined) query['details'] = String(options["details"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_ask_questionsCmd = organizations_askCmd
        .command('questions')
        .description('Manage organizations ask questions');

    organizations_ask_questionsCmd
        .command('list <organizationId>')
        .description('List recommended questions to ask in an organization')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/ask/questions`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_ask_questionsCmd
        .command('stream <organizationId>')
        .description('List recommended questions to ask in an organization (streamed)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/ask/questions/stream`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_openapiCmd = organizationsCmd
        .command('openapi')
        .description('Manage organizations openapi');

    organizations_openapiCmd
        .command('list <organizationId>')
        .description('List all OpenAPI spec')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/openapi`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_openapiCmd
        .command('create <organizationId>')
        .description('Create an OpenAPI spec')
        .option('--slug <value>', 'Slug used as reference (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/openapi`;
            const body: Record<string, unknown> = {};
            if (options.slug !== undefined) body['slug'] = options.slug;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_openapiCmd
        .command('get <organizationId> <specSlug>')
        .description('Get an OpenAPI spec by its slug')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, specSlug, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/openapi/${specSlug}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_openapiCmd
        .command('set <organizationId> <specSlug>')
        .description('Create or update an OpenAPI spec')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, specSlug, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/openapi/${specSlug}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_openapiCmd
        .command('update <organizationId> <specSlug>')
        .description('Update OpenAPI spec visibility')
        .option('--visibility <value>', 'The visibility setting of the OpenAPI spec. * `private`: The spec is not publicly available. * `public`: The spec is available to anyone with a public link.  (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, specSlug, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/openapi/${specSlug}`;
            const body: Record<string, unknown> = {};
            if (options.visibility !== undefined) body['visibility'] = options.visibility;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_openapiCmd
        .command('delete <organizationId> <specSlug>')
        .description('Delete an OpenAPI spec')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, specSlug, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/openapi/${specSlug}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_openapi_versionsCmd = organizations_openapiCmd
        .command('versions')
        .description('Manage organizations openapi versions');

    organizations_openapi_versionsCmd
        .command('list <organizationId> <specSlug>')
        .description('List all OpenAPI spec versions')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, specSlug, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/openapi/${specSlug}/versions`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_openapi_versionsCmd
        .command('get <organizationId> <specSlug> <versionId>')
        .description('Get an OpenAPI spec version by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, specSlug, versionId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/openapi/${specSlug}/versions/${versionId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_openapi_versions_latestCmd = organizations_openapi_versionsCmd
        .command('latest')
        .description('Manage organizations openapi versions latest');

    organizations_openapi_versions_latestCmd
        .command('get <organizationId> <specSlug>')
        .description('Get the latest OpenAPI spec version')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, specSlug, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/openapi/${specSlug}/versions/latest`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_openapi_versions_latest_contentCmd = organizations_openapi_versions_latestCmd
        .command('content')
        .description('Manage organizations openapi versions latest content');

    organizations_openapi_versions_latest_contentCmd
        .command('get <organizationId> <specSlug>')
        .description('Get the latest OpenAPI spec version content')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, specSlug, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/openapi/${specSlug}/versions/latest/content`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_openapi_versions_contentCmd = organizations_openapi_versionsCmd
        .command('content')
        .description('Manage organizations openapi versions content');

    organizations_openapi_versions_contentCmd
        .command('get <organizationId> <specSlug> <versionId>')
        .description('Get an OpenAPI spec version content by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, specSlug, versionId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/openapi/${specSlug}/versions/${versionId}/content`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_agentInstructionsCmd = organizationsCmd
        .command('agent-instructions')
        .description('Manage organizations agent-instructions');

    organizations_agentInstructionsCmd
        .command('get <organizationId>')
        .description('Get Docs agent instructions for an organization')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/agent-instructions`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_agentInstructionsCmd
        .command('update <organizationId>')
        .description('Update Docs agent instructions for an organization')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/agent-instructions`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_translationsCmd = organizationsCmd
        .command('translations')
        .description('Manage organizations translations');

    organizations_translationsCmd
        .command('list <organizationId>')
        .description('List all the translations')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/translations`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_translationsCmd
        .command('create <organizationId>')
        .description('Create a translation')
        .option('--language <value>', '(required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/translations`;
            const body: Record<string, unknown> = {};
            if (options.language !== undefined) body['language'] = options.language;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_translationsCmd
        .command('get <organizationId> <translationId>')
        .description('Get a translation by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, translationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/translations/${translationId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_translationsCmd
        .command('update <organizationId> <translationId>')
        .description('Update a translation')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, translationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/translations/${translationId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_translationsCmd
        .command('delete <organizationId> <translationId>')
        .description('Delete a translation')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, translationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/translations/${translationId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_translationsCmd
        .command('run <organizationId> <translationId>')
        .description('Run a translation again')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, translationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/translations/${translationId}/run`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_translationsGlossaryCmd = organizationsCmd
        .command('translations-glossary')
        .description('Manage organizations translations-glossary');

    organizations_translationsGlossaryCmd
        .command('list <organizationId>')
        .description('List glossary entries')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--orderBy [orderBy]', 'Sort results by language key')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/translations-glossary`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["orderBy"] !== undefined) query['orderBy'] = String(options["orderBy"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_translationsGlossaryCmd
        .command('update <organizationId>')
        .description('Update glossary entries')
        .option('--operations <value>', '(required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/translations-glossary`;
            const body: Record<string, unknown> = {};
            if (options.operations !== undefined) body['operations'] = options.operations;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_translationsGlossaryCmd
        .command('get <organizationId> <glossaryEntryId>')
        .description('Get a glossary entry by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, glossaryEntryId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/translations-glossary/${glossaryEntryId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_importsCmd = organizationsCmd
        .command('imports')
        .description('Manage organizations imports');

    organizations_importsCmd
        .command('start <organizationId>')
        .description('Import content into a space from a website')
        .option('--enhance', 'Enhance the imported content with AI')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/org/${organizationId}/imports`;
            const body: Record<string, unknown> = {};
            if (options.enhance !== undefined) body['enhance'] = options.enhance;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_importsCmd
        .command('cancel <organizationId> <importRunId>')
        .description('Cancel an import run')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, importRunId, options) => {
            const api = await getAPIClient(true);
            const path = `/org/${organizationId}/imports/${importRunId}/cancel`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sitesCmd = organizationsCmd
        .command('sites')
        .description('Manage organizations sites');

    organizations_sitesCmd
        .command('list <organizationId>')
        .description('List all sites')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--space [space]', 'Identifier of the space to filter the sites by')
        .option('--title [title]', 'Filter sites by their title')
        .option('--published [published]', 'Filter sites by their published status')
        .option('--type [type]', 'Filter by site type')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["space"] !== undefined) query['space'] = String(options["space"]);
            if (options["title"] !== undefined) query['title'] = String(options["title"]);
            if (options["published"] !== undefined) query['published'] = String(options["published"]);
            if (options["type"] !== undefined) query['type'] = String(options["type"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sitesCmd
        .command('create <organizationId>')
        .description('Create a site')
        .option('--type <value>', 'The type of the site')
        .option('--title <value>', 'Title of the site')
        .option('--visibility <value>', 'The visibility setting of the site determines the audience of the site. * `public`: Anyone can access the site, and the site is indexed by search engines. * `unlisted`: Anyone can access the site, and the site is not indexed by search engines * `share-link`: Anyone with a secret token in the url can access the site. * `visitor-auth`: Anyone authenticated through a JWT token can access the site.')
        .option('--spaces <value>', 'ID of spaces to be added to the site')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites`;
            const body: Record<string, unknown> = {};
            if (options.type !== undefined) body['type'] = options.type;
            if (options.title !== undefined) body['title'] = options.title;
            if (options.visibility !== undefined) body['visibility'] = options.visibility;
            if (options.spaces !== undefined) body['spaces'] = options.spaces;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sitesCmd
        .command('get <organizationId> <siteId>')
        .description('Get a site by its ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sitesCmd
        .command('update <organizationId> <siteId>')
        .description('Update a site')
        .option('--title <value>', 'Title of the site')
        .option('--visibility <value>', 'The visibility setting of the site determines the audience of the site. * `public`: Anyone can access the site, and the site is indexed by search engines. * `unlisted`: Anyone can access the site, and the site is not indexed by search engines * `share-link`: Anyone with a secret token in the url can access the site. * `visitor-auth`: Anyone authenticated through a JWT token can access the site.')
        .option('--basename <value>', 'Basename for the site. For e.g. api')
        .option('--permissionsModel <value>', 'Permissions resolution mode for the site.')
        .option('--defaultSiteSpace <value>', 'ID of the site-space to be used as the default at the root level. If site has sections, this will mark the default site space in the site\'s default section.')
        .option('--defaultSiteSection <value>', 'ID of the site-section to be used as the default.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}`;
            const body: Record<string, unknown> = {};
            if (options.title !== undefined) body['title'] = options.title;
            if (options.visibility !== undefined) body['visibility'] = options.visibility;
            if (options.basename !== undefined) body['basename'] = options.basename;
            if (options.permissionsModel !== undefined) body['permissionsModel'] = options.permissionsModel;
            if (options.defaultSiteSpace !== undefined) body['defaultSiteSpace'] = options.defaultSiteSpace;
            if (options.defaultSiteSection !== undefined) body['defaultSiteSection'] = options.defaultSiteSection;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sitesCmd
        .command('delete <organizationId> <siteId>')
        .description('Delete a site')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sitesCmd
        .command('publish <organizationId> <siteId>')
        .description('Publish a site')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/publish`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sitesCmd
        .command('unpublish <organizationId> <siteId>')
        .description('Unpublish a site')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/unpublish`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sitesCmd
        .command('search <organizationId> <siteId>')
        .description('Search in a site')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/search`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    query,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_spacesCmd = organizations_sitesCmd
        .command('spaces')
        .description('Manage organizations sites spaces');

    const organizations_sites_spaces_gitCmd = organizations_sites_spacesCmd
        .command('git')
        .description('Manage organizations sites spaces git');

    const organizations_sites_spaces_git_installationsCmd = organizations_sites_spaces_gitCmd
        .command('installations')
        .description('Manage organizations sites spaces git installations');

    organizations_sites_spaces_git_installationsCmd
        .command('list <organizationId> <siteId>')
        .description('List the Git Sync installations for a site and its spaces')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/spaces/git/installations`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_adaptiveSchemaCmd = organizations_sitesCmd
        .command('adaptive-schema')
        .description('Manage organizations sites adaptive-schema');

    organizations_sites_adaptiveSchemaCmd
        .command('get <organizationId> <siteId>')
        .description('Get the JSON schema describing the attributes expected for an Adaptive content site visitor.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/adaptive-schema`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_adaptiveSchemaCmd
        .command('update <organizationId> <siteId>')
        .description('Update the JSON schema of the attributes expected for an Adaptive content site visitor.')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/adaptive-schema`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_adaptiveSchema_templateConditionsCmd = organizations_sites_adaptiveSchemaCmd
        .command('template-conditions')
        .description('Manage organizations sites adaptive-schema template-conditions');

    organizations_sites_adaptiveSchema_templateConditionsCmd
        .command('list <organizationId> <siteId>')
        .description('List templates of conditions generated based on the site visitor schema that can be used in adaptive content expressions.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/adaptive-schema/template-conditions`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_publishedCmd = organizations_sitesCmd
        .command('published')
        .description('Manage organizations sites published');

    organizations_sites_publishedCmd
        .command('get <organizationId> <siteId>')
        .description('Get a published site')
        .option('--shareKey [shareKey]', 'For sites published via share-links, the share key is useful to resolve published URLs.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/published`;
            const query: Record<string, string> = {};
            if (options["shareKey"] !== undefined) query['shareKey'] = String(options["shareKey"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_shareLinksCmd = organizations_sitesCmd
        .command('share-links')
        .description('Manage organizations sites share-links');

    organizations_sites_shareLinksCmd
        .command('list <organizationId> <siteId>')
        .description('List all share links')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--search [search]', 'Search share links by name or key')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/share-links`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["search"] !== undefined) query['search'] = String(options["search"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_shareLinksCmd
        .command('create <organizationId> <siteId>')
        .description('Create a share link')
        .option('--name <value>', 'Name of the share link (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/share-links`;
            const body: Record<string, unknown> = {};
            if (options.name !== undefined) body['name'] = options.name;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_shareLinksCmd
        .command('update <organizationId> <siteId> <shareLinkId>')
        .description('Update a share link')
        .option('--active', '')
        .option('--name <value>', 'Name of the share link')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, shareLinkId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/share-links/${shareLinkId}`;
            const body: Record<string, unknown> = {};
            if (options.active !== undefined) body['active'] = options.active;
            if (options.name !== undefined) body['name'] = options.name;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_shareLinksCmd
        .command('delete <organizationId> <siteId> <shareLinkId>')
        .description('Deletes a share link')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, shareLinkId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/share-links/${shareLinkId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_structureCmd = organizations_sitesCmd
        .command('structure')
        .description('Manage organizations sites structure');

    organizations_sites_structureCmd
        .command('get <organizationId> <siteId>')
        .description('Get a site structure')
        .option('--shareKey [shareKey]', 'For sites published via share-links, the share key is useful to resolve published URLs.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/structure`;
            const query: Record<string, string> = {};
            if (options["shareKey"] !== undefined) query['shareKey'] = String(options["shareKey"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_structureCmd
        .command('sort <organizationId> <siteId>')
        .description('Move a site space, site section or site section group to a new position in the site structure.')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/structure/sort`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_publishingCmd = organizations_sitesCmd
        .command('publishing')
        .description('Manage organizations sites publishing');

    const organizations_sites_publishing_authCmd = organizations_sites_publishingCmd
        .command('auth')
        .description('Manage organizations sites publishing auth');

    organizations_sites_publishing_authCmd
        .command('get <organizationId> <siteId>')
        .description('Get a site auth config')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/publishing/auth`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_publishing_authCmd
        .command('update <organizationId> <siteId>')
        .description('Update a site auth config')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/publishing/auth`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_publishing_authCmd
        .command('regenerate <organizationId> <siteId>')
        .description('Regenerate a site auth')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/publishing/auth/regenerate`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_publishing_previewCmd = organizations_sites_publishingCmd
        .command('preview')
        .description('Manage organizations sites publishing preview');

    organizations_sites_publishing_previewCmd
        .command('get <organizationId> <siteId>')
        .description('Get a site preview URL')
        .option('--siteSpace [siteSpace]', 'ID of the site-space to preview. If not provided, the default site-space will be used.')
        .option('--claims [claims]', 'Rison encoded string of attributes/assertions about the visitor for which we want to preview the site.')
        .option('--draft [draft]', 'Whether to include draft content in the preview. Defaults to true')
        .option('--target [target]', 'Target URL of the preview. If not provided, the default site preview URL will be used.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/publishing/preview`;
            const query: Record<string, string> = {};
            if (options["siteSpace"] !== undefined) query['siteSpace'] = String(options["siteSpace"]);
            if (options["claims"] !== undefined) query['claims'] = String(options["claims"]);
            if (options["draft"] !== undefined) query['draft'] = String(options["draft"]);
            if (options["target"] !== undefined) query['target'] = String(options["target"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_customizationCmd = organizations_sitesCmd
        .command('customization')
        .description('Manage organizations sites customization');

    organizations_sites_customizationCmd
        .command('get <organizationId> <siteId>')
        .description('Get a site customization settings')
        .option('--unmasked [unmasked]', '(Deprecated) Use the getRawCustomizationSettingsById internal endpoint.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/customization`;
            const query: Record<string, string> = {};
            if (options["unmasked"] !== undefined) query['unmasked'] = String(options["unmasked"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_customizationCmd
        .command('update <organizationId> <siteId>')
        .description('Update a site customization settings')
        .option('--title <value>', 'Title of the site')
        .option('--socialAccounts <value>', 'The social accounts of the site. (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/customization`;
            const body: Record<string, unknown> = {};
            if (options.title !== undefined) body['title'] = options.title;
            if (options.socialAccounts !== undefined) body['socialAccounts'] = options.socialAccounts;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_integrationScriptsCmd = organizations_sitesCmd
        .command('integration-scripts')
        .description('Manage organizations sites integration-scripts');

    organizations_sites_integrationScriptsCmd
        .command('list <organizationId> <siteId>')
        .description('List the scripts to embed in published content for a site.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/integration-scripts`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_siteSpacesCmd = organizations_sitesCmd
        .command('site-spaces')
        .description('Manage organizations sites site-spaces');

    organizations_sites_siteSpacesCmd
        .command('list <organizationId> <siteId>')
        .description('List all the site spaces')
        .option('--shareKey [shareKey]', 'For sites published via share-links, the share key is useful to resolve published URLs.')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--default [default]', 'If true, only the default site space will be returned. If false, only the non-default site spaces are returned. If undefined, all site spaces are returned.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/site-spaces`;
            const query: Record<string, string> = {};
            if (options["shareKey"] !== undefined) query['shareKey'] = String(options["shareKey"]);
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["default"] !== undefined) query['default'] = String(options["default"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_siteSpacesCmd
        .command('add <organizationId> <siteId>')
        .description('Add a space to a site')
        .option('--spaceId <value>', 'ID of the space (required)')
        .option('--sectionId <value>', 'ID of the section to add the space to. If not provided, the space will be added to the default section or at the root level if the site has no sections.')
        .option('--draft', 'Whether the site space should be created as draft. Defaults to false.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/site-spaces`;
            const body: Record<string, unknown> = {};
            if (options.spaceId !== undefined) body['spaceId'] = options.spaceId;
            if (options.sectionId !== undefined) body['sectionId'] = options.sectionId;
            if (options.draft !== undefined) body['draft'] = options.draft;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_siteSpacesCmd
        .command('update <organizationId> <siteId> <siteSpaceId>')
        .description('Update a site space')
        .option('--path <value>', 'Path to the space on the site')
        .option('--spaceId <value>', 'The content that this site space points to. If not set, the space will remain unchanged.')
        .option('--hidden', 'Whether the site space is hidden. If true, the site space will not be shown in the site\'s navigation. If not set, the hidden state will remain unchanged. If set to false, the site space will be shown in site navigation.')
        .option('--draft', 'Whether the site space should be kept in draft mode. Setting it to true makes the site space draft. Setting it to false makes the site space live.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSpaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/site-spaces/${siteSpaceId}`;
            const body: Record<string, unknown> = {};
            if (options.path !== undefined) body['path'] = options.path;
            if (options.spaceId !== undefined) body['spaceId'] = options.spaceId;
            if (options.hidden !== undefined) body['hidden'] = options.hidden;
            if (options.draft !== undefined) body['draft'] = options.draft;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_siteSpacesCmd
        .command('delete <organizationId> <siteId> <siteSpaceId>')
        .description('Delete a site space')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSpaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/site-spaces/${siteSpaceId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_siteSpacesCmd
        .command('move <organizationId> <siteId> <siteSpaceId>')
        .description('Move a site space to a new position. (Deprecated) use sortSiteStructure instead.')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSpaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/site-spaces/${siteSpaceId}/move`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_siteSpaces_customizationCmd = organizations_sites_siteSpacesCmd
        .command('customization')
        .description('Manage organizations sites site-spaces customization');

    organizations_sites_siteSpaces_customizationCmd
        .command('get <organizationId> <siteId> <siteSpaceId>')
        .description('Get a site space customization settings')
        .option('--unmasked [unmasked]', '(Deprecated) Use the getRawCustomizationSettingsById internal endpoint.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSpaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/site-spaces/${siteSpaceId}/customization`;
            const query: Record<string, string> = {};
            if (options["unmasked"] !== undefined) query['unmasked'] = String(options["unmasked"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_siteSpaces_customizationCmd
        .command('override <organizationId> <siteId> <siteSpaceId>')
        .description('Override a site space customization settings')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSpaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/site-spaces/${siteSpaceId}/customization`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_siteSpaces_customizationCmd
        .command('delete <organizationId> <siteId> <siteSpaceId>')
        .description('Delete a site space customization settings')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSpaceId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/site-spaces/${siteSpaceId}/customization`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_sectionGroupsCmd = organizations_sitesCmd
        .command('section-groups')
        .description('Manage organizations sites section-groups');

    organizations_sites_sectionGroupsCmd
        .command('list <organizationId> <siteId>')
        .description('List all site section groups')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/section-groups`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_sectionGroupsCmd
        .command('add <organizationId> <siteId>')
        .description('Add a section group to a site')
        .option('--title <value>', 'Title of the site section group (required)')
        .option('--sections <value>', 'IDs of the sections to be added to the section group')
        .option('--parent <value>', 'ID of the parent section group to nest this group under. If not provided, the section group will be added at the root of the site.')
        .option('--draft', 'Whether the section group should be created in draft mode.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/section-groups`;
            const body: Record<string, unknown> = {};
            if (options.title !== undefined) body['title'] = options.title;
            if (options.sections !== undefined) body['sections'] = options.sections;
            if (options.parent !== undefined) body['parent'] = options.parent;
            if (options.draft !== undefined) body['draft'] = options.draft;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_sectionGroupsCmd
        .command('update <organizationId> <siteId> <siteSectionGroupId>')
        .description('Update a site section group')
        .option('--title <value>', 'Title of the site section group')
        .option('--draft', 'Whether the site section group should be kept in draft mode. Setting it to true makes the site section group draft. Setting it to false makes the site section group live.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSectionGroupId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/section-groups/${siteSectionGroupId}`;
            const body: Record<string, unknown> = {};
            if (options.title !== undefined) body['title'] = options.title;
            if (options.draft !== undefined) body['draft'] = options.draft;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_sectionGroupsCmd
        .command('delete <organizationId> <siteId> <siteSectionGroupId>')
        .description('Delete a site section group')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSectionGroupId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/section-groups/${siteSectionGroupId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_sectionGroupsCmd
        .command('move <organizationId> <siteId> <siteSectionGroupId>')
        .description('Move a site section group to a new position. (Deprecated) use sortSiteStructure instead.')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSectionGroupId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/section-groups/${siteSectionGroupId}/move`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_sectionsCmd = organizations_sitesCmd
        .command('sections')
        .description('Manage organizations sites sections');

    organizations_sites_sectionsCmd
        .command('list <organizationId> <siteId>')
        .description('List all site sections')
        .option('--shareKey [shareKey]', 'For sites published via share-links, the share key is useful to resolve published URLs.')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/sections`;
            const query: Record<string, string> = {};
            if (options["shareKey"] !== undefined) query['shareKey'] = String(options["shareKey"]);
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_sectionsCmd
        .command('add <organizationId> <siteId>')
        .description('Add a section to a site')
        .option('--spaceId <value>', 'ID of the space to be added to the section as a site space variant (required)')
        .option('--draft', 'Whether the section should be created in draft mode.')
        .option('--siteSectionGroupId <value>', 'ID of the section group to create the section in')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/sections`;
            const body: Record<string, unknown> = {};
            if (options.spaceId !== undefined) body['spaceId'] = options.spaceId;
            if (options.draft !== undefined) body['draft'] = options.draft;
            if (options.siteSectionGroupId !== undefined) body['siteSectionGroupId'] = options.siteSectionGroupId;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_sectionsCmd
        .command('update <organizationId> <siteId> <siteSectionId>')
        .description('Update a site section')
        .option('--title <value>', 'Title of the site section')
        .option('--path <value>', 'Path to the section on the site')
        .option('--defaultSiteSpace <value>', 'ID of the site-space to be used as the default in this section.')
        .option('--draft', 'Whether the site section should be kept in draft mode. Setting it to true makes the site section draft. Setting it to false makes the site section live.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/sections/${siteSectionId}`;
            const body: Record<string, unknown> = {};
            if (options.title !== undefined) body['title'] = options.title;
            if (options.path !== undefined) body['path'] = options.path;
            if (options.defaultSiteSpace !== undefined) body['defaultSiteSpace'] = options.defaultSiteSpace;
            if (options.draft !== undefined) body['draft'] = options.draft;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_sectionsCmd
        .command('delete <organizationId> <siteId> <siteSectionId>')
        .description('Delete a site section')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/sections/${siteSectionId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_sectionsCmd
        .command('move <organizationId> <siteId> <siteSectionId>')
        .description('Move a site section to a new position. (Deprecated) use sortSiteStructure instead.')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteSectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/sections/${siteSectionId}/move`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_askCmd = organizations_sitesCmd
        .command('ask')
        .description('Manage organizations sites ask');

    organizations_sites_askCmd
        .command('stream <organizationId> <siteId>')
        .description('Ask a question in a site')
        .option('--format [format]', 'Output format for the content.')
        .option('--question <value>', '(required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/ask`;
            const query: Record<string, string> = {};
            if (options["format"] !== undefined) query['format'] = String(options["format"]);
            const body: Record<string, unknown> = {};
            if (options.question !== undefined) body['question'] = options.question;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    query,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_ask_questionsCmd = organizations_sites_askCmd
        .command('questions')
        .description('Manage organizations sites ask questions');

    organizations_sites_ask_questionsCmd
        .command('stream <organizationId> <siteId>')
        .description('List recommended questions to ask in a site')
        .option('--siteSpaceId [siteSpaceId]', 'The ID of the site space to filter the recommended questions for.')
        .option('--spaceId [spaceId]', 'The ID of the space to filter the recommended questions for.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/ask/questions`;
            const query: Record<string, string> = {};
            if (options["siteSpaceId"] !== undefined) query['siteSpaceId'] = String(options["siteSpaceId"]);
            if (options["spaceId"] !== undefined) query['spaceId'] = String(options["spaceId"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_contextRecordsCmd = organizations_sitesCmd
        .command('context-records')
        .description('Manage organizations sites context-records');

    organizations_sites_contextRecordsCmd
        .command('list <organizationId> <siteId>')
        .description('List all context records')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--type [type]', 'Filter context records by type.')
        .option('--connector [connector]', 'Filter context records by connector type.')
        .option('--connection [connection]', 'Filter context records by connection id.')
        .option('--topic [topic]', 'Filter context records by associated site topic ID.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/context-records`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["type"] !== undefined) query['type'] = String(options["type"]);
            if (options["connector"] !== undefined) query['connector'] = String(options["connector"]);
            if (options["connection"] !== undefined) query['connection'] = String(options["connection"]);
            if (options["topic"] !== undefined) query['topic'] = String(options["topic"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_contextRecordsCmd
        .command('upsert <organizationId> <siteId>')
        .description('Create or update context records')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/context-records`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_contextRecordsCmd
        .command('get <organizationId> <siteId> <siteContextRecordId>')
        .description('Get a context record')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteContextRecordId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/context-records/${siteContextRecordId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_scansCmd = organizations_sitesCmd
        .command('scans')
        .description('Manage organizations sites scans');

    organizations_sites_scansCmd
        .command('list <organizationId> <siteId>')
        .description('List all site scans')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--topic [topic]', 'Filter scans by associated site topic ID.')
        .option('--status [status]', 'Filter scans by status.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/scans`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["topic"] !== undefined) query['topic'] = String(options["topic"]);
            if (options["status"] !== undefined) query['status'] = String(options["status"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_scansCmd
        .command('create <organizationId> <siteId>')
        .description('Enqueue a new site scan')
        .option('--topic <value>', 'The site topic ID to scan. (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/scans`;
            const body: Record<string, unknown> = {};
            if (options.topic !== undefined) body['topic'] = options.topic;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_scansCmd
        .command('get <organizationId> <siteId> <siteScanId>')
        .description('Get a site scan by ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteScanId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/scans/${siteScanId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_findingsCmd = organizations_sitesCmd
        .command('findings')
        .description('Manage organizations sites findings');

    organizations_sites_findingsCmd
        .command('list <organizationId> <siteId>')
        .description('List all site context findings')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--topic [topic]', 'Filter findings by associated site topic ID.')
        .option('--status [status]', 'Filter findings by status.')
        .option('--type [type]', 'Filter findings by type.')
        .option('--severity [severity]', 'Filter findings by estimated severity.')
        .option('--hasChangeRequests [hasChangeRequests]', 'Filter findings that have at least one associated change request.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/findings`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["topic"] !== undefined) query['topic'] = String(options["topic"]);
            if (options["status"] !== undefined) query['status'] = String(options["status"]);
            if (options["type"] !== undefined) query['type'] = String(options["type"]);
            if (options["severity"] !== undefined) query['severity'] = String(options["severity"]);
            if (options["hasChangeRequests"] !== undefined) query['hasChangeRequests'] = String(options["hasChangeRequests"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_findingsCmd
        .command('get <organizationId> <siteId> <siteFindingId>')
        .description('Get a site finding by ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteFindingId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/findings/${siteFindingId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_findingsCmd
        .command('update <organizationId> <siteId> <siteFindingId>')
        .description('Update a site finding')
        .option('--status <value>', '(required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteFindingId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/findings/${siteFindingId}`;
            const body: Record<string, unknown> = {};
            if (options.status !== undefined) body['status'] = options.status;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_findings_changeRequestsCmd = organizations_sites_findingsCmd
        .command('change-requests')
        .description('Manage organizations sites findings change-requests');

    organizations_sites_findings_changeRequestsCmd
        .command('list <organizationId> <siteId> <siteFindingId>')
        .description('List change requests linked to a site finding')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteFindingId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/findings/${siteFindingId}/change-requests`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_findings_changeRequestsCmd
        .command('trigger <organizationId> <siteId> <siteFindingId>')
        .description('Process a site finding into change requests')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteFindingId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/findings/${siteFindingId}/change-requests`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_findings_pagesCmd = organizations_sites_findingsCmd
        .command('pages')
        .description('Manage organizations sites findings pages');

    organizations_sites_findings_pagesCmd
        .command('list <organizationId> <siteId> <siteFindingId>')
        .description('List pages linked to a site finding')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteFindingId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/findings/${siteFindingId}/pages`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_findings_questionsCmd = organizations_sites_findingsCmd
        .command('questions')
        .description('Manage organizations sites findings questions');

    organizations_sites_findings_questionsCmd
        .command('list <organizationId> <siteId> <siteFindingId>')
        .description('List questions linked to a site finding')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteFindingId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/findings/${siteFindingId}/questions`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_findings_recordsCmd = organizations_sites_findingsCmd
        .command('records')
        .description('Manage organizations sites findings records');

    organizations_sites_findings_recordsCmd
        .command('list <organizationId> <siteId> <siteFindingId>')
        .description('List records linked to a site finding')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteFindingId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/findings/${siteFindingId}/records`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_contextConnectionsCmd = organizations_sitesCmd
        .command('context-connections')
        .description('Manage organizations sites context-connections');

    organizations_sites_contextConnectionsCmd
        .command('list <organizationId> <siteId>')
        .description('List all context connections')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/context-connections`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_contextConnectionsCmd
        .command('create <organizationId> <siteId>')
        .description('Create a context connection')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/context-connections`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_contextConnectionsCmd
        .command('get <organizationId> <siteId> <siteContextConnectionId>')
        .description('Get a context connection')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteContextConnectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/context-connections/${siteContextConnectionId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_contextConnectionsCmd
        .command('update <organizationId> <siteId> <siteContextConnectionId>')
        .description('Update a context connection')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteContextConnectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/context-connections/${siteContextConnectionId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_contextConnectionsCmd
        .command('delete <organizationId> <siteId> <siteContextConnectionId>')
        .description('Delete a context connection')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteContextConnectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/context-connections/${siteContextConnectionId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_contextConnectionsCmd
        .command('sync <organizationId> <siteId> <siteContextConnectionId>')
        .description('Trigger a sync for a context connection')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteContextConnectionId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/context-connections/${siteContextConnectionId}/sync`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_topicsCmd = organizations_sitesCmd
        .command('topics')
        .description('Manage organizations sites topics');

    organizations_sites_topicsCmd
        .command('list <organizationId> <siteId>')
        .description('List all topics')
        .option('--from [from]', 'Filter stats to answers created at or after this timestamp.')
        .option('--to [to]', 'Filter stats to answers created at or before this timestamp.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/topics`;
            const query: Record<string, string> = {};
            if (options["from"] !== undefined) query['from'] = String(options["from"]);
            if (options["to"] !== undefined) query['to'] = String(options["to"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_topicsCmd
        .command('get <organizationId> <siteId> <siteTopicId>')
        .description('Get a topic')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteTopicId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/topics/${siteTopicId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_topicsCmd
        .command('update <organizationId> <siteId> <siteTopicId>')
        .description('Update a topic')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteTopicId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/topics/${siteTopicId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_topics_findingsCmd = organizations_sites_topicsCmd
        .command('findings')
        .description('Manage organizations sites topics findings');

    organizations_sites_topics_findingsCmd
        .command('delete <organizationId> <siteId> <siteTopicId>')
        .description('Delete all findings for a topic')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteTopicId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/topics/${siteTopicId}/findings`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_questionsCmd = organizations_sitesCmd
        .command('questions')
        .description('Manage organizations sites questions');

    organizations_sites_questionsCmd
        .command('list <organizationId> <siteId>')
        .description('List all questions in a site')
        .option('--from [from]', 'Filter stats to answers created at or after this timestamp.')
        .option('--to [to]', 'Filter stats to answers created at or before this timestamp.')
        .option('--type [type]', 'Filter questions by question type.')
        .option('--relevance [relevance]', 'Filter questions by question relevance.')
        .option('--channelType [channelType]', 'Filter questions by answer channel type.')
        .option('--answered [answered]', 'Filter questions by answer resolution.')
        .option('--topic [topic]', 'Filter questions by associated site topic IDs.')
        .option('--order [order]', 'An order for the items in the list')
        .option('--sort [sort]', 'Sort questions by latest ask activity, answered rate, or positive feedback rate. If omitted, ordering stays on canonical question creation date to preserve current behavior.')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/questions`;
            const query: Record<string, string> = {};
            if (options["from"] !== undefined) query['from'] = String(options["from"]);
            if (options["to"] !== undefined) query['to'] = String(options["to"]);
            if (options["type"] !== undefined) query['type'] = String(options["type"]);
            if (options["relevance"] !== undefined) query['relevance'] = String(options["relevance"]);
            if (options["channelType"] !== undefined) query['channelType'] = String(options["channelType"]);
            if (options["answered"] !== undefined) query['answered'] = String(options["answered"]);
            if (options["topic"] !== undefined) query['topic'] = String(options["topic"]);
            if (options["order"] !== undefined) query['order'] = String(options["order"]);
            if (options["sort"] !== undefined) query['sort'] = String(options["sort"]);
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_questionsCmd
        .command('get <organizationId> <siteId> <siteQuestionId>')
        .description('Get a site question by ID')
        .option('--from [from]', 'Filter stats to answers created at or after this timestamp.')
        .option('--to [to]', 'Filter stats to answers created at or before this timestamp.')
        .option('--relevance [relevance]', 'Filter stats by question relevance.')
        .option('--channelType [channelType]', 'Filter stats by answer channel type.')
        .option('--answered [answered]', 'Filter stats by answer resolution.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteQuestionId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/questions/${siteQuestionId}`;
            const query: Record<string, string> = {};
            if (options["from"] !== undefined) query['from'] = String(options["from"]);
            if (options["to"] !== undefined) query['to'] = String(options["to"]);
            if (options["relevance"] !== undefined) query['relevance'] = String(options["relevance"]);
            if (options["channelType"] !== undefined) query['channelType'] = String(options["channelType"]);
            if (options["answered"] !== undefined) query['answered'] = String(options["answered"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_questions_sourcesCmd = organizations_sites_questionsCmd
        .command('sources')
        .description('Manage organizations sites questions sources');

    organizations_sites_questions_sourcesCmd
        .command('list <organizationId> <siteId> <siteQuestionId>')
        .description('List sources for a question')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--from [from]', 'Filter sources to answers created at or after this timestamp.')
        .option('--to [to]', 'Filter sources to answers created at or before this timestamp.')
        .option('--relevance [relevance]', 'Filter answer sources by question relevance.')
        .option('--channelType [channelType]', 'Filter answer sources by answer channel type.')
        .option('--answered [answered]', 'Filter answer sources by answer resolution.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteQuestionId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/questions/${siteQuestionId}/sources`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["from"] !== undefined) query['from'] = String(options["from"]);
            if (options["to"] !== undefined) query['to'] = String(options["to"]);
            if (options["relevance"] !== undefined) query['relevance'] = String(options["relevance"]);
            if (options["channelType"] !== undefined) query['channelType'] = String(options["channelType"]);
            if (options["answered"] !== undefined) query['answered'] = String(options["answered"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_questionStatsCmd = organizations_sitesCmd
        .command('question-stats')
        .description('Manage organizations sites question-stats');

    organizations_sites_questionStatsCmd
        .command('get <organizationId> <siteId>')
        .description('Get question stats for a site')
        .option('--from [from]', 'Filter stats to answers created at or after this timestamp.')
        .option('--to [to]', 'Filter stats to answers created at or before this timestamp.')
        .option('--topic [topic]', 'Filter stats by associated site topic IDs.')
        .option('--relevance [relevance]', 'Filter stats by question relevance.')
        .option('--channelType [channelType]', 'Filter stats by answer channel type.')
        .option('--answered [answered]', 'Filter stats by answer resolution.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/question-stats`;
            const query: Record<string, string> = {};
            if (options["from"] !== undefined) query['from'] = String(options["from"]);
            if (options["to"] !== undefined) query['to'] = String(options["to"]);
            if (options["topic"] !== undefined) query['topic'] = String(options["topic"]);
            if (options["relevance"] !== undefined) query['relevance'] = String(options["relevance"]);
            if (options["channelType"] !== undefined) query['channelType'] = String(options["channelType"]);
            if (options["answered"] !== undefined) query['answered'] = String(options["answered"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_answersCmd = organizations_sitesCmd
        .command('answers')
        .description('Manage organizations sites answers');

    organizations_sites_answersCmd
        .command('list <organizationId> <siteId>')
        .description('List all answers for a site')
        .option('--question [question]', 'Filter answers to a specific site question ID.')
        .option('--from [from]', 'Filter answers created at or after this timestamp.')
        .option('--to [to]', 'Filter answers created at or before this timestamp.')
        .option('--language [language]', 'Filter answers by ISO language code.')
        .option('--answered [answered]', 'Filter answers by answered resolution.')
        .option('--helpfulness [helpfulness]', 'Filter answers by answered helpfulness.')
        .option('--relevance [relevance]', 'Filter answers by question relevance.')
        .option('--channelType [channelType]', 'Filter answers by answer channel type.')
        .option('--question.type [question.type]', 'Filter answers by question type.')
        .option('--topic [topic]', 'Filter answers by associated site topic ID.')
        .option('--thread [thread]', 'Filter answers by thread root answer ID. Includes the root answer itself.')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/answers`;
            const query: Record<string, string> = {};
            if (options["question"] !== undefined) query['question'] = String(options["question"]);
            if (options["from"] !== undefined) query['from'] = String(options["from"]);
            if (options["to"] !== undefined) query['to'] = String(options["to"]);
            if (options["language"] !== undefined) query['language'] = String(options["language"]);
            if (options["answered"] !== undefined) query['answered'] = String(options["answered"]);
            if (options["helpfulness"] !== undefined) query['helpfulness'] = String(options["helpfulness"]);
            if (options["relevance"] !== undefined) query['relevance'] = String(options["relevance"]);
            if (options["channelType"] !== undefined) query['channelType'] = String(options["channelType"]);
            if (options["question.type"] !== undefined) query['question.type'] = String(options["question.type"]);
            if (options["topic"] !== undefined) query['topic'] = String(options["topic"]);
            if (options["thread"] !== undefined) query['thread'] = String(options["thread"]);
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_answersCmd
        .command('get <organizationId> <siteId> <siteQuestionAnswerId>')
        .description('Get a site answer by ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteQuestionAnswerId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/answers/${siteQuestionAnswerId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_answers_threadCmd = organizations_sites_answersCmd
        .command('thread')
        .description('Manage organizations sites answers thread');

    organizations_sites_answers_threadCmd
        .command('get <organizationId> <siteId> <siteQuestionAnswerId>')
        .description('Get a site answer thread by answer ID')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteQuestionAnswerId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/answers/${siteQuestionAnswerId}/thread`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_answers_sourcesCmd = organizations_sites_answersCmd
        .command('sources')
        .description('Manage organizations sites answers sources');

    organizations_sites_answers_sourcesCmd
        .command('list <organizationId> <siteId> <siteQuestionAnswerId>')
        .description('List the sources for an answer')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteQuestionAnswerId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/answers/${siteQuestionAnswerId}/sources`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_permissionsCmd = organizations_sitesCmd
        .command('permissions')
        .description('Manage organizations sites permissions');

    organizations_sites_permissionsCmd
        .command('invite <organizationId> <siteId>')
        .description('Invite a user or a team to a site')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/permissions`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_permissions_aggregateCmd = organizations_sites_permissionsCmd
        .command('aggregate')
        .description('Manage organizations sites permissions aggregate');

    organizations_sites_permissions_aggregateCmd
        .command('list <organizationId> <siteId>')
        .description('List all sites users permissions')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--order [order]', 'An order for the items in the list')
        .option('--role [role]', 'The role to filter the list by')
        .option('--search [search]', 'A query to filter the list by display name and email')
        .option('--sort [sort]', 'The property to sort the list by')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/permissions/aggregate`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["order"] !== undefined) query['order'] = String(options["order"]);
            if (options["role"] !== undefined) query['role'] = String(options["role"]);
            if (options["search"] !== undefined) query['search'] = String(options["search"]);
            if (options["sort"] !== undefined) query['sort'] = String(options["sort"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_permissions_usersCmd = organizations_sites_permissionsCmd
        .command('users')
        .description('Manage organizations sites permissions users');

    organizations_sites_permissions_usersCmd
        .command('list <organizationId> <siteId>')
        .description('List site user permissions')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/permissions/users`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_permissions_usersCmd
        .command('update <organizationId> <siteId> <userId>')
        .description('Update site user permissions')
        .option('--role <value>', '"The role of a member in an organization. "admin": Can administrate the content: create, delete spaces, ... "create": Can create content. "review": Can review content. "edit": Can edit the content (live or change requests). "comment": Can access the content and its discussions. "read": Can access the content, but cannot update it in any way.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/permissions/users/${userId}`;
            const body: Record<string, unknown> = {};
            if (options.role !== undefined) body['role'] = options.role;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_permissions_usersCmd
        .command('remove <organizationId> <siteId> <userId>')
        .description('Remove a site user')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, userId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/permissions/users/${userId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_permissions_teamsCmd = organizations_sites_permissionsCmd
        .command('teams')
        .description('Manage organizations sites permissions teams');

    organizations_sites_permissions_teamsCmd
        .command('list <organizationId> <siteId>')
        .description('List an org team\'s permission in a site')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/permissions/teams`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_permissions_teamsCmd
        .command('update <organizationId> <siteId> <teamId>')
        .description('Update an org team\'s permission in a site')
        .option('--role <value>', '"The role of a member in an organization. "admin": Can administrate the content: create, delete spaces, ... "create": Can create content. "review": Can review content. "edit": Can edit the content (live or change requests). "comment": Can access the content and its discussions. "read": Can access the content, but cannot update it in any way.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, teamId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/permissions/teams/${teamId}`;
            const body: Record<string, unknown> = {};
            if (options.role !== undefined) body['role'] = options.role;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_permissions_teamsCmd
        .command('remove <organizationId> <siteId> <teamId>')
        .description('Remove an org team from a site')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, teamId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/permissions/teams/${teamId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_aiCmd = organizations_sitesCmd
        .command('ai')
        .description('Manage organizations sites ai');

    const organizations_sites_ai_responseCmd = organizations_sites_aiCmd
        .command('response')
        .description('Manage organizations sites ai response');

    organizations_sites_ai_responseCmd
        .command('stream <organizationId> <siteId>')
        .description('Generate an AI response in a site')
        .option('--previousResponseId <value>', 'The ID of the previous response to continue from')
        .option('--input <value>', 'The messages to send to the AI agent. (required)')
        .option('--model <value>', '')
        .option('--tools <value>', 'Custom tools to provide to the AI agent.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/ai/response`;
            const body: Record<string, unknown> = {};
            if (options.previousResponseId !== undefined) body['previousResponseId'] = options.previousResponseId;
            if (options.input !== undefined) body['input'] = options.input;
            if (options.model !== undefined) body['model'] = options.model;
            if (options.tools !== undefined) body['tools'] = options.tools;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_agentSettingsCmd = organizations_sitesCmd
        .command('agent-settings')
        .description('Manage organizations sites agent-settings');

    organizations_sites_agentSettingsCmd
        .command('get <organizationId> <siteId>')
        .description('Get site agent settings')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/agent-settings`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_agentSettingsCmd
        .command('update <organizationId> <siteId>')
        .description('Update site agent settings')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/agent-settings`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_styleguideCmd = organizations_sitesCmd
        .command('styleguide')
        .description('Manage organizations sites styleguide');

    organizations_sites_styleguideCmd
        .command('create <organizationId> <siteId>')
        .description('Create or return a site\'s styleguide')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/styleguide`;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_styleguideCmd
        .command('delete <organizationId> <siteId>')
        .description('Delete a site\'s styleguide')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/styleguide`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_insightsCmd = organizations_sitesCmd
        .command('insights')
        .description('Manage organizations sites insights');

    const organizations_sites_insights_eventsCmd = organizations_sites_insightsCmd
        .command('events')
        .description('Manage organizations sites insights events');

    organizations_sites_insights_eventsCmd
        .command('track <organizationId> <siteId>')
        .description('Track site events')
        .option('--events <value>', '(required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/insights/events`;
            const body: Record<string, unknown> = {};
            if (options.events !== undefined) body['events'] = options.events;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_insights_eventsCmd
        .command('aggregate <organizationId> <siteId>')
        .description('Query site events')
        .option('--select <value>', '')
        .option('--where <value>', '')
        .option('--groupBy <value>', '')
        .option('--limit <value>', '')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/insights/events/aggregate`;
            const body: Record<string, unknown> = {};
            if (options.select !== undefined) body['select'] = options.select;
            if (options.where !== undefined) body['where'] = options.where;
            if (options.groupBy !== undefined) body['groupBy'] = options.groupBy;
            if (options.limit !== undefined) body['limit'] = options.limit;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_insights_visitorSegmentsCmd = organizations_sites_insightsCmd
        .command('visitor-segments')
        .description('Manage organizations sites insights visitor-segments');

    organizations_sites_insights_visitorSegmentsCmd
        .command('list <organizationId> <siteId>')
        .description('List a site visitor segments')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/insights/visitor-segments`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_adsCmd = organizations_sitesCmd
        .command('ads')
        .description('Manage organizations sites ads');

    organizations_sites_adsCmd
        .command('update <organizationId> <siteId>')
        .description('Update a site ads settings')
        .option('--status <value>', '')
        .option('--topic <value>', 'Topic of the content')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/ads`;
            const body: Record<string, unknown> = {};
            if (options.status !== undefined) body['status'] = options.status;
            if (options.topic !== undefined) body['topic'] = options.topic;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_redirectsCmd = organizations_sitesCmd
        .command('redirects')
        .description('Manage organizations sites redirects');

    organizations_sites_redirectsCmd
        .command('list <organizationId> <siteId>')
        .description('List all site redirects')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--search [search]', 'Search for a redirect by path')
        .option('--draft [draft]', 'Filter redirects by draft mode.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/redirects`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["search"] !== undefined) query['search'] = String(options["search"]);
            if (options["draft"] !== undefined) query['draft'] = String(options["draft"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_redirectsCmd
        .command('create <organizationId> <siteId>')
        .description('Create a site redirect')
        .option('--source <value>', 'The source path to redirect from. (required)')
        .option('--captureWildcard', 'Capture and append the wildcard-matched suffix to the destination URL.')
        .option('--draft', 'Whether the redirect is draft and not live.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/redirects`;
            const body: Record<string, unknown> = {};
            if (options.source !== undefined) body['source'] = options.source;
            if (options.captureWildcard !== undefined) body['captureWildcard'] = options.captureWildcard;
            if (options.draft !== undefined) body['draft'] = options.draft;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_redirectsCmd
        .command('replace <organizationId> <siteId>')
        .description('Create or update site redirects in bulk')
        .option('--redirects <value>', '(required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/redirects`;
            const body: Record<string, unknown> = {};
            if (options.redirects !== undefined) body['redirects'] = options.redirects;
            try {
                const response = await api.request({
                    path,
                    method: 'PUT',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_redirectsCmd
        .command('update <organizationId> <siteId> <siteRedirectId>')
        .description('Update a site redirect')
        .option('--source <value>', 'The source path to redirect from.')
        .option('--captureWildcard', 'Capture and append the wildcard-matched suffix to the destination URL.')
        .option('--draft', 'When true, it can be used to promote a draft redirect to live.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteRedirectId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/redirects/${siteRedirectId}`;
            const body: Record<string, unknown> = {};
            if (options.source !== undefined) body['source'] = options.source;
            if (options.captureWildcard !== undefined) body['captureWildcard'] = options.captureWildcard;
            if (options.draft !== undefined) body['draft'] = options.draft;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_redirectsCmd
        .command('delete <organizationId> <siteId> <siteRedirectId>')
        .description('Delete a site redirect')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteRedirectId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/redirects/${siteRedirectId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_redirectCmd = organizations_sitesCmd
        .command('redirect')
        .description('Manage organizations sites redirect');

    organizations_sites_redirectCmd
        .command('get <organizationId> <siteId>')
        .description('Get a site redirect by its source')
        .option('--shareKey [shareKey]', 'For sites published via share-links, the share key is useful to resolve published URLs.')
        .option('--source <source>', 'The source path of the redirect.')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/redirect`;
            const query: Record<string, string> = {};
            if (options["shareKey"] !== undefined) query['shareKey'] = String(options["shareKey"]);
            if (options["source"] !== undefined) query['source'] = String(options["source"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_mcpServersCmd = organizations_sitesCmd
        .command('mcp-servers')
        .description('Manage organizations sites mcp-servers');

    organizations_sites_mcpServersCmd
        .command('list <organizationId> <siteId>')
        .description('List all MCP servers for a site')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/mcp-servers`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_mcpServersCmd
        .command('create <organizationId> <siteId>')
        .description('Create a new MCP server')
        .option('--name <value>', 'Name of the MCP server (required)')
        .option('--url <value>', '(required)')
        .option('--transport <value>', 'Transport protocol used to connect to the MCP server')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/mcp-servers`;
            const body: Record<string, unknown> = {};
            if (options.name !== undefined) body['name'] = options.name;
            if (options.url !== undefined) body['url'] = options.url;
            if (options.transport !== undefined) body['transport'] = options.transport;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_mcpServersCmd
        .command('get <organizationId> <siteId> <siteMcpServerId>')
        .description('Get a site MCP server')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteMcpServerId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/mcp-servers/${siteMcpServerId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_mcpServersCmd
        .command('update <organizationId> <siteId> <siteMcpServerId>')
        .description('Update a site MCP server')
        .option('--name <value>', 'Name of the MCP server')
        .option('--url <value>', '')
        .option('--transport <value>', 'Transport protocol used to connect to the MCP server')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteMcpServerId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/mcp-servers/${siteMcpServerId}`;
            const body: Record<string, unknown> = {};
            if (options.name !== undefined) body['name'] = options.name;
            if (options.url !== undefined) body['url'] = options.url;
            if (options.transport !== undefined) body['transport'] = options.transport;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_mcpServersCmd
        .command('delete <organizationId> <siteId> <siteMcpServerId>')
        .description('Delete a site MCP server')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteMcpServerId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/mcp-servers/${siteMcpServerId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const organizations_sites_channelsCmd = organizations_sitesCmd
        .command('channels')
        .description('Manage organizations sites channels');

    organizations_sites_channelsCmd
        .command('list <organizationId> <siteId>')
        .description('List all site channels for a site')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/channels`;
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_channelsCmd
        .command('create <organizationId> <siteId>')
        .description('Create a site channel')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/channels`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_channelsCmd
        .command('get <organizationId> <siteId> <siteChannelId>')
        .description('Get a site channel')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteChannelId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/channels/${siteChannelId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_channelsCmd
        .command('update <organizationId> <siteId> <siteChannelId>')
        .description('Update a site channel')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteChannelId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/channels/${siteChannelId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    organizations_sites_channelsCmd
        .command('delete <organizationId> <siteId> <siteChannelId>')
        .description('Delete a site channel')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (organizationId, siteId, siteChannelId, options) => {
            const api = await getAPIClient(true);
            const path = `/orgs/${organizationId}/sites/${siteId}/channels/${siteChannelId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const subdomainsCmd = program
        .command('subdomains')
        .description('Manage subdomains');

    subdomainsCmd
        .command('get <subdomain>')
        .description('Get a subdomain')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (subdomain, options) => {
            const api = await getAPIClient(true);
            const path = `/subdomains/${subdomain}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const adsCmd = program
        .command('ads')
        .description('Manage ads');

    const ads_sitesCmd = adsCmd
        .command('sites')
        .description('Manage ads sites');

    ads_sitesCmd
        .command('list')
        .description('List all the sites with ads configured')
        .option('--page [page]', 'Identifier of the page results to fetch.')
        .option('--limit [limit]', 'The number of results per page')
        .option('--status [status]', 'Filter sites by their ads review status')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (options) => {
            const api = await getAPIClient(true);
            const path = '/ads/sites';
            const query: Record<string, string> = {};
            if (options["page"] !== undefined) query['page'] = String(options["page"]);
            if (options["limit"] !== undefined) query['limit'] = String(options["limit"]);
            if (options["status"] !== undefined) query['status'] = String(options["status"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    ads_sitesCmd
        .command('update <siteId>')
        .description('Update the Ads configuration for a site')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (siteId, options) => {
            const api = await getAPIClient(true);
            const path = `/ads/sites/${siteId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const urlsCmd = program
        .command('urls')
        .description('Manage urls');

    const urls_contentCmd = urlsCmd
        .command('content')
        .description('Manage urls content');

    urls_contentCmd
        .command('get')
        .description('Resolve a URL to a content (space, collection, page)')
        .option('--url <url>', 'URL to resolve')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (options) => {
            const api = await getAPIClient(true);
            const path = '/urls/content';
            const query: Record<string, string> = {};
            if (options["url"] !== undefined) query['url'] = String(options["url"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const urls_embedCmd = urlsCmd
        .command('embed')
        .description('Manage urls embed');

    urls_embedCmd
        .command('get')
        .description('Resolve a URL to an embed')
        .option('--url <url>', 'URL to resolve')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (options) => {
            const api = await getAPIClient(true);
            const path = '/urls/embed';
            const query: Record<string, string> = {};
            if (options["url"] !== undefined) query['url'] = String(options["url"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const urls_publishedCmd = urlsCmd
        .command('published')
        .description('Manage urls published');

    urls_publishedCmd
        .command('get')
        .description('Resolve a URL of a published content.')
        .option('--url <url>', 'URL to resolve')
        .option('--visitorAuthToken [visitorAuthToken]', 'JWT token generated for a authenticated access session')
        .option('--redirectOnError [redirectOnError]', 'When true redirects the user to the authentication/fallback URL if the access token is invalid')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (options) => {
            const api = await getAPIClient(true);
            const path = '/urls/published';
            const query: Record<string, string> = {};
            if (options["url"] !== undefined) query['url'] = String(options["url"]);
            if (options["visitorAuthToken"] !== undefined) query['visitorAuthToken'] = String(options["visitorAuthToken"]);
            if (options["redirectOnError"] !== undefined) query['redirectOnError'] = String(options["redirectOnError"]);
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                    query,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    urls_publishedCmd
        .command('resolve')
        .description('Resolve a URL of a published content.')
        .option('--url <value>', '(required)')
        .option('--redirectOnError', 'When true redirects the user to the authentication/fallback URL if the access token is invalid')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (options) => {
            const api = await getAPIClient(true);
            const path = '/urls/published';
            const body: Record<string, unknown> = {};
            if (options.url !== undefined) body['url'] = options.url;
            if (options.redirectOnError !== undefined) body['redirectOnError'] = options.redirectOnError;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const gitCmd = program
        .command('git')
        .description('Manage git');

    const git_installationsCmd = gitCmd
        .command('installations')
        .description('Manage git installations');

    git_installationsCmd
        .command('install')
        .description('Install a Git Sync provider on a target')
        .option('--provider <value>', 'The provider of the Git Sync installation. (required)')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (options) => {
            const api = await getAPIClient(true);
            const path = '/git/installations';
            const body: Record<string, unknown> = {};
            if (options.provider !== undefined) body['provider'] = options.provider;
            try {
                const response = await api.request({
                    path,
                    method: 'POST',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    git_installationsCmd
        .command('get <installationId>')
        .description('Get a Git Sync installation')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/git/installations/${installationId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    git_installationsCmd
        .command('update <installationId>')
        .description('Update a Git Sync installation configuration')
        .option('--body <json>', 'Request body as a JSON string')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/git/installations/${installationId}`;
            const body = options.body ? JSON.parse(options.body) : undefined;
            try {
                const response = await api.request({
                    path,
                    method: 'PATCH',
                    secure: true,
                    ...(body !== undefined ? { body, type: ContentType.Json } : {}),
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    git_installationsCmd
        .command('uninstall <installationId>')
        .description('Uninstall a Git Sync installation')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/git/installations/${installationId}`;
            try {
                const response = await api.request({
                    path,
                    method: 'DELETE',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const git_installations_githubCmd = git_installationsCmd
        .command('github')
        .description('Manage git installations github');

    const git_installations_github_reposCmd = git_installations_githubCmd
        .command('repos')
        .description('Manage git installations github repos');

    git_installations_github_reposCmd
        .command('list <installationId>')
        .description('List GitHub repositories available for a Git Sync installation')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/git/installations/${installationId}/github/repos`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const git_installations_github_repos_branchesCmd = git_installations_github_reposCmd
        .command('branches')
        .description('Manage git installations github repos branches');

    git_installations_github_repos_branchesCmd
        .command('list <installationId> <accountName> <repositoryName>')
        .description('List GitHub repository branches available for a Git Sync installation')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (installationId, accountName, repositoryName, options) => {
            const api = await getAPIClient(true);
            const path = `/git/installations/${installationId}/github/repos/${accountName}/${repositoryName}/branches`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const git_installations_gitlabCmd = git_installationsCmd
        .command('gitlab')
        .description('Manage git installations gitlab');

    const git_installations_gitlab_projectsCmd = git_installations_gitlabCmd
        .command('projects')
        .description('Manage git installations gitlab projects');

    git_installations_gitlab_projectsCmd
        .command('list <installationId>')
        .description('List GitLab projects available for a Git Sync installation')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (installationId, options) => {
            const api = await getAPIClient(true);
            const path = `/git/installations/${installationId}/gitlab/projects`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

    const git_installations_gitlab_projects_branchesCmd = git_installations_gitlab_projectsCmd
        .command('branches')
        .description('Manage git installations gitlab projects branches');

    git_installations_gitlab_projects_branchesCmd
        .command('list <installationId> <projectId>')
        .description('List GitLab project branches available for a Git Sync installation')
        .option('--json', 'Output as JSON (machine-readable)')
        .option('--yaml', 'Output as YAML (machine-readable)')
        .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
        .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
        .action(async (installationId, projectId, options) => {
            const api = await getAPIClient(true);
            const path = `/git/installations/${installationId}/gitlab/projects/${projectId}/branches`;
            try {
                const response = await api.request({
                    path,
                    method: 'GET',
                    secure: true,
                });
                if (response.status !== 204) {
                    const data = await response.json();
                    printResult(data, options);
                }
            } catch (error) {
                console.error((error as Error).message);
                process.exit(1);
            }
        });

}

// Shell completion scripts, generated from the command tree.
export const COMPLETIONS: Record<string, string> = {
    "bash": "# gitbook2 bash completion. Install: gitbook2 completion bash >> ~/.bashrc\n_gb2_children() {\n  case \"$1\" in\n    '/') echo 'system users spaces integrations collections organizations subdomains ads urls git auth whoami completion help' ;;\n    'system') echo 'info' ;;\n    'users') echo 'whoami get update' ;;\n    'spaces') echo 'get update delete duplicate restore move embed search git permissions content documents change-requests revisions comments commenters integration-blocks pdf links list create' ;;\n    'spaces embed') echo 'get' ;;\n    'spaces git') echo 'import export info' ;;\n    'spaces git info') echo 'get' ;;\n    'spaces permissions') echo 'invite teams users aggregate' ;;\n    'spaces permissions teams') echo 'update remove list' ;;\n    'spaces permissions users') echo 'list update remove' ;;\n    'spaces content') echo 'get template pages files page path reusable-contents computed' ;;\n    'spaces content template') echo 'apply' ;;\n    'spaces content pages') echo 'list' ;;\n    'spaces content files') echo 'list get backlinks' ;;\n    'spaces content files backlinks') echo 'list' ;;\n    'spaces content page') echo 'get links backlinks meta-links' ;;\n    'spaces content page links') echo 'list' ;;\n    'spaces content page backlinks') echo 'list' ;;\n    'spaces content page meta-links') echo 'list' ;;\n    'spaces content path') echo 'get' ;;\n    'spaces content reusable-contents') echo 'get' ;;\n    'spaces content computed') echo 'document revision' ;;\n    'spaces content computed document') echo 'get' ;;\n    'spaces content computed revision') echo 'get' ;;\n    'spaces documents') echo 'get' ;;\n    'spaces change-requests') echo 'list create get update merge pull-content reviews requested-reviewers conversations links comments contributors content changes pdf commenters' ;;\n    'spaces change-requests reviews') echo 'list submit get' ;;\n    'spaces change-requests requested-reviewers') echo 'list request remove' ;;\n    'spaces change-requests conversations') echo 'list update delete' ;;\n    'spaces change-requests links') echo 'list' ;;\n    'spaces change-requests comments') echo 'list post get update delete replies' ;;\n    'spaces change-requests comments replies') echo 'list post get update delete' ;;\n    'spaces change-requests contributors') echo 'get' ;;\n    'spaces change-requests content') echo 'get update pages files page reusable-contents path' ;;\n    'spaces change-requests content pages') echo 'list' ;;\n    'spaces change-requests content files') echo 'list get backlinks' ;;\n    'spaces change-requests content files backlinks') echo 'list' ;;\n    'spaces change-requests content page') echo 'get links backlinks meta-links' ;;\n    'spaces change-requests content page links') echo 'list' ;;\n    'spaces change-requests content page backlinks') echo 'list' ;;\n    'spaces change-requests content page meta-links') echo 'list' ;;\n    'spaces change-requests content reusable-contents') echo 'get' ;;\n    'spaces change-requests changes') echo 'get' ;;\n    'spaces change-requests pdf') echo 'get' ;;\n    'spaces revisions') echo 'get changes pages files page path reusable-contents' ;;\n    'spaces revisions changes') echo 'get' ;;\n    'spaces revisions pages') echo 'list' ;;\n    'spaces revisions files') echo 'list get' ;;\n    'spaces revisions page') echo 'get document meta-links' ;;\n    'spaces revisions page document') echo 'get' ;;\n    'spaces revisions path') echo 'get' ;;\n    'spaces revisions page meta-links') echo 'list' ;;\n    'spaces change-requests content path') echo 'get' ;;\n    'spaces revisions reusable-contents') echo 'get document' ;;\n    'spaces revisions reusable-contents document') echo 'get' ;;\n    'spaces comments') echo 'list post get update delete replies' ;;\n    'spaces comments replies') echo 'list post get update delete' ;;\n    'spaces commenters') echo 'list' ;;\n    'spaces change-requests commenters') echo 'list' ;;\n    'spaces permissions aggregate') echo 'list' ;;\n    'integrations') echo 'list get publish unpublish installations events sites dev tasks' ;;\n    'spaces integration-blocks') echo 'list' ;;\n    'spaces pdf') echo 'get' ;;\n    'spaces links') echo 'list' ;;\n    'collections') echo 'get update delete move transfer permissions list create' ;;\n    'collections permissions') echo 'invite teams users aggregate' ;;\n    'collections permissions teams') echo 'list update remove' ;;\n    'collections permissions users') echo 'list update remove' ;;\n    'collections permissions aggregate') echo 'list' ;;\n    'integrations installations') echo 'list install get update uninstall tokens spaces sites' ;;\n    'integrations events') echo 'list get' ;;\n    'integrations sites') echo 'list' ;;\n    'integrations dev') echo 'set disable' ;;\n    'integrations tasks') echo 'queue' ;;\n    'integrations installations tokens') echo 'create' ;;\n    'integrations installations spaces') echo 'install get update uninstall' ;;\n    'integrations installations sites') echo 'list install get update uninstall' ;;\n    'organizations') echo 'list get update members ping teams invites link-invites join search change-requests integrations installations saml sso ask openapi agent-instructions translations translations-glossary imports sites' ;;\n    'organizations members') echo 'list get update remove sso teams' ;;\n    'organizations ping') echo 'update' ;;\n    'organizations members sso') echo 'set' ;;\n    'organizations members teams') echo 'list' ;;\n    'organizations teams') echo 'list create get update remove members' ;;\n    'organizations teams members') echo 'list update add delete' ;;\n    'organizations invites') echo 'invite join' ;;\n    'organizations link-invites') echo 'list create get update delete' ;;\n    'organizations change-requests') echo 'list' ;;\n    'organizations integrations') echo 'installation_status installations-status' ;;\n    'organizations integrations installation_status') echo 'get' ;;\n    'organizations installations') echo 'list' ;;\n    'organizations integrations installations-status') echo 'list' ;;\n    'organizations saml') echo 'list create get update delete' ;;\n    'organizations sso') echo 'list' ;;\n    'organizations ask') echo 'create questions stream' ;;\n    'organizations ask questions') echo 'list stream' ;;\n    'organizations openapi') echo 'list create get set update delete versions' ;;\n    'organizations openapi versions') echo 'list latest get content' ;;\n    'organizations openapi versions latest') echo 'get content' ;;\n    'organizations openapi versions latest content') echo 'get' ;;\n    'organizations openapi versions content') echo 'get' ;;\n    'organizations agent-instructions') echo 'get update' ;;\n    'organizations translations') echo 'list create get update delete run' ;;\n    'organizations translations-glossary') echo 'list update get' ;;\n    'organizations imports') echo 'start cancel' ;;\n    'organizations sites') echo 'list create get update delete spaces adaptive-schema published publish unpublish share-links structure publishing customization integration-scripts site-spaces section-groups sections search ask context-records scans findings context-connections topics questions question-stats answers permissions ai agent-settings styleguide insights ads redirects redirect mcp-servers channels' ;;\n    'organizations sites spaces') echo 'git' ;;\n    'organizations sites spaces git') echo 'installations' ;;\n    'organizations sites spaces git installations') echo 'list' ;;\n    'organizations sites adaptive-schema') echo 'get update template-conditions' ;;\n    'organizations sites adaptive-schema template-conditions') echo 'list' ;;\n    'organizations sites published') echo 'get' ;;\n    'organizations sites share-links') echo 'list create update delete' ;;\n    'organizations sites structure') echo 'get sort' ;;\n    'organizations sites publishing') echo 'auth preview' ;;\n    'organizations sites publishing auth') echo 'get update regenerate' ;;\n    'organizations sites publishing preview') echo 'get' ;;\n    'organizations sites customization') echo 'get update' ;;\n    'organizations sites integration-scripts') echo 'list' ;;\n    'organizations sites site-spaces') echo 'list add update delete customization move' ;;\n    'organizations sites section-groups') echo 'list add update delete move' ;;\n    'organizations sites sections') echo 'list add update delete move' ;;\n    'organizations sites ask') echo 'stream questions' ;;\n    'organizations sites ask questions') echo 'stream' ;;\n    'organizations sites context-records') echo 'list upsert get' ;;\n    'organizations sites scans') echo 'list create get' ;;\n    'organizations sites findings') echo 'list get update change-requests pages questions records' ;;\n    'organizations sites findings change-requests') echo 'list trigger' ;;\n    'organizations sites findings pages') echo 'list' ;;\n    'organizations sites findings questions') echo 'list' ;;\n    'organizations sites findings records') echo 'list' ;;\n    'organizations sites context-connections') echo 'list create get update delete sync' ;;\n    'organizations sites topics') echo 'list get update findings' ;;\n    'organizations sites topics findings') echo 'delete' ;;\n    'organizations sites questions') echo 'list get sources' ;;\n    'organizations sites questions sources') echo 'list' ;;\n    'organizations sites question-stats') echo 'get' ;;\n    'organizations sites answers') echo 'list get thread sources' ;;\n    'organizations sites answers thread') echo 'get' ;;\n    'organizations sites answers sources') echo 'list' ;;\n    'organizations sites site-spaces customization') echo 'get override delete' ;;\n    'organizations sites permissions') echo 'invite aggregate users teams' ;;\n    'organizations sites permissions aggregate') echo 'list' ;;\n    'organizations sites permissions users') echo 'list update remove' ;;\n    'organizations sites permissions teams') echo 'list update remove' ;;\n    'organizations sites ai') echo 'response' ;;\n    'organizations sites ai response') echo 'stream' ;;\n    'organizations sites agent-settings') echo 'get update' ;;\n    'organizations sites styleguide') echo 'create delete' ;;\n    'organizations sites insights') echo 'events visitor-segments' ;;\n    'organizations sites insights events') echo 'track aggregate' ;;\n    'organizations sites insights visitor-segments') echo 'list' ;;\n    'organizations sites ads') echo 'update' ;;\n    'organizations sites redirects') echo 'list create replace update delete' ;;\n    'organizations sites redirect') echo 'get' ;;\n    'organizations sites mcp-servers') echo 'list create get update delete' ;;\n    'organizations sites channels') echo 'list create get update delete' ;;\n    'subdomains') echo 'get' ;;\n    'ads') echo 'sites' ;;\n    'ads sites') echo 'list update' ;;\n    'urls') echo 'content embed published' ;;\n    'urls content') echo 'get' ;;\n    'urls embed') echo 'get' ;;\n    'urls published') echo 'get resolve' ;;\n    'git') echo 'installations' ;;\n    'git installations') echo 'install get update uninstall github gitlab' ;;\n    'git installations github') echo 'repos' ;;\n    'git installations github repos') echo 'list branches' ;;\n    'git installations github repos branches') echo 'list' ;;\n    'git installations gitlab') echo 'projects' ;;\n    'git installations gitlab projects') echo 'list branches' ;;\n    'git installations gitlab projects branches') echo 'list' ;;\n    *) echo '' ;;\n  esac\n}\n_gitbook2_complete() {\n  local cur key next i token\n  key=\"/\"\n  for ((i=1; i<COMP_CWORD; i++)); do\n    token=\"${COMP_WORDS[i]}\"\n    [[ \"$token\" == -* ]] && continue\n    if [[ \"$key\" == \"/\" ]]; then next=\"$token\"; else next=\"$key $token\"; fi\n    if [[ -n \"$(_gb2_children \"$next\")\" ]]; then key=\"$next\"; fi\n  done\n  cur=\"${COMP_WORDS[COMP_CWORD]}\"\n  COMPREPLY=( $(compgen -W \"$(_gb2_children \"$key\")\" -- \"$cur\") )\n}\ncomplete -F _gitbook2_complete gitbook2\n",
    "zsh": "# gitbook2 zsh completion. Install: gitbook2 completion zsh >> ~/.zshrc\n# Initialise the completion system if the host shell hasn't already.\nif ! whence compdef >/dev/null 2>&1; then autoload -Uz compinit && compinit; fi\nautoload -U +X bashcompinit && bashcompinit\n# gitbook2 bash completion. Install: gitbook2 completion bash >> ~/.bashrc\n_gb2_children() {\n  case \"$1\" in\n    '/') echo 'system users spaces integrations collections organizations subdomains ads urls git auth whoami completion help' ;;\n    'system') echo 'info' ;;\n    'users') echo 'whoami get update' ;;\n    'spaces') echo 'get update delete duplicate restore move embed search git permissions content documents change-requests revisions comments commenters integration-blocks pdf links list create' ;;\n    'spaces embed') echo 'get' ;;\n    'spaces git') echo 'import export info' ;;\n    'spaces git info') echo 'get' ;;\n    'spaces permissions') echo 'invite teams users aggregate' ;;\n    'spaces permissions teams') echo 'update remove list' ;;\n    'spaces permissions users') echo 'list update remove' ;;\n    'spaces content') echo 'get template pages files page path reusable-contents computed' ;;\n    'spaces content template') echo 'apply' ;;\n    'spaces content pages') echo 'list' ;;\n    'spaces content files') echo 'list get backlinks' ;;\n    'spaces content files backlinks') echo 'list' ;;\n    'spaces content page') echo 'get links backlinks meta-links' ;;\n    'spaces content page links') echo 'list' ;;\n    'spaces content page backlinks') echo 'list' ;;\n    'spaces content page meta-links') echo 'list' ;;\n    'spaces content path') echo 'get' ;;\n    'spaces content reusable-contents') echo 'get' ;;\n    'spaces content computed') echo 'document revision' ;;\n    'spaces content computed document') echo 'get' ;;\n    'spaces content computed revision') echo 'get' ;;\n    'spaces documents') echo 'get' ;;\n    'spaces change-requests') echo 'list create get update merge pull-content reviews requested-reviewers conversations links comments contributors content changes pdf commenters' ;;\n    'spaces change-requests reviews') echo 'list submit get' ;;\n    'spaces change-requests requested-reviewers') echo 'list request remove' ;;\n    'spaces change-requests conversations') echo 'list update delete' ;;\n    'spaces change-requests links') echo 'list' ;;\n    'spaces change-requests comments') echo 'list post get update delete replies' ;;\n    'spaces change-requests comments replies') echo 'list post get update delete' ;;\n    'spaces change-requests contributors') echo 'get' ;;\n    'spaces change-requests content') echo 'get update pages files page reusable-contents path' ;;\n    'spaces change-requests content pages') echo 'list' ;;\n    'spaces change-requests content files') echo 'list get backlinks' ;;\n    'spaces change-requests content files backlinks') echo 'list' ;;\n    'spaces change-requests content page') echo 'get links backlinks meta-links' ;;\n    'spaces change-requests content page links') echo 'list' ;;\n    'spaces change-requests content page backlinks') echo 'list' ;;\n    'spaces change-requests content page meta-links') echo 'list' ;;\n    'spaces change-requests content reusable-contents') echo 'get' ;;\n    'spaces change-requests changes') echo 'get' ;;\n    'spaces change-requests pdf') echo 'get' ;;\n    'spaces revisions') echo 'get changes pages files page path reusable-contents' ;;\n    'spaces revisions changes') echo 'get' ;;\n    'spaces revisions pages') echo 'list' ;;\n    'spaces revisions files') echo 'list get' ;;\n    'spaces revisions page') echo 'get document meta-links' ;;\n    'spaces revisions page document') echo 'get' ;;\n    'spaces revisions path') echo 'get' ;;\n    'spaces revisions page meta-links') echo 'list' ;;\n    'spaces change-requests content path') echo 'get' ;;\n    'spaces revisions reusable-contents') echo 'get document' ;;\n    'spaces revisions reusable-contents document') echo 'get' ;;\n    'spaces comments') echo 'list post get update delete replies' ;;\n    'spaces comments replies') echo 'list post get update delete' ;;\n    'spaces commenters') echo 'list' ;;\n    'spaces change-requests commenters') echo 'list' ;;\n    'spaces permissions aggregate') echo 'list' ;;\n    'integrations') echo 'list get publish unpublish installations events sites dev tasks' ;;\n    'spaces integration-blocks') echo 'list' ;;\n    'spaces pdf') echo 'get' ;;\n    'spaces links') echo 'list' ;;\n    'collections') echo 'get update delete move transfer permissions list create' ;;\n    'collections permissions') echo 'invite teams users aggregate' ;;\n    'collections permissions teams') echo 'list update remove' ;;\n    'collections permissions users') echo 'list update remove' ;;\n    'collections permissions aggregate') echo 'list' ;;\n    'integrations installations') echo 'list install get update uninstall tokens spaces sites' ;;\n    'integrations events') echo 'list get' ;;\n    'integrations sites') echo 'list' ;;\n    'integrations dev') echo 'set disable' ;;\n    'integrations tasks') echo 'queue' ;;\n    'integrations installations tokens') echo 'create' ;;\n    'integrations installations spaces') echo 'install get update uninstall' ;;\n    'integrations installations sites') echo 'list install get update uninstall' ;;\n    'organizations') echo 'list get update members ping teams invites link-invites join search change-requests integrations installations saml sso ask openapi agent-instructions translations translations-glossary imports sites' ;;\n    'organizations members') echo 'list get update remove sso teams' ;;\n    'organizations ping') echo 'update' ;;\n    'organizations members sso') echo 'set' ;;\n    'organizations members teams') echo 'list' ;;\n    'organizations teams') echo 'list create get update remove members' ;;\n    'organizations teams members') echo 'list update add delete' ;;\n    'organizations invites') echo 'invite join' ;;\n    'organizations link-invites') echo 'list create get update delete' ;;\n    'organizations change-requests') echo 'list' ;;\n    'organizations integrations') echo 'installation_status installations-status' ;;\n    'organizations integrations installation_status') echo 'get' ;;\n    'organizations installations') echo 'list' ;;\n    'organizations integrations installations-status') echo 'list' ;;\n    'organizations saml') echo 'list create get update delete' ;;\n    'organizations sso') echo 'list' ;;\n    'organizations ask') echo 'create questions stream' ;;\n    'organizations ask questions') echo 'list stream' ;;\n    'organizations openapi') echo 'list create get set update delete versions' ;;\n    'organizations openapi versions') echo 'list latest get content' ;;\n    'organizations openapi versions latest') echo 'get content' ;;\n    'organizations openapi versions latest content') echo 'get' ;;\n    'organizations openapi versions content') echo 'get' ;;\n    'organizations agent-instructions') echo 'get update' ;;\n    'organizations translations') echo 'list create get update delete run' ;;\n    'organizations translations-glossary') echo 'list update get' ;;\n    'organizations imports') echo 'start cancel' ;;\n    'organizations sites') echo 'list create get update delete spaces adaptive-schema published publish unpublish share-links structure publishing customization integration-scripts site-spaces section-groups sections search ask context-records scans findings context-connections topics questions question-stats answers permissions ai agent-settings styleguide insights ads redirects redirect mcp-servers channels' ;;\n    'organizations sites spaces') echo 'git' ;;\n    'organizations sites spaces git') echo 'installations' ;;\n    'organizations sites spaces git installations') echo 'list' ;;\n    'organizations sites adaptive-schema') echo 'get update template-conditions' ;;\n    'organizations sites adaptive-schema template-conditions') echo 'list' ;;\n    'organizations sites published') echo 'get' ;;\n    'organizations sites share-links') echo 'list create update delete' ;;\n    'organizations sites structure') echo 'get sort' ;;\n    'organizations sites publishing') echo 'auth preview' ;;\n    'organizations sites publishing auth') echo 'get update regenerate' ;;\n    'organizations sites publishing preview') echo 'get' ;;\n    'organizations sites customization') echo 'get update' ;;\n    'organizations sites integration-scripts') echo 'list' ;;\n    'organizations sites site-spaces') echo 'list add update delete customization move' ;;\n    'organizations sites section-groups') echo 'list add update delete move' ;;\n    'organizations sites sections') echo 'list add update delete move' ;;\n    'organizations sites ask') echo 'stream questions' ;;\n    'organizations sites ask questions') echo 'stream' ;;\n    'organizations sites context-records') echo 'list upsert get' ;;\n    'organizations sites scans') echo 'list create get' ;;\n    'organizations sites findings') echo 'list get update change-requests pages questions records' ;;\n    'organizations sites findings change-requests') echo 'list trigger' ;;\n    'organizations sites findings pages') echo 'list' ;;\n    'organizations sites findings questions') echo 'list' ;;\n    'organizations sites findings records') echo 'list' ;;\n    'organizations sites context-connections') echo 'list create get update delete sync' ;;\n    'organizations sites topics') echo 'list get update findings' ;;\n    'organizations sites topics findings') echo 'delete' ;;\n    'organizations sites questions') echo 'list get sources' ;;\n    'organizations sites questions sources') echo 'list' ;;\n    'organizations sites question-stats') echo 'get' ;;\n    'organizations sites answers') echo 'list get thread sources' ;;\n    'organizations sites answers thread') echo 'get' ;;\n    'organizations sites answers sources') echo 'list' ;;\n    'organizations sites site-spaces customization') echo 'get override delete' ;;\n    'organizations sites permissions') echo 'invite aggregate users teams' ;;\n    'organizations sites permissions aggregate') echo 'list' ;;\n    'organizations sites permissions users') echo 'list update remove' ;;\n    'organizations sites permissions teams') echo 'list update remove' ;;\n    'organizations sites ai') echo 'response' ;;\n    'organizations sites ai response') echo 'stream' ;;\n    'organizations sites agent-settings') echo 'get update' ;;\n    'organizations sites styleguide') echo 'create delete' ;;\n    'organizations sites insights') echo 'events visitor-segments' ;;\n    'organizations sites insights events') echo 'track aggregate' ;;\n    'organizations sites insights visitor-segments') echo 'list' ;;\n    'organizations sites ads') echo 'update' ;;\n    'organizations sites redirects') echo 'list create replace update delete' ;;\n    'organizations sites redirect') echo 'get' ;;\n    'organizations sites mcp-servers') echo 'list create get update delete' ;;\n    'organizations sites channels') echo 'list create get update delete' ;;\n    'subdomains') echo 'get' ;;\n    'ads') echo 'sites' ;;\n    'ads sites') echo 'list update' ;;\n    'urls') echo 'content embed published' ;;\n    'urls content') echo 'get' ;;\n    'urls embed') echo 'get' ;;\n    'urls published') echo 'get resolve' ;;\n    'git') echo 'installations' ;;\n    'git installations') echo 'install get update uninstall github gitlab' ;;\n    'git installations github') echo 'repos' ;;\n    'git installations github repos') echo 'list branches' ;;\n    'git installations github repos branches') echo 'list' ;;\n    'git installations gitlab') echo 'projects' ;;\n    'git installations gitlab projects') echo 'list branches' ;;\n    'git installations gitlab projects branches') echo 'list' ;;\n    *) echo '' ;;\n  esac\n}\n_gitbook2_complete() {\n  local cur key next i token\n  key=\"/\"\n  for ((i=1; i<COMP_CWORD; i++)); do\n    token=\"${COMP_WORDS[i]}\"\n    [[ \"$token\" == -* ]] && continue\n    if [[ \"$key\" == \"/\" ]]; then next=\"$token\"; else next=\"$key $token\"; fi\n    if [[ -n \"$(_gb2_children \"$next\")\" ]]; then key=\"$next\"; fi\n  done\n  cur=\"${COMP_WORDS[COMP_CWORD]}\"\n  COMPREPLY=( $(compgen -W \"$(_gb2_children \"$key\")\" -- \"$cur\") )\n}\ncomplete -F _gitbook2_complete gitbook2\n",
    "fish": "# gitbook2 fish completion. Install: gitbook2 completion fish > ~/.config/fish/completions/gitbook2.fish\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'system'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'users'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'spaces'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'integrations'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'collections'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'organizations'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'subdomains'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'ads'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'urls'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'git'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'auth'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'whoami'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'completion'\ncomplete -c gitbook2 -n 'test (count (commandline -opc)) -eq 1' -f -a 'help'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from system' -f -a 'info'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from users' -f -a 'whoami'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from users' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from users' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'duplicate'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'restore'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'move'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'embed'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'search'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'git'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'permissions'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'content'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'documents'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'change-requests'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'revisions'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'comments'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'commenters'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'integration-blocks'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'pdf'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'links'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces embed' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces git' -f -a 'import'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces git' -f -a 'export'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces git' -f -a 'info'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces git info' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces permissions' -f -a 'invite'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces permissions' -f -a 'teams'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces permissions' -f -a 'users'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces permissions' -f -a 'aggregate'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces permissions teams' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces permissions teams' -f -a 'remove'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces permissions teams' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces permissions users' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces permissions users' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces permissions users' -f -a 'remove'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content' -f -a 'template'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content' -f -a 'pages'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content' -f -a 'files'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content' -f -a 'page'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content' -f -a 'path'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content' -f -a 'reusable-contents'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content' -f -a 'computed'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content template' -f -a 'apply'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content pages' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content files' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content files' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content files' -f -a 'backlinks'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content files backlinks' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content page' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content page' -f -a 'links'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content page' -f -a 'backlinks'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content page' -f -a 'meta-links'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content page links' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content page backlinks' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content page meta-links' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content path' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content reusable-contents' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content computed' -f -a 'document'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content computed' -f -a 'revision'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content computed document' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces content computed revision' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces documents' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'merge'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'pull-content'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'reviews'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'requested-reviewers'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'conversations'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'links'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'comments'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'contributors'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'content'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'changes'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'pdf'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests' -f -a 'commenters'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests reviews' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests reviews' -f -a 'submit'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests reviews' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests requested-reviewers' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests requested-reviewers' -f -a 'request'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests requested-reviewers' -f -a 'remove'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests conversations' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests conversations' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests conversations' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests links' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests comments' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests comments' -f -a 'post'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests comments' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests comments' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests comments' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests comments' -f -a 'replies'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests comments replies' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests comments replies' -f -a 'post'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests comments replies' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests comments replies' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests comments replies' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests contributors' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content' -f -a 'pages'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content' -f -a 'files'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content' -f -a 'page'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content' -f -a 'reusable-contents'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content' -f -a 'path'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content pages' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content files' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content files' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content files' -f -a 'backlinks'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content files backlinks' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content page' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content page' -f -a 'links'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content page' -f -a 'backlinks'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content page' -f -a 'meta-links'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content page links' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content page backlinks' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content page meta-links' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content reusable-contents' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests changes' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests pdf' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions' -f -a 'changes'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions' -f -a 'pages'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions' -f -a 'files'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions' -f -a 'page'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions' -f -a 'path'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions' -f -a 'reusable-contents'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions changes' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions pages' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions files' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions files' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions page' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions page' -f -a 'document'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions page' -f -a 'meta-links'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions page document' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions path' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions page meta-links' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests content path' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions reusable-contents' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions reusable-contents' -f -a 'document'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces revisions reusable-contents document' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces comments' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces comments' -f -a 'post'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces comments' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces comments' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces comments' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces comments' -f -a 'replies'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces comments replies' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces comments replies' -f -a 'post'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces comments replies' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces comments replies' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces comments replies' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces commenters' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces change-requests commenters' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces permissions aggregate' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations' -f -a 'publish'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations' -f -a 'unpublish'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations' -f -a 'installations'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations' -f -a 'events'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations' -f -a 'sites'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations' -f -a 'dev'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations' -f -a 'tasks'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces integration-blocks' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces pdf' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from spaces links' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections' -f -a 'move'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections' -f -a 'transfer'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections' -f -a 'permissions'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections permissions' -f -a 'invite'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections permissions' -f -a 'teams'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections permissions' -f -a 'users'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections permissions' -f -a 'aggregate'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections permissions teams' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections permissions teams' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections permissions teams' -f -a 'remove'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections permissions users' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections permissions users' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections permissions users' -f -a 'remove'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from collections permissions aggregate' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations' -f -a 'install'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations' -f -a 'uninstall'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations' -f -a 'tokens'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations' -f -a 'spaces'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations' -f -a 'sites'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations events' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations events' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations sites' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations dev' -f -a 'set'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations dev' -f -a 'disable'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations tasks' -f -a 'queue'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations tokens' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations spaces' -f -a 'install'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations spaces' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations spaces' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations spaces' -f -a 'uninstall'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations sites' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations sites' -f -a 'install'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations sites' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations sites' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from integrations installations sites' -f -a 'uninstall'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'members'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'ping'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'teams'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'invites'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'link-invites'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'join'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'search'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'change-requests'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'integrations'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'installations'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'saml'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'sso'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'ask'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'openapi'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'agent-instructions'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'translations'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'translations-glossary'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'imports'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations' -f -a 'sites'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations members' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations members' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations members' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations members' -f -a 'remove'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations members' -f -a 'sso'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations members' -f -a 'teams'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations ping' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations members sso' -f -a 'set'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations members teams' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations teams' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations teams' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations teams' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations teams' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations teams' -f -a 'remove'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations teams' -f -a 'members'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations teams members' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations teams members' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations teams members' -f -a 'add'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations teams members' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations invites' -f -a 'invite'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations invites' -f -a 'join'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations link-invites' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations link-invites' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations link-invites' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations link-invites' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations link-invites' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations change-requests' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations integrations' -f -a 'installation_status'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations integrations' -f -a 'installations-status'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations integrations installation_status' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations installations' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations integrations installations-status' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations saml' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations saml' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations saml' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations saml' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations saml' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sso' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations ask' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations ask' -f -a 'questions'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations ask' -f -a 'stream'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations ask questions' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations ask questions' -f -a 'stream'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi' -f -a 'set'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi' -f -a 'versions'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi versions' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi versions' -f -a 'latest'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi versions' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi versions' -f -a 'content'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi versions latest' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi versions latest' -f -a 'content'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi versions latest content' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations openapi versions content' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations agent-instructions' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations agent-instructions' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations translations' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations translations' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations translations' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations translations' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations translations' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations translations' -f -a 'run'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations translations-glossary' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations translations-glossary' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations translations-glossary' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations imports' -f -a 'start'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations imports' -f -a 'cancel'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'spaces'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'adaptive-schema'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'published'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'publish'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'unpublish'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'share-links'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'structure'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'publishing'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'customization'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'integration-scripts'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'site-spaces'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'section-groups'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'sections'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'search'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'ask'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'context-records'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'scans'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'findings'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'context-connections'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'topics'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'questions'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'question-stats'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'answers'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'permissions'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'ai'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'agent-settings'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'styleguide'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'insights'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'ads'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'redirects'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'redirect'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'mcp-servers'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites' -f -a 'channels'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites spaces' -f -a 'git'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites spaces git' -f -a 'installations'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites spaces git installations' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites adaptive-schema' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites adaptive-schema' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites adaptive-schema' -f -a 'template-conditions'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites adaptive-schema template-conditions' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites published' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites share-links' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites share-links' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites share-links' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites share-links' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites structure' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites structure' -f -a 'sort'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites publishing' -f -a 'auth'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites publishing' -f -a 'preview'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites publishing auth' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites publishing auth' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites publishing auth' -f -a 'regenerate'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites publishing preview' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites customization' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites customization' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites integration-scripts' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites site-spaces' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites site-spaces' -f -a 'add'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites site-spaces' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites site-spaces' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites site-spaces' -f -a 'customization'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites site-spaces' -f -a 'move'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites section-groups' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites section-groups' -f -a 'add'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites section-groups' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites section-groups' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites section-groups' -f -a 'move'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites sections' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites sections' -f -a 'add'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites sections' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites sections' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites sections' -f -a 'move'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites ask' -f -a 'stream'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites ask' -f -a 'questions'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites ask questions' -f -a 'stream'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites context-records' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites context-records' -f -a 'upsert'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites context-records' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites scans' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites scans' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites scans' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings' -f -a 'change-requests'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings' -f -a 'pages'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings' -f -a 'questions'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings' -f -a 'records'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings change-requests' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings change-requests' -f -a 'trigger'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings pages' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings questions' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites findings records' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites context-connections' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites context-connections' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites context-connections' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites context-connections' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites context-connections' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites context-connections' -f -a 'sync'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites topics' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites topics' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites topics' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites topics' -f -a 'findings'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites topics findings' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites questions' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites questions' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites questions' -f -a 'sources'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites questions sources' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites question-stats' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites answers' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites answers' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites answers' -f -a 'thread'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites answers' -f -a 'sources'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites answers thread' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites answers sources' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites site-spaces customization' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites site-spaces customization' -f -a 'override'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites site-spaces customization' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites permissions' -f -a 'invite'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites permissions' -f -a 'aggregate'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites permissions' -f -a 'users'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites permissions' -f -a 'teams'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites permissions aggregate' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites permissions users' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites permissions users' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites permissions users' -f -a 'remove'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites permissions teams' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites permissions teams' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites permissions teams' -f -a 'remove'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites ai' -f -a 'response'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites ai response' -f -a 'stream'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites agent-settings' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites agent-settings' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites styleguide' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites styleguide' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites insights' -f -a 'events'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites insights' -f -a 'visitor-segments'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites insights events' -f -a 'track'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites insights events' -f -a 'aggregate'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites insights visitor-segments' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites ads' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites redirects' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites redirects' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites redirects' -f -a 'replace'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites redirects' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites redirects' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites redirect' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites mcp-servers' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites mcp-servers' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites mcp-servers' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites mcp-servers' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites mcp-servers' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites channels' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites channels' -f -a 'create'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites channels' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites channels' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from organizations sites channels' -f -a 'delete'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from subdomains' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from ads' -f -a 'sites'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from ads sites' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from ads sites' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from urls' -f -a 'content'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from urls' -f -a 'embed'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from urls' -f -a 'published'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from urls content' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from urls embed' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from urls published' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from urls published' -f -a 'resolve'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git' -f -a 'installations'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations' -f -a 'install'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations' -f -a 'get'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations' -f -a 'update'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations' -f -a 'uninstall'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations' -f -a 'github'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations' -f -a 'gitlab'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations github' -f -a 'repos'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations github repos' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations github repos' -f -a 'branches'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations github repos branches' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations gitlab' -f -a 'projects'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations gitlab projects' -f -a 'list'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations gitlab projects' -f -a 'branches'\ncomplete -c gitbook2 -n '__fish_seen_subcommand_from git installations gitlab projects branches' -f -a 'list'\n"
};
