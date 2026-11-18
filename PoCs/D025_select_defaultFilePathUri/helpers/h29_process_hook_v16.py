#!/usr/bin/env python3
"""Capture independent picker/provider process evidence for continuation16."""

import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path


DEVICE = os.environ.get("PPV3_DEVICE", "")
RUN_ID = os.environ.get("PPV3_RUN_ID", "unknown")
GROUP = os.environ.get("PPV3_GROUP", "unknown")
CASE_ID = os.environ.get("PPV630_CASE", "H29-C-52ba990f664cdfd2")
STAGE = sys.argv[1] if len(sys.argv) > 1 else "unknown"
OUT = Path(os.environ.get("PPV630_OUTPUT_DIR", "."))
ROOT = OUT / "process-oracle-v16" / RUN_ID / STAGE
ROOT.mkdir(parents=True, exist_ok=True)
HDC = os.environ.get(
    "PPV630_HDC", "/data/oh-testing/prebuilts/ohos-sdk/linux/20/toolchains/hdc"
)


def call(label, args, timeout=20):
    record = {"label": label, "args": args, "device": DEVICE}
    try:
        proc = subprocess.run(
            [HDC, "-t", DEVICE, "shell", *args],
            capture_output=True,
            text=True,
            errors="replace",
            timeout=timeout,
            check=False,
        )
        text = proc.stdout + proc.stderr
        artifact = ROOT / (label + ".txt")
        artifact.write_text(text, encoding="utf-8", errors="replace")
        record.update(
            {
                "returnCode": proc.returncode,
                "artifact": str(artifact),
                "bytes": artifact.stat().st_size,
            }
        )
        return text, record
    except Exception as exc:
        record["error"] = f"{type(exc).__name__}: {exc}"
        return "", record


records = []
ps_text, item = call("ps-all", ["ps", "-A"])
records.append(item)
_, item = call("pidof-filepicker-bundle", ["pidof", "com.ohos.filepicker"])
records.append(item)
_, item = call("pidof-external-file-manager", ["pidof", "com.ohos.UserFile.ExternalFileManager"])
records.append(item)
_, item = call("pidof-external-file-access", ["pidof", "com.ohos.UserFile.ExternalFileManager:fileAccess"])
records.append(item)
aa_text, item = call("aa-dump", ["aa", "dump", "-a", "-u", "100"])
records.append(item)
wms_text, item = call(
    "window-manager", ["hidumper", "-s", "WindowManagerService", "-a", "-a"]
)
records.append(item)
if STAGE in ("evidence", "after", "cleanup"):
    _, item = call("hilog-x", ["hilog", "-x"], timeout=30)
    records.append(item)

combined = ps_text + "\n" + aa_text + "\n" + wms_text
provider_matches = [
    line
    for line in combined.splitlines()
    if re.search(
        r"filePicker|FilePicker|com\.ohos\.filepicker|UserFile|ExternalFileManager|fileAccess|docs/storage",
        line,
        re.IGNORECASE,
    )
]
picker_matches = [
    line
    for line in combined.splitlines()
    if re.search(r"filePicker|FilePicker|com\.ohos\.filepicker", line, re.IGNORECASE)
]

summary = {
    "schema": "continuation16-h29-process-oracle-v1",
    "caseId": CASE_ID,
    "runId": RUN_ID,
    "group": GROUP,
    "stage": STAGE,
    "observedAt": time.time(),
    "providerIdentityMatches": provider_matches[-80:],
    "pickerProcessMatches": picker_matches[-80:],
    "commands": records,
    "independent": True,
}
(ROOT / "summary.json").write_text(
    json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
print(json.dumps(summary, ensure_ascii=False))
