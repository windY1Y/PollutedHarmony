import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path


device = os.environ.get("PPV3_DEVICE", "")
run_id = os.environ.get("PPV3_RUN_ID", "unknown")
stage = sys.argv[1] if len(sys.argv) > 1 else "unknown"
out = Path(os.environ.get("PPV630_OUTPUT_DIR", "."))
root = out / "ui-probe-v6" / run_id / stage
root.mkdir(parents=True, exist_ok=True)
hdc = "/data/oh-testing/prebuilts/ohos-sdk/linux/20/toolchains/hdc"
target_name = os.environ.get("PPV630_H29_PUBLIC_NAME", "ppv630-h29-public-v6.txt")


def call(args, timeout=15):
    try:
        proc = subprocess.run(
            [hdc, "-t", device, *args],
            capture_output=True,
            text=True,
            errors="replace",
            timeout=timeout,
            check=False,
        )
        return {"args": args, "returnCode": proc.returncode, "stdout": proc.stdout, "stderr": proc.stderr}
    except Exception as exc:
        return {"args": args, "returnCode": -1, "error": repr(exc)}


def recv(device_path, local_path, timeout=20):
    result = call(["file", "recv", device_path, str(local_path)], timeout=timeout)
    result["artifact"] = str(local_path)
    return result


def parse_bounds(value):
    if isinstance(value, dict):
        keys = {str(k).lower(): v for k, v in value.items()}
        if all(k in keys for k in ("left", "top", "right", "bottom")):
            try:
                return tuple(int(keys[k]) for k in ("left", "top", "right", "bottom"))
            except (TypeError, ValueError):
                return None
        if all(k in keys for k in ("x", "y", "width", "height")):
            try:
                return (int(keys["x"]), int(keys["y"]), int(keys["x"]) + int(keys["width"]), int(keys["y"]) + int(keys["height"]))
            except (TypeError, ValueError):
                return None
    if isinstance(value, (list, tuple)) and len(value) >= 4:
        try:
            return tuple(int(x) for x in value[:4])
        except (TypeError, ValueError):
            return None
    if isinstance(value, str):
        nums = re.findall(r"-?\d+", value)
        if len(nums) >= 4:
            return tuple(int(x) for x in nums[:4])
    return None


def attrs(node):
    if not isinstance(node, dict):
        return {}
    result = {}
    for key in ("attributes", "attr", "attribute"):
        if isinstance(node.get(key), dict):
            result.update(node[key])
    result.update({k: v for k, v in node.items() if k not in ("children", "attributes", "attr", "attribute")})
    return result


def walk(node, path="root"):
    if isinstance(node, dict):
        yield path, node, attrs(node)
        if isinstance(node.get("children"), list):
            for index, child in enumerate(node["children"]):
                yield from walk(child, path + ".children[" + str(index) + "]")
    elif isinstance(node, list):
        for index, child in enumerate(node):
            yield from walk(child, path + "[" + str(index) + "]")


def text_of(attributes):
    values = []
    for key in ("text", "content", "value", "description", "resourceName", "id"):
        if attributes.get(key) is not None:
            values.append(str(attributes[key]))
    return " | ".join(values)


def nodes_from(layout_path):
    try:
        data = json.loads(layout_path.read_text(encoding="utf-8", errors="replace"))
    except Exception as exc:
        return {"parseError": repr(exc), "target": [], "confirm": []}
    target = []
    confirm = []
    for path, _node, attributes in walk(data):
        bounds = parse_bounds(attributes.get("bounds") or attributes.get("bound") or attributes.get("rect"))
        if not bounds:
            continue
        text = text_of(attributes)
        item = {"path": path, "text": text, "bounds": bounds, "attributes": attributes}
        if target_name.lower() in text.lower():
            target.append(item)
        if re.search(r"open|select|done|confirm|choose|ok|complete", text, re.I):
            confirm.append(item)
    return {"target": target, "confirm": confirm}


def snapshot(label):
    commands = []
    layout_device = "/data/local/tmp/ppv630-h29-v6-layout-" + run_id + "-" + label + ".json"
    screen_device = "/data/local/tmp/ppv630-h29-v6-screen-" + run_id + "-" + label + ".png"
    layout = call(["shell", "uitest", "dumpLayout", "-a", "-m", "true", "-p", layout_device], timeout=20)
    commands.append(layout)
    layout_path = root / (label + ".layout.json")
    if layout["returnCode"] == 0:
        commands.append(recv(layout_device, layout_path))
    screen = call(["shell", "uitest", "screenCap", "-p", screen_device], timeout=20)
    commands.append(screen)
    if screen["returnCode"] == 0:
        commands.append(recv(screen_device, root / (label + ".screen.png")))
    window = call(["shell", "hidumper", "-s", "WindowManagerService", "-a", "-a"], timeout=20)
    (root / (label + ".window-manager.txt")).write_text(window.get("stdout", "") + window.get("stderr", ""), encoding="utf-8", errors="replace")
    commands.append({"args": window["args"], "returnCode": window["returnCode"], "artifact": label + ".window-manager.txt"})
    nodes = nodes_from(layout_path) if layout_path.is_file() else {"target": [], "confirm": []}
    (root / (label + ".nodes.json")).write_text(json.dumps(nodes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"label": label, "nodes": nodes, "commands": commands}


summary = {
    "schema": "continuation13-h29-picker-ui-probe-v6",
    "caseId": os.environ.get("PPV630_CASE", "unknown"),
    "runId": run_id,
    "group": os.environ.get("PPV3_GROUP", "unknown"),
    "stage": stage,
    "targetName": target_name,
    "publicFixtureOnly": True,
    "ownerUriNotProven": True,
    "status": "not_started",
    "snapshots": [],
    "clicks": [],
}
commands = []
try:
    if stage == "ready":
        first = None
        deadline = time.monotonic() + 15
        while time.monotonic() < deadline:
            first = snapshot("before-click")
            commands.extend(first["commands"])
            summary["snapshots"].append({"label": first["label"], "nodes": first["nodes"]})
            wms = (root / "before-click.window-manager.txt").read_text(encoding="utf-8", errors="replace")
            if "FilePicker" in wms or "filePicker" in wms or first["nodes"].get("target"):
                break
            time.sleep(0.5)
        target = (first or {}).get("nodes", {}).get("target", [])
        if target:
            left, top, right, bottom = target[0]["bounds"]
            point = ((left + right) // 2, (top + bottom) // 2)
            click = call(["shell", "uitest", "uiInput", "click", str(point[0]), str(point[1])], timeout=20)
            click.update({"purpose": "select-public-canary-file", "point": point})
            summary["clicks"].append(click)
            time.sleep(1)
            after_file = snapshot("after-file-click")
            commands.extend(after_file["commands"])
            summary["snapshots"].append({"label": after_file["label"], "nodes": after_file["nodes"]})
            confirm = after_file["nodes"].get("confirm", [])
            if confirm:
                left, top, right, bottom = confirm[-1]["bounds"]
                point = ((left + right) // 2, (top + bottom) // 2)
                click = call(["shell", "uitest", "uiInput", "click", str(point[0]), str(point[1])], timeout=20)
                click.update({"purpose": "confirm-public-canary-selection", "point": point})
                summary["clicks"].append(click)
            else:
                key = call(["shell", "uitest", "uiInput", "keyEvent", "Enter"], timeout=20)
                key["purpose"] = "confirm-public-canary-selection-fallback"
                summary["clicks"].append(key)
            time.sleep(1.5)
            final = snapshot("after-confirm")
            commands.extend(final["commands"])
            summary["snapshots"].append({"label": final["label"], "nodes": final["nodes"]})
            summary["status"] = "clicked_public_fixture"
        else:
            summary["status"] = "picker_visible_but_fixture_node_not_found"
    else:
        snap = snapshot("stage")
        commands.extend(snap["commands"])
        summary["snapshots"].append({"label": snap["label"], "nodes": snap["nodes"]})
        summary["status"] = "snapshot_only"
except Exception as exc:
    summary["status"] = "probe_error"
    summary["error"] = repr(exc)

hilog = call(["shell", "hilog", "-x"], timeout=20)
(root / "hilog-x.txt").write_text(hilog.get("stdout", "") + hilog.get("stderr", ""), encoding="utf-8", errors="replace")
commands.append({"args": hilog["args"], "returnCode": hilog["returnCode"], "artifact": "hilog-x.txt"})
summary["commands"] = commands
(root / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
