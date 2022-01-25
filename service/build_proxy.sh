#!/usr/bin/env bash

cd ./service

set -euo pipefail

# Compile frontend assets to dist
# echo Compiling frontend assets
II_DIR="$(dirname "$0")"
TARGET="wasm32-unknown-unknown"

cargo build --manifest-path "Cargo.toml" --target $TARGET --package ledger_proxy --release

# # keep version in sync with Dockerfile
# cargo install ic-cdk-optimizer --locked --root "$II_DIR"/../../target
STATUS=$?

if [ "$STATUS" -eq "0" ]; then
      ../tools/ic-cdk-optimizer \
      ./target/$TARGET/release/ledger_proxy.wasm \
      -o ./target/$TARGET/release/ledger_proxy.wasm

  true
else
  echo Could not install ic-cdk-optimizer.
  false
fi
