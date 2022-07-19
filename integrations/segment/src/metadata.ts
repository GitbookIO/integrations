import { name, version } from '../package.json';

export const IntegrationInfo = {
    name: name.replace('@', ''),
    version,
}