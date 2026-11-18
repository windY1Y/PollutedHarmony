#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m entry_test -b com.acts.arkui.component.common.attrs.nowear.test -s unittest OpenHarmonyTestRunner -w 10800000 -s timeout 300000 -s ppSpec %7B%22version%22%3A1%2C%22properties%22%3A%5B%7B%22mode%22%3A%22object%22%2C%22path%22%3A%5B%22mdListener%22%5D%7D%2C%7B%22mode%22%3A%22proxy%22%2C%22path%22%3A%5B%22mdListener%22%2C%22on%22%5D%7D%5D%7D -s ppSession bd32e9e2c160a652b848b0a7
