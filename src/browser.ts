import type {
  BrowserQRCodeCreateInput,
  BrowserQRCodeInstance,
  QRCodeAppearanceInput,
  QRCodeOutputFormat,
  QRCodePayloadInput
} from "./types";
import { buildQRCodePayload } from "./payload";
import { getStylingOptions } from "./style";

type QRCodeStylingLike = {
  append: (element: HTMLElement) => void;
  update: (options: Record<string, unknown>) => void;
  download: (options: { name?: string; extension: QRCodeOutputFormat }) => void;
  getRawData: (extension: QRCodeOutputFormat) => Promise<Blob | Buffer | null>;
};

interface QRCodeStylingCtor {
  new (options: Record<string, unknown>): QRCodeStylingLike;
}

async function loadBrowserQRCodeStyling(): Promise<QRCodeStylingCtor> {
  const mod = await import("qr-code-styling");
  const ctor = (mod as { default?: unknown }).default ?? mod;
  if (typeof ctor !== "function") {
    throw new Error("Nao foi possivel carregar qr-code-styling no browser.");
  }
  return ctor as QRCodeStylingCtor;
}

function resolvePayload(content: QRCodePayloadInput | string): string {
  return buildQRCodePayload(content);
}

function resolveOptions(
  content: QRCodePayloadInput | string,
  options?: { appearance?: QRCodeAppearanceInput; style?: QRCodeAppearanceInput }
) {
  const styleInput = options?.style ?? options?.appearance;
  return getStylingOptions(resolvePayload(content), styleInput);
}

export async function createBrowserQRCode(input: BrowserQRCodeCreateInput): Promise<BrowserQRCodeInstance> {
  const QRCodeStyling = await loadBrowserQRCodeStyling();
  const qrCode = new QRCodeStyling(resolveOptions(input.content, { appearance: input.appearance, style: input.style }));
  qrCode.append(input.element);

  return {
    update: ({ content, appearance, style }) => {
      qrCode.update(resolveOptions(content, { appearance, style }));
    },
    download: (fileName = "qr-code", extension: QRCodeOutputFormat = "png") => {
      qrCode.download({ name: fileName, extension });
    },
    getRawData: (extension: QRCodeOutputFormat = "png") => qrCode.getRawData(extension)
  };
}

export const createQrCode = createBrowserQRCode;
