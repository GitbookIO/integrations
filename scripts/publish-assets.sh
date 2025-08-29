#!/bin/bash

set -o errexit
set -o pipefail
set -u

# Check that necessary env variables are set
: "$CLOUDFLARE_PAGES_PROJECT"
: "$CLOUDFLARE_ACCOUNT_ID"
: "$CLOUDFLARE_API_TOKEN"

ASSETS_DIST_PATH='./dist'

# Build the integrations assets dist folder
bun run build-assets

# Publish the assets to Cloudflare pages' project
wrangler pages publish $ASSETS_DIST_PATH --project-name=$CLOUDFLARE_PAGES_PROJECT