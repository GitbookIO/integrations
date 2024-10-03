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
