#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m phone -b com.example.ModelSheet -s unittest OpenHarmonyTestRunner -w 600000 -s ppKey onHeightDidChange -s ppMode proxy
