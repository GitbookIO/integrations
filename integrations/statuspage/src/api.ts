import { StatuspageRuntimeContext } from './configuration';

export interface StatuspagePageObject {
    id: string;
    name: string;
    url: string;
    updated_at: string;
}

export interface StatuspageComponentObject {
    id: string;
    name: string;
    description: string;
    updated_at: string;
    status:
        | 'operational'
        | 'under_maintenance'
        | 'degraded_performance'
        | 'partial_outage'
        | 'major_outage'
        | '';
}

/**
 * Execute a Slack API request and return the result.
 */
export async function statuspageAPI<Response>(
    context: StatuspageRuntimeContext,
    request: {
        method: string;
        path: string;
        payload?: { [key: string]: any };
    },
    cache: {
        ttl: number;
    } = {
        ttl: 3600,
    }
): Promise<Response> {
    const { environment } = context;

    const apiKey = environment.spaceInstallation?.configuration.api_key;

    if (!apiKey) {
        throw new Error('No API key provided');
    }

    const url = new URL(`https://api.statuspage.io/v1/${request.path}`);

    let body;
    const headers: {
        [key: string]: string;
    } = {
        Authorization: `OAuth ${apiKey}`,
    };

    if (request.method === 'GET') {
        Object.entries(request.payload || {}).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(request.payload || {});
    }

    const response = await fetch(url.toString(), {
        method: request.method,
        body,
        headers,
        cf:
            request.method === 'GET'
                ? {
                      cacheTtl: cache.ttl,
                      cacheEverything: true,
                  }
                : undefined,
    });

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
}
