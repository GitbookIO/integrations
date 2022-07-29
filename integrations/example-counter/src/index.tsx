/** @jsx contentKitHyperscript */

import { createComponentCallback, contentKitHyperscript } from '@gitbook/runtime';

interface CounterBlockProps {}

interface CounterBlockState {
    count: number;
}

interface CounterModalProps {
    value: number;
}

type CounterBlockAction =
    | {
          action: 'increment';
      }
    | {
          action: 'decrement';
      }
    | {
          action: '@ui.modal.close';
          returnValue: CounterModalProps;
      };

createComponentCallback<CounterBlockProps, CounterBlockState, CounterBlockAction>({
    componentId: 'counter',
    initialState: {
        count: 0,
    },
    action: async (previous, action) => {
        switch (action.action) {
            case 'increment':
                return {
                    ...previous,
                    state: {
                        count: previous.state.count + 1,
                    },
                };

            case 'decrement':
                return {
                    ...previous,
                    state: {
                        count: previous.state.count + 1,
                    },
                };

            case '@ui.modal.close':
                return {
                    ...previous,
                    state: {
                        count: action.returnValue.value,
                    },
                };

            default:
                return previous;
        }
    },

    render: async ({ state }) => {
        return (
            <block>
                <hstack>
                    <box>
                        <text>Count is {state.count}</text>
                    </box>
                    <spacer />
                    <box>
                        <button label="-1" action={{ action: 'decrement' }} />
                    </box>
                    <box>
                        <button label="+1" action={{ action: 'increment' }} />
                    </box>
                    <box>
                        <button
                            label="Set"
                            action={{
                                action: '@ui.modal.open',
                                componentId: 'modal-set',
                                props: { value: state.count },
                            }}
                        />
                    </box>
                </hstack>
            </block>
        );
    },
});

createComponentCallback<CounterModalProps>({
    componentId: 'modal-set',
    initialState: {},
    action: async (previous, action) => {
        return previous;
    },
    render: async ({ props }) => {
        return (
            <modal title="Set count">
                <textinput label="Count" initial_value={props.value} />
            </modal>
        );
    },
});
