#!/usr/bin/env bash

set -euo pipefail

# Switch to the root of the repository.
cd "$(dirname "$(dirname "${BASH_SOURCE[0]}")")"

mkdocs build

# Some of the docs are generated from the individual package READMEs,
# which have to use absolute URLs so that they work on the NPM package
# pages. This converts them to site-root relative URLs, so that links
# between packages target the current branch's version of the docs.
# https://neutrinojs.org/ -> Not changed (since used for the "current version" link)
# https://neutrinojs.org/foo/ -> /foo/
find build/ -type f -name '*.html' -exec sed -ri 's|https://neutrinojs\.org/(\w+)|/\1|g' {} +
