import { createIntegration } from '@gitbook/runtime';

import { configureComponent } from './components';
import { translateContentSource } from './contentSources';

export default createIntegration({
    components: [configureComponent],
    contentSources: [translateContentSource],
});
