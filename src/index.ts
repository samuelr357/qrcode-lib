import {
  DEFAULT_LOGO_MARGIN,
  DEFAULT_QR_SIZE,
  MAX_QR_SIZE,
  MIN_QR_SIZE,
  QR_CODE_CONTENT_TYPES,
  QR_CODE_CORNER_DOT_SHAPES,
  QR_CODE_CORNER_SQUARE_SHAPES,
  QR_CODE_DOTS_SHAPES,
  QR_CODE_GRADIENT_MODES,
  QR_CODE_OUTPUT_FORMATS,
  QR_CODE_WIFI_AUTH_TYPES
} from "./constants";
import { buildQRCodePayload } from "./payload";
import { clampSize, getStylingOptions, normalizeAppearance } from "./style";
import type { QRCodeOptionsCatalog } from "./types";

export function getQRCodeOptionsCatalog(): QRCodeOptionsCatalog {
  return {
    contentTypes: QR_CODE_CONTENT_TYPES,
    dotsShapes: QR_CODE_DOTS_SHAPES,
    cornerSquareShapes: QR_CODE_CORNER_SQUARE_SHAPES,
    cornerDotShapes: QR_CODE_CORNER_DOT_SHAPES,
    gradientModes: QR_CODE_GRADIENT_MODES,
    outputFormats: QR_CODE_OUTPUT_FORMATS,
    wifiAuthTypes: QR_CODE_WIFI_AUTH_TYPES,
    limits: {
      minSize: MIN_QR_SIZE,
      maxSize: MAX_QR_SIZE,
      defaultSize: DEFAULT_QR_SIZE,
      defaultLogoMargin: DEFAULT_LOGO_MARGIN
    }
  };
}

export {
  buildQRCodePayload,
  clampSize,
  normalizeAppearance,
  getStylingOptions
};

export type {
  BrowserQRCodeCreateInput,
  BrowserQRCodeInstance,
  GenerateQRCodeNodeInput,
  QRCodeAppearance,
  QRCodeBitcoinInput,
  QRCodeContentType,
  QRCodeCornerDotShape,
  QRCodeCornerSquareShape,
  QRCodeDotsShape,
  QRCodeEmailInput,
  QRCodeGradientMode,
  QRCodeLocationInput,
  QRCodeOptionsCatalog,
  QRCodeOutputFormat,
  QRCodePayloadInput,
  QRCodePayPalInput,
  QRCodePhoneInput,
  QRCodeSmsInput,
  QRCodeTextInput,
  QRCodeUrlInput,
  QRCodeVCardInput,
  QRCodeWhatsAppInput,
  QRCodeWifiAuthType,
  QRCodeWifiInput,
  QRCodeZoomInput
} from "./types";

export {
  QR_CODE_CONTENT_TYPES,
  QR_CODE_CORNER_DOT_SHAPES,
  QR_CODE_CORNER_SQUARE_SHAPES,
  QR_CODE_DOTS_SHAPES,
  QR_CODE_GRADIENT_MODES,
  QR_CODE_OUTPUT_FORMATS,
  QR_CODE_WIFI_AUTH_TYPES,
  DEFAULT_QR_SIZE,
  MIN_QR_SIZE,
  MAX_QR_SIZE,
  DEFAULT_LOGO_MARGIN
} from "./constants";
