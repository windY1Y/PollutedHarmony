#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m entry_test -b com.acts.userauthetstest -s unittest OpenHarmonyTestRunner -w 1200000 -s timeout 600000 -s ppKey finalizeConstruction -s ppMode proxy
