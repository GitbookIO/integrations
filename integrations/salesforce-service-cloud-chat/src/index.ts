import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type SFSCEnvironment = RuntimeEnvironment<
    {},
    {
        salesforce_instance_url?: string;
        embedded_service_site_url?: string;
        org_id?: string;
        messaging_deployment_name?: string;
        scrt2_url?: string;
    }
>;

type SFSCContext = RuntimeContext<SFSCEnvironment>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    _event,
    { environment }: SFSCContext,
) => {
    const cfg = environment.siteInstallation?.configuration || {};

    const required = [
        'salesforce_instance_url',
        'embedded_service_site_url',
        'org_id',
        'messaging_deployment_name',
        'scrt2_url',
    ] as const;

    for (const key of required) {
        if (!cfg[key]) {
            return;
        }
    }

    const replaced = (script as string)
        .replace(/<INSTANCE_URL>/g, String(cfg.salesforce_instance_url))
        .replace(/<EMBEDDED_SERVICE_SITE_URL>/g, String(cfg.embedded_service_site_url))
        .replace(/<ORG_ID>/g, String(cfg.org_id))
        .replace(/<MESSAGING_DEPLOYMENT_NAME>/g, String(cfg.messaging_deployment_name))
        .replace(/<SCRT2_URL>/g, String(cfg.scrt2_url));

    return new Response(replaced, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<SFSCContext>({
    fetch_published_script: handleFetchEvent,
});
