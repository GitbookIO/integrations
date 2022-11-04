import { createIntegration } from '@gitbook/runtime';

import { components } from './components';
import { StatuspageRuntimeContext } from './configuration';
import { handleFetchEvent } from './fetch';

export default createIntegration<StatuspageRuntimeContext>({
    fetch: handleFetchEvent,
    components,
});
