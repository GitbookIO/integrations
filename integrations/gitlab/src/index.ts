import { createIntegration } from '@gitbook/runtime';

import { GitLabRuntimeContext } from './configuration';
import {
    handleSpaceContentUpdatedEvent,
    handleSpaceGitSyncProgressStatusEvents,
    handleSpaceInstallationSetupEvent,
} from './events';
import { handleFetchEvent } from './router';

export default createIntegration<GitLabRuntimeContext>({
    fetch: handleFetchEvent,

    events: {
        space_installation_setup: handleSpaceInstallationSetupEvent,
        space_gitsync_started: handleSpaceGitSyncProgressStatusEvents,
        space_gitsync_completed: handleSpaceGitSyncProgressStatusEvents,
        space_content_updated: handleSpaceContentUpdatedEvent,
    },
});
