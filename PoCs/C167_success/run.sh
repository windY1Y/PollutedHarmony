#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -p com.acts.requesttest_test -b com.acts.requesttest -s unittest OpenHarmonyTestRunner -w 180000 -s timeout 60000 -s ppKey success -s ppMode proxy
