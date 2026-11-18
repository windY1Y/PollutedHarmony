#!/usr/bin/env python3
"""Write validation hook arguments for a continuation16 H29 run.

The installed H29 runner HAP prints `[PPV630_PROCESS]` but not
`[PPV630_READY]`, so the runner's `ready` hook never fires.  The per-cell UI
operator is therefore spawned from `before` and reaped from `evidence`, keyed
by PPV3_RUN_ID so cells never share output.
"""

import argparse
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--process-hook", required=True)
    parser.add_argument("--ui-probe", required=True)
    parser.add_argument("--watcher-ctl", required=True)
    parser.add_argument("--hdc", required=True)
    parser.add_argument("--device", required=True)
    parser.add_argument("--matrix", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--filename", required=True)
    parser.add_argument("--file-uri", required=True)
    parser.add_argument("--ui-budget-seconds", default="50")
    parser.add_argument("--ui-wait-seconds", default="25")
    parser.add_argument("--confirm-token", action="append", default=[])
    args = parser.parse_args()

    def watcher(action):
        command = [
            "python3",
            args.watcher_ctl,
            action,
            "--out",
            args.matrix,
            "--operator",
            args.ui_probe,
            "--hdc",
            args.hdc,
            "--device",
            args.device,
            "--run-id",
            args.run_id,
            "--filename",
            args.filename,
            "--expected-uri",
            args.file_uri,
            "--budget-seconds",
            args.ui_budget_seconds,
            "--wait-seconds",
            args.ui_wait_seconds,
        ]
        for token in args.confirm_token:
            command += ["--confirm-token", token]
        return command

    payload = {
        "before": [["python3", args.process_hook, "before"], watcher("spawn")],
        "ready": [],
        "evidence": [["python3", args.process_hook, "evidence"], watcher("wait")],
        "after": [["python3", args.process_hook, "after"]],
        "cleanup": [["python3", args.process_hook, "cleanup"]],
    }
    if args.output.exists() and args.output.stat().st_size:
        raise SystemExit(f"refusing to overwrite nonempty file: {args.output}")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
