import {
  buildQRCodePayload,
  getStylingOptions
} from "./chunk-5KUVBYXA.js";

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
function resolveOptions(content, appearance) {
  return getStylingOptions(resolvePayload(content), appearance);
}
async function createBrowserQRCode(input) {
  const QRCodeStyling = await loadBrowserQRCodeStyling();
  const qrCode = new QRCodeStyling(resolveOptions(input.content, input.appearance));
  qrCode.append(input.element);
  return {
    update: ({ content, appearance }) => {
      qrCode.update(resolveOptions(content, appearance));
    },
    download: (fileName = "qr-code", extension = "png") => {
      qrCode.download({ name: fileName, extension });
    },
    getRawData: (extension = "png") => qrCode.getRawData(extension)
  };
}
export {
  createBrowserQRCode
};
