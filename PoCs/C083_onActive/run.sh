#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -p com.ohos.acecollaboration -b com.ohos.acecollaboration -s unittest OpenHarmonyTestRunner -w 600000 -s ppKey onActive -s ppMode proxy
