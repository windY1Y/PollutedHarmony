#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m entry_test -b ohos.acts.multimedia.audio.audiorecorder -s unittest OpenHarmonyTestRunner -w 1000000 -s timeout 60000 -s ppKey audioEncoderMime -s ppMode string
