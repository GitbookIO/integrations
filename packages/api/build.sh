#!/bin/bash

rm -rf ./dist/
rm -rf ./spec/
mkdir ./spec

LOCAL_OPENAPI_FILE=../../../gitbook-x/packages/api-client/static/openapi.yaml

if [[ -z "${GITBOOK_OPENAPI_URL}" ]]; then
  OPENAPI_URL="https://api.gitbook-staging.com/openapi.yaml"
else
  OPENAPI_URL="${GITBOOK_OPENAPI_URL}"
fi

if [ -f "$LOCAL_OPENAPI_FILE" ]; then
    cp $LOCAL_OPENAPI_FILE spec/openapi.yaml
else
    curl $OPENAPI_URL --output spec/openapi.yaml --silent
fi

# First we build the API client from the OpenAPI definition
echo "Building API client from OpenAPI spec..."
swagger-typescript-api --path ./spec/openapi.yaml --output ./src/ --name client.ts --silent

# Then we bundle into an importable JSON module
swagger-cli bundle ./spec/openapi.yaml --outfile ./spec/openapi.json --type json

# Then we build the JS files
echo "Bundling library from code..."
esbuild ./src/index.ts --bundle --platform=node --outfile=./dist/index.js --log-level=warning

# Finally we build the TypeScript declaration files
echo "Generating public types from code..."
tsc --project tsconfig.json --declaration --allowJs --emitDeclarationOnly --outDir ./dist/
