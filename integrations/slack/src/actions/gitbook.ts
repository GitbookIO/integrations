import { slackAPI } from '../slack';
import { getInstallationConfig } from '../utils';

const orgId = 'TdvOhBZeNlhXIANE35Zl';
const spaceId = 'sobfe0QALfpHjq2hgfhd';

function slackTimestampToISOFormat(slackTs) {
    const timestampInMilliseconds = parseFloat(slackTs) * 1000;

    const date = new Date(timestampInMilliseconds);

    const formattedDate = date.toISOString();

    return formattedDate;
}

export async function getInstallationApiClient(api, externalId: string) {
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations('slack', {
        externalId,
    });

    const installation = installations[0];
    if (!installation) {
        return {};
    }

    // Authentify as the installation
    const installationApiClient = await api.createInstallationClient('slack', installation.id);

    return { client: installationApiClient, installation };
}

export async function createMessageThreadRecording(context, slackEvent) {
    const { api, environment } = context;

    const { team_id, channel, thread_ts } = slackEvent;

    const { client: installationApiClient } = await getInstallationApiClient(api, team_id);

    const { accessToken } = await getInstallationConfig(context, team_id);

    const messageReplies = await slackAPI(
        context,
        {
            method: 'GET',
            path: 'conversations.replies',
            payload: {
                channel,
                ts: thread_ts,
            },
        },
        { accessToken }
    );
    const { messages = [] } = messageReplies;

    const startRecordingRes = await installationApiClient.orgs.startRecording(orgId, {
        space: spaceId,
        context: 'chat',
    });

    const recording = startRecordingRes.data;

    const events = messages.map((post) => {
        const { text, user, ts, thread_ts } = post;

        let messageType = 'message.reply';
        if (ts === thread_ts) {
            messageType = 'message';
        }

        return {
            type: messageType,
            text,
            user: user ?? '',
            timestamp: slackTimestampToISOFormat(ts),
        };
    });

    // add all messages in a thread to a recording

    await installationApiClient.orgs.addEventsToRecording(orgId, recording.id, {
        events,
    });

    // stop recording
    const stopRecordingRes = await installationApiClient.orgs.stopRecording(orgId, recording.id, {
        space: spaceId,
    });

    const outputRecording = stopRecordingRes.data;

  rn outputRecording;
}
