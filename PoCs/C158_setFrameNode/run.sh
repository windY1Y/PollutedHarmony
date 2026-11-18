#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
HDC="${HDC:-hdc}"
DEVICE="${1:?device}"
for hap in haps/*.hap; do "$HDC" -t "$DEVICE" install "$hap"; done
"$HDC" -t "$DEVICE" shell aa test -m entry_test -b com.arkui.ace.XNode.api12 -s unittest OpenHarmonyTestRunner -w 180000 -s timeout 180000 -s ppSpec %7B%22version%22%3A1%2C%22properties%22%3A%5B%7B%22mode%22%3A%22object%22%2C%22path%22%3A%5B%22renderNode_%22%5D%7D%2C%7B%22mode%22%3A%22proxy%22%2C%22path%22%3A%5B%22renderNode_%22%2C%22setFrameNode%22%5D%7D%5D%7D -s ppSession d28beabd3e932a2daf2865b5
