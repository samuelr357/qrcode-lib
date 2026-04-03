import {
  buildQRCodePayload,
  getStylingOptions
} from "./chunk-BGUPRGQW.js";

// src/browser.ts
async function loadBrowserQRCodeStyling() {
  const mod = await import("qr-code-styling");
  const ctor = mod.default ?? mod;
  if (typeof ctor !== "function") {
    throw new Error("Nao foi possivel carregar qr-code-styling no browser.");
  }
  return ctor;
}
function resolvePayload(content) {
  return buildQRCodePayload(content);
}
function resolveOptions(content, options) {
  const styleInput = options?.style ?? options?.appearance;
  return getStylingOptions(resolvePayload(content), styleInput);
}
async function createBrowserQRCode(input) {
  const QRCodeStyling = await loadBrowserQRCodeStyling();
  const qrCode = new QRCodeStyling(resolveOptions(input.content, { appearance: input.appearance, style: input.style }));
  qrCode.append(input.element);
  return {
    update: ({ content, appearance, style }) => {
      qrCode.update(resolveOptions(content, { appearance, style }));
    },
    download: (fileName = "qr-code", extension = "png") => {
      qrCode.download({ name: fileName, extension });
    },
    getRawData: (extension = "png") => qrCode.getRawData(extension)
  };
}
var createQrCode = createBrowserQRCode;
export {
  createBrowserQRCode,
  createQrCode
};
