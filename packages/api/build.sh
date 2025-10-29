#!/bin/bash

rm -rf ./dist/
rm -rf ./spec/
mkdir ./spec

LOCAL_OPENAPI_FILE=../../../gitbook-x/packages/api-client/static/openapi.yaml

if [[ -z "${GITBOOK_OPENAPI_URL}" ]]; then
  OPENAPI_URL="https://api.gitbook.com/openapi.yaml?cacheBust=$(date +%s)"
else
  OPENAPI_URL="${GITBOOK_OPENAPI_URL}"
fi

echo "Building API client from OpenAPI spec..."

if [ -f "$LOCAL_OPENAPI_FILE" ]; then
    echo "Using local OpenAPI spec $LOCAL_OPENAPI_FILE"
    cp $LOCAL_OPENAPI_FILE spec/openapi.yaml
else
    echo "Fetching remote OpenAPI spec $OPENAPI_URL"
    curl $OPENAPI_URL --output spec/openapi.yaml --silent
fi

# First we build the API client from the OpenAPI definition
swagger-typescript-api --path ./spec/openapi.yaml --output ./src/ --name client.ts --silent --templates ./templates

# Then we bundle into an importable JSON module
swagger-cli bundle ./spec/openapi.yaml --outfile ./spec/openapi.json --type json

# Then we extract the API constants
echo "Extracting API constants..."
bun ./scripts/extract-constants.ts

# Then we build the JS files
echo "Bundling CJS format from code..."
esbuild ./src/index.ts --bundle --platform=node --format=cjs --outfile=./dist/index.cjs --log-level=warning
echo "Bundling ESM format from code..."
esbuild ./src/index.ts --bundle --platform=node --format=esm --outfile=./dist/index.js --log-level=warning

# Finally we build the TypeScript declaration files
echo "Generating public types from code..."
tsc --project tsconfig.json --noEmit false --declaration --allowJs --emitDeclarationOnly --outDir ./dist/ --rootDir ./src
