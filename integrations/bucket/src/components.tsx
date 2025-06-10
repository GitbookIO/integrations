import { createComponent, ExposableError } from '@gitbook/runtime';
import {
    BucketAction,
    BucketProps,
    BucketRuntimeContext,
    BucketSiteInstallationConfiguration,
    BucketState,
} from './types';
import { assertSiteInstallation } from './utils';

export const configBlock = createComponent<
    BucketProps,
    BucketState,
    BucketAction,
    BucketRuntimeContext
>({
    componentId: 'config',
    initialState: (props) => {
        const siteInstallation = props.siteInstallation;
        return {
            secret_key: siteInstallation.configuration?.secret_key || '',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'save.config':
                const { api, environment } = context;

                const siteInstallation = assertSiteInstallation(environment);

                const secretKey = element.state.secret_key;
                if (typeof secretKey !== 'string' || !secretKey) {
                    throw new ExposableError(
                        'Incomplete configuration: missing Bucket environment secret key',
                    );
                }

                const configurationBody: BucketSiteInstallationConfiguration = {
                    secret_key: secretKey,
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
    render: async () => {
        return (
            <block>
                <input
                    label="Secret key"
                    hint={
                        <text>
                            The secret key from your Bucket{' '}
                            <link
                                target={{
                                    url: 'https://app.bucket.co/envs/current/settings/app-environments',
                                }}
                            >
                                environment settings.
                            </link>
                        </text>
                    }
                    element={<textinput state="secret_key" placeholder="Secret key" />}
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
            </block>
        );
    },
});
