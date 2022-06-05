#!/bin/bash

rm -rf ./dist/
esbuild ./src/cli.ts \
    --bundle \
    --platform=node \
    --external:esbuild \
    --external:@stoplight/json-ref-resolver \
    --outfile=./dist/cli.js \
    --log-level=warning
