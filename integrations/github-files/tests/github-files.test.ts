import { describe, it, expect } from 'bun:test';

import { splitGithubUrl } from '../src/github';

describe('splitGithubUrl', () => {
    describe('valid GitHub URLs', () => {
        it('should split a basic GitHub URL', () => {
            const url = 'https://github.com/gitbookio/gitbook/blob/master/README.md';
            const result = splitGithubUrl(url);
            expect(result).toEqual({
                orgName: 'gitbookio',
                repoName: 'gitbook',
                fileName: 'README.md',
                ref: 'master',
                lines: [],
            });
        });

        it('should split GitHub URL with line range', () => {
            const url = 'https://github.com/gitbookio/gitbook/blob/master/README.md#L1-L2';
            const result = splitGithubUrl(url);
            expect(result).toEqual({
                orgName: 'gitbookio',
                repoName: 'gitbook',
                fileName: 'README.md',
                ref: 'master',
                lines: [1, 2],
            });
        });

        it('should split GitHub URL with single line', () => {
            const url = 'https://github.com/gitbookio/gitbook/blob/master/README.md#L1';
            const result = splitGithubUrl(url);
            expect(result).toEqual({
                orgName: 'gitbookio',
                repoName: 'gitbook',
                fileName: 'README.md',
                ref: 'master',
                lines: [1, 1],
            });
        });

        it('should handle repo names with dots', () => {
            const url = 'https://github.com/vercel/next.js/blob/canary/package.json';
            const result = splitGithubUrl(url);
            expect(result).toEqual({
                orgName: 'vercel',
                repoName: 'next.js',
                fileName: 'package.json',
                ref: 'canary',
                lines: [],
            });
        });

        it('should handle repo names with hyphens and underscores', () => {
            const url = 'https://github.com/vercel/next-learn/blob/main/package.json';
            const result = splitGithubUrl(url);
            expect(result).toEqual({
                orgName: 'vercel',
                repoName: 'next-learn',
                fileName: 'package.json',
                ref: 'main',
                lines: [],
            });
        });

        it('should handle nested file paths', () => {
            const url = 'https://github.com/facebook/react/blob/main/src/index.js';
            const result = splitGithubUrl(url);
            expect(result).toEqual({
                orgName: 'facebook',
                repoName: 'react',
                fileName: 'src/index.js',
                ref: 'main',
                lines: [],
            });
        });

        it('should handle deeply nested file paths', () => {
            const url =
                'https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/terminal/browser/terminal.ts';
            const result = splitGithubUrl(url);
            expect(result).toEqual({
                orgName: 'microsoft',
                repoName: 'vscode',
                fileName: 'src/vs/workbench/contrib/terminal/browser/terminal.ts',
                ref: 'main',
                lines: [],
            });
        });

        it('should handle URLs with query parameters', () => {
            const url = 'https://github.com/gitbookio/gitbook/blob/master/README.md?query=test';
            const result = splitGithubUrl(url);
            expect(result).toEqual({
                orgName: 'gitbookio',
                repoName: 'gitbook',
                fileName: 'README.md',
                ref: 'master',
                lines: [],
            });
        });

        it('should handle URLs with both query parameters and line numbers', () => {
            const url =
                'https://github.com/gitbookio/gitbook/blob/master/README.md?query=test#L5-L10';
            const result = splitGithubUrl(url);
            expect(result).toEqual({
                orgName: 'gitbookio',
                repoName: 'gitbook',
                fileName: 'README.md',
                ref: 'master',
                lines: [5, 10],
            });
        });

        it('should handle HTTP URLs', () => {
            const url = 'http://github.com/gitbookio/gitbook/blob/master/README.md';
            const result = splitGithubUrl(url);
            expect(result).toEqual({
                orgName: 'gitbookio',
                repoName: 'gitbook',
                fileName: 'README.md',
                ref: 'master',
                lines: [],
            });
        });

        it('should handle organization names with hyphens', () => {
            const url = 'https://github.com/microsoft-docs/azure-docs/blob/main/README.md';
            const result = splitGithubUrl(url);
            expect(result).toEqual({
                orgName: 'microsoft-docs',
                repoName: 'azure-docs',
                fileName: 'README.md',
                ref: 'main',
                lines: [],
            });
        });
    });

    describe('invalid GitHub URLs', () => {
        it('should return undefined for non-GitHub URLs', () => {
            const url = 'https://gitlab.com/gitbookio/gitbook/blob/master/README.md';
            const result = splitGithubUrl(url);
            expect(result).toBeUndefined();
        });

        it('should return undefined for malformed GitHub URLs', () => {
            const url = 'https://github.com/gitbookio/gitbook/README.md';
            const result = splitGithubUrl(url);
            expect(result).toBeUndefined();
        });

        it('should return undefined for GitHub URLs without blob', () => {
            const url = 'https://github.com/gitbookio/gitbook/tree/master/README.md';
            const result = splitGithubUrl(url);
            expect(result).toBeUndefined();
        });

        it('should return undefined for empty string', () => {
            const result = splitGithubUrl('');
            expect(result).toBeUndefined();
        });

        it('should return undefined for malformed URLs', () => {
            const testCases = [
                'not-a-url',
                'http://',
                'https://',
                'ftp://example.com',
                'mailto:test@example.com',
                'javascript:alert("test")',
                '://github.com/test/repo',
                'github.com/test/repo', // missing protocol
            ];

            for (const url of testCases) {
                const result = splitGithubUrl(url);
                expect(result).toBeUndefined();
            }
        });
    });
});
