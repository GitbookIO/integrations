import { extractLinearIssueIdFromLink, getLinearAPIClient } from './linear';
import { LinearRuntimeContext } from './types';

/**
 * Index all issues in an account.
 */
export async function indexAccount(context: LinearRuntimeContext) {
    const { environment } = context;
    const configuration = environment.installation?.configuration;
    const linearClient = await getLinearAPIClient(configuration);

    const result = await linearClient.issues();
    const issues = result?.issues?.nodes;

    const entities = issues.map(issue => ({
        entityId: issue.id,
        properties: {
            identifier: issue.identifier,
            number: issue.number,
            title: issue.title,
            description: issue.description || '',
            workflow_state: issue.state.name,
            created_at: issue.createdAt,
            url: issue.url,
        }
    }))

    await indexEntities(context, 'linear:issue', entities);
    
    return entities;
}


async function indexEntities(
    context: LinearRuntimeContext,
    entityType: string,
    entities: Array<{
        entityId: string;
        properties: Record<string, any>;
    }>
) {
    await context.api.request({
        path: `/orgs/${context.environment.installation.target.organization}/schemas/${entityType}/entities`,
        secure: true,
        method: 'PUT',
        format: 'json',
        type: 'application/json',
        body: {
            entities,
        },
    });
}

