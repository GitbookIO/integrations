#!/usr/bin/env bash
set -euo pipefail

readonly pages_dir=${1:?missing prepared Pages directory}
readonly repo=${GITHUB_WORKSPACE:?}
readonly revision=${GITHUB_SHA:?}
readonly project_url="https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID:?}/pages/projects/${CLOUDFLARE_PAGES_PROJECT:?}"

get_project() {
    curl --fail --silent --show-error --header "Authorization: Bearer ${CLOUDFLARE_API_TOKEN:?}" "$project_url" |
        jq -ce 'select(.success == true) | .result | objects'
}

active_revision() {
    jq -r '.canonical_deployment.deployment_trigger.metadata.commit_hash // ""'
}

project=$(get_project)
active=$(active_revision <<<"$project")
branch=$(jq -er '.production_branch | strings | select(length > 0)' <<<"$project")
if [[ -n $active ]]; then
    [[ $active =~ ^[0-9a-f]{40}$ ]] || { echo 'Unexpected production Pages commit' >&2; exit 1; }
    if git -C "$repo" merge-base --is-ancestor "$revision" "$active"; then
        echo "Pages already serves this commit or a newer one ($active)."
        exit 0
    fi
    git -C "$repo" merge-base --is-ancestor "$active" "$revision" || {
        echo "Production Pages commit $active is outside this release's history." >&2
        exit 1
    }
fi

# Run outside the checkout so Wrangler sees only the prepared files and bundled Worker.
cd "$pages_dir"
"$repo/node_modules/.bin/wrangler" pages publish dist --no-bundle \
    --project-name "$CLOUDFLARE_PAGES_PROJECT" --branch "$branch" --commit-hash "$revision"

# Hold the shared project queue until the next release can see this deployment.
for ((attempt = 0; attempt < 60; attempt++)); do
    project=$(get_project)
    active=$(active_revision <<<"$project")
    if [[ $active == "$revision" ]]; then exit 0; fi
    sleep 5
done
echo "Pages has not activated $revision. Check the deployment before retrying." >&2
exit 1
