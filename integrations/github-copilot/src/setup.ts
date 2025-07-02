import jwt from '@tsndr/cloudflare-worker-jwt';
import { IntegrationInstallation } from '@gitbook/api';
import { GitHubCopilotRuntimeContext } from './types';
import { ExposableError } from '@gitbook/runtime';

export async function createGitHubSetupState(
    context: GitHubCopilotRuntimeContext,
    installation: IntegrationInstallation,
) {
    const token = await jwt.sign(
        { installationId: installation.id },
        context.environment.signingSecrets.integration,
    );
    return token;
}

export async function verifyGitHubSetupState(context: GitHubCopilotRuntimeContext, token: string) {
    const verified = await jwt.verify(token, context.environment.signingSecrets.integration);
    if (!verified) {
        throw new ExposableError('Invalid token signature');
    }

    const { payload } = jwt.decode(token);
    if (!payload || typeof payload.installationId !== 'string') {
        throw new ExposableError('Invalid token');
    }
    return payload.installationId as string;
}
