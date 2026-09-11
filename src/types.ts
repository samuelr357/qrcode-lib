export type QRCodeContentType =
  | "url"
  | "text"
  | "location"
  | "phone"
  | "email"
  | "sms"
  | "bitcoin"
  | "paypal"
  | "vcard"
  | "whatsapp"
  | "wifi"
  | "zoom";

export type QRCodeDotsShape = "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
export type QRCodeCornerSquareShape = "square" | "dot" | "extra-rounded";
export type QRCodeCornerDotShape = "square" | "dot";
export type QRCodeGradientMode = "linear-0" | "linear-45" | "linear-90" | "linear-135" | "radial-center";
export type QRCodeOutputFormat = "png" | "svg";
export type QRCodeWifiAuthType = "WPA" | "WEP" | "nopass";
export type QRCodeARQuality = "excellent" | "good" | "risky" | "invalid";
export type QRCodeValidationSeverity = "info" | "warning" | "error";

export interface QRCodeARProfile {
  mode: "ar-marker";
  physicalSizeMm?: number;
  physicalWidthMm?: number;
  physicalHeightMm?: number;
  enforceQuietZone?: boolean;
  readabilityValidation?: boolean;
  minimumContrast?: boolean;
  minimumContrastRatio?: number;
  minimumPhysicalSizeMm?: number;
  maximumLogoRatio?: number;
}

export interface QRCodeValidationIssue {
  code:
    | "physical-size-invalid"
    | "physical-size-small"
    | "physical-size-borderline"
    | "transparent-background"
    | "unsupported-color-format"
    | "contrast-invalid"
    | "contrast-low"
    | "logo-too-large"
    | "quiet-zone-will-be-enforced"
    | "complex-style";
  severity: QRCodeValidationSeverity;
  message: string;
  value?: number | string | boolean;
}

export interface QRCodeARValidationResult {
  quality: QRCodeARQuality;
  valid: boolean;
  issues: QRCodeValidationIssue[];
  metrics: {
    contrastRatio: number | null;
    physicalWidthMm: number | null;
    physicalHeightMm: number | null;
    logoSizeRatio: number;
    requiredQuietZonePx: number;
  };
}

export interface QRCodeReadbackResult {
  readable: boolean;
  matches: boolean;
  expectedPayload: string;
  decodedPayload: string | null;
  error: "generated-qr-unreadable" | "generated-qr-payload-mismatch" | null;
}

export interface QRCodeAppearance {
  size?: number;
  logo?: string | null;
  logoMargin?: number;
  logoSizeRatio?: number;
  quietZonePx?: number;
  colors?: {
    bg?: string;
    fg?: string;
    eyeFrame?: string;
    eyeCenter?: string;
    transparent?: boolean;
  };
  gradient?: {
    enabled?: boolean;
    start?: string;
    end?: string;
    mode?: QRCodeGradientMode;
  };
  shapes?: {
    dots?: QRCodeDotsShape;
    cornerSquare?: QRCodeCornerSquareShape;
    cornerDot?: QRCodeCornerDotShape;
  };
}

export interface QRCodeStyle {
  size?: number;
  logoUrl?: string | null;
  logoPadding?: number;
  logoSizeRatio?: number;
  quietZonePx?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  eyeOuterColor?: string;
  eyeInnerColor?: string;
  transparentBackground?: boolean;
  gradient?: {
    enabled?: boolean;
    from?: string;
    to?: string;
    style?: QRCodeGradientMode;
  };
  shape?: {
    body?: QRCodeDotsShape;
    eyeOuter?: QRCodeCornerSquareShape;
    eyeInner?: QRCodeCornerDotShape;
  };
}

export type QRCodeAppearanceInput = QRCodeAppearance | QRCodeStyle;

export interface QRCodeUrlInput { type: "url"; url?: string; }
export interface QRCodeTextInput { type: "text"; text?: string; }
export interface QRCodeLocationInput { type: "location"; lat?: string | number; lng?: string | number; }
export interface QRCodePhoneInput { type: "phone"; phone?: string; }
export interface QRCodeEmailInput { type: "email"; email?: string; subject?: string; body?: string; }
export interface QRCodeSmsInput { type: "sms"; phone?: string; body?: string; }
export interface QRCodeBitcoinInput { type: "bitcoin"; address?: string; amount?: string | number; }
export interface QRCodePayPalInput { type: "paypal"; username?: string; amount?: string | number; currency?: string; }
export interface QRCodeVCardInput { type: "vcard"; name?: string; organization?: string; phone?: string; email?: string; }
export interface QRCodeWhatsAppInput { type: "whatsapp"; phone?: string; message?: string; }
export interface QRCodeWifiInput { type: "wifi"; ssid?: string; password?: string; authType?: QRCodeWifiAuthType; hidden?: boolean; }
export interface QRCodeZoomInput { type: "zoom"; url?: string; }

export type QRCodePayloadInput =
  | QRCodeUrlInput | QRCodeTextInput | QRCodeLocationInput | QRCodePhoneInput
  | QRCodeEmailInput | QRCodeSmsInput | QRCodeBitcoinInput | QRCodePayPalInput
  | QRCodeVCardInput | QRCodeWhatsAppInput | QRCodeWifiInput | QRCodeZoomInput;

export interface QRCodeOptionsCatalog {
  contentTypes: readonly QRCodeContentType[];
  dotsShapes: readonly QRCodeDotsShape[];
  cornerSquareShapes: readonly QRCodeCornerSquareShape[];
  cornerDotShapes: readonly QRCodeCornerDotShape[];
  gradientModes: readonly QRCodeGradientMode[];
  outputFormats: readonly QRCodeOutputFormat[];
  wifiAuthTypes: readonly QRCodeWifiAuthType[];
  limits: {
    minSize: number;
    maxSize: number;
    defaultSize: number;
    defaultLogoMargin: number;
  };
}

export interface GenerateQRCodeNodeInput {
  content: QRCodePayloadInput | string;
  appearance?: QRCodeAppearance;
  style?: QRCodeStyle;
  format?: QRCodeOutputFormat;
  arProfile?: QRCodeARProfile;
}

export interface BrowserQRCodeCreateInput {
  element: HTMLElement;
  content: QRCodePayloadInput | string;
  appearance?: QRCodeAppearance;
  style?: QRCodeStyle;
  arProfile?: QRCodeARProfile;
}

export interface BrowserQRCodeInstance {
  update: (input: {
    content: QRCodePayloadInput | string;
    appearance?: QRCodeAppearance;
    style?: QRCodeStyle;
    arProfile?: QRCodeARProfile;
  }) => void;
  download: (fileName?: string, extension?: QRCodeOutputFormat) => void;
  getRawData: (extension?: QRCodeOutputFormat) => Promise<Blob | Buffer | null>;
}
