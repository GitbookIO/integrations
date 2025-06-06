import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface GithubInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

export interface GithubSnippetProps {
    url?: string;
    snippetTag?: string;
    snippets?: Array<{
        url: string;
        snippetTag?: string;
        id: string;
    }>;
    visible?: boolean;
}

export interface GithubSimpleProps {
    owner?: string;
    repo?: string;
    branch?: string;
    filePath?: string;
    snippetTag?: string;
    visible?: boolean;
    files?: Array<{
        filePath: string;
        snippetTag?: string;
        id: string;
    }>;
}

export type GithubRuntimeEnvironment = RuntimeEnvironment<GithubInstallationConfiguration, {}>;
export type GithubRuntimeContext = RuntimeContext<GithubRuntimeEnvironment>;
