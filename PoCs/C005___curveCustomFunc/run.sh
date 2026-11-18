#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m entry_test -b com.acts.actsneuralnetworkcoretest -s unittest OpenHarmonyTestRunner -w 180000 -s timeout 60000 -s ppKey 'Symbol(__use_refs__)' -s ppMode object
