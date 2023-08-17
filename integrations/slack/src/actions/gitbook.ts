const orgId = 'TdvOhBZeNlhXIANE35Zl';
const spaceId = 'sobfe0QALfpHjq2hgfhd';

function slackTimestampToISOFormat(slackTs) {
    const timestampInMilliseconds = parseFloat(slackTs) * 1000;

    const date = new Date(timestampInMilliseconds);

    const formattedDate = date.toISOString();

    return formattedDate;
}

async function getInstallationApiClient(api, externalId: string) {
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations('slack', {
        externalId,
    });

    const installation = installations[0];
    if (!installation) {
        return {};
    }

    // console.log('installation id ', installation.id);
    // Authentify as the installation
    const installationApiClient = await api.createInstallationClient('slack', installation.id);

    return installationApiClient;
}

async function fetchThreadPosts(channel, thread_ts, slackBotToken) {
    const slackRes = await fetch(
        `https://slack.com/api/conversations.replies?channel=${channel}&ts=${thread_ts}`,
        {
            headers: {
                Authorization: `Bearer ${slackBotToken}`,
            },
        }
    );

    return (await slackRes.json()).messages ?? [];
}

export async function createMessageThreadRecording(context, slackEvent) {
    const { api, environment } = context;
    const slackBotToken = environment.secrets.BOT_TOKEN;

    const { team_id, channel, thread_ts } = slackEvent;

    const installationApiClient = await getInstallationApiClient(api, team_id);
    const threadPosts = await fetchThreadPosts(channel, thread_ts, slackBotToken);

    const startRecordingRes = await installationApiClient.orgs.startRecording(orgId, {
        space: spaceId,
        context: 'chat',
    });

    const recording = startRecordingRes.data;

    const events = threadPosts.map((post) => {
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

    return outputRecording;
}
