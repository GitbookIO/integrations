import { ReflagRuntimeEnvironment } from './types';

export function assertSiteInstallation(environment: ReflagRuntimeEnvironment) {
    const siteInstallation = environment.siteInstallation;
    if (!siteInstallation) {
        throw new Error('Expected a site installation, but none was found');
    }

    return siteInstallation;
}

export function assertInstallation(environment: ReflagRuntimeEnvironment) {
    const installation = environment.installation;
    if (!installation) {
        throw new Error('Expected an installation, but none was found');
    }

    return installation;
}
