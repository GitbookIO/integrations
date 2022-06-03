#!/bin/bash

rm -rf ./dist/

OPENAPI_SOURCE=../../../gitbook-x/packages/api-client/src/openapi.yaml

if [[ ! -z "${CI}" ]]; then
    OPENAPI_SOURCE=https://api.gitbook.com/openapi.yaml
fi

# First we build the API client from the OpenAPI definition
echo "Building API client from OpenAPI spec..."
swagger-typescript-api --path $OPENAPI_SOURCE --output ./src/ --name client.ts --silent

# Then we build the JS files
echo "Bundling library from code..."
esbuild ./src/index.ts --bundle --platform=node --outfile=./dist/index.js --log-level=warning

# Finally we build the TypeScript declaration files
echo "Generating public types from code..."
tsc --project tsconfig.json --declaration --allowJs --emitDeclarationOnly --outDir ./dist/
