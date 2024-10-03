import { createIntegration } from '@gitbook/runtime';
import { translateContentSource } from './translateContentSource';
import { configureSourceComponent } from './configureSourceComponent';

export default createIntegration({
    contentSources: [translateContentSource],
    components: [configureSourceComponent],
});
