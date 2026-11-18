#!/usr/bin/env bash
set -euo pipefail

# Continuation-only H29 fixture qualification. Original suite, historical
# evidence, shared runner, and global device configuration are read-only.
# v8 uses one UI operator per runner cell (the ready hook), so repetitions do
# not share a parent-level watcher or overwrite one another's UI evidence.
BASE=/data/oh-testing/v2/05_validation
CONT=$BASE/manual-retests/20261019/phase2/continuation16
SRC=$BASE/manual-retests/20261019/phase2/continuation13/h29-picker-v4
RUNPY=$BASE/round3-codegen-20261013/validation630/scripts/run.py
HDC=/data/oh-testing/prebuilts/ohos-sdk/linux/20/toolchains/hdc
DEVICE=${H29_DEVICE:-${PPV3_DEVICE:-}}
MODE=${H29_MODE:-direct-docs}
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
WORK=/data/oh-testing/v2/05_validation/manual-retests/20261019/phase2/continuation18/h29
DEVICE_PORT=${DEVICE##*:}
case "$DEVICE_PORT" in
  ''|*[!0-9]*)
    echo "H29_DEVICE must end in a numeric device port: $DEVICE" >&2
    exit 24
    ;;
esac
HDC_SERVER_PORT=${H29_HDC_SERVER_PORT:-$((DEVICE_PORT + 3200))}
export OHOS_HDC_SERVER_PORT="$HDC_SERVER_PORT"
LOCK_FILE=$CONT/device-${HDC_SERVER_PORT}-${DEVICE_PORT}.h29.lock
DEVICE_TARGETS=$(mktemp /tmp/h29-cont15-device-targets.XXXXXX)
DEVICE_TARGETS_STDERR=$(mktemp /tmp/h29-cont15-device-targets-err.XXXXXX)
RUN_ID="20261029-h29-cont16-${MODE}-$(date +%Y%m%d-%H%M%S-%N)"
RUN_ROOT=$WORK/runs/$RUN_ID
PROVISION=$RUN_ROOT/provision
CONFIG_DIR=$RUN_ROOT/config
HOOK_DIR=$RUN_ROOT/hooks
MATRIX=$RUN_ROOT/matrix

case "$MODE" in
  direct-docs)
    RUN_GROUPS=B
    REPETITIONS=${H29_B_REPETITIONS:-3}
    ;;
  h29-pt)
    RUN_GROUPS=PT
    REPETITIONS=${H29_PT_REPETITIONS:-3}
    ;;
  full-matrix|matrix)
    RUN_GROUPS=${H29_GROUPS:-B,P,PT,CLEAN,OWN_SHADOW}
    REPETITIONS=${H29_REPETITIONS:-3}
    ;;
  *)
    echo "H29_MODE must be direct-docs, h29-pt, or full-matrix" >&2
    exit 2
    ;;
esac

if [ ! -f "$SRC/config/config.bound.json" ] || [ ! -f "$SRC/config/environment.json" ]; then
  echo "continuation13 H29 source config is missing: $SRC" >&2
  exit 20
fi
if [ ! -x "$HDC" ]; then
  echo "HDC is missing or not executable: $HDC" >&2
  exit 21
fi
if [ -z "$DEVICE" ]; then
  echo "H29_DEVICE (or PPV3_DEVICE) is required; refusing the historical default" >&2
  exit 24
fi
if [ ! -d "$WORK" ]; then
  echo "continuation15 H29 work directory is missing: $WORK" >&2
  exit 24
fi

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "continuation15 device-${DEVICE_PORT} is locked by another run: $LOCK_FILE" >&2
  exit 25
fi
printf '%s\n' "$$ $DEVICE $(date --iso-8601=seconds)" > "$LOCK_FILE"
set +e
"$HDC" list targets > "$DEVICE_TARGETS" 2> "$DEVICE_TARGETS_STDERR"
DEVICE_GATE_RC=$?
set -e
if [ "$DEVICE_GATE_RC" -ne 0 ]; then
  echo "hdc list targets failed; no run root or fixture was created" >&2
  exit 24
fi
TARGET_COUNT=$(sed '/^[[:space:]]*$/d' "$DEVICE_TARGETS" | wc -l)
FIRST_TARGET=$(sed '/^[[:space:]]*$/d' "$DEVICE_TARGETS" | head -n 1)
if [ "$TARGET_COUNT" -ne 1 ] || [ "$FIRST_TARGET" != "$DEVICE" ]; then
  echo "HDC target is not uniquely confirmed: expected=$DEVICE actual=$FIRST_TARGET count=$TARGET_COUNT" >&2
  cat "$DEVICE_TARGETS" >&2
  exit 24
fi
if [ -e "$RUN_ROOT" ]; then
  echo "run id collision; refusing to overwrite: $RUN_ROOT" >&2
  exit 22
fi
mkdir -p "$PROVISION" "$CONFIG_DIR" "$HOOK_DIR" "$MATRIX"
cp "$DEVICE_TARGETS" "$PROVISION/device-targets.txt"
cp "$DEVICE_TARGETS_STDERR" "$PROVISION/device-targets.stderr.txt"
rm -f "$DEVICE_TARGETS" "$DEVICE_TARGETS_STDERR"
cp "$SRC/config/config.bound.json" "$CONFIG_DIR/source-v4.json"
cp "$SRC/config/environment.json" "$CONFIG_DIR/environment-source.json"

RUN_TAG=$(printf '%s' "$RUN_ID" | md5sum | cut -c1-8)
FIXTURE_NAME="h29-${RUN_TAG}.txt"
DOCS_DIR=${H29_DOCS_DIR:-/mnt/user/100/nosharefs/docs/currentUser/Download}
DOCS_FILE=$DOCS_DIR/$FIXTURE_NAME
DOCS_DIR_URI=${H29_DOCS_DIR_URI:-file://docs/storage/Users/currentUser/Download}
INJECT_DIR_URI=${H29_INJECT_DIR_URI:-$DOCS_DIR_URI}
DOCS_URI=$DOCS_DIR_URI/$FIXTURE_NAME
CANARY_TEXT="PPV630_H29_C15_CANARY_${RUN_ID}"

capture_hdc() {
  local label=$1
  shift
  set +e
  "$HDC" -t "$DEVICE" "$@" > "$PROVISION/$label.stdout.txt" 2> "$PROVISION/$label.stderr.txt"
  local rc=$?
  set -e
  printf '%s\n' "$rc" > "$PROVISION/$label.exit-code.txt"
  return 0
}

require_capture_hdc() {
  local label=$1
  shift
  capture_hdc "$label" "$@"
  local rc
  rc=$(cat "$PROVISION/$label.exit-code.txt" 2>/dev/null || printf '1')
  if [ "$rc" -ne 0 ]; then
    echo "required HDC step failed: $label rc=$rc" >&2
    exit 24
  fi
}

cleanup_device() {
  set +e
  "$HDC" -t "$DEVICE" shell aa force-stop org.oh.ppv3.runner > "$PROVISION/post-runner-force-stop.txt" 2>&1
  "$HDC" -t "$DEVICE" shell aa force-stop org.oh.ppv630.resourceowner > "$PROVISION/post-owner-force-stop.txt" 2>&1
  "$HDC" -t "$DEVICE" uninstall org.oh.ppv630.resourceowner > "$PROVISION/owner-uninstall.stdout.txt" 2> "$PROVISION/owner-uninstall.stderr.txt"
  "$HDC" -t "$DEVICE" shell rm -f "$DOCS_FILE" > "$PROVISION/public-fixture-remove.txt" 2>&1
  set -e
}
trap cleanup_device EXIT

OWNER_HAP=$BASE/round3-codegen-20261013/validation630/work/resource-owner/artifacts/resource-owner-signed.hap
require_capture_hdc hdc-probe shell true
if [ "$(cat "$PROVISION/hdc-probe.exit-code.txt" 2>/dev/null || printf '1')" -ne 0 ]; then
  echo "HDC device connection failed; see $PROVISION/hdc-probe.*" >&2
  exit 23
fi
capture_hdc power-state-before shell "hidumper -s 3704 -a -all"
capture_hdc boot-id shell "cat /proc/sys/kernel/random/boot_id"
capture_hdc device-uptime shell "cat /proc/uptime"
capture_hdc power-timeout shell "power-shell timeout -o 864000000"
capture_hdc power-wakeup shell "power-shell wakeup"
capture_hdc power-state-after shell "hidumper -s 3704 -a -all"
capture_hdc runner-process-baseline shell ps -A
capture_hdc owner-process-baseline shell ps -A
capture_hdc window-baseline shell hidumper -s WindowManagerService -a -a
require_capture_hdc provider-path-check shell test -d "$DOCS_DIR"
if [ "$(cat "$PROVISION/provider-path-check.exit-code.txt" 2>/dev/null || printf '1')" -ne 0 ]; then
  echo "provider physical path is unavailable: $DOCS_DIR" >&2
  exit 24
fi
printf '%s\n' \
  "physicalDocsDir=$DOCS_DIR" \
  "directoryUri=$DOCS_DIR_URI" \
  "fileUri=$DOCS_URI" \
  > "$PROVISION/provider-path-binding.txt"
require_capture_hdc public-mkdir shell mkdir -p "$DOCS_DIR"
# Send the canary as a file instead of printf-through-shell: the host keeps the
# exact bytes it sent and the device path never depends on nested quoting.
printf '%s\n' "$CANARY_TEXT" > "$PROVISION/canary-source.txt"
sha256sum "$PROVISION/canary-source.txt" > "$PROVISION/canary-source.sha256.txt"
require_capture_hdc public-send file send "$PROVISION/canary-source.txt" "$DOCS_FILE"
capture_hdc public-owner shell chown 20001006:20001006 "$DOCS_FILE"
capture_hdc public-mode shell chmod 664 "$DOCS_FILE"
capture_hdc public-list shell ls -la "$DOCS_DIR"
set +e
"$HDC" -t "$DEVICE" file recv "$DOCS_FILE" "$PROVISION/canary-from-device.txt" \
  > "$PROVISION/public-canary-recv.stdout.txt" \
  2> "$PROVISION/public-canary-recv.stderr.txt"
CANARY_RECV_RC=$?
set -e
printf '%s\n' "$CANARY_RECV_RC" > "$PROVISION/public-canary-recv.exit-code.txt"
if [ "$CANARY_RECV_RC" -eq 0 ] && [ -f "$PROVISION/canary-from-device.txt" ]; then
  sha256sum "$PROVISION/canary-from-device.txt" > "$PROVISION/public-sha256-before.stdout.txt"
else
  printf '%s\n' 'host-side digest unavailable: hdc file recv failed' \
    > "$PROVISION/public-sha256-before.stdout.txt"
fi
printf '%s\n' 'host-side digest replaces unsupported device toybox sha256sum' \
  > "$PROVISION/public-sha256-before.method.txt"
require_capture_hdc owner-install install "$OWNER_HAP"
capture_hdc owner-force-stop shell aa force-stop org.oh.ppv630.resourceowner
# The resource-owner HAP is installed for package/identity evidence only.  Do
# not start its Ability: it can cover the system FilePicker and make the UI
# oracle observe the fixture owner instead of the picker.
printf '%s\n' 'owner Ability intentionally not started; package identity only' \
  > "$PROVISION/owner-start-skipped.txt"
sleep 3
capture_hdc owner-bundle-dump shell bm dump -a org.oh.ppv630.resourceowner
capture_hdc picker-bundle shell bm dump -n com.ohos.filepicker
capture_hdc docs-provider-bundle shell bm dump -n com.ohos.UserFile.ExternalFileManager

python3 "$SCRIPT_DIR/h29_config_v16.py" \
  --source-config "$CONFIG_DIR/source-v4.json" \
  --source-environment "$CONFIG_DIR/environment-source.json" \
  --config "$CONFIG_DIR/config.bound.json" \
  --environment "$CONFIG_DIR/environment.json" \
  --contract "$PROVISION/fixture-contract.json" \
  --run-id "$RUN_ID" \
  --mode "$MODE" \
  --directory-uri "$INJECT_DIR_URI" \
  --file-uri "$DOCS_URI" \
  --filename "$FIXTURE_NAME" \
  --canary-text "$CANARY_TEXT" \
  --timeout-ms "${H29_TIMEOUT_MS:-60000}" \
  > "$PROVISION/config-builder.stdout.txt" 2> "$PROVISION/config-builder.stderr.txt"

printf '%s\n' \
  "caseId=H29-C-52ba990f664cdfd2" \
  "runId=$RUN_ID" \
  "providerKind=system-docs-provider" \
  "directoryUri=$DOCS_DIR_URI" \
  "fileUri=$DOCS_URI" \
  "fixtureFile=$DOCS_FILE" \
  > "$PROVISION/bundle-evidence.txt"

cp "$SCRIPT_DIR/h29_process_hook_v16.py" "$HOOK_DIR/h29_process_hook_v16.py"
cp "$SCRIPT_DIR/h29_picker_ui_probe_v16.py" "$HOOK_DIR/h29_picker_ui_probe_v16.py"
cp "$SCRIPT_DIR/h29_ui_watcher_ctl_v16.py" "$HOOK_DIR/h29_ui_watcher_ctl_v16.py"
python3 "$SCRIPT_DIR/h29_hooks_v16.py" \
  --output "$HOOK_DIR/hooks.json" \
  --process-hook "$HOOK_DIR/h29_process_hook_v16.py" \
  --ui-probe "$HOOK_DIR/h29_picker_ui_probe_v16.py" \
  --watcher-ctl "$HOOK_DIR/h29_ui_watcher_ctl_v16.py" \
  --ui-budget-seconds "${H29_UI_BUDGET_SECONDS:-45}" \
  --ui-wait-seconds "${H29_UI_WAIT_SECONDS:-20}" \
  --hdc "$HDC" \
  --device "$DEVICE" \
  --matrix "$MATRIX" \
  --run-id "$RUN_ID" \
  --filename "$FIXTURE_NAME" \
  --file-uri "$DOCS_URI" \
  --confirm-token "OPEN" \
  --confirm-token "SELECT" \
  --confirm-token "DONE" \
  --confirm-token "CONFIRM"

RUNNER_HAP=$BASE/round3-codegen-20261013/validation630/work/signing/H29-C-1b4befcb171c6ade-runner/artifacts/H29-C-1b4befcb171c6ade-runner-normal-signed.hap
REPLAY="PYTHONPATH=$BASE/round3-codegen-20261013/validation630/scripts OHOS_HDC_SERVER_PORT=$HDC_SERVER_PORT python3 $RUNPY --config $CONFIG_DIR/config.bound.json --environment $CONFIG_DIR/environment.json --device $DEVICE --hdc $HDC --hap $RUNNER_HAP --bundle org.oh.ppv3.runner --ability EntryAbility --hooks $HOOK_DIR/hooks.json --out $MATRIX --groups $RUN_GROUPS --repetitions $REPETITIONS --install"
printf '%s\n' "$REPLAY" > "$RUN_ROOT/replay-command.txt"

capture_hdc hilog-clear shell hilog -r
printf '%s\n' 'The per-cell UI operator is spawned by the runner before hook and reaped by the evidence hook.' \
  'The installed H29 runner HAP prints PPV630_PROCESS but not PPV630_READY, so the ready hook can never fire.' \
  > "$RUN_ROOT/ui-operator-rationale.txt"

set +e
PYTHONPATH="$BASE/round3-codegen-20261013/validation630/scripts" OHOS_HDC_SERVER_PORT="$HDC_SERVER_PORT" python3 - "$RUNPY" \
  --config "$CONFIG_DIR/config.bound.json" \
  --environment "$CONFIG_DIR/environment.json" \
  --device "$DEVICE" \
  --hdc "$HDC" \
  --hap "$RUNNER_HAP" \
  --bundle org.oh.ppv3.runner \
  --ability EntryAbility \
  --hooks "$HOOK_DIR/hooks.json" \
  --out "$MATRIX" \
  --groups "$RUN_GROUPS" \
  --repetitions "$REPETITIONS" \
  --install \
  > "$RUN_ROOT/runner.stdout.txt" 2> "$RUN_ROOT/runner.stderr.txt" <<'PY'
import runpy
import sys

run_path = sys.argv[1]
sys.argv = [run_path] + sys.argv[2:]
runpy.run_path(run_path, run_name="__main__")
PY
RUN_RC=$?
set -e
printf '%s\n' "$RUN_RC" > "$RUN_ROOT/runner.exit-code.txt"

capture_hdc runner-bundle-dump shell bm dump -n org.oh.ppv3.runner
capture_hdc runner-uid shell "ps -A -o UID,NAME | grep -i ppv3"

set +e
python3 "$SCRIPT_DIR/h29_picker_oracle_v16.py" \
  --matrix "$MATRIX" \
  --contract "$PROVISION/fixture-contract.json" \
  --device "$DEVICE" \
  --parent-run-id "$RUN_ID" \
  --expected-groups "$RUN_GROUPS" \
  --expected-repetitions "$REPETITIONS" \
  --output "$MATRIX/h29-picker-v16-oracle.json" \
  > "$RUN_ROOT/oracle.stdout.txt" 2> "$RUN_ROOT/oracle.stderr.txt"
ORACLE_RC=$?
set -e
printf '%s\n' "$ORACLE_RC" > "$RUN_ROOT/oracle.exit-code.txt"

python3 "$SCRIPT_DIR/h29_run_summary_v16.py" \
  --output "$RUN_ROOT/run-summary.json" \
  --run-id "$RUN_ID" \
  --mode "$MODE" \
  --device "$DEVICE" \
  --shared-uri "$DOCS_URI" \
  --matrix "$MATRIX" \
  --runner-rc "$RUN_RC" \
  --oracle-rc "$ORACLE_RC"

printf 'RUN_ROOT=%s\nMATRIX=%s\nRUN_RC=%s\nORACLE_RC=%s\n' "$RUN_ROOT" "$MATRIX" "$RUN_RC" "$ORACLE_RC"
exit "$ORACLE_RC"
