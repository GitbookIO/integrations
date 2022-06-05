import * as fs from 'fs';
import * as path from 'path';

/**
 * Check if a file exists.
 */
export async function fileExists(path: string): Promise<null | 'directory' | 'file'> {
    try {
        const stat = await fs.promises.stat(path);
        return stat.isDirectory() ? 'directory' : 'file';
    } catch {
        return null;
    }
}

/**
 * Return a nice looking path to print in the console.
 */
export function prettyPath(inputPath: string): string {
    return path.relative(process.cwd(), inputPath);
}
