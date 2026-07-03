import * as fs from 'fs/promises';
import * as path from 'path';

import type { ContentDiagnostic } from '@gitbook/content-engine';

const IGNORED_DIRECTORIES = new Set(['node_modules', '.git']);

const DIFF_PREVIEW_LINES = 12;

const useColor = process.stdout.isTTY === true;
const paint = (code: string, text: string) => (useColor ? `[${code}m${text}[0m` : text);
const red = (text: string) => paint('31', text);
const yellow = (text: string) => paint('33', text);
const green = (text: string) => paint('32', text);
const dim = (text: string) => paint('2', text);

/**
 * Load the content engine lazily so that the (large) engine is only
 * initialized when a content command actually runs.
 */
async function loadEngine() {
    return await import('@gitbook/content-engine');
}

/**
 * Expand a list of files and directories into the markdown files they contain.
 */
async function collectMarkdownFiles(inputs: string[]): Promise<string[]> {
    const files: string[] = [];

    const visit = async (input: string) => {
        const stats = await fs.stat(input);
        if (stats.isDirectory()) {
            const entries = await fs.readdir(input, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    if (IGNORED_DIRECTORIES.has(entry.name) || entry.name.startsWith('.')) {
                        continue;
                    }
                    await visit(path.join(input, entry.name));
                } else if (entry.name.endsWith('.md')) {
                    files.push(path.join(input, entry.name));
                }
            }
        } else {
            files.push(input);
        }
    };

    for (const input of inputs) {
        await visit(input);
    }

    return files.sort();
}

function printDiff(diagnostic: ContentDiagnostic) {
    const lines: string[] = [];
    if (diagnostic.actual) {
        for (const line of diagnostic.actual.split('\n')) {
            lines.push(red(`    - ${line}`));
        }
    }
    if (diagnostic.expected) {
        for (const line of diagnostic.expected.split('\n')) {
            lines.push(green(`    + ${line}`));
        }
    }
    for (const line of lines.slice(0, DIFF_PREVIEW_LINES)) {
        console.log(line);
    }
    if (lines.length > DIFF_PREVIEW_LINES) {
        console.log(dim(`    … ${lines.length - DIFF_PREVIEW_LINES} more lines`));
    }
}

function printDiagnostic(file: string, diagnostic: ContentDiagnostic) {
    const position = diagnostic.range
        ? `:${diagnostic.range.start.line}:${diagnostic.range.start.column}`
        : '';
    const severity =
        diagnostic.severity === 'error' ? red(diagnostic.severity) : yellow(diagnostic.severity);
    console.log(`${file}${position}  ${severity}  ${dim(diagnostic.code)}  ${diagnostic.message}`);
    printDiff(diagnostic);
}

/**
 * Lint markdown files against the GitBook content schema: content that GitBook
 * would remove or restructure on import, and invalid frontmatter. Style is not
 * lint's concern. Returns the process exit code.
 */
export async function lintContentFiles(
    inputs: string[],
    options: { strict: boolean },
): Promise<number> {
    const { lintContent } = await loadEngine();

    const files = await collectMarkdownFiles(inputs.length > 0 ? inputs : ['.']);
    if (files.length === 0) {
        console.log('No markdown files found.');
        return 0;
    }

    let errors = 0;
    let warnings = 0;
    for (const file of files) {
        const source = await fs.readFile(file, 'utf8');
        const { diagnostics } = await lintContent(source);
        for (const diagnostic of diagnostics) {
            printDiagnostic(file, diagnostic);
            if (diagnostic.severity === 'error') {
                errors++;
            } else {
                warnings++;
            }
        }
    }

    const clean = errors === 0 && warnings === 0;
    console.log(
        clean
            ? green(`✓ ${files.length} file(s) checked, no issues found.`)
            : `${files.length} file(s) checked: ${errors} error(s), ${warnings} warning(s).`,
    );
    return errors > 0 || (options.strict && warnings > 0) ? 1 : 0;
}

/**
 * Check for broken internal links and anchors across markdown files.
 * Returns the process exit code.
 */
export async function brokenLinksContentFiles(
    inputs: string[],
    options: { strict: boolean },
): Promise<number> {
    const { checkBrokenLinks } = await loadEngine();

    const root = process.cwd();
    const files = await collectMarkdownFiles(inputs.length > 0 ? inputs : ['.']);
    if (files.length === 0) {
        console.log('No markdown files found.');
        return 0;
    }

    const pages = await Promise.all(
        files.map(async (file) => ({
            path: path.relative(root, path.resolve(root, file)).split(path.sep).join('/'),
            content: await fs.readFile(file, 'utf8'),
        })),
    );

    const { diagnostics } = await checkBrokenLinks({
        pages,
        fileExists: async (filePath) => {
            try {
                await fs.stat(path.resolve(root, filePath));
                return true;
            } catch {
                return false;
            }
        },
    });

    let errors = 0;
    let warnings = 0;
    for (const diagnostic of diagnostics) {
        printDiagnostic(diagnostic.page, diagnostic);
        if (diagnostic.severity === 'error') {
            errors++;
        } else {
            warnings++;
        }
    }

    const clean = errors === 0 && warnings === 0;
    console.log(
        clean
            ? green(`✓ ${files.length} file(s) checked, no broken links found.`)
            : `${files.length} file(s) checked: ${errors} broken link(s), ${warnings} broken anchor(s).`,
    );
    return errors > 0 || (options.strict && warnings > 0) ? 1 : 0;
}

/**
 * Apply GitBook's canonical style to markdown files. Never removes or
 * restructures content unless `force` is set, in which case GitBook's full
 * normalization is applied. Returns the process exit code.
 */
export async function formatContentFiles(
    inputs: string[],
    options: { write: boolean; force: boolean },
): Promise<number> {
    const { formatContent } = await loadEngine();

    const files = await collectMarkdownFiles(inputs.length > 0 ? inputs : ['.']);
    if (files.length === 0) {
        console.log('No markdown files found.');
        return 0;
    }

    let changed = 0;
    let failed = 0;
    let issues = 0;
    for (const file of files) {
        const source = await fs.readFile(file, 'utf8');
        try {
            const result = await formatContent(source, { normalize: options.force });
            if (result.changed && options.write) {
                await fs.writeFile(file, result.output);
            }
            if (result.changed || result.issues.length > 0) {
                if (result.changed) {
                    changed++;
                }
                issues += result.issues.length;
                const status = result.changed
                    ? options.write
                        ? green('formatted')
                        : yellow('would change')
                    : dim('unchanged');
                const issueNote =
                    result.issues.length > 0
                        ? `  ${red(`${result.issues.length} content issue(s) preserved`)}`
                        : '';
                console.log(`${file}  ${status}${issueNote}`);
            }
        } catch (error) {
            failed++;
            console.log(
                `${file}  ${red('error')}  ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    console.log(
        `${files.length} file(s) checked: ${changed} ${
            options.write ? 'formatted' : 'not formatted'
        }, ${failed} failed.`,
    );
    if (issues > 0) {
        console.log(
            dim(
                `${issues} content-altering change(s) were not applied. Run 'gitbook content lint' to review them, or 'format --force' to apply GitBook's full normalization.`,
            ),
        );
    }
    if (failed > 0) {
        return 2;
    }
    return !options.write && changed > 0 ? 1 : 0;
}
