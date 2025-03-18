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
        const formId = element.props.formId;
        const accountId = environment.installation?.configuration?.account;

        const cacheKey = getWebframeCacheKey();
        const webframeURL = new URL(`${environment.integration.urls.publicEndpoint}/webframe`);
        webframeURL.searchParams.set('formId', formId || '');
        webframeURL.searchParams.set('munchkinId', accountId || '');
        webframeURL.searchParams.set('v', cacheKey);

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
                            Select "Configure" from the block control menu to choose the form you'd
                            like to embed.
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
    { currentFormId?: string },
    { formId?: string },
    {},
    MarketoRuntimeContext
>({
    componentId: 'settingsModal',

    initialState: (props) => ({
        formId: props.currentFormId || '',
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
                        <text>Marketo Form ID</text>
                        <textinput state="formId" />
                    </box>
                </vstack>
            </modal>
        );
    },
});
