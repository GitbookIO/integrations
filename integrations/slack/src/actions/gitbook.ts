import { slackAPI } from '../slack';
import { getInstallationConfig } from '../utils';

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

        // we need to pass installation.target.organization
    });

    // won't work for multiple installations accross orgs and same slack team
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
    const { installation } = await getInstallationApiClient(api, slackEvent.team_id);

    const orgId = installation.target.organization;
    const spaceId = installation.configuration.recordings_space;

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
