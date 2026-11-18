#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m entry_test -b com.openharmony.arkui_capi_nowear_xts_api15 -s unittest OpenHarmonyTestRunner -w 600000 -s timeout 180000 -s ppKey shadow -s ppMode proxy
