#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -p ohos.acts.distributedKvStore -b ohos.acts.distributedKvStore -s unittest OpenHarmonyTestRunner -w 1200000 -s ppKey constructor_of_DeviceKVStore -s ppMode proxy
