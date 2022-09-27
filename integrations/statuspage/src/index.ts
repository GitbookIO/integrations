import { createIntegration } from '@gitbook/runtime';
import { components } from './components';
import { handleFetchEvent } from './fetch';

export default createIntegration({
    fetch: handleFetchEvent,
    components,
});
