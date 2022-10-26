/**
 * Returns the accessible Jira resources.
 * https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#4--check-site-access-for-the-app
 */
export async function getJIRASites(accessToken: string): Promise<AccessibleResource[]> {
    const resp = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
        },
    });

    if (!resp.ok) {
        throw new Error(`Could not fetch JIRA sites ${resp.status} ${resp.statusText}`);
    }

    const resources = (await resp.json()) as AccessibleResourcesResponse;

    // Find the JIRA sites and store their IDs and URLs.
    const sites = resources.filter((resource) =>
        resource.scopes.find((scope) => scope.includes('jira'))
    );

    return sites;
}

/**
 * Gets the Jira Issue for the given ID/key.
 * https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get
 */
export async function getJIRAIssue(
    issueIdOrKey: string,
    options: {
        site: string;
        accessToken: string;
    }
): Promise<JiraIssue> {
    const resp = await fetch(
        `https://api.atlassian.com/ex/jira/${options.site}/rest/api/3/issue/${issueIdOrKey}`,
        {
            headers: {
                Authorization: `Bearer ${options.accessToken}`,
                Accept: 'application/json',
            },
        }
    );

    const issue = (await resp.json()) as JiraIssue;
    return issue;
}

type JiraIssue = {
    id: string;
    key: string;
    fields: {
        issuetype: {
            id: string;
            name: string;
            avatarId: number;
            iconUrl: string;
        };
        created: string;
        updated: string;
        priority: {
            name: string;
            id: string;
            iconUrl: string;
        };
        assignee?: JiraPerson;
        labels: string[];
        status: {
            id: string;
            name: string;
            iconUrl: string;
        };
        summary: string;
        creator: JiraPerson;
        comment: {
            comments: [];
            total: number;
        };
        description?: JiraDocContent;
    };
};

type JiraPerson = {
    accountId: string;
    emailAddress: string;
    displayName: string;
    active: boolean;
    timeZone: string;
    accountType: 'atlassian';
    avatarUrls: {
        '16x16': string;
        '24x24': string;
        '32x32': string;
        '48x48': string;
    };
};

type JiraTextContent = {
    type: 'text';
    text: string;
    marks?: Array<{
        type: 'strong' | 'em';
    }>;
};

type JiraDocContent = {
    type: 'doc';
    version: number;
    content: JiraContent[];
};

type JiraParagraphContent = {
    type: 'paragraph';
    content: JiraContent[];
};

type JiraContent = JiraTextContent | JiraParagraphContent;

type AccessibleResource = {
    id: string;
    url: string;
    name: string;
    scopes: string[];
    avatarUrl: string;
};

type AccessibleResourcesResponse = AccessibleResource[];
