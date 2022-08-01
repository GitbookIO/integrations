/** @jsx contentKitHyperscript */
import { Router } from 'itty-router';

import {
    createComponentCallback,
    contentKitHyperscript,
    createOAuthHandler,
} from '@gitbook/runtime';

import { executeMailchimpAPIRequest } from './api';

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
        redirectURL: `${environment.integration.urls.publicEndpoint}/oauth`,
        clientId: environment.secrets.CLIENT_ID,
        clientSecret: environment.secrets.CLIENT_SECRET,
        authorizeURL: 'https://login.mailchimp.com/oauth2/authorize',
        accessTokenURL: 'https://login.mailchimp.com/oauth2/token',
        extractCredentials: async (response) => {
            const { access_token } = response;

            const metadataResponse = await fetch('https://login.mailchimp.com/oauth2/metadata', {
                headers: {
                    Authorization: `OAuth ${access_token}`,
                },
            });

            const { dc } = await metadataResponse.json();

            return {
                externalIds: [dc],
                configuration: {
                    oauth_credentials: { access_token, dc },
                },
            };
        },
    })
);

/*
 * List the lists for the given Mailchimp account.
 */
router.get('/lists', async () => {
    const result = await executeMailchimpAPIRequest('GET', 'lists', {
        count: 1000,
    });

    const completions = result?.lists.map((list) => ({
        label: list.name,
        value: list.id,
    }));

    return new Response(JSON.stringify(completions), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
});

addEventListener('fetch', (event, eventContext) => {
    event.respondWith(router.handle(event.request, eventContext));
});

createComponentCallback<
    {},
    { email: string; subscribed: boolean },
    { action: 'subscribe' } | { action: 'subscribe_again' }
>({
    componentId: 'subscribe-form',
    initialState: {
        email: '',
        subscribed: false,
    },
    action: async (previous, action) => {
        if (action.action === 'subscribe' && previous.state.email) {
            await executeMailchimpAPIRequest(
                'POST',
                `lists/${environment.installation.configuration.list}/members`,
                {
                    email_address: previous.state.email,
                    status: 'subscribed',
                }
            );

            return {
                ...previous,
                state: {
                    ...previous.state,
                    email: '',
                    subscribed: true,
                },
            };
        }

        if (action.action === 'subscribe_again') {
            return {
                ...previous,
                state: {
                    ...previous.state,
                    subscribed: false,
                },
            };
        }

        return previous;
    },

    render: async ({ state }) => {
        if (
            !environment.installation.configuration.oauth_credentials ||
            !environment.installation.configuration.list
        ) {
            return (
                <block>
                    <box style="card">
                        <hstack>
                            <box>
                                <text>
                                    The Mailchimp integration is not yet properly configured. Finish
                                    the installation first.
                                </text>
                            </box>
                            <spacer />
                            <box>
                                <button
                                    style="primary"
                                    label="Configure"
                                    action={{
                                        action: '@ui.url.open',
                                        url: environment.installation.urls.app,
                                    }}
                                />
                            </box>
                        </hstack>
                    </box>
                </block>
            );
        }

        if (state.subscribed) {
            return (
                <block>
                    <box style="card">
                        <hstack align="center">
                            <box>
                                <vstack>
                                    <box>
                                        <text style="bold">Thank you for subscribing!</text>
                                    </box>
                                </vstack>
                            </box>
                            <spacer />
                            <box>
                                <button
                                    label="Subscribe with another email"
                                    action={{ action: 'subscribe_again' }}
                                />
                            </box>
                        </hstack>
                    </box>
                </block>
            );
        }

        return (
            <block>
                <box style="card">
                    <hstack align="center">
                        <box>
                            <vstack>
                                <box>
                                    <text style="bold">Sign up for updates:</text>
                                </box>
                                <box>
                                    <text>
                                        You can unsubscribe at any time. Read our privacy policy.
                                    </text>
                                </box>
                            </vstack>
                        </box>
                        <spacer />
                        <box>
                            <textinput id="email" placeholder="Email" />
                        </box>
                        <box>
                            <button
                                label="Subscribe"
                                confirm={{
                                    title: 'Subscribe to updates?',
                                    text: 'You will receive emails from us. You can unsubscribe at any time.',
                                    confirm: 'Subscribe',
                                }}
                                action={{ action: 'subscribe' }}
                            />
                        </box>
                    </hstack>
                </box>
            </block>
        );
    },
});
