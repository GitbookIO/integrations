// src/widget/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Voting } from '@vaultrice/react-components';

function createVotingRoot(container: HTMLElement, initialState: any) {
    const root = createRoot(container);

    function render(state: any) {
        const votingProps: any = {
            id: state.votingId || state.id || '',
            title: state.title || '',
            description: state.description || '',
            choices: state.choices || [],
            voteLabel: state.voteLabel || 'vote',
            bind: true,
            showPercentage: !!state.showPercentages,
            showTotalVotes: !!state.showTotalVotes,
            userIdForLocalStorage: 'gitbook-user',
            credentials: state.credentials,
            choicesInstanceOptions: {
                class: state.votingClass || '_undefined_',
                ttl: state.tll || 60 * 60 * 1000, // 1 hour in ms
            },
        };
        try {
            if (typeof votingProps.choices === 'string')
                votingProps.choices = JSON.parse(votingProps.choices);
        } catch (e) {
            votingProps.choices = [];
        }

        try {
            root.render(React.createElement(Voting, votingProps));
        } catch (err) {
            // render error fallback
            const fallback = document.createElement('div');
            fallback.textContent = 'Failed to render voting widget';
            container.innerHTML = '';
            container.appendChild(fallback);
            // console.error('Voting render failed', err);
        }
    }

    // render immediately with initial state (if any)
    render(initialState || {});

    return { render, root };
}

/**
 * exported init() — will be called from <script type="module"> in the iframe HTML
 */
export default function init() {
    // guard: we expect to run only in browsers (iframe)
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    let lastState: any = null;
    let mounted = false;
    let votingContainer: HTMLElement | null = null;
    let votingApi: { render: (s: any) => void } | null = null;

    function postAction(action: any) {
        try {
            window.parent.postMessage({ action }, '*');
        } catch (e) {
            // ignore
        }
    }

    function onMessage(event: MessageEvent) {
        // GitBook sends `event.data.state = {...}`
        if (!event.data || typeof event.data !== 'object') return;
        const maybeState = event.data.state;
        if (maybeState && typeof maybeState === 'object') {
            lastState = maybeState;
            if (typeof lastState.credentials === 'string') {
                lastState.credentials = JSON.parse(lastState.credentials);
            }

            // mount if not mounted
            if (!mounted) {
                // create root element if not present
                votingContainer = document.getElementById('root');
                if (!votingContainer) {
                    votingContainer = document.createElement('div');
                    votingContainer.id = 'root';
                    document.body.appendChild(votingContainer);
                }

                votingApi = createVotingRoot(votingContainer, lastState);
                mounted = true;
            } else if (votingApi) {
                votingApi.render(lastState);
            }

            // attempt to notify parent about height
            requestResize();
        }
    }

    function requestResize() {
        try {
            const height =
                document.body.scrollHeight ||
                (votingContainer ? votingContainer.scrollHeight : 300);
            postAction({
                action: '@webframe.resize',
                size: { height: Math.max(height, 200) },
            });
        } catch (e) {
            // ignore
        }
    }

    function onLoaded() {
        postAction({ action: '@webframe.ready' });
        // If the parent already sent state via initial message, it will be picked up by onMessage
    }

    // Listen to messages from parent
    window.addEventListener('message', onMessage);

    // resize observer to adapt when content changes dynamically
    if (typeof (window as any).ResizeObserver !== 'undefined') {
        try {
            const ro = new (window as any).ResizeObserver(() => requestResize());
            ro.observe(document.body);
        } catch (e) {
            // ignore
        }
    }

    // on load, tell parent we're ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onLoaded);
    } else {
        onLoaded();
    }

    // expose a small API for manual invocation if needed
    return {
        getState: () => lastState,
        destroy: () => {
            window.removeEventListener('message', onMessage);
        },
    };
}
