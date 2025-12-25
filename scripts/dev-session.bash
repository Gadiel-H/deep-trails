#!/usr/bin/env bash
trap "printf '\n\nStopping dev session...\n'; kill 0" SIGINT

set -e

log() {
  printf "\n[$(date '+%H:%M:%S')] ▶ $1"
}

ok() {
  printf "\n[$(date '+%H:%M:%S')] ✔ $1"
}

log "Watching IIFE and running a server"
bash scripts/build-iife.bash --watch --serve &
sleep 5 &&

log "Starting other build watchers"

log "watch:esm"
npm run watch:esm &

log "watch:cjs"
npm run watch:cjs &

log "watch:types"
npm run watch:types &

log "watch:docs"
npm run watch:docs &

ok "All processes are runnning"

wait
