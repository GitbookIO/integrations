#!/usr/bin/env bash
set -euo pipefail

cd "${1:?missing prepared assets directory}"
# Wrangler follows symlinks. Only directories and regular files belong in this artifact.
unexpected=$(find . ! -type d ! -type f -print -quit)
[[ -z $unexpected ]] || { echo 'Unexpected entry in Pages assets' >&2; exit 1; }
find . -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum -- | sha256sum | cut -d' ' -f1
