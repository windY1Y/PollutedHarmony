#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -p ohos.acts.sensors.sensor.function -b ohos.acts.sensors.sensor.function -s unittest OpenHarmonyTestRunner -w 160000 -s ppKey decorate -s ppMode proxy
