import { describe, it, expect } from 'bun:test';
import { extractIntentFromMessage } from '../src/actions/intent/classifier';

describe('Action intent classifier', () => {
    const testCases: [string, 'ingest' | 'question'][] = [
        ['hey @gitbook use this to improve our docs', 'ingest'],
        ['hey @gitbook, can you use this to improve our docs', 'ingest'],
        ['please import the feedback in this thread to help improve the docs', 'ingest'],
        ['can you import this conversation to improve the docs', 'ingest'],
        ['add this to our knowledge base', 'ingest'],
        ['can you ingest this customer feedback?', 'ingest'],
        ['upload these files for ingestion', 'ingest'],
        ['store this conversation in our internal documentation', 'ingest'],
        ['log this chat for future reference', 'ingest'],
        ['capture feedback from this thread and add it to the guides', 'ingest'],
        ['please add these notes to our documentation repository', 'ingest'],
        ['document this discussion for the team', 'ingest'],

        ['how do I reset my password?', 'question'],
        ['what is the support email?', 'question'],
        ['can you tell me the documentation link?', 'question'],
        ['where can I find the user guide?', 'question'],
        ['who should I contact for access?', 'question'],
        ['how do I create a change request?', 'question'],
        ['when will the next release be available?', 'question'],
        ['how do I edit a change request', 'question'],
        ['is there a guide for onboarding new members?', 'question'],
        ['what should I do if I encounter an error?', 'question'],
        ['can you explain the workflow for submitting a bug?', 'question'],
        ['where can I find the latest version of the manual?', 'question'],
    ];

    it.each(testCases)('should classify "%s" as %s', async (input, expectedIntent) => {
        const result = await extractIntentFromMessage(input);

        expect(result.intent).toBe(expectedIntent);
        expect(result.confidence).toBeGreaterThan(0.5);
    });
});
