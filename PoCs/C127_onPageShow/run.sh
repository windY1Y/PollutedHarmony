#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m entry_test -b com.example.taskpoolsendable -s unittest /ets/testrunner/OpenHarmonyTestRunner -w 800000 -s ppKey onPageShow -s ppMode proxy
