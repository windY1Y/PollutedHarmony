#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m entry_test -b ohos.acts.multimedia.audio.avrecorder -s unittest OpenHarmonyTestRunner -w 6000000 -s timeout 1100000 -s ppKey onSurfaceChanged -s ppMode proxy
