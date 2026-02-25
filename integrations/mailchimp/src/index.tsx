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
    | { action: '@ui.modal.close'; listIndex: number; cta: string; listIds: string[] };

const DEFAULT_CTA = 'Sign up to our mailing list to receive updates!';
const DEFAULT_DISCLAIMER =
    'By clicking Subscribe, you agree to the processing of your email address in accordance with our privacy policy.';

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

                try {
                    const listId = await resolveMailingListId(
                        configuration.api_endpoint,
                        accessToken,
                        element.props.listId,
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
                const listIndex = 'listIndex' in action ? action.listIndex : null;
                const listIds = 'listIds' in action ? action.listIds : null;
                const cta = 'cta' in action ? action.cta : null;
                const listId = listIds !== null && listIndex !== null ? listIds[listIndex] : null;
                return {
                    props: {
                        listId: listId ?? element.props.listId,
                        cta: cta || element.props.cta,
                    },
                };
            }
            default:
                return element;
        }
    },

    async render(element) {
        const { cta = DEFAULT_CTA, listId } = element.props;
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
                                cta,
                                listId,
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
                    <box>
                        <text>{DEFAULT_DISCLAIMER}</text>
                    </box>
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
    apiEndpoint: string,
    accessToken: string,
    propListId?: string,
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
    { listId: string | undefined; cta: string },
    { cta: string; listIndex: string | undefined },
    {},
    MailchimpRuntimeContext
>({
    componentId: 'settingsModal',

    initialState: (props) => ({
        cta: props.cta,

        // Store an index instead of an id so we can pre-select something
        listIndex: undefined,
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

        const { listId } = element.props;
        const lists = await getMailingLists(configuration.api_endpoint, accessToken);
        const initialListIndex = listId
            ? lists.findIndex((list) => list.id === element.props.listId)
            : undefined;

        return (
            <modal
                title="Edit Mailchimp Block"
                size="medium"
                submit={
                    <button
                        label="Save"
                        onPress={{
                            action: '@ui.modal.close',
                            listIds: lists.map((list) => list.id),
                            listIndex: element.dynamicState('listIndex'),
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
                                initialValue={
                                    initialListIndex !== undefined
                                        ? String(initialListIndex)
                                        : undefined
                                }
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
