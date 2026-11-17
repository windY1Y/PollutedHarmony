#!/usr/bin/env python3
# python3 extract_native_calls_with_pp-sink.py ./reports/... -o output.txt

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path


PP_SINK_TOKEN = "[pptrace][pp-sink]"
MARKER_KEY_RE = re.compile(r"__GHUNTER_PP_TAINT__:([^:\s]+):")
TAINT_KEY_RE = re.compile(r"taintKey=\[([^\]]+)\]")
KEY_FIELD_RE = re.compile(r"\bkey=\[([^\]]+)\]")
CALLER_RE = re.compile(
    r",\s*caller info:\s*jsFunction=(?P<js_function>.*?)"
    r"\s+file=(?P<js_file>.*?)"
    r"\s+pos=(?P<js_pos>.*?)"
    r"\s+package=(?P<js_package>.*?)(?=,\s*jsStack=|$)"
)
JS_STACK_RE = re.compile(r",\s*jsStack=(?P<js_stack>.*)$")
SINK_RE = re.compile(
    r"callbackFunction=(?P<function>.*?)\s+"
    r"module=(?P<module>.*?)\s+"
    r"requestModule=(?P<request_module>.*?)\s+"
    r"so=(?P<so>.*?)\s+"
    r"export=(?P<export>.*?)\s+"
    r"argPath=(?P<arg_path>.*?)\s+"
    r"(?:(?:key=\[(?P<prop_key>[^\]]*)\]\s+))?"
    r"source=(?P<source>.*?)\s+"
    r"taintReason=(?P<taint_reason>.*?)(?=,\s*(?:caller info:|jsStack=)|$)"
)


def run_rg_pp_sink(paths):
    if shutil.which("rg") is None:
        raise RuntimeError("ripgrep is not installed. Install it first.")

    cmd = [
        "rg",
        "--no-config",
        "-F",
        "-a",
        "-n",
        "--color",
        "never",
        PP_SINK_TOKEN,
        *[str(p) for p in paths],
    ]
    completed = subprocess.run(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="ignore",
    )
    if completed.returncode not in (0, 1):
        raise RuntimeError(
            "rg failed with exit code {}\nCommand: {}\n{}".format(
                completed.returncode, " ".join(cmd), completed.stderr
            )
        )
    return completed.stdout.splitlines(), cmd


def normalize_unknown(value):
    value = (value or "").strip()
    return "" if value == "<unknown>" else value


def infer_kind(taint_reason):
    if "tainted-numeric-string" in taint_reason:
        return "tainted-numeric-string"
    if "tainted-numeric-value" in taint_reason:
        return "tainted-numeric-value"
    if "tainted-proxy-meta" in taint_reason:
        return "tainted-proxy-meta"
    if "tainted-meta" in taint_reason:
        return "tainted-meta"
    if "tainted-string" in taint_reason:
        return "tainted-string"
    return "tainted"


def infer_pp_key(line, prop_key, taint_reason):
    match = TAINT_KEY_RE.search(taint_reason)
    if match:
        return match.group(1).strip()

    match = MARKER_KEY_RE.search(line)
    if match:
        return match.group(1).strip()

    if prop_key:
        return prop_key.strip()

    return "<unknown>"


def parse_pp_sink_line(raw_line):
    pos = raw_line.find(PP_SINK_TOKEN)
    if pos < 0:
        return None

    sink_text = raw_line[pos + len(PP_SINK_TOKEN):].strip()
    match = SINK_RE.search(sink_text)
    if not match:
        return None

    data = {key: (value or "").strip() for key, value in match.groupdict().items()}
    caller_match = CALLER_RE.search(sink_text)
    if caller_match:
        data.update({key: (value or "").strip() for key, value in caller_match.groupdict().items()})
    else:
        data.update({"js_function": "", "js_file": "", "js_pos": "", "js_package": ""})
    js_stack_match = JS_STACK_RE.search(sink_text)
    data["js_stack"] = js_stack_match.group("js_stack").strip() if js_stack_match else ""

    data["function"] = normalize_unknown(data["function"])
    data["module"] = normalize_unknown(data["module"])
    data["request_module"] = normalize_unknown(data["request_module"])
    data["so"] = normalize_unknown(data["so"])
    data["export"] = normalize_unknown(data["export"])
    data["kind"] = infer_kind(data["taint_reason"])
    data["pp_key"] = infer_pp_key(raw_line, data["prop_key"], data["taint_reason"])
    data["raw"] = raw_line
    return data


def should_keep_record(record):
    if record["function"] == "info" and record["source"] == "arg-self":
        if not record["module"] and not record["request_module"] and not record["so"]:
            return False
    return True


def dedupe_key(record):
    return (
        record["pp_key"],
        record["kind"],
        record["function"],
        record["module"],
        record["request_module"],
        record["so"],
        record["export"],
        record["arg_path"],
        record["source"],
        record["prop_key"],
    )


def format_record(record):
    return (
        f"ppKey={record['pp_key']}\t"
        f"kind={record['kind']}\t"
        f"function={record['function'] or '<unknown>'}\t"
        f"module={record['module'] or '<unknown>'}\t"
        f"requestModule={record['request_module'] or '<unknown>'}\t"
        f"so={record['so'] or '<unknown>'}\t"
        f"export={record['export'] or '<unknown>'}\t"
        f"argPath={record['arg_path']}\t"
        f"source={record['source']}\t"
        f"propKey={record['prop_key'] or '<none>'}\t"
        f"taintReason={record['taint_reason']}\t"
        f"jsFunction={record['js_function'] or '<none>'}\t"
        f"jsFile={record['js_file'] or '<none>'}\t"
        f"jsPos={record['js_pos'] or '<none>'}\t"
        f"jsPackage={record['js_package'] or '<none>'}\t"
        f"jsStack={record['js_stack'] or '<none>'}"
    )


def derive_module_api_output_path(output_path):
    suffix = output_path.suffix or ".out"
    return output_path.with_name(f"{output_path.stem}.module_key_api{suffix}")


def display_module(record):
    for field in ("request_module", "module", "so"):
        value = record[field]
        if value:
            return value
    return "<unknown>"


def display_api(record, module_name):
    function = record["function"]
    export = record["export"]
    source_module = record["module"]

    if export and "." in export and (not function or "." not in function):
        api = export
    else:
        api = function or export or "<unknown>"

    if source_module and source_module != module_name and not api.startswith(f"{source_module}."):
        api = f"{source_module} {api}"

    arg_path = record["arg_path"]
    pp_key = record["pp_key"]
    simple_prop_path = bool(
        pp_key
        and re.match(rf"^(?:arg\[\d+\]|<receiver>)\.{re.escape(pp_key)}$", arg_path)
    )
    direct_arg_path = bool(re.match(r"^arg\[\d+\]$", arg_path))
    if arg_path and not simple_prop_path and not direct_arg_path:
        api = f"{api}, {arg_path}"

    return api


def write_module_key_api_summary(records, output_path):
    modules = {}
    for record in records:
        module_name = display_module(record)
        api = display_api(record, module_name)
        key = record["pp_key"] or "<unknown>"

        module_items = modules.setdefault(module_name, {})
        apis = module_items.setdefault(key, [])
        if api not in apis:
            apis.append(api)

    with output_path.open("w", encoding="utf-8", newline="\n") as handle:
        first_module = True
        for module_name, key_to_apis in modules.items():
            if not first_module:
                handle.write("\n")
            first_module = False
            handle.write(f"# {module_name}\n")

            api_to_keys = {}
            for key, apis in key_to_apis.items():
                api_tuple = tuple(apis)
                api_to_keys.setdefault(api_tuple, []).append(key)

            for api_tuple, keys in api_to_keys.items():
                handle.write(f"{' / '.join(keys)} -> {' / '.join(api_tuple)}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Extract final [pptrace][pp-sink] lines, parse sink fields, and deduplicate records."
    )
    parser.add_argument(
        "paths",
        nargs="+",
        help="Input file(s) or directory/directories to search.",
    )
    parser.add_argument(
        "-B",
        "--before",
        type=int,
        default=0,
        help="Deprecated compatibility option. Context is no longer needed and this value is ignored.",
    )
    parser.add_argument(
        "-o",
        "--output",
        default="native_calls_with_pp-sink.out",
        help="Output file for deduplicated pp-sink records. Default: native_calls_with_pp-sink.out.",
    )
    parser.add_argument(
        "--raw-output",
        action="store_true",
        help="Write deduplicated raw pp-sink log lines instead of parsed TSV-like records.",
    )
    parser.add_argument(
        "--module-api-output",
        default=None,
        help=(
            "Output file for a compact module-grouped ppKey -> API summary. "
            "Default: <output>.module_key_api.<suffix>."
        ),
    )
    parser.add_argument(
        "--print-rg-command",
        action="store_true",
        help="Print equivalent rg command to stderr.",
    )

    args = parser.parse_args()

    paths = [Path(p) for p in args.paths]
    for path in paths:
        if not path.exists():
            raise FileNotFoundError(f"Input path does not exist: {path}")

    lines, cmd = run_rg_pp_sink(paths)
    if args.print_rg_command:
        print("Equivalent command:", " ".join(cmd), file=sys.stderr)

    records = []
    parse_failed = []
    filtered = []
    seen = set()
    for line in lines:
        record = parse_pp_sink_line(line)
        if record is None:
            parse_failed.append(line)
            continue
        if not should_keep_record(record):
            filtered.append(record)
            continue
        key = dedupe_key(record)
        if key in seen:
            continue
        seen.add(key)
        records.append(record)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8", newline="\n") as handle:
        for record in records:
            handle.write(record["raw"] if args.raw_output else format_record(record))
            handle.write("\n")

    module_api_output_path = (
        Path(args.module_api_output)
        if args.module_api_output
        else derive_module_api_output_path(output_path)
    )
    module_api_output_path.parent.mkdir(parents=True, exist_ok=True)
    write_module_key_api_summary(records, module_api_output_path)

    flow_groups = {}
    for record in records:
        sink = (
            record["function"] or "<unknown>",
            record["module"] or "<unknown>",
            record["request_module"] or "<unknown>",
            record["so"] or "<unknown>",
            record["export"] or "<unknown>",
        )
        detail = f"{record['pp_key']}({record['arg_path']} {record['source']} {record['kind']})"
        flow_groups.setdefault(sink, {"keys": [], "details": []})
        if record["pp_key"] not in flow_groups[sink]["keys"]:
            flow_groups[sink]["keys"].append(record["pp_key"])
        if detail not in flow_groups[sink]["details"]:
            flow_groups[sink]["details"].append(detail)

    print(f"Input paths: {', '.join(str(p) for p in paths)}")
    print(f"pp-sink lines observed: {len(lines)}")
    print(f"Filtered noisy pp-sink records: {len(filtered)}")
    print(f"Unique pp-sink records: {len(records)}")
    print(f"Parse failures: {len(parse_failed)}")
    print(f"Output: {output_path}")

    total_keys = len({record["pp_key"] for record in records})
    print(
        "\nAfter deduplication, {} ppKeys flow into {} native sinks\n"
        "(ppKeys -> function : module : requestModule : so : export):".format(
            total_keys, len(flow_groups)
        ),
        file=sys.stderr,
    )
    for (function, module, request_module, so, export), flow in sorted(flow_groups.items()):
        print(
            "[{}] -> {} : {} : {} : {} : {} \t| details: {}".format(
                ", ".join(flow["keys"]),
                function,
                module,
                request_module,
                so,
                export,
                ", ".join(flow["details"]),
            ),
            file=sys.stderr,
        )

    if parse_failed:
        print("\nUnparsed pp-sink lines:", file=sys.stderr)
        for line in parse_failed[:20]:
            print(line, file=sys.stderr)
        if len(parse_failed) > 20:
            print(f"... {len(parse_failed) - 20} more", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
