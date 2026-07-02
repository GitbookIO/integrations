#!/bin/bash

rm -rf ./dist/
esbuild ./src/cli.ts \
    --bundle \
    --platform=node \
    --external:esbuild \
    --external:miniflare \
    --external:fsevents \
    --outfile=./dist/cli.js \
    --log-level=warning

# gitbook2 — standalone API-testing CLI (see src/cli2.ts)
esbuild ./src/cli2.ts \
    --bundle \
    --platform=node \
    --external:esbuild \
    --external:miniflare \
    --external:fsevents \
    --outfile=./dist/cli2.js \
    --log-level=warning
