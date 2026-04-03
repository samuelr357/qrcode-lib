import {
  buildQRCodePayload,
  getStylingOptions
} from "./chunk-5KUVBYXA.js";

// src/node.ts
async function loadNodeDeps() {
  const [qrCodeStylingMod, canvasMod, jsdomMod] = await Promise.all([
    import("qr-code-styling/lib/qr-code-styling.common.js"),
    import("canvas"),
    import("jsdom")
  ]);
  const ctor = qrCodeStylingMod.default ?? qrCodeStylingMod;
  if (typeof ctor !== "function") {
    throw new Error("Nao foi possivel carregar qr-code-styling no Node.js.");
  }
  const nodeCanvas = canvasMod.default ?? canvasMod;
  const JSDOM = jsdomMod.JSDOM;
  if (!JSDOM) {
    throw new Error("Dependencia jsdom nao encontrada. Instale: npm i jsdom");
  }
  return {
    QRCodeStyling: ctor,
    nodeCanvas,
    JSDOM
  };
}
async function toBuffer(value) {
  if (!value) {
    throw new Error("Falha ao gerar QR Code.");
  }
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    return value;
  }
  if (typeof Blob !== "undefined" && value instanceof Blob) {
    const arrayBuffer = await value.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  if (value && typeof value.arrayBuffer === "function") {
    const arrayBuffer = await value.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  throw new Error("Tipo de retorno nao suportado ao gerar QR Code.");
}
async function generateQRCodeBuffer(input) {
  const { QRCodeStyling, nodeCanvas, JSDOM } = await loadNodeDeps();
  const payload = buildQRCodePayload(input.content);
  const baseOptions = getStylingOptions(payload, input.appearance);
  const qrCode = new QRCodeStyling({
    ...baseOptions,
    nodeCanvas,
    jsdom: JSDOM
  });
  return toBuffer(await qrCode.getRawData(input.format ?? "png"));
}
export {
  generateQRCodeBuffer
};
