const VALID_STATUS_TYPES = ['backlog', 'unstarted', 'started', 'completed', 'canceled'];

export async function onRequestGet({ request, params, env }) {
    const statusType = params.type;

    if (!VALID_STATUS_TYPES.includes(statusType)) {
        return new Response(`Invalid status type ${statusType}`, {
            status: 400,
        });
    }

    const origReqURL = new URL(request.url);
    const query = origReqURL.searchParams;

    const fillColor = query.get('fill');
    const strokeColor = query.get('stroke');
    const themeMode = query.get('theme');

    const statusAssetURL = origReqURL;
    statusAssetURL.search = '';
    statusAssetURL.pathname = `/linear/status-${statusType}-${themeMode ? themeMode : 'light'}.svg`;

    // Fetch the SVG corresponding to the status type
    let statusAssetResponse: Response;
    try {
        statusAssetResponse = await env.ASSETS.fetch(statusAssetURL);
    } catch (error) {
        return new Response(`Error while fetching the status asset.`, {
            status: 500,
        });
    }

    return new HTMLRewriter()
        .on('svg > path', {
            element(element) {
                if (fillColor) {
                    element.setAttribute('fill', `#${fillColor}`);
                }

                if (strokeColor) {
                    element.setAttribute('stroke', `#${strokeColor}`);
                }
            },
        })
        .transform(statusAssetResponse);
}
