import type { GenerateQRCodeNodeInput, QRCodeOutputFormat } from "./types";
import { buildQRCodePayload } from "./payload";
import { getStylingOptions } from "./style";

type NodeBuffer = Buffer;

type QRCodeStylingLike = {
  getRawData: (extension: QRCodeOutputFormat) => Promise<NodeBuffer | Blob | null>;
};

interface QRCodeStylingCtor {
  new (options: Record<string, unknown>): QRCodeStylingLike;
}

async function loadNodeDeps() {
  const [qrCodeStylingMod, canvasMod, jsdomMod] = await Promise.all([
    import("qr-code-styling/lib/qr-code-styling.common.js"),
    import("canvas"),
    import("jsdom")
  ]);

  const ctor = (qrCodeStylingMod as { default?: unknown }).default ?? qrCodeStylingMod;
  if (typeof ctor !== "function") {
    throw new Error("Nao foi possivel carregar qr-code-styling no Node.js.");
  }

  const nodeCanvas = (canvasMod as { default?: unknown }).default ?? canvasMod;
  const JSDOM = (jsdomMod as { JSDOM?: unknown }).JSDOM;

  if (!JSDOM) {
    throw new Error("Dependencia jsdom nao encontrada. Instale: npm i jsdom");
  }

  return {
    QRCodeStyling: ctor as QRCodeStylingCtor,
    nodeCanvas,
    JSDOM
  };
}

async function toBuffer(value: Buffer | Blob | null): Promise<Buffer> {
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

  if (value && typeof (value as Blob).arrayBuffer === "function") {
    const arrayBuffer = await (value as Blob).arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  throw new Error("Tipo de retorno nao suportado ao gerar QR Code.");
}

export async function generateQRCodeBuffer(input: GenerateQRCodeNodeInput): Promise<Buffer> {
  const { QRCodeStyling, nodeCanvas, JSDOM } = await loadNodeDeps();

  const payload = buildQRCodePayload(input.content);
  const baseOptions = getStylingOptions(payload, input.style ?? input.appearance);

  const qrCode = new QRCodeStyling({
    ...baseOptions,
    nodeCanvas,
    jsdom: JSDOM
  });

  return toBuffer(await qrCode.getRawData(input.format ?? "png"));
}

export const generateQrCodeBuffer = generateQRCodeBuffer;
