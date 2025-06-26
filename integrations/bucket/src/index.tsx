import { GitBookAPI } from '@gitbook/api';

import { createIntegration } from '@gitbook/runtime';
import { assertInstallation, assertSiteInstallation } from './utils';

import { handleSyncAdaptiveSchema, SYNC_ADAPTIVE_SCHEMA_SCHEDULE_SECONDS } from './tasks';
import { configBlock } from './components';

export default createIntegration({
    components: [configBlock],
    events: {
        site_view: async (event, context) => {
            const installation = assertInstallation(context.environment);
            const siteInstallation = assertSiteInstallation(context.environment);

            // If the last sync attempt was more than an hour ago, we try to sync the adaptive schema
            const shouldSyncAdaptiveSchema =
                siteInstallation.configuration.lastSyncAttemptAt &&
                siteInstallation.configuration.lastSyncAttemptAt <
                    Date.now() - SYNC_ADAPTIVE_SCHEMA_SCHEDULE_SECONDS * 1000;

            if (shouldSyncAdaptiveSchema) {
                await handleSyncAdaptiveSchema(context, installation, siteInstallation);
            }
        },
        site_installation_setup: async (event, context) => {
            const installation = assertInstallation(context.environment);
            const siteInstallation = assertSiteInstallation(context.environment);
            await handleSyncAdaptiveSchema(context, installation, siteInstallation);
        },
    },
});
