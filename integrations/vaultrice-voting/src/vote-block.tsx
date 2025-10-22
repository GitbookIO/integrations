import { createComponent } from '@gitbook/runtime';

interface VotingChoice {
    id: string;
    label: string;
}

const DEFAULT_CHOICES = [
    { id: 'option-a', label: 'Option A' },
    { id: 'option-b', label: 'Option B' },
] as VotingChoice[];

const DEFAULTS = {
    votingId: 'voting-xyz',
    votingClass: '_undefined_',
    title: 'Sample Voting',
    description: 'Choose your preferred option',
    choices: JSON.stringify(DEFAULT_CHOICES, null, 2),
    voteLabel: 'vote',
    showPercentages: false,
    showTotalVotes: true,
    ttl: 60 * 60 * 1000,
};

export const VoteBlock = createComponent({
    componentId: 'vote-block',

    /**
     * initialState uses props if present (persisted), otherwise sensible defaults.
     * IMPORTANT: editors bind to state; Save will copy state => props.
     */
    initialState: (props: any) => ({
        votingId: props.votingId ?? DEFAULTS.votingId,
        votingClass: props.votingClass ?? DEFAULTS.votingClass,
        title: props.title ?? DEFAULTS.title,
        description: props.description ?? DEFAULTS.description,
        choices: props.choices ?? DEFAULTS.choices, // JSON string
        voteLabel: props.voteLabel ?? DEFAULTS.voteLabel,
        showPercentages: props.showPercentages ?? DEFAULTS.showPercentages,
        showTotalVotes: props.showTotalVotes ?? DEFAULTS.showTotalVotes,
        ttl: props.ttl ?? DEFAULTS.ttl,
    }),

    /**
     * Actions:
     * - save: persist current state to props (commit)
     * - reset: discard unsaved changes (revert to props)
     */
    action: async (element: any, action: any) => {
        switch (action.action) {
            case 'save': {
                // Validate choices JSON
                let parsedChoices: VotingChoice[] = [];
                try {
                    const raw = element.state.choices ?? '';
                    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    if (!Array.isArray(parsed)) throw new Error('choices must be an array');
                    parsedChoices = parsed.map((c) => ({
                        id: String(c.id ?? '').trim(),
                        label: String(c.label ?? '').trim(),
                    }));
                    if (parsedChoices.some((c) => !c.id || !c.label)) {
                        throw new Error('each choice must have non-empty id and label');
                    }
                } catch (e) {
                    // Keep state as-is; you could also surface a modal/hint here if desired.
                    console.error('Invalid choices JSON', e);
                    return {};
                }

                // Build the props to persist
                const newProps = {
                    votingId: element.state.votingId,
                    votingClass: element.state.votingClass,
                    title: element.state.title,
                    description: element.state.description,
                    choices: JSON.stringify(parsedChoices, null, 2), // store normalized JSON string
                    voteLabel: element.state.voteLabel,
                    showPercentages: !!element.state.showPercentages,
                    showTotalVotes: !!element.state.showTotalVotes,
                    ttl: Number(element.state.ttl) || DEFAULTS.ttl,
                };

                // Return both props (persist) and state (sync UI to saved form)
                return {
                    props: newProps,
                    state: newProps,
                };
            }

            case 'reset': {
                // Revert state from current persisted props
                const p = element.props || {};
                const reverted = {
                    votingId: p.votingId ?? DEFAULTS.votingId,
                    votingClass: p.votingClass ?? DEFAULTS.votingClass,
                    title: p.title ?? DEFAULTS.title,
                    description: p.description ?? DEFAULTS.description,
                    choices: p.choices ?? DEFAULTS.choices,
                    voteLabel: p.voteLabel ?? DEFAULTS.voteLabel,
                    showPercentages: p.showPercentages ?? DEFAULTS.showPercentages,
                    showTotalVotes: p.showTotalVotes ?? DEFAULTS.showTotalVotes,
                    ttl: p.ttl ?? DEFAULTS.ttl,
                };
                return { state: reverted };
            }

            default:
                return {};
        }
    },

    async render(element, { environment }) {
        if (element.context.type !== 'document') {
            throw new Error('Voting widget can only be used in documents');
        }

        const { editable } = element.context;

        // Get configuration from the integration
        const installConfig = environment.installation?.configuration;

        element.setCache({
            maxAge: 3600, // Cache for 1 hour
        });

        const url = new URL(environment.integration.urls.publicEndpoint);
        url.searchParams.set('v', String(environment.integration.version));

        let parsedChoices = [];
        try {
            parsedChoices = JSON.parse(element.state.choices || '[]');
        } catch (e) {}

        const votingWidget = (
            <webframe
                source={{
                    url: url.toString(),
                }}
                aspectRatio={7 / (parsedChoices.length < 3 ? 4 : parsedChoices.length + 1)}
                data={{
                    votingId: element.dynamicState('votingId'),
                    votingClass: element.dynamicState('votingClass'),
                    title: element.dynamicState('title'),
                    description: element.dynamicState('description'),
                    choices: element.dynamicState('choices'),
                    voteLabel: element.dynamicState('voteLabel'),
                    credentials: JSON.stringify({
                        projectId: installConfig?.projectId,
                        apiKey: installConfig?.apiKey,
                        apiSecret: installConfig?.apiSecret,
                    }),
                    showPercentages: element.dynamicState('showPercentages'),
                    showTotalVotes: element.dynamicState('showTotalVotes'),
                    ttl: element.dynamicState('ttl'),
                }}
            />
        );

        if (editable) {
            return (
                <block>
                    <card title="Vaultrice Voting Widget Configuration">
                        <vstack>
                            <card title="General">
                                <vstack>
                                    <text style="bold">Voting ID</text>
                                    <textinput state="votingId" placeholder="Voting id" />

                                    <divider size="small" />

                                    <text style="bold">Voting Class</text>
                                    <textinput state="votingClass" placeholder="Voting classs" />

                                    <divider size="small" />

                                    <text style="bold">Voting Title</text>
                                    <textinput state="title" placeholder="Voting title" />

                                    <divider size="small" />

                                    <text style="bold">Voting description (optional)</text>
                                    <textinput
                                        state="description"
                                        placeholder="Voting description"
                                    />

                                    <divider size="small" />

                                    <hstack>
                                        <text style="bold">TTL (ms)</text>
                                        <textinput state="ttl" placeholder="Time to live in ms" />

                                        <text style="bold">Vote button label</text>
                                        <textinput
                                            state="voteLabel"
                                            placeholder="Vote button label"
                                        />
                                    </hstack>
                                </vstack>
                            </card>

                            <divider size="small" />

                            <card
                                title="Choices"
                                hint="Provide a JSON array of choices, each with `id` and `label`."
                            >
                                <codeblock
                                    state="choices"
                                    content={String(element.state.choices)}
                                    syntax="json"
                                />
                            </card>

                            <divider size="small" />

                            <card title="Options">
                                <hstack>
                                    <text style="bold">Show Percentages</text>
                                    <switch state="showPercentages" />

                                    <divider size="small" />

                                    <text style="bold">Show Total Votes</text>
                                    <switch state="showTotalVotes" />
                                </hstack>
                            </card>

                            <divider size="medium" />

                            <hstack align="center">
                                <button
                                    label="💾 Save"
                                    style="primary"
                                    onPress={{ action: 'save' }}
                                />
                                {/* <button
                  label='↩ Reset'
                  style='secondary'
                  onPress={{ action: 'reset' }}
                /> */}
                            </hstack>

                            <divider size="medium" />

                            <card title="Preview">{votingWidget}</card>
                        </vstack>
                    </card>
                </block>
            );
        }

        return <block>{votingWidget}</block>;
    },
});
