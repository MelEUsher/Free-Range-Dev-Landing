#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT_DIR/node_modules/.bin:$PATH"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required for this workflow. Install it globally or run 'npm install' to use the local binary." >&2
  exit 1
fi

cd "$ROOT_DIR"

pnpm lint
pnpm typecheck
pnpm build
