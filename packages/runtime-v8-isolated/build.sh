#!/bin/bash

rm -rf ./dist/
esbuild ./src/index.ts  --platform=node --outfile=./dist/index.js --log-level=warning
