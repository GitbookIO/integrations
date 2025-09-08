import { ContentKitIcon } from '@gitbook/api';
import { createComponent } from '@gitbook/runtime';
import { MarketoRuntimeContext } from './types';
import { getWebframeCacheKey } from './cache';

type Action = { action: '@ui.modal.close'; returnValue: { formId?: string } };

/**
 * Component to render the block when embeding a Marketo form.
 */
export const marketoFormBlock = createComponent<
    {
        formId?: string | undefined;
        message?: string | undefined;
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
                        message: action.returnValue.message || undefined,
                    },
                };
            }
            default:
                return element;
        }
    },

    async render(element, { environment }) {
        element.setCache({ maxAge: 0 });
        const formId = element.props.formId;
        const message = element.props.message;
        const accountId = environment.installation?.configuration?.account;

        const cacheKey = getWebframeCacheKey();
        const webframeURL = new URL(`${environment.integration.urls.publicEndpoint}/webframe`);
        webframeURL.searchParams.set('formId', formId || '');
        webframeURL.searchParams.set('munchkinId', accountId || '');
        webframeURL.searchParams.set('v', cacheKey);
        if (element.props.message) {
            webframeURL.searchParams.set(
                'message',
                encodeURIComponent(element.props.message) || '',
            );
        }

        return (
            <block
                controls={[
                    {
                        label: 'Select Marketo form',
                        icon: ContentKitIcon.Settings,
                        onPress: {
                            action: '@ui.modal.open',
                            componentId: 'settingsModal',
                            props: {
                                currentFormId: formId,
                                currentMessage: message,
                            },
                        },
                    },
                ]}
            >
                {!accountId ? (
                    <hint>
                        <text style="bold">
                            Your Marketo integration isn't configured correctly: missing Munchkin
                            account ID.
                        </text>
                    </hint>
                ) : !formId ? (
                    <hint>
                        <text style="bold">
                            Marketo Form: use the block menu to choose the form you'd like to embed.
                        </text>
                    </hint>
                ) : (
                    <webframe
                        source={{
                            url: webframeURL.toString(),
                        }}
                    />
                )}
            </block>
        );
    },
});

/**
 * A modal to configure the Mailchimp block.
 */
export const settingsModal = createComponent<
    { currentFormId?: string; currentMessage?: string },
    { formId?: string; message?: string },
    {},
    MarketoRuntimeContext
>({
    componentId: 'settingsModal',

    initialState: (props) => ({
        formId: props.currentFormId || '',
        message: props.currentMessage || '',
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
                                message: element.dynamicState('message'),
                            },
                        }}
                    />
                }
            >
                <vstack>
                    <box>
                        <text>Marketo Form ID</text>
                        <textinput state="formId" />
                    </box>
                    <box>
                        <text>Optional Post-Submit Message</text>
                        <textinput state="message" />
                    </box>
                </vstack>
            </modal>
        );
    },
});
