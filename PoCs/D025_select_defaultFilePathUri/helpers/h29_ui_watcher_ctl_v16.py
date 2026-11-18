#!/usr/bin/env python3
"""Spawn and reap the per-cell H29 UI operator from runner hooks.

`spawn` is used by the runner `before` hook: it must return immediately so the
runner can launch the ability, and the operator must survive the hook process.
`wait` is used by the runner `evidence` hook: it reaps the operator, bounded,
and records the exit status so a hung operator cannot outlive its cell.
"""

import argparse
import json
import os
import signal
import subprocess
import sys
import time
from pathlib import Path


def state_path(out, run_id):
    return Path(out) / "watcher-v16" / f"{run_id}.json"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("spawn", "wait", "status"))
    parser.add_argument("--out", required=True)
    parser.add_argument("--operator", required=True)
    parser.add_argument("--hdc", required=True)
    parser.add_argument("--device", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--filename", required=True)
    parser.add_argument("--expected-uri", required=True)
    parser.add_argument("--confirm-token", action="append", default=[])
    parser.add_argument("--budget-seconds", type=float, default=50.0)
    parser.add_argument("--wait-seconds", type=float, default=25.0)
    args = parser.parse_args()

    cell_run_id = os.environ.get("PPV3_RUN_ID") or args.run_id
    path = state_path(args.out, cell_run_id)
    path.parent.mkdir(parents=True, exist_ok=True)

    if args.action == "spawn":
        if path.exists() and path.stat().st_size:
            raise SystemExit(f"refusing to overwrite existing watcher state: {path}")
        log_path = path.with_suffix(".log")
        log = log_path.open("wb")
        command = [
            sys.executable,
            args.operator,
            "--hdc",
            args.hdc,
            "--device",
            args.device,
            "--out",
            args.out,
            "--run-id",
            args.run_id,
            "--filename",
            args.filename,
            "--expected-uri",
            args.expected_uri,
            "--budget-seconds",
            str(args.budget_seconds),
        ]
        for token in args.confirm_token:
            command += ["--confirm-token", token]
        env = os.environ.copy()
        env["PPV3_RUN_ID"] = cell_run_id
        process = subprocess.Popen(
            command,
            stdout=log,
            stderr=subprocess.STDOUT,
            stdin=subprocess.DEVNULL,
            start_new_session=True,
            cwd="/",
            env=env,
        )
        log.close()
        path.write_text(
            json.dumps(
                {
                    "schema": "continuation16-h29-ui-operator-state-v1",
                    "runId": cell_run_id,
                    "parentRunId": args.run_id,
                    "pid": process.pid,
                    "command": command,
                    "log": str(log_path),
                    "spawnedAt": time.time(),
                    "device": args.device,
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        print(json.dumps({"spawned": process.pid, "runId": cell_run_id}))
        return 0

    if not path.is_file():
        print(json.dumps({"state": "missing", "runId": cell_run_id}))
        return 0

    state = json.loads(path.read_text(encoding="utf-8"))
    pid = int(state.get("pid", 0))

    def still_alive(process_id):
        if process_id <= 0:
            return False
        try:
            os.kill(process_id, 0)
        except OSError:
            return False
        try:
            fields = Path(f"/proc/{process_id}/stat").read_text(encoding="utf-8", errors="replace").split()
            if len(fields) > 2 and fields[2] == "Z":
                return False
        except OSError:
            pass
        return True

    deadline = time.monotonic() + max(args.wait_seconds, 1.0)
    exited = None
    while time.monotonic() < deadline:
        if not still_alive(pid):
            exited = 0
            break
        time.sleep(0.3)

    killed = False
    if exited is None:
        for sig in (signal.SIGTERM, signal.SIGKILL):
            killed = True
            try:
                os.killpg(os.getpgid(pid), sig)
            except OSError:
                try:
                    os.kill(pid, sig)
                except OSError:
                    pass
            time.sleep(0.6)
            if not still_alive(pid):
                exited = -1 if sig == signal.SIGTERM else -9
                break

    summary_file = Path(args.out) / "ui-probe-v16" / cell_run_id / "summary.json"
    operator_summary = None
    if summary_file.is_file():
        try:
            operator_summary = json.loads(summary_file.read_text(encoding="utf-8"))
        except Exception as exc:
            operator_summary = {"parseError": repr(exc)}

    result = {
        "schema": "continuation16-h29-ui-operator-reap-v1",
        "runId": cell_run_id,
        "pid": pid,
        "reaped": exited is not None,
        "killedByReaper": killed,
        "exitStatus": exited,
        "operatorStatus": (operator_summary or {}).get("status"),
        "operatorSummary": str(summary_file) if summary_file.is_file() else None,
    }
    path.with_suffix(".reap.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
