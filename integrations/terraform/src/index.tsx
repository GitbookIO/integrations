import * as jose from 'jose';

import { createComponent, createIntegration, FetchEventCallback } from '@gitbook/runtime';

import { TerraformInstallationConfiguration, TerraformRuntimeContext } from './configuration';
import { generateJwtSecret, parseJwtSecret } from './token';

const tokenRegExp = /^Bearer\s+(\S+)$/i;

const tokenText = createComponent<{}, {}, void, TerraformRuntimeContext>({
    componentId: 'jwt',
    async render(element, context) {
        element.setCache({ maxAge: 30 });

        const config = context.environment.installation!.configuration;
        const secret = parseJwtSecret(config.tokenSecret);
        const token = await new jose.SignJWT({
            sub: context.environment.installation!.id,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .sign(secret);

        return (
            <block>
                <card
                    title="Authentication token"
                    hint="Use this token in the GitBook Terraform provider configuration."
                >
                    <codeblock content={token} />
                </card>
            </block>
        );
    },
});

const handleFetchEvent: FetchEventCallback<TerraformRuntimeContext> = async (request, context) => {
    const { api } = context;
    const authToken = (request.headers.get('Authorization') || '').match(tokenRegExp)?.[1];
    if (!authToken) {
        return new Response('Unauthorized', { status: 401 });
    }

    // First, parse the installation ID from the JWT *without* verifiying the
    // signature, which we need to do so we can fetch the sign secret from the
    // installation configuration.
    let installationId: string;
    try {
        const payload = jose.decodeJwt(authToken);
        if (!payload.sub) {
            return new Response('Invalid token', { status: 400 });
        }
        installationId = payload.sub;
    } catch (error) {
        return new Response('Invalid token', { status: 400 });
    }

    const { data: installation } = await api.integrations.getIntegrationInstallationById(
        'terraform',
        installationId
    );

    // Verify the auth token with the sign secret of the installation ID.
    const { tokenSecret } = installation.configuration as TerraformInstallationConfiguration;
    const key = parseJwtSecret(tokenSecret);

    try {
        await jose.jwtVerify(authToken, key);
    } catch (error) {
        return new Response('Invalid token', { status: 400 });
    }

    const {
        data: { token },
    } = await api.integrations.createIntegrationInstallationToken('terraform', installationId);

    return new Response(JSON.stringify({ token }), { status: 200 });
};

export default createIntegration({
    fetch: handleFetchEvent,
    events: {
        installation_setup: async (event, context) => {
            const { api } = context;
            const installation = context.environment.installation;

            // If the token secret has been configured already, there's nothing
            // to do.
            if (installation?.configuration.tokenSecret) {
                return;
            }

            const tokenSecret = await generateJwtSecret();

            const configuration: TerraformInstallationConfiguration = {
                tokenSecret,
            };

            await api.integrations.updateIntegrationInstallation(
                'terraform',
                event.installationId,
                {
                    configuration,
                }
            );
        },
    },
    components: [tokenText],
});
