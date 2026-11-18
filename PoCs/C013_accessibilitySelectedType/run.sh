#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -p com.example.aceceshi -b com.example.aceceshi -s unittest OpenHarmonyTestRunner -w 2500000 -s timeout 50000 -s ppKey comment -s ppMode object
