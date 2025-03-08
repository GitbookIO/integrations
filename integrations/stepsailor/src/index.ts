import {
  createIntegration,
  FetchPublishScriptEventCallback,
  RuntimeContext,
  RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type StepsailorRuntimeContext = RuntimeContext<
  RuntimeEnvironment<
    {},
    {
      organizationId?: string;
      deployConfigId?: string;
      apiKey?: string;
    }
  >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
  event,
  { environment }: StepsailorRuntimeContext
) => {
  const organizationId =
    environment.siteInstallation?.configuration?.organizationId;
  const deployConfigId =
    environment.siteInstallation?.configuration?.deployConfigId;
  const apiKey = environment.siteInstallation?.configuration?.apiKey;

  if (!organizationId || !deployConfigId || !apiKey) {
    throw new Error(
      `The Stepsailor organization ID, deploy config ID and API key are missing from the configuration (ID: ${
        'spaceId' in event ? event.spaceId : event.siteId
      }).`
    );
  }

  return new Response(
    (script as string)
      .replace('<TO_REPLACE_ORGANIZATION_ID>', organizationId)
      .replace('<TO_REPLACE_DEPLOY_CONFIG_ID>', deployConfigId)
      .replace('<TO_REPLACE_API_KEY>', apiKey),
    {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'max-age=604800',
      },
    }
  );
};

export default createIntegration<StepsailorRuntimeContext>({
  fetch_published_script: handleFetchEvent,
});
