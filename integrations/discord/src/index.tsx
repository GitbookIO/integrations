import { Router } from 'itty-router';

// eslint-disable-next-line import/no-extraneous-dependencies
import { RequestUpdateIntegrationInstallation } from '@gitbook/api';
import {
    createIntegration,
    createComponent,
    createOAuthHandler,
    OAuthResponse,
    FetchEventCallback,
} from '@gitbook/runtime';

import { DiscordRuntimeContext } from './types';

const discordBlock = createComponent({
    componentId: 'discord',
    initialState: (props) => {
        return {
            message: 'Click Me',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'click':
                console.log('Button Clicked');
                return {};
        }
    },
    render: async (element, action, context) => {
        return (
            <block>
                <button label={element.state.message} onPress={{ action: 'click' }} />
            </block>
        );
    },
});

const handleFetchEvent: FetchEventCallback<DiscordRuntimeContext> = async (request, context) => {
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
        // @ts-ignore
        createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            authorizeURL:
                'https://discord.com/api/oauth2/authorize?response_type=code&permissions=2048',
            accessTokenURL: 'https://discord.com/api/oauth2/token',
            scopes: ['applications.commands', 'bot', 'webhook.incoming'],
            extractCredentials,
        })
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};

const extractCredentials = async (
    response: OAuthResponse
): Promise<RequestUpdateIntegrationInstallation> => {
    const { access_token } = response;

    return {
        configuration: {
            oauth_credentials: {
                access_token,
                expires_at: Date.now() + response.expires_in * 1000,
                refresh_token: response.refresh_token,
            },
        },
    };
};

export default createIntegration<DiscordRuntimeContext>({
    fetch: handleFetchEvent,
    components: [discordBlock],
});

// 1 - CONSENT URL WINDOW
// https://discord.com/oauth2/authorize?
// response_type=code&
// permissions=274877958144&
// client_id={SECRET}&
// redirect_uri=https%3A%2F%2Fintegrations.gitbook.com%2Fv1%2Fintegrations%2Fdiscord%2Fintegration%2Foauth&
// state=9b70cd849580737041abf9a6f38e4eb73b8340af0dd8af836fef14419c6c7f72&
// scope=applications.commands%20bot&
// prompt=consent

// 2 - PERMISSIONS URL WINDOW
// https://discord.com/oauth2/authorize?
// response_type=code&
// permissions=274877958144&
// client_id={SECRET}&
// redirect_uri=https%3A%2F%2Fintegrations.gitbook.com%2Fv1%2Fintegrations%2Fdiscord%2Fintegration%2Foauth&
// state=9b70cd849580737041abf9a6f38e4eb73b8340af0dd8af836fef14419c6c7f72&
// scope=applications.commands%20bot&
// prompt=consent

// 3 - ERROR URL WINDOW - "Internal Server Error"
// https://integrations.gitbook.com/v1/integrations/discord/integration/oauth?
// code=mlL69l3EdKYil0aDOE5PC1It8i6ORY&
// state=9b70cd849580737041abf9a6f38e4eb73b8340af0dd8af836fef14419c6c7f72&
// guild_id=1118104737657667594&
// permissions=274877958144

// https://discord.com/api/oauth2/authorize?
// client_id={SECRET}&
// permissions=274877958144&
// redirect_uri=https%3A%2F%2Fintegrations.gitbook.com%2Fv1%2Fintegrations%2Fdiscord%2Fintegration%2Foauth&
// response_type=code&
// scope=bot%20applications.commands

// No route matching GET - OATH2
// https://integrations.gitbook.com/v1/integrations/discord/integration/oauth2?
// code=ppx2MA67hrd0pJnzcxmjrDmveD9IRJ&
// state=9b70cd849580737041abf9a6f38e4eb73b8340af0dd8af836fef14419c6c7f72&
// guild_id=1118104737657667594&
// permissions=0

// AFTER SELECTING MY SERVER URL - "Internal Server Error" - OATH
// https://integrations.gitbook.com/v1/integrations/discord/integration/oauth?
// code=tjsz6laHiAGhKZxLXb0dS76X9ELh3k&
// state=9b70cd849580737041abf9a6f38e4eb73b8340af0dd8af836fef14419c6c7f72&
// guild_id=1118104737657667594&
// permissions=0

// EXAMPLE
// https://discord.com/oauth2/authorize?response_type=code& - yes
// client_id={SECRET}& - yes
// scope=identify%20guilds.join& - yes
// state=15773059ghq9183habn& - yes
// redirect_uri=https%3A%2F%2Fnicememe.website& - yes
// prompt=consent - yes
//
// MINE
// https://discord.com/oauth2/authorize?response_type=code&
// client_id={SECRET}&
// redirect_uri=https%3A%2F%2Fintegrations.gitbook.com%2Fv1%2Fintegrations%2Fdiscord%2Fintegration%2Foauth&
// state=9b70cd849580737041abf9a6f38e4eb73b8340af0dd8af836fef14419c6c7f72&
// scope=applications.commands%20bot&
// prompt=consent

// Application ID: 1118461240851824660
// Public Key: 43e4e8b45a9cb10c829d4bdd89093327bdba56a911f89e9239398cc17d6c4809
