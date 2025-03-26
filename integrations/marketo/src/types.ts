import { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type MarketoRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            account?: string;
            workspace?: string;
        }
    >
>;
