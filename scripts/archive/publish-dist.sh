#!/usr/bin/env bash
# Publish a built archive dist/ into public/YYYY on main.
#
# Usage (from main repo root):
#   ./scripts/archive/publish-dist.sh 2026 /path/to/edition/dist
#
# See docs/ARCHIVES.md for the full yearly ritual.

set -euo pipefail

YEAR="${1:-}"
DIST="${2:-}"

if [[ -z "$YEAR" || -z "$DIST" ]]; then
  echo "Usage: $0 <year> <path-to-dist>" >&2
  exit 1
fi

if [[ ! "$YEAR" =~ ^[0-9]{4}$ ]]; then
  echo "Year must be YYYY" >&2
  exit 1
fi

if [[ ! -d "$DIST" ]]; then
  echo "Dist directory not found: $DIST" >&2
  exit 1
fi

if [[ ! -f "$DIST/index.html" ]]; then
  echo "Dist does not look like an Astro static build (missing index.html): $DIST" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TARGET="$ROOT/public/$YEAR"

echo "Publishing $DIST → $TARGET"
rm -rf "$TARGET"
mkdir -p "$TARGET"
rsync -a --exclude='*.map' "$DIST"/ "$TARGET"/

# Ensure no-op SW file if HTML still references it (legacy PWA shells)
if [[ ! -f "$TARGET/registerSW.js" ]]; then
  printf '%s\n' '/* Archive snapshot: service worker disabled. */' >"$TARGET/registerSW.js"
fi

echo "Done. Size: $(du -sh "$TARGET" | cut -f1)"
echo "Remember to update Footer PREVIOUS_EDITIONS, robots.txt, and vercel.json host redirects."
echo "See docs/ARCHIVES.md"
