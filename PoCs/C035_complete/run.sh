#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -p com.acts.pcs.jstest -b com.acts.pcs.jstest -s unittest OpenHarmonyTestRunner -w 1800000 -s timeout 20000 -s ppKey complete -s ppMode proxy
