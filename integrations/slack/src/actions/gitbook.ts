import { slackAPI } from '../slack';
import { getInstallationConfig } from '../utils';

const orgId = 'TdvOhBZeNlhXIANE35Zl';
const spaceId = 'mpu06z75jn9wS83SndrV';

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

    console.log('getInstallationApiClient======');
    const { client: installationApiClient } = await getInstallationApiClient(api, team_id);

    console.log('getInstallationConfig======');
    const { accessToken } = await getInstallationConfig(context, team_id);

    console.log('conversation.replies======');
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

    console.log('actual start recording======');
    const startRecordingRes = await installationApiClient.orgs.startRecording(orgId, {
        space: spaceId,
        context: 'thread',
    });

    const recording = startRecordingRes.data;

    const events = messages.map((message) => {
        const { text, user, ts, thread_ts } = message;

        return {
            type: 'thread.message',
            text,
            user: user ?? '',
            timestamp: slackTimestampToISOFormat(ts),
            ...(ts === thread_ts ? { isFirst: true } : {}),
        };
    });
    console.log('events======', events);

    // add all messages in a thread to a recording

    await installationApiClient.orgs.addEventsToRecording(orgId, recording.id, {
        events,
    });

    // stop recording
    const stopRecordingRes = await installationApiClient.orgs.stopRecording(orgId, recording.id, {
        space: spaceId,
    });

    const outputRecording = stopRecordingRes.data;

    return outputRecording;
}
