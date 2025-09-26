import {
    createIntegration,
    FetchEventCallback,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';
import { VoteBlock } from './vote-block';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import script from './script.raw.js?raw'; // the generated string module

type VaultriceContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            projectId?: string;
            apiKey?: string;
            apiSecret?: string;
        }
    >
>;

/**
 * serve the published script: return JS string with placeholders replaced
 */
export const handleFetchPublishedScript: FetchPublishScriptEventCallback = async (
    event,
    { environment }: VaultriceContext,
) => {
    return new Response(script as string, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'public, max-age=3600',
        },
    });
};

/**
 * Generic HTTP handler (GitBook calls /integration)
 */
export const handleFetch: FetchEventCallback = async (request, context) => {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.endsWith('voting.js') && url.searchParams.get('script') === 'true') {
        return handleFetchPublishedScript(request as any, context as any) as any;
    }

    return new Response(
        `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Vaultrice Voting iframe</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html,body { width: 100%; height: 100%; }
          #root { padding: 12px; }
        </style>
      </head>
      <body>
        <div id="root"><div class="loading">Loading voting widget...</div></div>
        <script type="module">
          // Import the ES module served by the integration (same path with script param)
          import init from '${url.origin}${url.pathname}/voting.js?script=true&v=${context.environment.integration.version}';
          // call the exported init() to setup message listeners and rendering
          (async () => {
            try {
              const api = await init();
              // optional: keep reference (api) to call later if needed
            } catch (err) {
              console.error('Widget init failed', err);
            }
          })();
        </script>
      </body>
    </html>`,
        {
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'public, max-age=86400',
            },
        },
    );
};

export default createIntegration({
    fetch: handleFetch,
    fetch_published_script: handleFetchPublishedScript,
    components: [VoteBlock],
});
