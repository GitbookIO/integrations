import { createIntegration } from '@gitbook/runtime';
import { translateContentSource } from './translateContentSource';
import { configureComponent } from './configureComponent';
import { configureSourceComponent } from './configureSourceComponent';

export default createIntegration({
    contentSources: [translateContentSource],
    components: [configureComponent, configureSourceComponent],
});
