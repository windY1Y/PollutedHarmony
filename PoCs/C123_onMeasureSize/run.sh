#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m phone -b com.acts.arkui.component.common.attrs.flex2.test -s unittest OpenHarmonyTestRunner -w 10800000 -s timeout 300000 -s ppKey onMeasureSize -s ppMode proxy
