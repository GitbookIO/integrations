import { SlackInstallationConfiguration } from '../configuration';
import { slackAPI } from '../slack';
import { getInstallationApiClient } from './gitbook';

export async function shareMessage({ channelId, teamId, threadId, userId, text, context }) {
    const { api } = context;

    const { installation } = await getInstallationApiClient(api, teamId);
    if (!installation) {
        throw new Error('Installation not found');
    }

    // Authenticate as the installation
    const accessToken = (installation.configuration as SlackInstallationConfiguration)
        .oauth_credentials?.access_token;

    const blocks = JSON.parse(text);

    if (blocks) {
        await slackAPI(
            context,
            {
                method: 'POST',
                path: 'chat.postMessage',
                payload: {
                    channel: channelId,
                    blocks,
                    thread_ts: threadId,
                    user: userId,
                },
            },
            { accessToken }
        );
    }
}
