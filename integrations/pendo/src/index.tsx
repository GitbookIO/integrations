import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
    createComponent,
} from '@gitbook/runtime';
import { IntegrationInstallationConfiguration } from '@gitbook/api';

import script from './script.raw.js';

type PendoRuntimeContext = RuntimeContext<
    RuntimeEnvironment<{}, PendoSiteInstallationConfiguration>
>;
type PendoRuntimeEnvironment = RuntimeEnvironment<{}, PendoSiteInstallationConfiguration>;

type PendoSiteInstallationConfiguration = {
    api_key?: string;
    is_eu_region?: boolean;
};

type PendoState = PendoSiteInstallationConfiguration;

type PendoProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    siteInstallation?: {
        configuration?: PendoSiteInstallationConfiguration;
    };
};
export type PendoAction = { action: 'save.config' };

const configBlock = createComponent<PendoProps, PendoState, PendoAction, PendoRuntimeContext>({
    componentId: 'config',
    initialState: (props) => {
        const siteInstallation = props.siteInstallation;
        return {
            api_key: siteInstallation?.configuration?.api_key || '',
            is_eu_region: siteInstallation?.configuration?.is_eu_region || false,
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'save.config':
                const { api, environment } = context;
                const siteInstallation = assertSiteInstallation(environment);

                const configurationBody = {
                    ...siteInstallation.configuration,
                    api_key: element.state.api_key,
                    is_eu_region: element.state.is_eu_region,
                };

                await api.integrations.updateIntegrationSiteInstallation(
                    siteInstallation.integration,
                    siteInstallation.installation,
                    siteInstallation.site,
                    {
                        configuration: {
                            ...configurationBody,
                        },
                    },
                );

                return { type: 'complete' };
        }
    },
    render: async (element, context) => {
        return (
            <configuration>
                <box>
                    <markdown content="### Pendo Analytics" />
                    <vstack>
                        <input
                            label="Pendo API Key"
                            hint={<text>The Pendo API Key.</text>}
                            element={<textinput state="api_key" placeholder="API Key" />}
                        />
                    </vstack>
                    <divider size="medium" />

                    <markdown content="### Region of your Pendo App" />
                    <input
                        label="Is your app in the EU Region"
                        hint="Toggle on if your app is in EU Region"
                        element={<switch state="is_eu_region" />}
                    />

                    <input
                        label=""
                        hint=""
                        element={
                            <button
                                style="primary"
                                disabled={false}
                                label="Save"
                                tooltip="Save configuration"
                                onPress={{
                                    action: 'save.config',
                                }}
                            />
                        }
                    />
                </box>
            </configuration>
        );
    },
});

function assertSiteInstallation(environment: PendoRuntimeEnvironment) {
    const siteInstallation = environment.siteInstallation;
    if (!siteInstallation) {
        throw new Error('No site installation found');
    }

    return siteInstallation;
}

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: PendoRuntimeContext,
) => {
    const apiKey = environment.siteInstallation?.configuration?.api_key;
    const isEURegion = environment.siteInstallation?.configuration?.is_eu_region;
    if (!apiKey) {
        throw new Error(
            `The API key is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }
    const region = isEURegion ? 'EU' : 'US';
    return new Response(
        (script as string).replace('<TO_REPLACE>', apiKey).replace('<REGION>', region),
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        },
    );
};

export default createIntegration<PendoRuntimeContext>({
    fetch_published_script: handleFetchEvent,
    components: [configBlock],
});
