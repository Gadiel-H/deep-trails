#!/usr/bin/env bash
set -e

# --------------------
# Base configuration
# --------------------
ENTRY="./src/index.ts"
OUTFILE="./dist/iife.min.js"
GLOBAL_NAME="DeepTrails"
TARGET="ES6"

WATCH=false
SERVE=false

# --------------------
# Parse arguments
# --------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --watch)
      WATCH=true
      shift
      ;;
    --serve)
      SERVE=true
      WATCH=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--watch] [--serve]"
      exit 1
      ;;
  esac
done

# --------------------
# Build dinamic flags
# --------------------
ESBUILD_FLAGS=(
  "$ENTRY"
  --global-name="$GLOBAL_NAME"
  --bundle
  --minify
  --keep-names
  --sourcemap
  --outfile="$OUTFILE"
  --format=iife
  --target="$TARGET"
)

$WATCH && ESBUILD_FLAGS+=(--watch=forever)
$SERVE && ESBUILD_FLAGS+=(--servedir=.)

# --------------------
# Execute esbuild
# --------------------
echo "▶ esbuild"
echo "  watch:  $WATCH"
echo "  serve:  $SERVE"
echo

npx esbuild "${ESBUILD_FLAGS[@]}"
