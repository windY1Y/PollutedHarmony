#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m entry_test -b com.arkui.ace.StateMangagement02.api12 -s unittest OpenHarmonyTestRunner -w 180000 -s timeout 180000 -s ppKey map_ -s ppMode proxy
