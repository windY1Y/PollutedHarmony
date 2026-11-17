# OpenHarmony Prototype-Pollution Artifact

## 1. Directory structure

```text
artifact/
├── README.md
├── runtime.patch
└── scripts/
    ├── apply_taint.py
    ├── 01_undefined_prop_collection/
    │   ├── lane_runner.py
    │   ├── runner_base.py
    │   └── extract_undefined_props.py
    ├── 02_type_inference/
    │   ├── collect_contexts.py
    │   ├── infer_js.cjs
    │   └── infer_native.py
    ├── 03_deep_prop_exploration/
    │   ├── run.py
    │   ├── aggregate.py
    │   └── verify_relations.py
    └── 04_gadgets_exploration/
        ├── build_input.py
        ├── execute04.py
        └── reference_extract.py
```

The scripts are a minimal selection; batch execution requires additional deployment configurations, generated inputs, and runner helpers.

## 2. Obtain, patch, build, and run OpenHarmony

Use a Linux host with Git, Git LFS, `repo`, Python 3.11, `rg`, and the [OpenHarmony build dependencies](https://github.com/openharmony/docs/blob/OpenHarmony-v6.0-Release/en/device-dev/quick-start/quickstart-pkg-install-package.md). Use HDC from the matching OpenHarmony SDK. Replace the paths and test identifiers below with your own.

### 2.1. Download the source and apply the patch

Use the release tag **OpenHarmony-v6.0-Release**. Apply the patch from the OpenHarmony source root.

```bash
export ARTIFACT_ROOT="$(realpath /path/to/artifact)"
export OH_ROOT="$HOME/openharmony-6.0"

mkdir -p "$OH_ROOT"
cd "$OH_ROOT"
git lfs install
repo init -u https://gitcode.com/openharmony/manifest \
  -b refs/tags/OpenHarmony-v6.0-Release --no-repo-verify
repo sync -c -j8
repo forall -c 'git lfs pull'

# Verify the two repositories modified by the runtime patch.
test "$(git -C arkcompiler/ets_runtime rev-parse HEAD)" = \
  f088365c32823389e561f3f79cbe9afec623656a || exit 1
test "$(git -C foundation/arkui/napi rev-parse HEAD)" = \
  bcc225b37237e93259c672df4ed71c1597de0058 || exit 1

git apply --check "$ARTIFACT_ROOT/runtime.patch" && \
  git apply "$ARTIFACT_ROOT/runtime.patch"

# Prepare ACTS sources for injection before building test HAPs.
python3 "$ARTIFACT_ROOT/scripts/apply_taint.py"
bash build/prebuilts_download.sh
```

### 2.2. Build and boot the system

For an **ARM64 RK3568 board**:

```bash
cd "$OH_ROOT"
./build.sh --product-name rk3568 --target-cpu arm64 --ccache --jobs 4
```

Flash `out/rk3568/packages/phone/images/` following the [RK3568 guide](https://github.com/openharmony/docs/blob/OpenHarmony-v6.0-Release/en/device-dev/quick-start/quickstart-pkg-3568-burn.md), then boot and connect the board.

Alternatively, build and boot the upstream **ARM32 headless QEMU** target:

```bash
cd "$OH_ROOT"
./build.sh --product-name qemu-arm-linux-headless --ccache --jobs 4
bash vendor/ohemu/qemu_arm_linux_headless/qemu_run.sh
```

Install QEMU and configure networking for HDC as described in the [QEMU guide](https://github.com/openharmony/device_qemu/blob/OpenHarmony-v6.0-Release/arm_virt/linux/README_zh.md). This headless target cannot run the ArkUI workload; the experiments' custom ARM64 QEMU adaptations are not included in this runtime-only patch.

### 2.3. Run an ACTS module and collect logs

Build and sign the selected ACTS module after injection using its [ACTS build configuration](https://github.com/openharmony/xts_acts/blob/OpenHarmony-v6.0-Release/README_zh.md). The following commands assume a Stage-model test HAP, its required helper HAPs, and an instrumented debug/test image.

```bash
hdc list targets
export TARGET="<target-reported-by-hdc>"
export HAP="/absolute/path/to/rebuilt-test.hap"
export BUNDLE="<bundleName>"
export TEST_MODULE="<hap-module-name>"
export TEST_RUNNER="<test-runner-identifier>"

hdc -t "$TARGET" install "$HAP"
# Install any helper HAPs required by the selected module in the same way.
```

Start log capture, using the same target:

```bash
export TARGET="<target-reported-by-hdc>"
hdc -t "$TARGET" shell hilog > /absolute/path/to/runtime.log
```

In the first terminal, collect unresolved properties, then run a candidate injection after the first test completes:

```bash
# Unresolved-property collection.
hdc -t "$TARGET" shell "param set persist.pptrace.pp.phase undef"
hdc -t "$TARGET" shell "aa force-stop $BUNDLE"
hdc -t "$TARGET" shell \
  "aa test -b $BUNDLE -m $TEST_MODULE -s unittest $TEST_RUNNER -s ppKey none -w 60000"

# Candidate injection and consumption observation.
export PROPERTY="<candidate-property>"
export MODE="object"
hdc -t "$TARGET" shell "param set persist.pptrace.pp.phase taint"
hdc -t "$TARGET" shell "aa force-stop $BUNDLE"
hdc -t "$TARGET" shell \
  "aa test -b $BUNDLE -m $TEST_MODULE -s unittest $TEST_RUNNER -s ppKey $PROPERTY -s ppMode $MODE -w 60000"
```

Use phase `type` instead of `undef` to collect runtime type evidence. After testing finishes, stop log capture with `Ctrl-C`, then extract native consumption records:

```bash
python3 "$ARTIFACT_ROOT/scripts/04_gadgets_exploration/reference_extract.py" \
  /absolute/path/to/runtime.log -o /absolute/path/to/native-consumption.txt
hdc -t "$TARGET" shell "param set persist.pptrace.pp.phase off"
```

Patch applicability and command syntax were checked; a full system build and device run were not performed during artifact preparation.
