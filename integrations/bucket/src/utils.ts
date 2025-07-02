import { BucketRuntimeEnvironment } from './types';

export function assertSiteInstallation(environment: BucketRuntimeEnvironment) {
    const siteInstallation = environment.siteInstallation;
    if (!siteInstallation) {
        throw new Error('Expected a site installation, but none was found');
    }

    return siteInstallation;
}

export function assertInstallation(environment: BucketRuntimeEnvironment) {
    const installation = environment.installation;
    if (!installation) {
        throw new Error('Expected an installation, but none was found');
    }

    return installation;
}
