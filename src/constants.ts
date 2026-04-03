import type {
  QRCodeContentType,
  QRCodeCornerDotShape,
  QRCodeCornerSquareShape,
  QRCodeDotsShape,
  QRCodeGradientMode,
  QRCodeOutputFormat,
  QRCodeWifiAuthType
} from "./types";

export const QR_CODE_CONTENT_TYPES: readonly QRCodeContentType[] = [
  "url",
  "text",
  "location",
  "phone",
  "email",
  "sms",
  "bitcoin",
  "paypal",
  "vcard",
  "whatsapp",
  "wifi",
  "zoom"
] as const;

export const QR_CODE_DOTS_SHAPES: readonly QRCodeDotsShape[] = [
  "square",
  "rounded",
  "dots",
  "classy",
  "classy-rounded",
  "extra-rounded"
] as const;

export const QR_CODE_CORNER_SQUARE_SHAPES: readonly QRCodeCornerSquareShape[] = [
  "square",
  "dot",
  "extra-rounded"
] as const;

export const QR_CODE_CORNER_DOT_SHAPES: readonly QRCodeCornerDotShape[] = ["square", "dot"] as const;

export const QR_CODE_GRADIENT_MODES: readonly QRCodeGradientMode[] = [
  "linear-0",
  "linear-45",
  "linear-90",
  "linear-135",
  "radial-center"
] as const;

export const QR_CODE_OUTPUT_FORMATS: readonly QRCodeOutputFormat[] = ["png", "svg"] as const;

export const QR_CODE_WIFI_AUTH_TYPES: readonly QRCodeWifiAuthType[] = ["WPA", "WEP", "nopass"] as const;

export const DEFAULT_QR_SIZE = 1000;
export const MIN_QR_SIZE = 200;
export const MAX_QR_SIZE = 2000;
export const DEFAULT_LOGO_MARGIN = 6;
