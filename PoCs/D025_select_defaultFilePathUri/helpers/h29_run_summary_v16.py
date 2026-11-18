#!/usr/bin/env python3
"""Write a small immutable continuation16 run summary."""

import argparse
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--mode", required=True)
    parser.add_argument("--device", required=True)
    parser.add_argument("--shared-uri", required=True)
    parser.add_argument("--matrix", required=True)
    parser.add_argument("--runner-rc", type=int, required=True)
    parser.add_argument("--oracle-rc", type=int, required=True)
    args = parser.parse_args()
    if args.output.exists() and args.output.stat().st_size:
        raise SystemExit(f"refusing to overwrite nonempty file: {args.output}")
    payload = {
        "schema": "continuation16-h29-picker-run-v1",
        "caseId": "H29-C-52ba990f664cdfd2",
        "runId": args.run_id,
        "mode": args.mode,
        "device": args.device,
        "sharedUri": args.shared_uri,
        "matrix": args.matrix,
        "runnerReturnCode": args.runner_rc,
        "oracleReturnCode": args.oracle_rc,
        "securityVerdict": "not_decided",
        "historicalEvidenceUsedAsVerdict": False,
    }
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
