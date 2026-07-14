export const webFrameHTML: string = `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="light dark">
        <title>Visitor claims webframe demo</title>
        <style>
            :root {
                color-scheme: light dark;
                font-family:
                    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
                    sans-serif;
                background: #f8fafc;
                color: #111827;
            }

            * {
                box-sizing: border-box;
            }

            body {
                margin: 0;
                padding: 16px;
                background: #f8fafc;
            }

            main {
                display: grid;
                gap: 12px;
                max-width: 960px;
            }

            h1,
            h2,
            p {
                margin: 0;
            }

            h1 {
                font-size: 18px;
                font-weight: 700;
            }

            h2 {
                font-size: 13px;
                font-weight: 700;
                text-transform: uppercase;
                color: #4b5563;
            }

            .panel {
                border: 1px solid #d1d5db;
                border-radius: 8px;
                background: #ffffff;
                padding: 14px;
            }

            .status {
                display: grid;
                gap: 4px;
                border-left: 4px solid #f59e0b;
            }

            .status.has-visitor {
                border-left-color: #22c55e;
            }

            .status-title {
                font-weight: 700;
            }

            .status-detail {
                color: #4b5563;
                font-size: 13px;
            }

            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                gap: 12px;
            }

            pre {
                margin: 10px 0 0;
                padding: 12px;
                overflow: auto;
                border-radius: 6px;
                background: #111827;
                color: #f9fafb;
                font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                white-space: pre-wrap;
                word-break: break-word;
            }

            code {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            }

            @media (prefers-color-scheme: dark) {
                :root,
                body {
                    background: #030712;
                    color: #f9fafb;
                }

                .panel {
                    background: #111827;
                    border-color: #374151;
                }

                h2,
                .status-detail {
                    color: #d1d5db;
                }

                pre {
                    background: #030712;
                    color: #f9fafb;
                    border: 1px solid #374151;
                }
            }
        </style>
    </head>
    <body>
        <main>
            <section class="panel">
                <h1>Visitor claims webframe demo</h1>
            </section>

            <section class="panel status" data-status-panel>
                <p class="status-title" data-status>No webframe state received yet.</p>
            </section>

            <section class="panel">
                <h2>Full webframe state</h2>
                <pre data-state>{}</pre>
            </section>

            <section class="grid">
                <article class="panel">
                    <h2>state.visitor</h2>
                    <pre data-visitor>null</pre>
                </article>
            </section>

           
        </main>

        <script>
            const gitbookWebFrame = window.parent;
            const statusPanel = document.querySelector('[data-status-panel]');
            const status = document.querySelector('[data-status]');
            const stateOutput = document.querySelector('[data-state]');
            const visitorOutput = document.querySelector('[data-visitor]');
            

            function sendAction(payload) {
                gitbookWebFrame?.postMessage({ action: payload }, '*');
            }

            function format(value) {
                return JSON.stringify(value, null, 2);
            }

            function resize() {
                window.requestAnimationFrame(() => {
                    const height = Math.max(
                        document.documentElement.scrollHeight,
                        document.body.scrollHeight,
                        120,
                    );

                    sendAction({
                        action: '@webframe.resize',
                        size: {
                            height,
                            aspectRatio: window.innerWidth / height,
                        },
                    });
                });
            }

            function renderState(state) {
                const visitor = state?.visitor;
                const hasVisitor = Boolean(visitor);

                stateOutput.textContent = format(state ?? {});
                visitorOutput.textContent = format(visitor ?? null);

                statusPanel.classList.toggle('has-visitor', hasVisitor);
                status.textContent = hasVisitor
                    ? 'Visitor context received.'
                    : 'No visitor context received.';

                resize();
            }

            window.addEventListener('message', (event) => {
                const state = event.data?.state;
                if (!state) {
                    return;
                }

                console.info('visitor-claims-webframe-demo: received state', state);
                renderState(state);
            });

            sendAction({ action: '@webframe.ready' });
            resize();
        </script>
    </body>
</html>
`;
