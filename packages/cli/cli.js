#!/usr/bin/env -S node --no-warnings

/**
 * To avoid the probem of bun/npm only linking the CLI at the installation time.
 * We use a fixed file that will be linked to the bin folder and requires the actual CLI.
 */
require('./dist/cli.js');
