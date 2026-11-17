"""
提取运行 suite 后 receiver/key 的访问记录，特别是 isFound? 0, isOnPrototype? 1 的情况。

主要输出：
1. 原始去重记录：subdir, receiver, key
2. 只包含去重 key 的集合：key
3. key 到 testmodule 列表的映射：{key: [testmodule, ...]}
另输出 filtered_out.csv、filter_summary.json 和 context_review.csv。
context_review 中的来源/源码归属待定记录仍保留在主要输出中。

过滤依据：识别 originVersion=1/2；仅过滤明确测试路径且 origin=js-bytecode
的访问。v2 的 origin 表示直接读取来源，nativeContext 表示外层上下文，不能
用外层上下文覆盖直接来源。v1 的 native-callback 仍可能包含测试 JS 重入，
旧日志需另行复核，不能仅凭测试 frame 删除。

使用方法：注意必须到log目录，否则无法生成正确的 key -> testmodule 映射关系
python extract_undefined_props.py ./reports/report/pptrace_ark_all/log -o undefined_props.csv

若 -o undefined_props.csv，则输出：
1. undefined_props.csv
2. undefined_props_keys.csv
3. undefined_props_keys_testmodules.json
"""

#!/usr/bin/env python3
import argparse
import csv
import json
import os
import re
import shutil
import subprocess
from pathlib import Path


ARK = b"ArkCompiler:"
PROP_CONTEXT_PREFIX = b"[pptrace][prop-context"
RG_SEP = ":::RG_SEP:::"
RG_SEP_B = RG_SEP.encode()

USELESS_PROPS = {
    "[-D]", "[Symbol]",
    "[__pp_taint_id__]", "[__pptrace_napi_export__]", "[__pptrace_napi_module__]",
    "[__pptrace_napi_module_name__]", "[__pptrace_napi_so__]",
    "[-s ppActiveThen]", "[-s ppKey]", "[-s ppMode]", "[-s ppStack]",
    "[ppKey]", "[ppActiveThen]", "[ppMode]", "[ppStack]",
    "[breakOnError]",
    "[_GLOBAL_MODULE_NAME]", "[_napiwrapper]", "[readCbFunc_]",
    "[___IS_TRACKED_OPTIMISED]", "[handledColorMode]", "[wrappedValue_]",
}

GENERATED_DOLLAR_PROPS = {
    "[$index]", "[$isOn]", "[$rating]", "[$refreshing]",
    "[$selected]", "[$text]", "[$value]",
}

NUMERIC_PROP_RE = re.compile(r"^\[-?\d+\]$")
COMMON_MODULE_CACHE_PROP_RE = re.compile(
    r"^\[__common_module_cache___[0-9a-f]{64}\]$"
)
OHOS_ABILITY_ENTRY_PROP_RE = re.compile(
    r"^\[ohos\..*(?:entry(?:_test)?|testModule)\]$"
)

PROP_CONTEXT_RE = re.compile(
    r"\[pptrace\]\[prop-context(?:-(?P<access>GET|HAS))?\]\s+"
    r"key=(?P<key>\[[^\]]*\]|\S*)"
    r"(?P<details>\s+.*)$"
)
CONTEXT_FIELD_RE = re.compile(
    r"(?:^|\s)(function|file|pos|package|receiverType|receiverTag|receiverExpr|"
    r"rawFile|rawPos|originVersion|origin|nativeApi|nativeModule|nativeContext|nativeContextRole)="
)
NATIVE_ORIGINS = {"napi", "ark-api", "native-callback", "native-frame"}
MODULE_SOURCE_MARKERS = ("/product/", "/foundation/", "/frameworks/",
                         "/applications/standard/", "/system/", "/sdk/")
# ACTS page bundles can retain generated filenames instead of src/main paths.
# Restrict these patterns to entry-owned pages, not app/dependency bundles.
COMPILED_TEST_PAGE_RES = (
    re.compile(r"^/entry/build/[^/]+/cache/[^/]+/[^/]+@legacycompilearkts/"
               r"jsbundle/release/(?P<ability>[^/]+)/temporary/(?P=ability)/"
               r"pages/[^\s]+\.temp\.js$"),
    re.compile(r"^/entry/build/[^/]+/intermediates/loader_out/default/js/"
               r"[^/]+/pages/[^\s]+\.js$"),
)
CONTEXT_COLUMNS = ["function", "file", "pos", "package", "originVersion", "origin",
                   "nativeApi", "nativeModule", "nativeContext", "nativeContextRole", "rawFile", "rawPos"]

IDENT_CHARS = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_:$<>")
HEX_CHARS = set("0123456789abcdefABCDEF")


def normalize_value(value: str) -> str:
    """
    不用 re.sub，手写扫描，减少正则开销。

    处理：
      [Symbol(0xc8241510)]   -> [Symbol]
      [Array(0xa27b7580)]    -> [Array]
      [Function(0xa27b8878)] -> [Function]
      Symbol(0xc8241510)    -> Symbol
      0xa27b7580            -> 0xADDR
    """
    s = value.strip()
    n = len(s)
    out = []
    i = 0

    while i < n:
        ch = s[i]

        # 删除 Type(0xabc) 里的地址部分
        if ch == "(" and i + 3 < n and s[i + 1:i + 3] == "0x":
            j = i + 3
            while j < n and s[j] in HEX_CHARS:
                j += 1

            if j < n and s[j] == ")":
                if out and out[-1] in IDENT_CHARS:
                    i = j + 1
                    continue

        # 裸地址替换成 0xADDR
        if ch == "0" and i + 2 < n and s[i + 1] == "x" and s[i + 2] in HEX_CHARS:
            j = i + 2
            while j < n and s[j] in HEX_CHARS:
                j += 1
            out.append("0xADDR")
            i = j
            continue

        out.append(ch)
        i += 1

    return "".join(out)


def decode_value(raw: bytes) -> str:
    return raw.strip().decode("utf-8", errors="ignore")


def get_subdir_name_fast(root_dir: str, file_path: str) -> str:
    rel = os.path.relpath(file_path, root_dir)
    parts = rel.split(os.sep)

    if len(parts) >= 2:
        return parts[0]

    return "."


def output_paths(output: str):
    output_path = Path(output).resolve()

    if output_path.suffix:
        keys_path = output_path.with_name(
            output_path.stem + "_keys" + output_path.suffix
        )
        key_subdirs_json_path = output_path.with_name(
            output_path.stem + "_keys_testmodules.json"
        )
        rejected_path = output_path.with_name(
            output_path.stem + "_filtered_out" + output_path.suffix
        )
        summary_path = output_path.with_name(
            output_path.stem + "_filter_summary.json"
        )
    else:
        keys_path = output_path.with_name(output_path.name + "_keys")
        key_subdirs_json_path = output_path.with_name(
            output_path.name + "_keys_testmodules.json"
        )
        rejected_path = output_path.with_name(output_path.name + "_filtered_out")
        summary_path = output_path.with_name(output_path.name + "_filter_summary.json")

    return output_path, keys_path, key_subdirs_json_path, rejected_path, summary_path


def parse_prop_context(payload: bytes) -> dict:
    """Parse legacy and versioned logs, including metadata without a JS frame."""
    text = decode_value(payload)
    match = PROP_CONTEXT_RE.search(text)
    if not match:
        return {}
    context = {"key": match["key"], "access": match["access"] or ""}
    details = match["details"]
    fields = list(CONTEXT_FIELD_RE.finditer(details))
    for index, field in enumerate(fields):
        end = fields[index + 1].start() if index + 1 < len(fields) else len(details)
        context[field[1]] = details[field.end():end].strip()
    no_stack = "no js stack info" in details
    if not no_stack and not all(field in context for field in ("function", "file", "pos", "package")):
        return {}
    for field in CONTEXT_COLUMNS:
        context.setdefault(field, "")
    if no_stack:
        context["receiverExpr"] = context.get("receiverExpr", "").removesuffix(" no js stack info")
    return context


def is_useless_prop(key: str) -> bool:
    if key in USELESS_PROPS or key in GENERATED_DOLLAR_PROPS:
        return True
    if key.startswith("[com."):
        return True
    if NUMERIC_PROP_RE.fullmatch(key):
        return True
    if COMMON_MODULE_CACHE_PROP_RE.fullmatch(key):
        return True
    if OHOS_ABILITY_ENTRY_PROP_RE.fullmatch(key):
        return True
    return False


def normalize_context_file(file_name: str) -> str:
    return file_name.replace("\\", "/").lower()


def test_frame_kind(context: dict) -> str:
    """Identify test source paths; this alone does not attribute the access.

    Generic entry/src/main and entry|entry names require an ACTS testmodule.
    src/main alone is never a test marker. Prefer translated file over rawFile,
    since a bundled system module may have a test application's raw filename.
    """
    file_name = normalize_context_file(context.get("file", ""))
    if file_name in ("", "?", "<unknown>"):
        file_name = normalize_context_file(context.get("rawFile", ""))
    path = "/" + file_name.lstrip("/")
    package_name = context.get("package", "").lower()
    # A generated dependency bundle may include real API/framework code as
    # well as Hypium. Its output directory does not establish source ownership.
    if re.search(r"/(?:vendors?|common)(?:_[^/]*)?\.js$", path):
        return ""
    if (
        "hypium" in file_name
        or "hypium" in package_name
        or re.search(r"(?:/|\|)(?:src/)?ohostest/(?:ets|js)/testrunner/", path)
    ):
        return "hypium_or_test_runner"
    if re.search(r"(?:/|\|)(?:src/)?ohostest/", path):
        return "test_module_self_access"
    if "/test/xts/acts/" in path or "/suites/acts/" in path:
        return "test_module_self_access"
    if any(marker in path for marker in MODULE_SOURCE_MARKERS):
        return ""
    is_acts = context.get("testmodule", context.get("module", "")).lower().startswith("acts")
    if is_acts and any(pattern.fullmatch(path) for pattern in COMPILED_TEST_PAGE_RES):
        return "test_page_self_access"
    if is_acts and ("/entry/src/main/" in path or
                    (file_name.startswith("entry|") and "|src/main/" in file_name)):
        return "test_page_self_access"
    return ""


def context_disposition(context: dict) -> str:
    """Positive native evidence wins; absence of a tag never proves JS origin."""
    versioned = context.get("originVersion") in {"1", "2"}
    origin = context.get("origin", "")
    if versioned and origin in NATIVE_ORIGINS:
        return "keep_native"
    test_kind = test_frame_kind(context)
    if test_kind:
        if versioned and origin == "js-bytecode":
            return "filter_" + test_kind
        return "review_test_origin_unknown"
    if not versioned or origin not in ({"js-bytecode"} | NATIVE_ORIGINS):
        return "review_origin_unknown"
    file_name = normalize_context_file(context.get("file", ""))
    path = "/" + file_name.lstrip("/")
    if any(marker in path for marker in MODULE_SOURCE_MARKERS) or file_name.startswith(("@ohos.", "ohos.")):
        return "keep_module_js"
    return "review_source_unknown"


def classify_context(context: dict) -> str:
    """Compatibility API: nonempty means an evidenced test-own access."""
    disposition = context_disposition(context)
    return disposition[len("filter_"):] if disposition.startswith("filter_") else ""


def new_summary():
    return {
        "raw_context_lines": 0, "unparsed_context_lines": 0, "useless_key_hits": 0,
        "undefined_hits": 0, "kept_hits": 0, "filtered_hits": 0, "review_hits": 0,
        "filter_reasons": {}, "origin_counts": {}, "classification_counts": {},
    }


def context_row(reason, record, context):
    return (reason, record["subdir"], record["receiver"], record["key"],
            *(context.get(field, "") for field in CONTEXT_COLUMNS))


def count_device_hilog_files(root_dir: str) -> int:
    count = 0
    for dirpath, _, filenames in os.walk(root_dir):
        for name in filenames:
            if name.startswith("device_hilog"):
                count += 1
    return count

def build_rg_command(root_dir: str):
    """
    用 rg 预过滤，只保留 receiver/key/target/context 这些状态机需要的行。

    参数说明：
      -F: 固定字符串匹配，比正则快
      -a/--text: 把二进制文件也按文本处理
      --no-heading: 不输出文件标题分组
      -n: 输出行号
      --with-filename: 输出文件名
      --color never: 禁止颜色控制字符
      --field-match-separator RG_SEP: 用 NUL 分隔 path / line_no / content，避免路径中冒号干扰
      --sort path: 保证同一文件内按路径顺序输出，便于状态机解析
      -g "**/device_hilog*": 只处理 device_hilog* 文件
    """
    cmd = [
        "rg",
        "-F",
        "-a",
        "--no-heading",
        "-n",
        "--with-filename",
        "--color",
        "never",
        "--field-match-separator",
        RG_SEP,
        "-g",
        "**/device_hilog*",
    ]
    cmd.extend(["-e", PROP_CONTEXT_PREFIX.decode()])
    cmd.append(root_dir)
    return cmd


def parse_rg_stream(root_dir: str, total_files: int = 0, show_progress: bool = True,
                    review_records=None):
    """
    从 rg 输出流中解析记录。

    rg 输出格式：
      file_path \\0 line_no \\0 line_content

    只处理 line_content 中 ArkCompiler 后面的 payload。
    """
    cmd = build_rg_command(root_dir)

    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    records_with_subdir = set()
    keys_only = set()
    key_to_subdirs = {}
    rejected_records = set()
    summary = new_summary()

    processed_files = 0
    seen_files = set()

    assert proc.stdout is not None

    def keep_record(record: dict):
        records_with_subdir.add(
            (record["subdir"], record["receiver"], record["key"])
        )
        keys_only.add(record["key"])
        key_to_subdirs.setdefault(record["key"], set()).add(record["subdir"])
        summary["kept_hits"] += 1

    def reject_record(record: dict, reason: str, context: dict):
        summary["filtered_hits"] += 1
        summary["filter_reasons"][reason] = (
            summary["filter_reasons"].get(reason, 0) + 1
        )
        rejected_records.add(context_row(reason, record, context))

    for raw_line in proc.stdout:
        raw_line = raw_line.rstrip(b"\r\n")

        try:
            file_path_b, _line_no_b, content = raw_line.split(RG_SEP_B, 2)
        except ValueError:
            # 理论上不会发生，除非 rg 版本不支持 field-match-separator
            continue

        file_path = file_path_b.decode("utf-8", errors="ignore")

        current_subdir = get_subdir_name_fast(root_dir, file_path)
        if file_path not in seen_files:
            seen_files.add(file_path)
            processed_files += 1

            if show_progress:
                if total_files > 0:
                    print(
                        f"\r[{processed_files}/{total_files} hilog] current testmodule: {current_subdir}",
                        end="",
                        flush=True,
                    )
                else:
                    print(
                        f"\r[{processed_files} hilog] current testmodule: {current_subdir}",
                        end="",
                        flush=True,
                    )

        ark_pos = content.find(ARK)
        if ark_pos < 0:
            continue

        payload = content[ark_pos + len(ARK):].strip()

        prop_context_pos = payload.find(PROP_CONTEXT_PREFIX)
        if prop_context_pos < 0:
            continue

        summary["raw_context_lines"] += 1
        context = parse_prop_context(payload[prop_context_pos:])
        if not context:
            summary["unparsed_context_lines"] += 1
            continue

        key = context.get("key", "")
        if not key or is_useless_prop(key):
            summary["useless_key_hits"] += 1
            continue

        summary["undefined_hits"] += 1
        record = {
            "subdir": current_subdir,
            "receiver": "<unknown>",
            "key": key,
        }

        context["testmodule"] = current_subdir
        disposition = context_disposition(context)
        origin = context.get("origin", "") or "legacy_or_unknown"
        for field, name in (("origin_counts", origin), ("classification_counts", disposition)):
            summary[field][name] = summary[field].get(name, 0) + 1
        if disposition.startswith("filter_"):
            reject_record(record, disposition[len("filter_"):], context)
        else:
            keep_record(record)
            if disposition.startswith("review_"):
                summary["review_hits"] += 1
                if review_records is not None:
                    review_records.add(context_row(disposition, record, context))

    if show_progress:
        print()

    if proc.stdout is not None:
        proc.stdout.close()
    stderr = proc.stderr.read() if proc.stderr is not None else b""
    if proc.stderr is not None:
        proc.stderr.close()
    return_code = proc.wait()

    # rg 找不到匹配时返回 1，不算错误
    if return_code not in (0, 1):
        raise RuntimeError(
            "rg failed with exit code {}\n{}".format(
                return_code,
                stderr.decode("utf-8", errors="ignore"),
            )
        )

    return records_with_subdir, keys_only, key_to_subdirs, rejected_records, summary


def main():
    parser = argparse.ArgumentParser(
        description="Extract undefined-property contexts; only exclude evidenced test-own JS accesses."
    )
    parser.add_argument(
        "root_dirs",
        nargs="+",
        help="Root directories containing device_hilog* files, including subdirectories.",
    )
    parser.add_argument(
        "-o",
        "--output",
        default="prototype_access_records.csv",
        help="Output CSV file path. Default: prototype_access_records.csv",
    )

    args = parser.parse_args()

    if shutil.which("rg") is None:
        raise RuntimeError(
            "ripgrep is not installed. Install it first, e.g. `sudo apt install ripgrep`."
        )

    root_dirs = [os.path.abspath(root_dir) for root_dir in args.root_dirs]
    (
        output_path,
        keys_path,
        key_subdirs_json_path,
        rejected_path,
        summary_path,
    ) = output_paths(args.output)
    review_path = output_path.with_name(output_path.stem + "_context_review.csv")

    for root_dir in root_dirs:
        if not os.path.exists(root_dir):
            raise FileNotFoundError(f"Root directory does not exist: {root_dir}")

        if not os.path.isdir(root_dir):
            raise NotADirectoryError(f"Not a directory: {root_dir}")

    # records_with_subdir, keys_only, key_to_subdirs = parse_rg_stream(root_dir)
    # total_files = count_device_hilog_files(root_dir)
    total_files = sum(
        count_device_hilog_files(root_dir)
        for root_dir in root_dirs
    )
    print(f"Found device_hilog* files: {total_files}")

    records_with_subdir = set()
    keys_only = set()
    key_to_subdirs = {}
    rejected_records = set()
    review_records = set()
    summary = new_summary()

    for root_dir in root_dirs:
        print(f"\nScanning root dir: {root_dir}", flush=True)
        sub_records, sub_keys, sub_map, sub_rejected, sub_summary = parse_rg_stream(
            root_dir,
            total_files=total_files,
            show_progress=True,
            review_records=review_records,
        )

        records_with_subdir.update(sub_records)
        keys_only.update(sub_keys)
        rejected_records.update(sub_rejected)

        for name, value in sub_summary.items():
            if isinstance(value, dict):
                for reason, count in value.items():
                    summary[name][reason] = (
                        summary[name].get(reason, 0) + count
                    )
            else:
                summary[name] += value

        for key, subdirs in sub_map.items():
            key_to_subdirs.setdefault(key, set()).update(subdirs)

    sorted_with_subdir = sorted(
        records_with_subdir,
        key=lambda x: (x[0], x[1], x[2]),
    )

    sorted_keys_only = sorted(keys_only)

    with output_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["subdir", "receiver", "key"])
        writer.writerows(sorted_with_subdir)

    with keys_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["key"])
        for key in sorted_keys_only:
            writer.writerow([key])

    key_to_subdirs_sorted = {
        key: sorted(key_to_subdirs.get(key, set()))
        for key in sorted_keys_only
    }

    with key_subdirs_json_path.open("w", encoding="utf-8") as f:
        json.dump(key_to_subdirs_sorted, f, ensure_ascii=False, indent=2)

    sorted_rejected = sorted(
        rejected_records,
        key=lambda x: (x[0], x[1], x[2], x[3], x[5], x[6]),
    )

    with rejected_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(
            ["reason", "subdir", "receiver", "key"] + CONTEXT_COLUMNS
        )
        writer.writerows(sorted_rejected)

    with review_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["reason", "subdir", "receiver", "key"] + CONTEXT_COLUMNS)
        writer.writerows(sorted(review_records))

    with summary_path.open("w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print("Done.")
    # print(f"Root dir: {root_dir}")
    print("Root dirs:")
    for root_dir in root_dirs:
        print(f"  - {root_dir}")
    print(f"Output 1: {output_path}")
    print(f"Unique records with subdir: {len(sorted_with_subdir)}")
    print(f"Output 2: {keys_path}")
    print(f"Unique keys only: {len(sorted_keys_only)}")
    print(f"Output 3: {key_subdirs_json_path}")
    print(f"Key-to-testmodule JSON entries: {len(key_to_subdirs_sorted)}")
    print(f"Output 4: {rejected_path}")
    print(f"Filtered undefined hits: {summary['filtered_hits']}")
    print(f"Output 5: {summary_path}")
    print(f"Output 6 (also retained in main output): {review_path}")
    print(f"Origin/source unresolved hits retained: {summary['review_hits']}")


if __name__ == "__main__":
    main()
