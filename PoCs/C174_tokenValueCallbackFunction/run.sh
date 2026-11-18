#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -p com.example.xml -b com.example.xml -s unittest OpenHarmonyTestRunner -w 800000 -s ppKey tokenValueCallbackFunction -s ppMode proxy
