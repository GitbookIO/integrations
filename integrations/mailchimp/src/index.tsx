import { Router } from 'itty-router';

import {
    createComponent,
    createIntegration,
    createOAuthHandler,
    ExposableError,
    Logger,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';
import { ContentKitIcon } from '@gitbook/api';

import { getMailingLists, getUserMetadata, subscribeUserToList } from './sdk';

const logger = Logger('mailchimp');

type MailchimpRuntimeContext = RuntimeContext<
    RuntimeEnvironment<{
        api_endpoint: string;
        oauth_credentials?: {
            access_token: string;
        };
    }>
>;

type MailchimpBlockProps = {
    cta?: string;
    listId?: string;
};

type MailchimpBlockState = {
    success: boolean | undefined;
    email: string;
};

type MailchimpAction =
    | { action: 'subscribe'; email: string }
    | { action: '@ui.modal.close'; listId?: string; cta?: string };

const DEFAULT_CTA = 'Sign up to our mailing list to receive updates!';

/**
 * A Block to subscribe to a Mailchimp mailing list.
 */
const mailchimpSubscribe = createComponent<
    MailchimpBlockProps,
    MailchimpBlockState,
    MailchimpAction,
    MailchimpRuntimeContext
>({
    componentId: 'mailchimpSubscribe',

    initialState: () => ({
        email: '',
        success: undefined,
    }),

    async action(element, action, context) {
        switch (action.action) {
            case 'subscribe': {
                const { environment } = context;
                const configuration = environment.installation?.configuration;
                const accessToken = configuration?.oauth_credentials?.access_token;
                if (!accessToken) {
                    throw new ExposableError('Mailchimp integration not configured');
                }
                if (!element.props.listId) {
                    throw new ExposableError('No list ID provided');
                }

                try {
                    const listId = await resolveMailingListId(
                        element.props.listId,
                        configuration.api_endpoint,
                        accessToken,
                    );

                    if (!listId) {
                        throw new Error(`no lists found`);
                    }

                    await subscribeUserToList(listId, action.email, {
                        apiEndpoint: configuration.api_endpoint,
                        accessToken,
                    });

                    return {
                        state: {
                            email: action.email,
                            success: true,
                        },
                    };
                } catch (err) {
                    logger.error('Error while subscribing', (err as Error).stack);

                    return {
                        state: {
                            email: action.email,
                            success: false,
                        },
                    };
                }
            }
            case '@ui.modal.close': {
                return {
                    props: {
                        listId: ('listId' in action ? action.listId : null) || element.props.listId,
                        cta: ('cta' in action ? action.cta : null) || element.props.cta,
                    },
                };
            }
            default:
                return element;
        }
    },

    async render(element) {
        const { cta = DEFAULT_CTA } = element.props;
        const { success } = element.state;

        return (
            <block
                controls={[
                    {
                        label: 'Edit',
                        icon: ContentKitIcon.Edit,
                        onPress: {
                            action: '@ui.modal.open',
                            componentId: 'settingsModal',
                            props: {
                                currentCTA: cta,
                            },
                        },
                    },
                ]}
            >
                <card>
                    <hstack align="center">
                        <box grow={1}>
                            <text>{cta}</text>
                        </box>
                        <box grow={2}>
                            <textinput state="email" placeholder="Your email address" />
                        </box>
                        <box>
                            <button
                                disabled={typeof success === 'boolean'}
                                label={success ? 'Subscribed!' : 'Subscribe'}
                                onPress={{
                                    action: 'subscribe',
                                    email: element.dynamicState('email'),
                                }}
                            />
                        </box>
                    </hstack>
                    {typeof success === 'boolean' && success === false ? (
                        <box>
                            <text>An error occured, the site owner has been notified</text>
                        </box>
                    ) : null}
                </card>
            </block>
        );
    },
});

async function resolveMailingListId(
    propListId: string,
    apiEndpoint: string,
    accessToken: string,
): Promise<string | undefined> {
    if (propListId) {
        return propListId;
    }

    const lists = await getMailingLists(apiEndpoint, accessToken);
    return lists.length ? lists[0].id : undefined;
}

/**
 * A modal to configure the Mailchimp block.
 */
const settingsModal = createComponent<
    { currentListId?: string; currentCTA?: string },
    { cta: string; listIndex: string },
    {},
    MailchimpRuntimeContext
>({
    componentId: 'settingsModal',

    initialState: (props) => ({
        cta: props.currentCTA || DEFAULT_CTA,

        // Store an index instead of an id so we can pre-select something
        listIndex: '0',
    }),

    async render(element, context) {
        // Don't cache so that people can change to lists that they just created
        element.setCache({ maxAge: 0 });

        const { environment } = context;
        const configuration = environment.installation?.configuration;
        const accessToken = configuration?.oauth_credentials?.access_token;

        if (!accessToken) {
            throw new ExposableError('Mailchimp integration not configured');
        }

        const lists = await getMailingLists(
            configuration.api_endpoint,
            accessToken,
        );

        return (
            <modal
                title="Edit Mailchimp Block"
                size="medium"
                submit={
                    <button
                        label="Save"
                        onPress={{
                            action: '@ui.modal.close',

                            // @ts-ignore dynamicState gets converted to a string by our runtime
                            listId: lists[element.dynamicState('listId')]?.id,
                            cta: element.dynamicState('cta'),
                        }}
                    />
                }
            >
                <vstack>
                    <box>
                        <text>Call-to-action text</text>
                        <textinput state="cta" />
                    </box>
                    <box>
                        <text>Audience</text>
                        {lists.length > 0 ? (
                            <select
                                state="listIndex"
                                options={lists.map((list, index) => {
                                    return {
                                        label: list.name,
                                        id: String(index),
                                    };
                                })}
                            />
                        ) : (
                            <text>
                                No Mailchimp audiences found, did you complete the authentication
                                step?
                            </text>
                        )}
                    </box>
                </vstack>
            </modal>
        );
    },
});

/**
 * Mailchimp integration for subscribing users to mailing lists.
 */
export default createIntegration<MailchimpRuntimeContext>({
    /**
     * This integration only handles OAuth over its fetch handler.
     */
    fetch: async (request, context) => {
        const { environment } = context;

        const router = Router({
            base: new URL(
                environment.spaceInstallation?.urls?.publicEndpoint ||
                    environment.installation?.urls.publicEndpoint ||
                    environment.integration.urls.publicEndpoint,
            ).pathname,
        });

        /*
         * Authenticate the user using OAuth.
         */
        router.get(
            '/oauth',
            createOAuthHandler({
                redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
                clientId: environment.secrets.CLIENT_ID,
                clientSecret: environment.secrets.CLIENT_SECRET,
                authorizeURL: 'https://login.mailchimp.com/oauth2/authorize',
                accessTokenURL: 'https://login.mailchimp.com/oauth2/token',
                async extractCredentials(response) {
                    if (!response.access_token) {
                        throw new Error(
                            `Could not extract access_token from response ${JSON.stringify(
                                response,
                            )}`,
                        );
                    }

                    // In Mailchimp, you need to know the user's region before making API
                    // requests. We get the user metadata and store it in the installation.
                    const metadata = await getUserMetadata(response.access_token);

                    return {
                        configuration: {
                            oauth_credentials: { access_token: response.access_token },
                            api_endpoint: metadata.api_endpoint,
                        },
                    };
                },
            }),
        );

        const response = await router.handle(request, context);
        if (!response) {
            return new Response(`No route matching ${request.method} ${request.url}`, {
                status: 404,
            });
        }

        return response;
    },
    components: [mailchimpSubscribe, settingsModal],
});
