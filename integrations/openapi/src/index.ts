import { createIntegration } from '@gitbook/runtime';

import { configureComponent } from './components';
import { generateContentSource } from './contentSources';

export default createIntegration({
    components: [configureComponent],
    contentSources: [generateContentSource],
});
