import { GitBookAPI } from '@gitbook/api';

import { SlackRuntimeContext } from '../configuration';
import { slackAPI } from '../slack';
import { getInstallationConfig } from '../utils';

function slackTimestampToISOFormat(slackTs) {
    const timestampInMilliseconds = parseFloat(slackTs) * 1000;

    const date = new Date(timestampInMilliseconds);

    const formattedDate = date.toISOString();

    return formattedDate;
}

/**
 *  Get the installation API client for a given slack org and gitbook org combination
 *
 * TODO: there's a HARD limitation on having one slack team per gitbook org.
 */
export async function getInstallationApiClient(api: GitBookAPI, externalId: string) {
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

/**
 * Creates a capture from a message thread
 *
 * 1. Get all messages in a thread
 * 2. Start capture
 * 3. Add all messages in a thread as capture events
 * 4. Stop capture
 */
export async function createMessageThreadCapture(slackEvent, context: SlackRuntimeContext) {
    const { api } = context;
    const { installation } = await getInstallationApiClient(api, slackEvent.team_id);

    const orgId = installation.target.organization;

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

    // get a permalink to the thread
    const permalinkRes = (await slackAPI(
        context,
        {
            method: 'GET',
            path: 'chat.getPermalink',
            payload: {
                channel,
                message_ts: thread_ts,
            },
        },
        {
            accessToken,
        }
    )) as { ok: boolean; permalink: string };

    // TODO what's to be done with new permissions needed "capture:write" and users needing to re-auth

    // start capture
    const startCaptureRes = await installationApiClient.orgs.startCapture(orgId, {
        context: 'thread',
        externalId: thread_ts,
        ...(permalinkRes.ok ? { externalURL: permalinkRes.permalink } : {}),
    });

    const capture = startCaptureRes.data;

    const events = messages.map((message) => {
        const { text, ts, thread_ts } = message;

        return {
            type: 'thread.message',
            text,
            timestamp: slackTimestampToISOFormat(ts),
            ...(ts === thread_ts ? { isFirst: true } : {}),
        };
    });

    // add all messages in a thread to a capture
    await installationApiClient.orgs.addEventsToCapture(orgId, capture.id, {
        events,
    });

    // stop capture
    const stopCaptureRes = await installationApiClient.orgs.stopCapture(
        orgId,
        capture.id,
        {}, // remove in api
        {
            format: 'markdown',
        }
    );

    const outputCapture = stopCaptureRes.data;

    return outputCapture;
}
