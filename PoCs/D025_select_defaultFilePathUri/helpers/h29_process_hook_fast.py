import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

device = os.environ.get("PPV3_DEVICE", "")
run_id = os.environ.get("PPV3_RUN_ID", "unknown")
group = os.environ.get("PPV3_GROUP", "unknown")
case_id = os.environ.get("PPV630_CASE", "unknown")
stage = sys.argv[1] if len(sys.argv) > 1 else "unknown"
out = Path(os.environ.get("PPV630_OUTPUT_DIR", "."))
root = out / "picker-oracle-fast" / run_id / stage
root.mkdir(parents=True, exist_ok=True)
hdc = "/data/oh-testing/prebuilts/ohos-sdk/linux/20/toolchains/hdc"


def run(label, args):
    record = {"label": label, "args": args, "device": device}
    try:
        proc = subprocess.run(
            [hdc, "-t", device, "shell", *args],
            capture_output=True,
            text=True,
            errors="replace",
            timeout=5,
            check=False,
        )
        target = root / (label + ".txt")
        target.write_text(proc.stdout + proc.stderr, encoding="utf-8", errors="replace")
        record.update({"returnCode": proc.returncode, "artifact": target.name, "bytes": target.stat().st_size})
        return proc.stdout + proc.stderr, record
    except Exception as exc:
        record["error"] = type(exc).__name__ + ": " + str(exc)
        return "", record


records = []
matches = []
pids = []
if stage in ("before", "after", "evidence"):
    ps_text, record = run("ps-all", ["ps", "-A"])
    records.append(record)
    aa_text, record = run("aa-dump", ["aa", "dump", "-a", "-u", "100"])
    records.append(record)
    pid_text, record = run("pidof-filepicker", ["pidof", "filePicker"])
    records.append(record)
    for token in pid_text.split():
        if token.isdigit() and token not in pids:
            pids.append(token)
    for line in ps_text.splitlines():
        fields = line.split()
        if len(fields) >= 3 and fields[0].isdigit() and (fields[2] == "filePicker" or "com.ohos.filepicker" in " ".join(fields[2:])):
            if fields[0] not in pids:
                pids.append(fields[0])
    matches = [line for line in (ps_text + "\n" + aa_text).splitlines() if re.search(r"filePicker|com\.ohos\.filepicker", line, re.I)]
    for pid in pids:
        for label, args in (
            ("status-" + pid, ["cat", "/proc/%s/status" % pid]),
            ("stat-" + pid, ["cat", "/proc/%s/stat" % pid]),
            ("cmdline-" + pid, ["cat", "/proc/%s/cmdline" % pid]),
        ):
            _, record = run(label, args)
            records.append(record)

(root / "picker-process-matches.txt").write_text("\n".join(matches) + "\n", encoding="utf-8")
(root / "summary.json").write_text(
    json.dumps(
        {
            "schema": "continuation13-h29-picker-fast-oracle-v1",
            "caseId": case_id,
            "runId": run_id,
            "group": group,
            "stage": stage,
            "observedAt": time.time(),
            "pickerPids": pids,
            "pickerProcessMatches": matches,
            "commands": records,
        },
        ensure_ascii=False,
        indent=2,
    )
    + "\n",
    encoding="utf-8",
)
