#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m entry_test -b ohos.acts.UDMF -s unittest OpenHarmonyTestRunner -w 180000 -s timeout 70000 -s ppKey constructor_of_UnifiedRecord -s ppMode proxy
