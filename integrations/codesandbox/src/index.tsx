import {
    createIntegration,
    createComponent,
    RuntimeEnvironment,
    RuntimeContext,
} from '@gitbook/runtime';

import { extractCodeSandboxLinkPropsFromURL } from './codesandbox';

interface CodeSandboxInstallationConfiguration {}

type CodeSandboxRuntimeEnvironment = RuntimeEnvironment<CodeSandboxInstallationConfiguration>;
type CodeSandboxRuntimeContext = RuntimeContext<CodeSandboxRuntimeEnvironment>;

/**
 * Component to render the block when embedding the CodeSandBoxOEmbed URL.
 */
const embedBlock = createComponent<{
    subdomain?: string;
    linkValue?: string;
    codeSandBoxId?: string;
    url?: string;
}>({
    componentId: 'codesandbox',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                const nodeProps = extractCodeSandboxLinkPropsFromURL(url);

                return {
                    props: {
                        ...nodeProps,
                        url,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { environment } = context;
        const { url, codeSandBoxId, search } = element.props;

        // Display card if no ID is returned
        if (!codeSandBoxId) {
            return (
                <block>
                    <card
                        title={'CodeSandbox'}
                        onPress={{
                            action: '@ui.url.open',
                            url,
                        }}
                        icon={
                            <image
                                source={{
                                    url: environment.integration.urls.icon,
                                }}
                                aspectRatio={1}
                            />
                        }
                    />
                </block>
            );
        }
        return (
            <block>
                <webframe
                    source={{
                        url: `https://codesandbox.io/embed/${codeSandBoxId}?view=split&fontsize=12&hidedevtools=1&editorsize=60`,
                    }}
                    aspectRatio={2 / 1}
                />
            </block>
        );
    },
});

export default createIntegration<CodeSandboxRuntimeContext>({
    components: [embedBlock],
});
