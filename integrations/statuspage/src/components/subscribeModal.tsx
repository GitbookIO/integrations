import { createComponent } from '@gitbook/runtime';
import { StatuspageRuntimeContext } from '../configuration';

export const subscribeModal = createComponent<
    {},
    {
        email: string;
    },
    void,
    StatuspageRuntimeContext
>({
    componentId: 'subscribeModal',
    initialState: {
        email: '',
    },
    async render() {
        return (
            <modal title="Subscribe to updates">
                <textinput label="Email" state="email" placeholder="name@domain.com" />
            </modal>
        );
    },
});
