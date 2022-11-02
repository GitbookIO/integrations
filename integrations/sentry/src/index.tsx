import { createIntegration } from '@gitbook/runtime';

import { embedBlock } from './blocks';
import { SentryRuntimeContext } from './types';

export default createIntegration<SentryRuntimeContext>({
    components: [embedBlock],
});
