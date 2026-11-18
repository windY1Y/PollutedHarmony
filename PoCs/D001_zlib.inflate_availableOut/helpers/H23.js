// Continuation13-only H23 runner variant.  The original H23 runner is left
// untouched; this copy adds a real zlib consumer after Zip.deflate.
import zlib from '@ohos.zlib';
import { plan, need, ascii, digestBytes } from '../runtime/plan.js';

function errorSummary(error) {
  if (!error) return null;
  return {
    code: error.code === undefined ? null : error.code,
    message: String(error.message || error),
  };
}

async function consumeCompressed(output, plaintextLength, requestedBytes) {
  const decoder = await zlib.createZip();
  const requested = requestedBytes === undefined ? output.byteLength : requestedBytes;
  const consumerBytes = Math.max(1, Math.min(requested, output.byteLength));
  const consumerInput = new ArrayBuffer(consumerBytes);
  new Uint8Array(consumerInput).set(new Uint8Array(output, 0, consumerBytes));
  const decoded = new ArrayBuffer(plaintextLength + 32);
  new Uint8Array(decoded).fill(0xCC);
  // This is an explicit own field. The only polluted field remains the
  // deflate stream's inherited availableOut.
  const decodeStream = {
    nextIn: consumerInput,
    availableIn: consumerInput.byteLength,
    nextOut: decoded,
    availableOut: decoded.byteLength,
  };
  let initStatus = null;
  let inflateStatus = null;
  let inflateError = null;
  let endStatus = null;
  try {
    initStatus = await decoder.inflateInit(decodeStream);
    if (initStatus === 0) {
      try {
        inflateStatus = await decoder.inflate(decodeStream, 4);
      } catch (error) {
        inflateError = errorSummary(error);
      }
    }
  } catch (error) {
    inflateError = errorSummary(error);
  } finally {
    if (initStatus === 0) {
      try {
        endStatus = await decoder.inflateEnd(decodeStream);
      } catch (error) {
        if (!inflateError) inflateError = errorSummary(error);
      }
    }
  }
  return {
    initStatus,
    inflateStatus,
    endStatus,
    inflateError,
    remainingInput: decodeStream.availableIn,
    remainingOutput: decodeStream.availableOut,
    consumerInputBytes: consumerInput.byteLength,
    decoded: digestBytes(decoded),
  };
}

export async function prepare(context, cfg) {
  const zip = await zlib.createZip();
  const input = ascii(cfg.ordinary.input).buffer;
  const output = new ArrayBuffer(cfg.ordinary.outputBytes);
  new Uint8Array(output).fill(0xA5);
  // Do not provide availableOut here. In PT this is supplied only through
  // Object.prototype; B/P/CLEAN keep the ordinary native default.
  const stream = {
    nextIn: input,
    availableIn: input.byteLength,
    nextOut: output,
  };
  const status = await zip.deflateInit(
    { nextIn: input, availableIn: input.byteLength, nextOut: output, availableOut: output.byteLength },
    cfg.ordinary.level,
  );
  return plan(
    cfg,
    [stream],
    async () => {
      const deflateStatus = await zip.deflate(stream, cfg.ordinary.flush);
      const consumer = await consumeCompressed(output, input.byteLength, cfg.ordinary.consumerBytes);
      return {
        initStatus: status,
        deflateStatus,
        output: digestBytes(output),
        consumer,
      };
    },
    { cleanup: () => zip.deflateEnd(stream) },
  );
}
