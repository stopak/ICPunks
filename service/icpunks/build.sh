#!/usr/bin/env bash
set -euo pipefail

# Compile frontend assets to dist
# echo Compiling frontend assets
II_DIR="$(dirname "$0")"
TARGET="wasm32-unknown-unknown"

# cargo build --manifest-path "$II_DIR/Cargo.toml" --target $TARGET --release -j1

cargo build --target $TARGET --package icpunks --release

# # keep version in sync with Dockerfile
# cargo install ic-cdk-optimizer --version 0.3.0 --root "$II_DIR"/../../target
# STATUS=$?

# if [ "$STATUS" -eq "0" ]; then
#       "$II_DIR"/../../target/bin/ic-cdk-optimizer \
#       "$II_DIR/../../target/$TARGET/release/internet_identity.wasm" \
#       -o "$II_DIR/../../target/$TARGET/release/internet_identity.wasm"

#   true
# else
#   echo Could not install ic-cdk-optimizer.
#   false
# fi
