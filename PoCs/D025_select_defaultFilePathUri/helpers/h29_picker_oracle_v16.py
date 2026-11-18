#!/usr/bin/env python3
"""Evaluate the continuation16 H29 picker cells without declaring a security verdict.

A cell only closes when the fresh runner row, the per-cell UI operator summary,
the independent picker/docs-provider process evidence, the exact selected-URI
match, the before-read denial, the after-read success and the canary digest all
agree for the same cell run id.
"""

import argparse
import json
import re
from pathlib import Path


def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def first_key(value, key):
    for item in walk(value):
        if isinstance(item, dict) and key in item:
            return item[key]
    return None


def uri_candidates(value):
    result = []
    if isinstance(value, str):
        if "://" in value:
            result.append(value.strip())
    elif isinstance(value, dict):
        for child in value.values():
            result.extend(uri_candidates(child))
    elif isinstance(value, list):
        for child in value:
            result.extend(uri_candidates(child))
    return result


def json_chunks(path):
    groups = {}
    text = path.read_text(encoding="utf-8", errors="replace")
    for line in text.splitlines():
        marker = None
        for candidate in ("[PPV630_CHUNK]", "[PPV3_CHUNK]"):
            if candidate in line:
                marker = candidate
                break
        if not marker:
            continue
        try:
            payload = json.JSONDecoder().raw_decode(line.split(marker, 1)[1])[0]
        except Exception:
            continue
        run_id = payload.get("runId")
        if run_id:
            groups.setdefault(run_id, []).append(payload)
    rows = []
    for run_id, chunks in groups.items():
        chunks.sort(key=lambda item: item.get("index", -1))
        if not chunks or len(chunks) != chunks[0].get("count"):
            continue
        if [item.get("index") for item in chunks] != list(range(chunks[0].get("count", 0))):
            continue
        try:
            rows.append(
                {
                    "source": str(path),
                    "runId": run_id,
                    "row": json.loads("".join(item.get("data", "") for item in chunks)),
                }
            )
        except Exception:
            continue
    return rows


def json_rows(path):
    try:
        data = json.loads(path.read_text(encoding="utf-8", errors="replace"))
    except Exception:
        return []
    rows = []
    for item in walk(data):
        if not isinstance(item, dict):
            continue
        if "observation" in item or "readB" in item:
            if any(key in item for key in ("group", "status", "repetition", "runId")):
                rows.append({"source": str(path), "runId": item.get("runId"), "row": item})
    return rows


def digest_objects(value):
    result = []
    for item in walk(value):
        if not isinstance(item, dict):
            continue
        keys = {key.lower() for key in item}
        if keys.intersection({"fnv1a32", "hash", "prefix", "prefixhex", "sha256"}):
            result.append(item)
    return result


def read_state(observation):
    if not isinstance(observation, dict):
        return {"found": False}
    read_b = observation.get("readB")
    if not isinstance(read_b, dict):
        read_b = first_key(observation, "readB")
    before = observation["before"] if "before" in observation else first_key(observation, "before")
    return {"found": isinstance(read_b, dict), "before": before, "after": read_b}


def error_of(state):
    if not isinstance(state, dict):
        return None
    error = state.get("error")
    if not isinstance(error, dict):
        return None
    return {"code": error.get("code"), "message": error.get("message")}


def digest_matches(after, expected):
    if not isinstance(after, dict) or after.get("ok") is not True:
        return False, {}
    values = digest_objects(after)
    expected_fnv = str(expected.get("fnv1a32", "")).lower()
    expected_prefix = expected.get("prefix", [])
    for value in values:
        fnv = str(value.get("fnv1a32", value.get("hash", ""))).lower()
        if expected_fnv and fnv == expected_fnv:
            return True, value
        prefix = value.get("prefix")
        if expected_prefix and prefix == expected_prefix:
            return True, value
    return False, values[0] if values else {}


def selected_uris_from(observation, row):
    candidates = []
    if row.get("selected") is not None:
        candidates.append(row.get("selected"))
    if isinstance(observation, dict):
        if observation.get("selected") is not None:
            candidates.append(observation.get("selected"))
        value = observation.get("value")
        if isinstance(value, dict) and value.get("selected") is not None:
            candidates.append(value.get("selected"))
    uris = []
    for candidate in candidates:
        uris.extend(uri_candidates(candidate))
    return sorted(set(uris))


def picker_request_evidence(log_path, contract, run_id):
    """Evidence that the picker request really carried the configured field.

    Each cell log is a cumulative hilog window, so the slice must start at this
    cell's own [PPV630_PROCESS] marker (matched by runId), never at the first
    marker found in the file.
    """
    empty = {
        "logPresent": False,
        "sessionCreateCount": 0,
        "keyPickDirPaths": [],
        "defaultFilePathUris": [],
        "pickerSawExpectedDirectory": False,
        "pickerSawCanaryFilename": False,
        "segmentStart": None,
    }
    if not log_path.is_file():
        return empty
    text = log_path.read_text(encoding="utf-8", errors="replace")
    index = text.find(f'[PPV630_PROCESS]{{"runId":"{run_id}"')
    segment = text[index:] if index >= 0 else ""
    directory = contract.get("directoryUri", "")
    filename = contract.get("filename", "")
    key_dirs = sorted(set(re.findall(r'"key_pick_dir_path":"([^"]*)"', segment)))
    default_dirs = sorted(set(re.findall(r'"defaultFilePathUri":"([^"]*)"', segment)))
    return {
        "logPresent": True,
        "sessionCreateCount": segment.count("FilePickerUIExtAbility onSessionCreate"),
        "keyPickDirPaths": key_dirs,
        "defaultFilePathUris": default_dirs,
        "pickerSawExpectedDirectory": bool(directory) and directory in key_dirs,
        "pickerSawCanaryFilename": bool(filename) and filename in segment,
        "segmentStart": index,
    }


def row_finding(item, expected):
    row = item.get("row", {})
    observation = row.get("observation", row)
    state = read_state(observation)
    before = state.get("before")
    after = state.get("after")
    selected_uris = selected_uris_from(observation, row)
    expected_uri = expected.get("uri", "")
    selected_match = expected_uri in selected_uris
    before_denied = isinstance(before, dict) and before.get("ok") is False
    after_ok = isinstance(after, dict) and after.get("ok") is True
    digest_match, digest = digest_matches(after, expected)
    return {
        "source": item.get("source"),
        "runId": row.get("runId", item.get("runId")),
        "group": row.get("group"),
        "repetition": row.get("repetition"),
        "status": row.get("status"),
        "selectedUris": selected_uris,
        "selectedUriMatchesExpected": selected_match,
        "beforeReadDenied": before_denied,
        "beforeReadError": error_of(before),
        "afterCallerReadOk": after_ok,
        "afterReadError": error_of(after),
        "afterDigest": digest,
        "afterDigestMatchesExpected": digest_match,
        "temporaryGrantOracle": selected_match and before_denied and after_ok and digest_match,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--matrix", type=Path, required=True)
    parser.add_argument("--contract", type=Path, required=True)
    parser.add_argument("--device", required=True)
    parser.add_argument("--parent-run-id", required=True)
    parser.add_argument("--expected-groups", required=True)
    parser.add_argument("--expected-repetitions", type=int, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    contract = json.loads(args.contract.read_text(encoding="utf-8"))
    # Every cell streams a hilog window that can also contain earlier cells'
    # chunk lines, so a row is taken from its own <runId>.log when that file
    # exists and is only counted once per runId.
    cells = {}
    for path in sorted(args.matrix.rglob("*.log")):
        for item in json_chunks(path):
            run_id = item.get("runId")
            if not run_id:
                continue
            preferred = path.name == f"{run_id}.log"
            previous = cells.get(run_id)
            if previous is None or (preferred and not previous["preferred"]):
                cells[run_id] = {"item": item, "preferred": preferred}
    rows = [entry["item"] for entry in cells.values()]
    for path in sorted(args.matrix.rglob("*.json")):
        if path.name in {"summary.json", "h29-picker-v16-oracle.json"}:
            continue
        if "ui-probe-v16" in path.as_posix() or "watcher-v16" in path.as_posix():
            continue
        for item in json_rows(path):
            run_id = item.get("runId")
            if run_id in cells:
                continue
            cells[run_id] = {"item": item, "preferred": False}
            rows.append(item)

    findings = [row_finding(item, contract) for item in rows]
    expected_groups = [item.strip() for item in args.expected_groups.split(",") if item.strip()]
    expected_cells = {
        (group, repetition)
        for group in expected_groups
        for repetition in range(1, args.expected_repetitions + 1)
    }
    cell_rows = {}
    duplicate_cells = []
    for finding in findings:
        cell = (finding.get("group"), finding.get("repetition"))
        if cell in cell_rows:
            duplicate_cells.append(
                {
                    "cell": cell,
                    "firstRunId": cell_rows[cell].get("runId"),
                    "duplicateRunId": finding.get("runId"),
                    "firstSource": cell_rows[cell].get("source"),
                    "duplicateSource": finding.get("source"),
                }
            )
            continue
        cell_rows[cell] = finding

    ui_summaries = []
    for path in sorted(args.matrix.rglob("ui-probe-v16/**/summary.json")):
        try:
            ui_summaries.append(json.loads(path.read_text(encoding="utf-8", errors="replace")))
        except Exception:
            continue
    process_summaries = []
    for path in sorted(args.matrix.rglob("process-oracle-v16/**/summary.json")):
        try:
            process_summaries.append(json.loads(path.read_text(encoding="utf-8", errors="replace")))
        except Exception:
            continue

    ui_by_run = {}
    for item in ui_summaries:
        run_id = item.get("runId")
        if run_id:
            ui_by_run.setdefault(run_id, []).append(item)
    process_by_run = {}
    for item in process_summaries:
        run_id = item.get("runId")
        if run_id:
            process_by_run.setdefault(run_id, []).append(item)

    closed_statuses = {"selected_and_confirmed", "selected_by_row_click"}
    cell_closures = []
    for cell in sorted(expected_cells, key=lambda value: (value[0], value[1])):
        finding = cell_rows.get(cell)
        run_id = finding.get("runId") if finding else None
        matched_ui = ui_by_run.get(run_id, []) if run_id else []
        matched_process = process_by_run.get(run_id, []) if run_id else []
        ui_statuses = sorted({str(item.get("status")) for item in matched_ui})
        ui_ok = any(item.get("status") in closed_statuses for item in matched_ui)
        ui_clicks = sum(len(item.get("clicks") or []) for item in matched_ui)
        provider_ok = any(bool(item.get("providerIdentityMatches")) for item in matched_process)
        grant_ok = bool(finding and finding.get("temporaryGrantOracle"))
        picker = (
            picker_request_evidence(args.matrix / f"{run_id}.log", contract, run_id)
            if run_id
            else {"logPresent": False, "pickerSawExpectedDirectory": False}
        )
        cell_closures.append(
            {
                "group": cell[0],
                "repetition": cell[1],
                "runId": run_id,
                "findingPresent": finding is not None,
                "uiSummaryCount": len(matched_ui),
                "uiStatuses": ui_statuses,
                "uiClicks": ui_clicks,
                "processSummaryCount": len(matched_process),
                "uiClosed": ui_ok,
                "pickerRequest": picker,
                "pickerRequestObserved": bool(
                    picker.get("pickerSawExpectedDirectory") and picker.get("sessionCreateCount")
                ),
                "providerObserved": provider_ok,
                "grantOracle": grant_ok,
                "closed": bool(
                    finding
                    and ui_ok
                    and provider_ok
                    and grant_ok
                    and picker.get("pickerSawExpectedDirectory")
                ),
            }
        )

    closed_cells = [item for item in cell_closures if item["closed"]]
    ui_closed = bool(cell_closures) and all(item["uiClosed"] for item in cell_closures)
    provider_observed = bool(cell_closures) and all(item["providerObserved"] for item in cell_closures)
    picker_observed = bool(cell_closures) and all(item["pickerRequestObserved"] for item in cell_closures)
    blockers = []
    missing_cells = sorted(expected_cells.difference(cell_rows), key=lambda value: (value[0], value[1]))
    if missing_cells:
        blockers.append(f"Missing fresh runner cells: {missing_cells}")
    if duplicate_cells:
        blockers.append("Duplicate runner cells were found; no duplicate is counted as a successful repetition")
    if not ui_summaries:
        blockers.append("No fresh continuation16 UI operator summary was collected")
    if not ui_closed:
        blockers.append("Every expected cell must have an exact canary selection and an explicit or single-select confirmation")
    if not picker_observed:
        blockers.append("Every expected cell must show the expected directory in a FilePicker onSessionCreate request")
    if not provider_observed:
        blockers.append("Every expected cell must have independent picker/docs-provider identity evidence")
    if not findings:
        blockers.append("No decoded runner observation or raw chunk row was found")
    if len(closed_cells) != len(expected_cells):
        blockers.append(
            f"Closed cells {len(closed_cells)}/{len(expected_cells)}; a partial result is not a closed group"
        )

    report = {
        "schema": "continuation16-h29-picker-oracle-v1",
        "caseId": "H29-C-52ba990f664cdfd2",
        "device": args.device,
        "parentRunId": args.parent_run_id,
        "expectedGroups": expected_groups,
        "expectedRepetitions": args.expected_repetitions,
        "matrix": str(args.matrix),
        "contract": str(args.contract),
        "providerKind": contract.get("providerKind"),
        "providerIdentityObserved": provider_observed,
        "pickerRequestObserved": picker_observed,
        "uiClosed": ui_closed,
        "rows": findings,
        "cellClosures": cell_closures,
        "duplicateCells": duplicate_cells,
        "uiSummaries": ui_summaries,
        "processSummaries": process_summaries,
        "fixtureGrantOracleClosed": bool(
            expected_cells and len(closed_cells) == len(expected_cells) and not duplicate_cells
        ),
        "securityVerdict": "not_decided",
        "h29Recommendation": "proceed_to_full_matrix" if not blockers else "needs_evidence",
        "whyNotSecurity": "A normal user-mediated picker grant is a control qualification; it is not itself proof that prototype pollution caused unauthorized access.",
        "whyNotNoEffect": "The consumer path is not considered equivalent until the legal control and the inherited-value PT run are both measured.",
        "blockers": blockers,
    }
    if args.output.exists() and args.output.stat().st_size:
        raise SystemExit(f"refusing to overwrite nonempty output: {args.output}")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "fixtureGrantOracleClosed": report["fixtureGrantOracleClosed"],
                "securityVerdict": report["securityVerdict"],
                "h29Recommendation": report["h29Recommendation"],
                "rows": len(findings),
                "closedCells": len(closed_cells),
                "expectedCells": len(expected_cells),
                "uiSummaries": len(ui_summaries),
                "providerSummaries": len(process_summaries),
                "output": str(args.output),
            },
            ensure_ascii=False,
        )
    )
    return 0 if report["fixtureGrantOracleClosed"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
