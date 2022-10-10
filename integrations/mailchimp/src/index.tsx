import { Router } from 'itty-router';
import {
    createComponent,
    createIntegration,
    createOAuthHandler,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';
import { mailchimp } from './sdk';
import { ContentKitDefaultAction } from '@gitbook/api';

// client_id 694931987396
// client_secret e073b1c5e4602c94987befcc4c9bae4c8130258c56f8f86ef3

interface MailchimpInstallationConfiguration {
    api_endpoint: string;
    oauth_credentials?: {
        access_token: string;
    };
}

type MailchimpRuntimeEnvironment = RuntimeEnvironment<MailchimpInstallationConfiguration>;
type MailchimpRuntimeContext = RuntimeContext<MailchimpRuntimeEnvironment>;

type MailchimpBlockProps = {
    cta?: string;
    listId?: string;
};

type MailchimpBlockState = {
    success: boolean;
    email: string;
};

type MailchimpAction =
    | { action: 'subscribe'; email: string }
    | { action: '@ui.modal.close'; listId?: string; cta?: string };

const subscribeComponent = createComponent<
    MailchimpBlockProps,
    MailchimpBlockState,
    MailchimpAction,
    MailchimpRuntimeContext
>({
    componentId: 'subscribe',

    initialState: () => ({
        email: '',
        success: false,
    }),

    async action(element, action, context) {
        switch (action.action) {
            case 'subscribe': {
                const { environment } = context;
                const configuration = environment.installation?.configuration;
                const { listId } = element.props;
                const resp = await fetch(
                    `${configuration.api_endpoint}/3.0/lists/${listId}/members`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${configuration.oauth_credentials?.access_token}`,
                        },
                        body: JSON.stringify({
                            email_address: action.email,
                            status: 'subscribed',
                        }),
                    }
                );

                return {
                    state: {
                        email: action.email,
                        success: true,
                    },
                };
            }
            case '@ui.modal.close': {
                return {
                    props: {
                        listId: action.listId || element.props.listId,
                        cta: action.cta || element.props.cta,
                    },
                };
            }
            default:
                return element;
        }
    },

    async render(element, context) {
        const { listId, cta } = element.props;
        const { success } = element.state;

        return (
            <block>
                <card title={cta}>
                    <hstack>
                        <box grow={1}>
                            <textinput state="email" placeholder="Enter your email" />
                        </box>
                        <box>
                            <button
                                label="Subscribe"
                                onPress={{
                                    action: 'subscribe',
                                    email: element.dynamicState('email'),
                                }}
                            />
                        </box>
                        {success ? (
                            <box>
                                <text>You've been added to the mailing list!</text>
                            </box>
                        ) : null}
                        {listId && element.context.editable ? (
                            <box>
                                <text>{listId}</text>
                            </box>
                        ) : null}
                        {element.context.editable ? (
                            <box>
                                <button
                                    label="Edit"
                                    onPress={{
                                        action: '@ui.modal.open',
                                        componentId: 'settingsModal',
                                        props: {
                                            currentListId: listId,
                                            currentCTA: cta,
                                        },
                                    }}
                                />
                            </box>
                        ) : null}
                    </hstack>
                </card>
            </block>
        );
    },
});

/**
 * Component to render the preview modal when zooming.
 */
const settingsModal = createComponent<
    { currentListId?: string; currentCTA?: string },
    { cta?: string; listId?: string },
    {},
    MailchimpRuntimeContext
>({
    componentId: 'settingsModal',

    initialState: (props) => ({
        listId: props.currentListId,
        cta: props.currentCTA || 'Want to know more? Subscribe to our newsletter!',
    }),

    async render(element, context) {
        const { environment } = context;
        const configuration = environment.installation?.configuration;

        if (!configuration) {
            throw new Error();
        }

        const resp = await fetch(`${configuration.api_endpoint}/3.0/lists`, {
            headers: {
                Authorization: `Bearer ${configuration.oauth_credentials?.access_token}`,
            },
        });

        const { lists } = (await resp.json()) as MailchimpListsResponse;

        return (
            <modal
                title="Configure Mailchimp"
                size="medium"
                submit={
                    <button
                        label="Save"
                        onPress={{
                            action: '@ui.modal.close',
                            listId: element.dynamicState('listId'),
                            cta: element.dynamicState('cta'),
                        }}
                    />
                }
            >
                <vstack>
                    <text>Call-to-action text</text>
                    <textinput state="cta" />
                    <text>Mailchimp audience</text>
                    {lists.length > 0 ? (
                        <select
                            state="listId"
                            options={lists.map((list) => {
                                return {
                                    label: list.name,
                                    id: list.id,
                                };
                            })}
                        />
                    ) : (
                        <text>No Mailchimp lists found</text>
                    )}
                </vstack>
            </modal>
        );
    },
});

export default createIntegration<MailchimpRuntimeContext>({
    fetch: async (request, context) => {
        const { environment } = context;

        const router = Router({
            base: new URL(
                environment.spaceInstallation?.urls?.publicEndpoint ||
                    environment.installation?.urls.publicEndpoint ||
                    environment.integration.urls.publicEndpoint
            ).pathname,
        });

        /*
         * Authenticate the user using OAuth.
         */
        router.get(
            '/oauth',
            createOAuthHandler({
                redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
                clientId: '694931987396',
                clientSecret: 'e073b1c5e4602c94987befcc4c9bae4c8130258c56f8f86ef3',
                authorizeURL: 'https://login.mailchimp.com/oauth2/authorize',
                accessTokenURL: 'https://login.mailchimp.com/oauth2/token',
                async extractCredentials(response) {
                    if (!response.access_token) {
                        throw new Error(
                            `Could not extract access_token from response ${JSON.stringify(
                                response
                            )}`
                        );
                    }

                    const resp = await fetch('https://login.mailchimp.com/oauth2/metadata', {
                        headers: {
                            Authorization: `OAuth ${response.access_token}`,
                        },
                    });

                    const json = (await resp.json()) as MailchimpMetadataResponse;

                    return {
                        configuration: {
                            oauth_credentials: { access_token: response.access_token },
                            api_endpoint: json.api_endpoint,
                        },
                    };
                },
            })
        );

        const response = await router.handle(request, context);
        if (!response) {
            return new Response(`No route matching ${request.method} ${request.url}`, {
                status: 404,
            });
        }

        return response;
    },
    components: [subscribeComponent, settingsModal],
});

interface MailchimpListsResponse {
    lists: MailchimpListItem[];
    total_items: number;
}

interface MailchimpListItem {
    id: string;
    web_id: number;
    name: string;
    date_created: string;
}

interface MailchimpMetadataResponse {
    dc: string;
    role: string;
    accountname: string;
    user_id: number;
    login: {
        email: string;
        avatar: string | null;
        login_id: number;
        login_name: string;
        login_email: string;
    };
    login_url: string;
    api_endpoint: string;
}

/**
 * 
                        <textinput
                            id="email"
                            label="Email"
                            initialValue=""
                            placeholder="Enter your email"
                        />
                        <button
                            icon="maximize"
                            label="Subscribe"
                            tooltip="Subscribe"
                            onPress={{
                                action: '@ui.subscribe',
                            }}
                        />
 */
