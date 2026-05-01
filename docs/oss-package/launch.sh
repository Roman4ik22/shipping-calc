#!/usr/bin/env bash
# Pre-publish checklist for @rateships/customs.
# Runs install + test + build + pack-dry-run. Stops before publish so you can
# review the dry-run output, then run `npm publish --access=public` manually.

set -euo pipefail

cd "$(dirname "$0")"

echo "== 1. Install dependencies =="
npm install

echo
echo "== 2. Run test suite =="
npm test

echo
echo "== 3. Build dist/ =="
npm run build

echo
echo "== 4. Show what would be published (dry run) =="
npm pack --dry-run

echo
echo "== READY =="
echo
echo "Review the file list above. If it looks correct:"
echo
echo "  npm login                          # if not already logged in"
echo "  npm publish --access=public        # publishes @rateships/customs to npm"
echo
echo "If npm rejects with '404 scope @rateships not found':"
echo "  → create org first: https://www.npmjs.com/org/create"
echo "  → name: rateships"
echo "  → tier: free"
echo "  → then re-run: npm publish --access=public"
