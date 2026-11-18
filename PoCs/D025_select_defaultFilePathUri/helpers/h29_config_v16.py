#!/usr/bin/env python3
"""Create a continuation16 H29 config and canary contract from a read-only template."""

import argparse
import hashlib
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-config", type=Path, required=True)
    parser.add_argument("--source-environment", type=Path, required=True)
    parser.add_argument("--config", type=Path, required=True)
    parser.add_argument("--environment", type=Path, required=True)
    parser.add_argument("--contract", type=Path, required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--mode", choices=("direct-docs", "h29-pt", "full-matrix"), required=True)
    parser.add_argument("--directory-uri", required=True)
    parser.add_argument("--file-uri", required=True)
    parser.add_argument("--filename", required=True)
    parser.add_argument("--canary-text", required=True)
    parser.add_argument("--timeout-ms", type=int, default=60000)
    args = parser.parse_args()

    cfg = json.loads(args.source_config.read_text(encoding="utf-8"))
    env = json.loads(args.source_environment.read_text(encoding="utf-8"))
    raw = (args.canary_text + "\n").encode("utf-8")
    fnv = 2166136261
    for byte in raw:
        fnv = ((fnv ^ byte) * 16777619) & 0xFFFFFFFF
    contract = {
        "schema": "continuation16-h29-docs-provider-fixture-v1",
        "caseId": "H29-C-52ba990f664cdfd2",
        "providerKind": "system-docs-provider",
        "providerUriPrefix": "file://docs/storage/Users/currentUser/",
        "directoryUri": args.directory_uri,
        "uri": args.file_uri,
        "filename": args.filename,
        "canaryText": args.canary_text,
        "byteLength": len(raw),
        "prefix": list(raw[:96]),
        "fnv1a32": format(fnv, "08x"),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "callerUidMustBeDeniedBeforePicker": True,
        "callerMustReadAfterPickerReturn": True,
        "temporaryGrantIsInferredOnlyFromBeforeAfterReadTransition": True,
    }
    env.update(
        {
            "continuation": "continuation16-h29-picker",
            "runId": args.run_id,
            "bundleEvidence": (
                "/data/oh-testing/v2/05_validation/manual-retests/20261019/phase2/"
                f"continuation16/h29/runs/{args.run_id}/provision/bundle-evidence.txt"
            ),
        }
    )
    cfg["environment"] = env
    cfg["runId"] = "UNBOUND"
    cfg["group"] = "B" if args.mode == "direct-docs" else "PT"
    cfg.setdefault("values", {})["inj0"] = args.directory_uri
    cfg.setdefault("fixtures", {})["unselectedBUri"] = args.file_uri
    cfg["fixtures"]["unselectedBUri"] = args.file_uri
    cfg["provisionedResourceEvidence"] = {
        "scope": "Continuation15 unique docs-provider canary only",
        "providerKind": "system-docs-provider",
        "directoryUri": args.directory_uri,
        "fileUri": args.file_uri,
        "canarySha256": contract["sha256"],
        "canaryFnv1a32": contract["fnv1a32"],
        "ownerPrivateResourceNotClaimed": True,
    }
    cfg["continuation16Mode"] = args.mode
    # The per-cell UI operator has a 45s budget; the picker call must outlive it.
    cfg["timeoutMs"] = args.timeout_ms
    cfg["afterTimeoutMs"] = 5000
    cfg["uiOperator"] = {
        "invokedBy": "before-hook",
        "readyHookUsable": False,
        "readyHookReason": "installed runner HAP prints PPV630_PROCESS but not PPV630_READY",
        "budgetSeconds": 45,
    }
    cfg["supportedControls"] = (
        ["B"]
        if args.mode == "direct-docs"
        else ["PT"]
        if args.mode == "h29-pt"
        else ["B", "P", "PT", "CLEAN", "OWN_SHADOW"]
    )
    if args.mode == "direct-docs":
        options = dict(cfg.get("ordinary", {}).get("options", {}))
        options["defaultFilePathUri"] = args.directory_uri
        cfg.setdefault("ordinary", {})["options"] = options
    else:
        cfg.setdefault("ordinary", {})["options"] = {}

    for path, data in (
        (args.config, cfg),
        (args.environment, env),
        (args.contract, contract),
    ):
        if path.exists() and path.stat().st_size:
            raise SystemExit(f"refusing to overwrite nonempty file: {path}")
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"config": str(args.config), "contract": str(args.contract), "fnv1a32": contract["fnv1a32"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
