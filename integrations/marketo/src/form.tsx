import { ContentKitIcon } from '@gitbook/api';
import { createComponent } from '@gitbook/runtime';
import { MarketoRuntimeContext } from './types';

type Action = { action: '@ui.modal.close'; returnValue: { formId?: string } };

/**
 * Component to render the block when embeding a Marketo form.
 */
export const marketoFormBlock = createComponent<
    {
        formId?: string | undefined;
    },
    {},
    Action,
    MarketoRuntimeContext
>({
    componentId: 'form',

    async action(element, action, context) {
        switch (action.action) {
            case '@ui.modal.close': {
                return {
                    props: {
                        formId: action.returnValue.formId || undefined,
                    },
                };
            }
            default:
                return element;
        }
    },

    async render(element, { environment }) {
        element.setCache({ maxAge: 0 });
        const formId = element.props.formId || '3317';
        const accountId = environment.installation?.configuration?.account;

        if (!accountId) {
            return (
                <text>
                    Your Marketo integration isn't configured correctly: missing Munchkin account
                    ID.
                </text>
            );
        }

        if (!formId) {
            return (
                <text>Select "Configure" from the block menu to choose which form to embed.</text>
            );
        }

        const webframeURL = new URL(`${environment.integration.urls.publicEndpoint}/webframe`);
        webframeURL.searchParams.set('formId', formId);
        webframeURL.searchParams.set('munchkinId', accountId);

        return (
            <block
                controls={[
                    {
                        label: 'Configure',
                        icon: ContentKitIcon.Settings,
                        onPress: {
                            action: '@ui.modal.open',
                            componentId: 'settingsModal',
                            props: {
                                currentFormId: formId,
                            },
                        },
                    },
                ]}
            >
                <webframe
                    source={{
                        url: webframeURL.toString(),
                    }}
                />
            </block>
        );
    },
});

/**
 * A modal to configure the Mailchimp block.
 */
export const settingsModal = createComponent<
    { currentFormId?: string },
    { formId?: string },
    {},
    MarketoRuntimeContext
>({
    componentId: 'settingsModal',

    initialState: (props) => ({
        formId: props.currentFormId,
    }),

    async render(element, context) {
        return (
            <modal
                title="Edit Marketo form"
                size="medium"
                submit={
                    <button
                        label="Save"
                        onPress={{
                            action: '@ui.modal.close',
                            returnValue: {
                                formId: element.dynamicState('formId'),
                            },
                        }}
                    />
                }
            >
                <vstack>
                    <box>
                        <text>Marketo form id</text>
                        <textinput state="formId" />
                    </box>
                </vstack>
            </modal>
        );
    },
});
