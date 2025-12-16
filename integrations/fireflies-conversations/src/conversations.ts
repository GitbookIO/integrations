import pMap from 'p-map';
import { ConversationInput } from '@gitbook/api';
import { ExposableError, Logger } from '@gitbook/runtime';
import { FirefliesRuntimeContext, FirefliesTranscript, FirefliesGraphQLResponse } from './types';
import { firefliesGraphQLRequest } from './client';

const logger = Logger('fireflies-conversations:conversations');

/**
 * GraphQL query to fetch transcripts with sentences.
 */
const TRANSCRIPTS_QUERY = `
  query Transcripts($limit: Int, $skip: Int, $fromDate: DateTime) {
    transcripts(limit: $limit, skip: $skip, fromDate: $fromDate) {
      id
      title
      date
      duration
      transcript_url
      sentences {
        index
        speaker_name
        speaker_id
        text
        start_time
        end_time
      }
      speakers {
        id
        name
      }
      participants
      host_email
      organizer_email
    }
  }
`;

/**
 * Ingest transcripts from Fireflies.
 */
export async function ingestConversations(context: FirefliesRuntimeContext) {
    const { installation } = context.environment;
    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const limit = 50; // Fireflies API max limit is 50
    const maxPages = 20; // Limit total pages to prevent excessive API calls
    let skip = 0;
    let pageIndex = 0;
    let totalIngestedTranscripts = 0;

    logger.info(
        `Starting ingestion of transcripts from Fireflies for organization: ${installation.target.organization}`,
    );

    // Get transcripts from the last 30 days
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    const fromDateISO = fromDate.toISOString();

    while (pageIndex < maxPages) {
        pageIndex += 1;

        try {
            // Get transcripts from Fireflies using GraphQL
            const response = await firefliesGraphQLRequest<
                FirefliesGraphQLResponse<FirefliesTranscript[]>
            >(context, TRANSCRIPTS_QUERY, {
                limit,
                skip,
                fromDate: fromDateISO,
            });

            const transcripts = response.data?.transcripts || [];

            if (transcripts.length === 0) {
                logger.info('No more transcripts to fetch');
                break;
            }

            logger.debug(`Fetched ${transcripts.length} transcripts`, { skip, pageIndex });

            if (transcripts.length > 0) {
                const gitbookConversations = await pMap(
                    transcripts,
                    async (transcript) => {
                        return await parseTranscriptAsGitBook(context, transcript);
                    },
                    {
                        concurrency: 3,
                    },
                );

                if (gitbookConversations.length > 0) {
                    await context.api.orgs.ingestConversation(
                        installation.target.organization,
                        gitbookConversations,
                    );
                }
            }

            totalIngestedTranscripts += transcripts.length;

            // If we got fewer results than the limit, we've reached the end
            if (transcripts.length < limit) {
                break;
            }

            skip += limit;
        } catch (error) {
            logger.error('Failed to fetch transcripts from Fireflies', {
                error: error instanceof Error ? error.message : String(error),
                skip,
                pageIndex,
            });
            // Break on error to avoid infinite loops
            break;
        }
    }

    logger.info(`Ingested ${totalIngestedTranscripts} transcripts from Fireflies`);
}

/**
 * Parse a Fireflies transcript into a GitBook conversation.
 */
export async function parseTranscriptAsGitBook(
    context: FirefliesRuntimeContext,
    transcript: FirefliesTranscript,
): Promise<ConversationInput> {
    const { installation } = context.environment;
    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const resultConversation: ConversationInput = {
        id: transcript.id,
        metadata: {
            url: transcript.transcript_url || `https://app.fireflies.ai/viewer/${transcript.id}`,
            attributes: {
                transcriptId: transcript.id,
                title: transcript.title,
                duration: transcript.duration,
            },
            createdAt: new Date(transcript.date).toISOString(),
        },
        parts: [],
    };

    // Convert sentences to conversation parts
    const sentences = transcript.sentences || [];

    // Create a map of speaker IDs to determine if they're team members
    // We'll consider the host/organizer as team members, others as users
    const teamMemberSpeakerIds = new Set<string>();
    if (transcript.host_email) {
        const hostSpeaker = transcript.speakers?.find(
            (s) =>
                s.name.toLowerCase().includes(transcript.host_email?.toLowerCase() || '') ||
                transcript.participants?.some((p) => p === transcript.host_email),
        );
        if (hostSpeaker) {
            teamMemberSpeakerIds.add(hostSpeaker.id);
        }
    }
    if (transcript.organizer_email) {
        const organizerSpeaker = transcript.speakers?.find(
            (s) =>
                s.name.toLowerCase().includes(transcript.organizer_email?.toLowerCase() || '') ||
                transcript.participants?.some((p) => p === transcript.organizer_email),
        );
        if (organizerSpeaker) {
            teamMemberSpeakerIds.add(organizerSpeaker.id);
        }
    }

    // If we can't determine team members, default to treating all speakers as users
    const hasTeamMembers = teamMemberSpeakerIds.size > 0;

    for (const sentence of sentences) {
        if (sentence.text && sentence.text.trim()) {
            // Determine role: if we have team members identified, use that; otherwise default to user
            const isTeamMember =
                hasTeamMembers &&
                sentence.speaker_id &&
                teamMemberSpeakerIds.has(sentence.speaker_id);

            const role = isTeamMember ? 'team-member' : 'user';

            logger.debug('Processing sentence', {
                transcriptId: transcript.id,
                speakerId: sentence.speaker_id,
                speakerName: sentence.speaker_name,
                role,
            });

            resultConversation.parts.push({
                type: 'message',
                role,
                body: sentence.text,
            });
        }
    }

    logger.debug('Parsed transcript as GitBook conversation', {
        transcriptId: transcript.id,
        sentenceCount: sentences.length,
        partCount: resultConversation.parts.length,
    });

    return resultConversation;
}
