#!/usr/bin/env python3
"""Per-cell UI operator for the H29 FilePicker trial.

Why this is spawned from the runner `before` hook: the installed H29 runner HAP
prints `[PPV630_PROCESS]` but not `[PPV630_READY]` (verified in modules.abc), so
the runner's `ready` hook can never fire.  One operator process per cell, keyed
by PPV3_RUN_ID, so two cells can never share output.

Timing: `uitest dumpLayout` costs ~5s on this emulator and the FilePicker UI
extension is torn down ~12s after onSessionCreate, so the wait for the picker
process runs on the device inside a single hdc call and the layout dump is
bounded to the picker bundle window.
"""

import argparse
import json
import os
import re
import subprocess
import time
from pathlib import Path


def call(hdc, device, args, timeout=20):
    try:
        proc = subprocess.run(
            [hdc, "-t", device, *args],
            capture_output=True,
            text=True,
            errors="replace",
            timeout=timeout,
            check=False,
        )
        return {
            "args": args,
            "returnCode": proc.returncode,
            "stdout": proc.stdout,
            "stderr": proc.stderr,
        }
    except Exception as exc:
        return {"args": args, "returnCode": -1, "error": repr(exc)}


def parse_bounds(value):
    if isinstance(value, str):
        numbers = re.findall(r"-?\d+", value)
        if len(numbers) >= 4:
            return tuple(int(item) for item in numbers[:4])
    if isinstance(value, (list, tuple)) and len(value) >= 4:
        try:
            return tuple(int(item) for item in value[:4])
        except (TypeError, ValueError):
            return None
    return None


def attributes(node):
    if not isinstance(node, dict):
        return {}
    result = {}
    for key in ("attributes", "attribute", "attr"):
        if isinstance(node.get(key), dict):
            result.update(node[key])
    result.update(
        {k: v for k, v in node.items() if k not in ("children", "attributes", "attribute", "attr")}
    )
    return result


def visible(attrs):
    for key in ("visible", "isVisible", "visibility"):
        if key in attrs:
            value = str(attrs[key]).lower()
            if value in ("false", "hidden", "invisible", "gone", "0"):
                return False
    return True


def walk(node):
    if isinstance(node, dict):
        yield node
        for key, value in node.items():
            if key in ("attributes", "attribute", "attr"):
                continue
            if isinstance(value, (dict, list)):
                yield from walk(value)
    elif isinstance(node, list):
        for child in node:
            yield from walk(child)


def node_text(attrs):
    values = []
    for key in ("text", "originalText", "content", "value", "description", "accessibilityId"):
        value = attrs.get(key)
        if value is None or value == "":
            continue
        values.append(str(value))
    return " | ".join(values)


def read_nodes(path, filename, confirm_tokens):
    try:
        data = json.loads(path.read_text(encoding="utf-8", errors="replace"))
    except Exception as exc:
        return {"parseError": repr(exc), "target": [], "confirm": [], "all": [], "texts": []}
    target, confirm, texts, all_nodes = [], [], [], []
    for node in walk(data):
        attrs = attributes(node)
        if not visible(attrs):
            continue
        bounds = parse_bounds(attrs.get("bounds") or attrs.get("origBounds") or attrs.get("rect"))
        text = node_text(attrs)
        if text and len(texts) < 120:
            texts.append(text[:160])
        if not bounds:
            continue
        item = {
            "text": text,
            "bounds": list(bounds),
            "bundleName": attrs.get("bundleName"),
            "type": attrs.get("type"),
            "clickable": attrs.get("clickable"),
        }
        if text and len(all_nodes) < 200:
            all_nodes.append(item)
        if filename and filename.lower() in text.lower():
            target.append(item)
        stripped = text.strip()
        if stripped and any(stripped.lower() == token.lower() for token in confirm_tokens):
            confirm.append(item)
    return {"target": target, "confirm": confirm, "all": all_nodes, "texts": texts}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--hdc", required=True)
    parser.add_argument("--device", required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--filename", required=True)
    parser.add_argument("--expected-uri", required=True)
    parser.add_argument("--confirm-token", action="append", default=[])
    parser.add_argument("--budget-seconds", type=float, default=45.0)
    parser.add_argument("--gate-seconds", type=float, default=22.0)
    parser.add_argument("--first-dump-delay", type=float, default=1.5)
    args = parser.parse_args()

    started = time.monotonic()
    cell_run_id = os.environ.get("PPV3_RUN_ID") or args.run_id
    parent_run_id = args.run_id
    group = os.environ.get("PPV3_GROUP", "unknown")
    root = args.out / "ui-probe-v16" / cell_run_id
    root.mkdir(parents=True, exist_ok=True)

    confirm_tokens = args.confirm_token or [
        "open",
        "select",
        "done",
        "choose",
        "confirm",
        "\u6253\u5f00",
        "\u9009\u62e9",
        "\u5b8c\u6210",
        "\u786e\u5b9a",
    ]

    summary = {
        "schema": "continuation16-h29-picker-ui-operator-v3",
        "caseId": "H29-C-52ba990f664cdfd2",
        "runId": cell_run_id,
        "parentRunId": parent_run_id,
        "group": group,
        "repetition": os.environ.get("PPV3_REPETITION", "unknown"),
        "device": args.device,
        "targetFilename": args.filename,
        "confirmTokens": confirm_tokens,
        "expectedSelectedUri": args.expected_uri,
        "providerKind": "system-docs-provider",
        "invokedBy": "runner-before-hook",
        "status": "not_started",
        "confirmMode": None,
        "confirmationWasImplicit": False,
        "snapshots": [],
        "clicks": [],
        "startEvidence": [],
        "budgetSeconds": args.budget_seconds,
    }

    poll_index = 0
    summary["status"] = "operator_started"
    (root / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    def gate_and_dump(delay, gate_seconds=None):
        nonlocal poll_index
        poll_index += 1
        gate_seconds = args.gate_seconds if gate_seconds is None else gate_seconds
        remote = f"/data/local/tmp/h29c16-{cell_run_id}-{poll_index}.json"
        loops = max(int(gate_seconds / 0.2), 1)
        script = (
            f"i=0; while [ $i -lt {loops} ]; do "
            "if ps -A | grep -q -i '[f]ilepicker'; then echo GATE_PICKER_SEEN; "
            "ps -A | grep -i '[f]ilepicker'; break; fi; "
            "i=$((i+1)); sleep 0.2; done; "
            f"sleep {delay}; "
            f"uitest dumpLayout -p {remote} -b com.ohos.filepicker; "
            "echo GATE_DONE"
        )
        result = call(args.hdc, args.device, ["shell", script], timeout=int(gate_seconds + 25))
        gate_text = result.get("stdout", "") + result.get("stderr", "")
        local = root / f"{poll_index:03d}-picker.layout.json"
        received = None
        if "GATE_DONE" in gate_text:
            received = call(args.hdc, args.device, ["file", "recv", remote, str(local)], timeout=15)
            call(args.hdc, args.device, ["shell", f"rm -f {remote}"], timeout=10)
        nodes = (
            read_nodes(local, args.filename, confirm_tokens)
            if local.is_file()
            else {"target": [], "confirm": [], "all": [], "texts": []}
        )
        record = {
            "index": poll_index,
            "atSeconds": round(time.monotonic() - started, 2),
            "gateSawPicker": "GATE_PICKER_SEEN" in gate_text,
            "gateLines": [line for line in gate_text.splitlines() if "filepicker" in line.lower()][:10],
            "hdcReturnCode": result.get("returnCode"),
            "layoutArtifact": str(local) if local.is_file() else None,
            "layoutBytes": local.stat().st_size if local.is_file() else 0,
            "recvReturnCode": (received or {}).get("returnCode"),
            "targets": nodes.get("target", []),
            "confirm": nodes.get("confirm", []),
            "textSample": nodes.get("texts", [])[:40],
        }
        summary["snapshots"].append(record)
        return record, nodes

    def click(point, purpose, extra):
        click_result = call(
            args.hdc,
            args.device,
            ["shell", "uitest", "uiInput", "click", str(point[0]), str(point[1])],
            timeout=12,
        )
        click_result.update(
            {"purpose": purpose, "point": point, "atSeconds": round(time.monotonic() - started, 2), **extra}
        )
        summary["clicks"].append(click_result)
        return click_result

    try:
        target = None
        record, nodes = gate_and_dump(args.first_dump_delay)
        if not record.get("gateSawPicker"):
            summary["status"] = "picker_process_not_observed"
        elif nodes.get("target"):
            target = nodes["target"][0] if len(nodes["target"]) == 1 else None
            summary["status"] = "target_found" if target else "target_ambiguous"
        elif time.monotonic() - started < args.budget_seconds - 14:
            record, nodes = gate_and_dump(0.2)
            if nodes.get("target"):
                target = nodes["target"][0] if len(nodes["target"]) == 1 else None
                summary["status"] = "target_found" if target else "target_ambiguous"

        if target is None and summary["status"] not in ("target_ambiguous",):
            if record.get("gateSawPicker"):
                summary["status"] = "target_not_found"
            elif summary["status"] != "picker_process_not_observed":
                summary["status"] = "picker_process_not_observed"

        if target is not None:
            left, top, right, bottom = target["bounds"]
            point = ((left + right) // 2, (top + bottom) // 2)
            screen = call(
                args.hdc,
                args.device,
                ["shell", "uitest", "screenCap", "-p", f"/data/local/tmp/h29c16-{cell_run_id}-target.png"],
                timeout=15,
            )
            screen_local = root / "000-target.screen.png"
            if screen.get("returnCode") == 0:
                call(
                    args.hdc,
                    args.device,
                    ["file", "recv", f"/data/local/tmp/h29c16-{cell_run_id}-target.png", str(screen_local)],
                    timeout=20,
                )
            click(point, "select-exact-canary", {"target": target, "screenArtifact": str(screen_local) if screen_local.is_file() else None})
            summary["status"] = "target_clicked"
            summary["durationSeconds"] = round(time.monotonic() - started, 2)
            (root / "summary.json").write_text(
                json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
            time.sleep(1.0)

            if time.monotonic() - started < args.budget_seconds - 10:
                record2, nodes2 = gate_and_dump(0.3, gate_seconds=3)
            else:
                record2, nodes2 = {"gateSawPicker": False}, {"confirm": [], "target": []}
            confirm = nodes2.get("confirm", [])
            if len(confirm) == 1:
                left, top, right, bottom = confirm[0]["bounds"]
                point = ((left + right) // 2, (top + bottom) // 2)
                result = click(point, "confirm-exact-canary", {"confirm": confirm[0]})
                summary["confirmMode"] = "explicit-button"
                time.sleep(1.0)
                summary["status"] = (
                    "selected_and_confirmed"
                    if result.get("returnCode") == 0
                    else "confirmation_click_failed"
                )
            elif len(confirm) > 1:
                summary["status"] = "confirmation_ambiguous"
            else:
                summary["status"] = "selected_by_row_click"
                summary["confirmMode"] = "single-select-row-click"
    except Exception as exc:
        summary["status"] = "operator_error"
        summary["error"] = repr(exc)

    summary["durationSeconds"] = round(time.monotonic() - started, 2)
    (root / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({"runId": cell_run_id, "status": summary["status"], "clicks": len(summary["clicks"])}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
