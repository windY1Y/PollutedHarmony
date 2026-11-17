#!/usr/bin/env python3
"""Strict, resumable undef runner for the brother-compiled full suite on rich65."""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import shlex
import signal
import subprocess
import sys
import time
import xml.etree.ElementTree as ET
from collections import Counter
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

try:
    import fcntl
except ImportError:  # permits local py_compile on Windows
    fcntl = None

ROOT = Path("/opt/openharmony")
LAB = ROOT / "research_workspace"
EXACT = LAB / "migration_v2" / "exact_migration"
ART = EXACT / "adapter" / "clean_l1_reconstructed_20260901"
COMPILED_SUITE = EXACT / "experiment_bundle_v2" / "suite"
ENVFIX = ART / "suite_rich08_envfix_20260926"
PARALLEL = ART / "parallel_undef_20260929"
SUITE = COMPILED_SUITE
WORKDIR = PARALLEL / "workviews" / "rich-65"
CONFIG = WORKDIR / "config" / "user_config.xml"
TESTCASES = COMPILED_SUITE / "testcases"
RESOURCE = ENVFIX / "resource"
LIST = ART / "full_compiled_suite_1831.list"
IMAGE_MANIFEST = ROOT / ".oh_env" / "instances" / "rich-65" / "images" / "SHA256SUMS"
BASELINE_USERDATA_SHA = "4e8c51c6963424a9356221e9f5e0ead08cb16e32d668e917b3514cb846666487"
QEMU = ROOT / ".oh_env" / "qemu_run_arm64_instance.sh"
HDC = ROOT / "prebuilts" / "ohos-sdk" / "linux" / "20" / "toolchains" / "hdc"
PY = ROOT / "prebuilts" / "python" / "linux-x86" / "3.11.4" / "bin" / "python3.11"
LANE = LAB / "lanes" / "rich-65"
UNLOCK = EXACT / "adapter" / "screen_unlock_v1" / "ppsink_screen_unlock"
TARGET, PORT = "127.0.0.1:5665", "8865"
REMOTE_UNLOCK = "/data/local/tmp/pptrace_clean_parallel_rich65_screen_unlock"
SLOT = "65"
QEMU_START_TIMEOUT = 420
PROTECTED_SLOTS = (1, 2, 3, 4, 5, 6, 7)
LD = "/system/lib64/platformsdk:/system/lib64/chipset-sdk-sp:/system/lib64/chipset-sdk"
LIST_SHA = "da9bfaf2fd3eb7c1dbb4cbd84b8a809a9e9af9f23bc29da427bc2fa776ababf5"
RUN_PHASES = ("off", "undef")
RESTORABLE_PHASES = {"off", "undef", "type", "taint", "all", "debug"}
ACCEPT = {
    "completed", "completed-unavailable",
    "completed-reboot", "completed-reboot-unavailable",
}
FIELDS = (
    "index module attempt started_at ended_at elapsed_seconds xdevice_rc "
    "executed_marker tests failures errors disabled ignored unavailable "
    "device_after boot_before boot_after phase_after status watchdog_reason "
    "pp_sink_lines summary_sha256 lock_state report"
).split()


class Err(RuntimeError):
    pass


class Stopped(RuntimeError):
    pass


def iso():
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def stamp():
    return datetime.now().strftime("%Y%m%d_%H%M%S_%f")


def sha(path):
    h = hashlib.sha256()
    with Path(path).open("rb") as f:
        for b in iter(lambda: f.read(1048576), b""):
            h.update(b)
    return h.hexdigest()


def sane(value):
    return str(value).replace("\t", " ").replace("\r", " ").replace("\n", " ")


def metrics(summary):
    if not summary.is_file():
        return None, "summary_report.xml is absent"
    try:
        root = ET.parse(summary).getroot()
    except (OSError, ET.ParseError) as e:
        return None, f"invalid summary_report.xml: {e}"
    def n(k):
        try:
            return int(root.attrib.get(k, "0") or "0")
        except ValueError:
            return 0
    return {k: n(k) for k in "tests failures errors disabled ignored unavailable".split()}, ""


def sink_count(report):
    n = 0
    if report.is_dir():
        for p in report.rglob("*"):
            if p.is_file():
                try:
                    with p.open(encoding="utf-8", errors="replace") as f:
                        n += sum("[pptrace][pp-sink]" in line for line in f)
                except OSError:
                    pass
    return n


def json_atomic(path, value):
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps(value, ensure_ascii=True, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    tmp.replace(path)


class Runner:
    def __init__(self, start, end, run_id, run_root, continue_on_exhausted=False,
                 requested_phase="undef"):
        self.start, self.end, self.run_id = start, end, run_id
        self.continue_on_exhausted = continue_on_exhausted
        if requested_phase not in RUN_PHASES:
            raise Err(f"unsupported requested phase: {requested_phase}")
        self.requested_phase = requested_phase
        self.root = run_root or ART / "runs" / f"resume_v2_{run_id}"
        self.mods, self.journal = self.root / "modules", self.root / "journal.tsv"
        self.meta, self.events = self.root / "run.meta", self.root / "events.jsonl"
        self.phase_before, self.recoveries, self.stop_code, self.child = "unknown", 0, None, None
        self.cleanup_status, self.phase_after_restore = "not-run", "unavailable"
        self.locks = []
        self.env = os.environ.copy()
        self.env.update({
            "HOME": str(LANE / "hdc" / "home"),
            "TMPDIR": str(LANE / "hdc" / "tmp"),
            "XDG_CACHE_HOME": str(LANE / "hdc" / "cache"),
            "OHOS_HDC_SERVER_PORT": PORT,
            "PATH": str(ROOT / ".oh_env" / "bin") + ":" + self.env.get("PATH", ""),
            "PYTHONPATH": str(ROOT / ".oh_env" / "python-user" / "lib" / "python3.11" / "site-packages")
            + (":" + self.env["PYTHONPATH"] if self.env.get("PYTHONPATH") else ""),
        })

    def event(self, kind, **kw):
        self.root.mkdir(parents=True, exist_ok=True)
        with self.events.open("a", encoding="utf-8") as f:
            f.write(json.dumps({"at": iso(), "kind": kind, **kw}, ensure_ascii=True, sort_keys=True) + "\n")

    def putmeta(self, **kw):
        self.root.mkdir(parents=True, exist_ok=True)
        with self.meta.open("a", encoding="utf-8") as f:
            for k, v in kw.items():
                f.write(f"{sane(k)}={sane(v)}\n")

    def first_meta(self, key):
        """Return the first persisted value for an immutable run attribute."""
        if not self.meta.is_file():
            return None
        prefix = f"{key}="
        with self.meta.open(encoding="utf-8", errors="replace") as f:
            for line in f:
                if line.startswith(prefix):
                    return line[len(prefix):].rstrip("\r\n")
        return None

    def cmd(self, argv, timeout=60, cwd=None):
        try:
            return subprocess.run(argv, cwd=str(cwd) if cwd else None, env=self.env,
                stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
                encoding="utf-8", errors="replace", timeout=timeout, check=False)
        except subprocess.TimeoutExpired as e:
            out = e.stdout or ""
            if isinstance(out, bytes):
                out = out.decode("utf-8", "replace")
            return subprocess.CompletedProcess(argv, 124, out + f"\n[timeout after {timeout}s]\n")

    @staticmethod
    def save(path, cp):
        path.parent.mkdir(parents=True, exist_ok=True)
        a = cp.args
        line = shlex.join([str(x) for x in a]) if isinstance(a, (list, tuple)) else str(a)
        path.write_text(f"$ {line}\nreturncode={cp.returncode}\n--- output ---\n{cp.stdout or ''}", encoding="utf-8")

    def hdc(self, *args, timeout=60):
        return self.cmd([str(HDC), *args], timeout)

    def shell(self, command, timeout=60):
        return self.hdc("-t", TARGET, "shell", command, timeout=timeout)

    def ready(self):
        self.hdc("start", timeout=20)
        self.hdc("tconn", TARGET, timeout=25)
        t = self.hdc("list", "targets", "-v", timeout=25)
        if t.returncode or not any(TARGET in x and "Connected" in x for x in (t.stdout or "").splitlines()):
            return False
        a, b = self.shell("param get bootevent.appfwk.ready", 25), self.shell("uname -m", 25)
        return not a.returncode and not b.returncode and (a.stdout or "").strip() == "true" and (b.stdout or "").strip() == "aarch64"

    def phase(self):
        r = self.shell("param get persist.pptrace.pp.phase", 30)
        return (r.stdout or "").strip() if not r.returncode else ""

    def boot(self):
        r = self.shell("cat /proc/sys/kernel/random/boot_id", 30)
        return (r.stdout or "").strip() if not r.returncode else ""

    def setphase(self, value, out):
        out.mkdir(parents=True, exist_ok=True)
        a = self.shell(f"param set persist.pptrace.pp.phase {value}", 45)
        b = self.shell("param get persist.pptrace.pp.phase", 30)
        self.save(out / f"phase_set_{value}.log", a); self.save(out / "phase_observed.log", b)
        got = (b.stdout or "").strip()
        if a.returncode or got != value:
            raise Err(f"cannot set phase={value}; observed={got or 'unavailable'}")

    def unlock(self, out):
        out.mkdir(parents=True, exist_ok=True)
        self.save(out / "wakeup.log", self.shell("power-shell wakeup >/dev/null 2>&1 || true; power-shell timeout -o 864000000", 45))
        a = self.hdc("-t", TARGET, "file", "send", str(UNLOCK), REMOTE_UNLOCK, timeout=90)
        self.save(out / "unlock_push.log", a)
        if a.returncode:
            raise Err("screen unlock helper upload failed")
        b = self.shell(f"chmod 755 {REMOTE_UNLOCK}; LD_LIBRARY_PATH={LD} {REMOTE_UNLOCK}", 90)
        self.save(out / "unlock_run.log", b)
        c = self.shell("hidumper -s 3704 -a -all", 60)
        self.save(out / "lock_state_after_unlock.txt", c)
        lock_is_false = re.search(
            r"\bscreenLocked\s+false\s+(?:0|100)\b", c.stdout or ""
        )
        helper_reports_unlocked = re.search(r"\bafter=0\b", b.stdout or "")
        if b.returncode or c.returncode or not lock_is_false or not helper_reports_unlocked:
            raise Err("rich-65 screen remains locked or uninspectable")
        return "screenLocked=false"

    def protected(self):
        ans = {}
        for n in PROTECTED_SLOTS:
            p = ROOT / ".oh_env" / "instances" / f"rich-{n:02d}" / "qemu.pid"
            try:
                pid = int(p.read_text().strip())
            except FileNotFoundError:
                # rich-65 is isolated by a slot-specific launcher; another lane
                # may legitimately be stopped when this continuation starts.
                continue
            except (OSError, ValueError) as e:
                raise Err(f"cannot read protected rich-{n:02d} QEMU pid: {e}")
            try:
                command = Path(f"/proc/{pid}/cmdline").read_bytes()
            except FileNotFoundError:
                # Ignore a concurrently stopped lane, but never accept a live
                # PID whose command line belongs to another process.
                continue
            except OSError as e:
                raise Err(f"cannot inspect protected rich-{n:02d} QEMU pid: {e}")
            if f"oh-rich-{n:02d}".encode() not in command:
                raise Err(f"protected rich-{n:02d} pid {pid} is not expected QEMU")
            ans[f"rich-{n:02d}"] = pid
        return ans

    @contextmanager
    def flock(self, path, wait):
        if fcntl is None:
            raise Err("fcntl unavailable; execute this runner on Linux")
        path.parent.mkdir(parents=True, exist_ok=True)
        f, deadline = path.open("a+"), time.monotonic() + wait
        while True:
            try:
                fcntl.flock(f.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB); break
            except BlockingIOError:
                if time.monotonic() >= deadline:
                    f.close(); raise Err(f"timed out waiting for lock: {path}")
                time.sleep(2)
        try:
            yield
        finally:
            fcntl.flock(f.fileno(), fcntl.LOCK_UN); f.close()

    def take_locks(self):
        if fcntl is None:
            raise Err("fcntl unavailable; execute this runner on Linux")
        for p in (LANE / "locks" / "run.lock", PARALLEL / "locks" / f"rich-{int(SLOT):02d}.lock"):
            p.parent.mkdir(parents=True, exist_ok=True); f = p.open("a+")
            try:
                fcntl.flock(f.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                f.close(); raise Err(f"lane busy (lock held): {p}")
            self.locks.append(f)

    def drop_locks(self):
        if fcntl:
            for f in reversed(self.locks):
                try: fcntl.flock(f.fileno(), fcntl.LOCK_UN)
                except OSError: pass
                f.close()
        self.locks.clear()

    def restart(self, why):
        self.recoveries += 1
        out = self.root / "recoveries" / f"{self.recoveries:04d}_{stamp()}"
        out.mkdir(parents=True); (out / "reason.txt").write_text(why + "\n")
        self.event("rich06-restart-requested", reason=why, recovery=str(out))
        with self.flock(EXACT / "runtime_v6" / "cold_restart.lock", 600):
            before = self.protected(); json_atomic(out / "protected_pids_before.json", before)
            a = self.cmd([str(QEMU), "--profile", "rich", "--slot", SLOT, "--status"], 60)
            b = self.cmd([str(QEMU), "--profile", "rich", "--slot", SLOT, "--stop"], 180)
            self.save(out / "status_before.log", a); self.save(out / "stop.log", b)
            if b.returncode: raise Err(f"rich-65 stop failed: rc={b.returncode}")
            c = self.cmd(
                [str(QEMU), "--profile", "rich", "--slot", SLOT, "--persistent"],
                QEMU_START_TIMEOUT,
            )
            self.save(out / "start.log", c)
            if c.returncode: raise Err(f"rich-65 persistent start failed: rc={c.returncode}")
            until = time.monotonic() + 360
            while time.monotonic() < until and not self.ready(): time.sleep(5)
            if not self.ready(): raise Err("rich-65 did not become ready within 360s")
            self.save(out / "status_after.log", self.cmd([str(QEMU), "--profile", "rich", "--slot", SLOT, "--status"], 60))
            after = self.protected(); json_atomic(out / "protected_pids_after.json", after)
            if before != after:
                raise Err(f"protected rich-01..07 PID change during rich-65 recovery: before={before}, after={after}")
        self.event("rich06-restart-complete", reason=why, recovery=str(out))

    def ensure(self, why):
        if not self.ready(): self.restart(why)
        if not self.ready(): raise Err(f"rich-65 not ready after {why}")

    def wait_ready(self, timeout=360):
        deadline = time.monotonic() + timeout
        while True:
            if self.stop_code is not None:
                raise Stopped("signal while waiting for rich-65")
            if self.ready():
                return True
            if time.monotonic() >= deadline:
                return False
            time.sleep(5)

    def terminate_child(self):
        p = self.child
        if p is None or p.poll() is not None: return
        try: os.killpg(p.pid, signal.SIGTERM)
        except ProcessLookupError: return
        until = time.monotonic() + 20
        while p.poll() is None and time.monotonic() < until: time.sleep(.5)
        if p.poll() is None:
            try: os.killpg(p.pid, signal.SIGKILL)
            except ProcessLookupError: pass

    def signal(self, signum, _frame):
        self.stop_code = 128 + signum
        self.event("signal-received", signal=signum, stop_code=self.stop_code)
        self.terminate_child()

    def xdevice(self, module, out):
        report, log = out / "xdevice", out / "xdevice.log"
        arg = f"run acts -c {CONFIG} -l {module} -tcpath {TESTCASES} -respath {RESOURCE} -rp {report} -sn {TARGET}"
        command = [str(PY), "-m", "xdevice", arg]
        (out / "command.txt").write_text(shlex.join(command) + "\n")
        with log.open("wb") as f:
            p = subprocess.Popen(command, cwd=str(WORKDIR), env=self.env, stdout=f,
                                 stderr=subprocess.STDOUT, start_new_session=True)
            self.child, why, offline, deadline = p, "", None, time.monotonic() + 4800
            try:
                while p.poll() is None:
                    if self.stop_code is not None:
                        why = "interrupted"; self.terminate_child(); break
                    if time.monotonic() >= deadline:
                        why = "timeout"; self.terminate_child(); break
                    if self.ready(): offline = None
                    elif offline is None: offline = time.monotonic()
                    elif time.monotonic() - offline >= 300:
                        why = "device-lost"; self.terminate_child(); break
                    time.sleep(10)
                try: rc = p.wait(30)
                except subprocess.TimeoutExpired:
                    why = why or "process-stuck"; self.terminate_child(); rc = p.wait(30)
            finally:
                self.child = None
        return rc, why, report

    def row(self, index, module, attempt, started, elapsed, report, **kw):
        m = kw.pop("metrics", {}) or {}
        d = {k: "" for k in FIELDS}
        d.update({
            "index": index, "module": module, "attempt": attempt, "started_at": started,
            "ended_at": iso(), "elapsed_seconds": f"{elapsed:.1f}", "report": str(report),
            "xdevice_rc": "not-run", "executed_marker": 0, "device_after": "unknown",
            "boot_before": "unavailable", "boot_after": "unavailable",
            "phase_after": "unavailable", "status": "infra-preflight",
            "watchdog_reason": "", "pp_sink_lines": 0, "summary_sha256": "",
            "lock_state": "unavailable",
        })
        d.update({k: m.get(k, 0) for k in "tests failures errors disabled ignored unavailable".split()})
        d.update(kw)
        return {k: sane(v) for k, v in d.items()}

    def write_row(self, row):
        new = not self.journal.exists() or self.journal.stat().st_size == 0
        with self.journal.open("a", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=FIELDS, delimiter="\t", lineterminator="\n")
            if new: w.writeheader()
            w.writerow(row)
        self.event("journal-recorded", index=row["index"], module=row["module"], status=row["status"], report=row["report"])

    def latest(self):
        ans = {}
        if self.journal.is_file():
            with self.journal.open(encoding="utf-8", newline="") as f:
                for r in csv.DictReader(f, delimiter="\t"):
                    try: ans[int(r.get("index", ""))] = r
                    except ValueError: pass
        return ans

    def accepted(self, index, module):
        r = self.latest().get(index)
        if not r or r.get("module") != module or r.get("status") not in ACCEPT: return False
        p = Path(r.get("report", "")); expected = r.get("summary_sha256", "")
        try: p.resolve().relative_to(self.root.resolve())
        except (OSError, ValueError): return False
        s = p / "summary_report.xml"
        return bool(expected) and s.is_file() and sha(s) == expected

    def exhausted(self, index, module):
        """Recognize a terminal non-accepted row when resuming continuous mode."""
        r = self.latest().get(index)
        status = ((r or {}).get("status") or "").strip()
        return bool(r and r.get("module") == module and status and status not in ACCEPT
                    and status != "infra-replay-required")

    def sink_evidence(self):
        """Collect marker evidence from every attempt, including interrupted ones."""
        evidence = []
        if self.mods.is_dir():
            for report in sorted(self.mods.glob("*/attempt_*/xdevice")):
                count = sink_count(report)
                if count:
                    evidence.append({"report": str(report), "pp_sink_lines": count})
        return evidence

    @staticmethod
    def retryable(status):
        return status.startswith("infra-") or status in {"device-lost", "device-reboot"}

    def module(self, index, module):
        final = None
        for attempt in (1, 2):
            started, tick = iso(), time.monotonic()
            out = self.mods / f"{index:04d}_{module}" / f"attempt_{attempt}_{stamp()}"
            out.mkdir(parents=True); report = out / "xdevice"
            try:
                self.ensure(f"before-{index}-{module}-attempt-{attempt}")
                self.setphase(self.requested_phase, out)
                locked, before = self.unlock(out), self.boot()
                if not before: raise Err("cannot read rich-65 boot id before xDevice")
                rc, watched, report = self.xdevice(module, out)
                if watched == "interrupted": raise Stopped("signal interrupted active xDevice")
                device = "connected" if self.wait_ready() else "offline"
                after = self.boot() if device == "connected" else "unavailable"
                phase = self.phase() if device == "connected" else "unavailable"
                met, problem = metrics(report / "summary_report.xml")
                summary_sha = sha(report / "summary_report.xml") if met is not None else ""
                log = (out / "xdevice.log").read_text(encoding="utf-8", errors="replace")
                executed = len(re.findall(rf"Executed: .*/{re.escape(module)}(?:\.json)?(?=,|\s|$)", log))
                sinks = sink_count(report)
                if sinks: status = "pp-sink-detected"
                elif watched: status = f"infra-watchdog-{watched}"
                elif device != "connected": status = "device-lost"
                elif phase != self.requested_phase: status = "infra-phase-changed"
                elif met is None:
                    status = "infra-invalid-report"; (out / "summary_parse_error.txt").write_text(problem + "\n")
                elif not executed: status = "infra-not-executed"
                elif rc: status = "xdevice-error"
                elif not after: status = "infra-boot-id-unavailable"
                elif after != before and met["unavailable"]: status = "completed-reboot-unavailable"
                elif after != before: status = "completed-reboot"
                elif met["unavailable"]: status = "completed-unavailable"
                else: status = "completed"
                final = self.row(index, module, attempt, started, time.monotonic()-tick, report,
                    xdevice_rc=rc, executed_marker=executed, metrics=met, device_after=device,
                    boot_before=before, boot_after=after, phase_after=phase, status=status,
                    watchdog_reason=watched, pp_sink_lines=sinks, summary_sha256=summary_sha,
                    lock_state=locked)
            except Stopped:
                raise
            except (Err, OSError) as e:
                (out / "runner_error.txt").write_text(str(e) + "\n")
                self.event("module-preflight-error", index=index, module=module, attempt=attempt, error=str(e))
                final = self.row(index, module, attempt, started, time.monotonic()-tick, report)

            status = final["status"]
            if status in ACCEPT:
                self.write_row(final)
                print(f"[{index}/{self.end}] {module} status={status} tests={final['tests']} "
                      f"failures={final['failures']} unavailable={final['unavailable']} "
                      f"ppsink={final['pp_sink_lines']}", flush=True)
                return
            if attempt == 1 and self.retryable(status):
                self.event("module-retry", index=index, module=module, first_status=status, attempt_dir=str(out))
                if (not self.ready() or status in {"device-lost", "device-reboot", "infra-phase-changed"}
                        or status.startswith("infra-watchdog-")):
                    self.restart(f"retry-{index}-{module}-after-{status}")
                continue
            self.write_row(final)
            if self.continue_on_exhausted:
                self.event("module-exhausted", index=index, module=module, status=status, attempt_dir=str(out))
                print(f"[{index}/{self.end}] {module} exhausted with status={status}; continuing", file=sys.stderr, flush=True)
                return False
            raise Err(f"non-accepted result at {index} {module}: {status}; see {out}")

    def inputs(self):
        missing = [str(p) for p in (QEMU, HDC, PY, UNLOCK, LIST, CONFIG, WORKDIR, IMAGE_MANIFEST) if not p.exists()]
        if missing: raise Err("missing required paths: " + ", ".join(missing))
        if not CONFIG.is_file() or not TESTCASES.is_dir() or not RESOURCE.is_dir():
            raise Err(f"incomplete compiled suite/environment resource: suite={SUITE} config={CONFIG} testcases={TESTCASES} resource={RESOURCE}")
        modules = [x.strip() for x in LIST.read_text().splitlines() if x.strip()]
        if len(modules) != 1831: raise Err(f"unexpected full-suite list length: {len(modules)}")
        if sha(LIST) != LIST_SHA: raise Err("module list SHA256 differs from full compiled-suite inventory")
        for n in ASSIGNED_INDICES:
            if not re.fullmatch(r"[A-Za-z0-9_]+", modules[n-1]):
                raise Err(f"unsafe module at line {n}: {modules[n-1]!r}")
        return modules

    def summary(self, run_completed=False, final_return_code=None, pp_sink_evidence=None):
        latest = self.latest(); rows = [latest[k] for k in sorted(latest)]
        names = "tests failures errors disabled ignored unavailable pp_sink_lines".split()
        totals = {n: sum(int(r.get(n, "0") or 0) for r in rows) for n in names}
        exhausted_count = sum(r.get("status") not in ACCEPT for r in rows)
        if pp_sink_evidence is None:
            pp_sink_evidence = self.sink_evidence()
        observed_pp_sink_lines = sum(x["pp_sink_lines"] for x in pp_sink_evidence)
        if observed_pp_sink_lines:
            has_gate_status = "fail"
        elif not run_completed:
            has_gate_status = "incomplete"
        elif exhausted_count or totals["unavailable"]:
            has_gate_status = "no-sink-with-coverage-gaps"
        else:
            has_gate_status = "pass"
        result = {
            "schema": "pptrace-clean-parallel-rich-module-resume-v1-summary", "generated_at": iso(),
            "run_id": self.run_id, "journal": str(self.journal), "module_count": len(rows),
            "requested_phase": self.requested_phase,
            "accepted_count": sum(r.get("status") in ACCEPT for r in rows),
            "exhausted_count": exhausted_count,
            "status_counts": dict(Counter((r.get("status") or "") for r in rows)),
            "totals": totals,
            "first_index": min(latest) if latest else None, "last_index": max(latest) if latest else None,
            "run_completed": bool(run_completed), "cleanup_status": self.cleanup_status,
            "phase_after_restore": self.phase_after_restore,
            "final_return_code": final_return_code,
            "has_gate_status": has_gate_status,
            "observed_pp_sink_lines": observed_pp_sink_lines,
            "pp_sink_evidence": pp_sink_evidence,
        }
        json_atomic(self.root / "final_status.json", result)

    def cleanup(self):
        if self.phase_before not in RESTORABLE_PHASES:
            self.cleanup_status, self.phase_after_restore = "not-run", "unavailable"
            self.putmeta(cleanup_status="not-run", phase_after_restore="unavailable")
            return False
        out = self.root / "cleanup" / stamp()
        try:
            self.ensure("cleanup-phase-restore"); self.setphase(self.phase_before, out)
            got = self.phase(); self.save(out / "unlock_remove.log", self.shell(f"rm -f {REMOTE_UNLOCK}", 30))
            ok = got == self.phase_before
            self.phase_after_restore = got or "unavailable"
            self.cleanup_status = "restored" if ok else "restore-failed"
            self.putmeta(ended_at=iso(), phase_after_restore=got or "unavailable",
                         cleanup_status=self.cleanup_status, recovery_count=self.recoveries)
            return ok
        except (Err, OSError) as e:
            self.cleanup_status, self.phase_after_restore = "restore-failed", "unavailable"
            try:
                out.mkdir(parents=True, exist_ok=True)
                (out / "restore_error.txt").write_text(str(e) + "\n")
                self.putmeta(ended_at=iso(), phase_after_restore="unavailable",
                             cleanup_status="restore-failed", recovery_count=self.recoveries)
            except OSError:
                pass
            return False

    def run(self):
        code = 0; run_completed = False
        self.root.mkdir(parents=True, exist_ok=True); self.mods.mkdir(parents=True, exist_ok=True)
        try:
            modules = self.inputs(); self.take_locks(); self.ensure("initial-preflight")
            observed_phase = self.phase()
            stored_requested_phase = self.first_meta("requested_phase")
            if self.meta.is_file() and self.meta.stat().st_size and not stored_requested_phase:
                raise Err("existing run root lacks requested_phase; refuse to mix legacy/off run")
            if stored_requested_phase and stored_requested_phase != self.requested_phase:
                raise Err(f"run root requested_phase={stored_requested_phase}, not {self.requested_phase}")
            self.phase_before = self.first_meta("phase_before") or observed_phase
            if self.phase_before not in RESTORABLE_PHASES:
                raise Err(f"unexpected initial phase: {self.phase_before or 'unavailable'}")
            self.putmeta(schema="pptrace-clean-parallel-rich-module-resume-v1", run_id=self.run_id,
                started_at=iso(), start_line=self.start, end_line=self.end, target=TARGET,
                server_port=PORT, slot=SLOT, suite=SUITE, config=CONFIG, workdir=WORKDIR, testcases=TESTCASES, resource=RESOURCE, list=LIST, list_sha256=sha(LIST), image_manifest=IMAGE_MANIFEST, image_manifest_sha256=sha(IMAGE_MANIFEST), baseline_userdata_sha256=BASELINE_USERDATA_SHA,
                script=Path(__file__).resolve(), script_sha256=sha(Path(__file__)),
                phase_before=self.phase_before, requested_phase=self.requested_phase,
                protected_pids_at_start=json.dumps(self.protected(), sort_keys=True),
                phase_observed_at_start=observed_phase or "unavailable",
                continue_on_exhausted=str(self.continue_on_exhausted).lower())
            self.event("run-started", start_line=self.start, end_line=self.end)
            exhausted = []
            for n in ASSIGNED_INDICES:
                if self.stop_code is not None: raise Stopped("signal before next module")
                name = modules[n-1]
                if self.accepted(n, name):
                    print(f"[{n}/{self.end}] already accepted: {name}", flush=True); continue
                if self.continue_on_exhausted and self.exhausted(n, name):
                    exhausted.append({"index": n, "module": name})
                    print(f"[{n}/{self.end}] already exhausted: {name}", flush=True); continue
                if self.module(n, name) is False:
                    exhausted.append({"index": n, "module": name})
            run_completed = True
            if exhausted:
                code = 77
                self.event("run-completed-with-exhausted", count=len(exhausted), modules=exhausted)
            else:
                self.event("run-completed")
        except Stopped as e:
            code = self.stop_code or 130; self.event("run-interrupted", code=code, reason=str(e))
            print(f"interrupted: {e}", file=sys.stderr, flush=True)
        except (Err, OSError) as e:
            code = 75; self.event("run-failed", error=str(e))
            print(f"runner failed: {e}", file=sys.stderr, flush=True)
        finally:
            try:
                if not self.cleanup() and code == 0: code = 76
                pp_sink_evidence = self.sink_evidence()
                if pp_sink_evidence and code == 0:
                    code = 78
                    self.event("has-gate-failed",
                               observed_pp_sink_lines=sum(x["pp_sink_lines"] for x in pp_sink_evidence),
                               evidence_count=len(pp_sink_evidence))
                self.putmeta(final_return_code=code)
                self.summary(run_completed=run_completed, final_return_code=code,
                             pp_sink_evidence=pp_sink_evidence)
            finally:
                self.drop_locks()
        return code


def args():
    p = argparse.ArgumentParser(description="Strict resumable clean runner for isolated rich-65 only")
    p.add_argument("start_line", nargs="?", type=int, default=1)
    p.add_argument("end_line", nargs="?", type=int, default=1831)
    p.add_argument("run_id", nargs="?", default=datetime.now().strftime("%Y%m%d_%H%M%S"))
    p.add_argument("--run-root", type=Path)
    p.add_argument("--continue-on-exhausted", action="store_true")
    p.add_argument("--phase", choices=RUN_PHASES, default="undef",
                   help="phase to set before every module (default: undef)")
    a = p.parse_args()
    if not 1 <= a.start_line <= a.end_line <= 1831: p.error("range must satisfy 1 <= start <= end <= 1831")
    if not re.fullmatch(r"[A-Za-z0-9_.-]+", a.run_id): p.error("unsafe run_id")
    if a.run_root and not a.run_root.is_absolute(): p.error("--run-root must be absolute")
    return a


def main():
    a = args(); r = Runner(a.start_line, a.end_line, a.run_id, a.run_root,
                           a.continue_on_exhausted, a.phase)
    signal.signal(signal.SIGINT, r.signal); signal.signal(signal.SIGTERM, r.signal)
    return r.run()


if __name__ == "__main__":
    raise SystemExit(main())


