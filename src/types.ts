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

export interface QRCodeAppearance {
  size?: number;
  logo?: string | null;
  logoMargin?: number;
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

export interface QRCodeUrlInput {
  type: "url";
  url?: string;
}

export interface QRCodeTextInput {
  type: "text";
  text?: string;
}

export interface QRCodeLocationInput {
  type: "location";
  lat?: string | number;
  lng?: string | number;
}

export interface QRCodePhoneInput {
  type: "phone";
  phone?: string;
}

export interface QRCodeEmailInput {
  type: "email";
  email?: string;
  subject?: string;
  body?: string;
}

export interface QRCodeSmsInput {
  type: "sms";
  phone?: string;
  body?: string;
}

export interface QRCodeBitcoinInput {
  type: "bitcoin";
  address?: string;
  amount?: string | number;
}

export interface QRCodePayPalInput {
  type: "paypal";
  username?: string;
  amount?: string | number;
  currency?: string;
}

export interface QRCodeVCardInput {
  type: "vcard";
  name?: string;
  organization?: string;
  phone?: string;
  email?: string;
}

export interface QRCodeWhatsAppInput {
  type: "whatsapp";
  phone?: string;
  message?: string;
}

export interface QRCodeWifiInput {
  type: "wifi";
  ssid?: string;
  password?: string;
  authType?: QRCodeWifiAuthType;
  hidden?: boolean;
}

export interface QRCodeZoomInput {
  type: "zoom";
  url?: string;
}

export type QRCodePayloadInput =
  | QRCodeUrlInput
  | QRCodeTextInput
  | QRCodeLocationInput
  | QRCodePhoneInput
  | QRCodeEmailInput
  | QRCodeSmsInput
  | QRCodeBitcoinInput
  | QRCodePayPalInput
  | QRCodeVCardInput
  | QRCodeWhatsAppInput
  | QRCodeWifiInput
  | QRCodeZoomInput;

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
  format?: QRCodeOutputFormat;
}

export interface BrowserQRCodeCreateInput {
  element: HTMLElement;
  content: QRCodePayloadInput | string;
  appearance?: QRCodeAppearance;
}

export interface BrowserQRCodeInstance {
  update: (input: { content: QRCodePayloadInput | string; appearance?: QRCodeAppearance }) => void;
  download: (fileName?: string, extension?: QRCodeOutputFormat) => void;
  getRawData: (extension?: QRCodeOutputFormat) => Promise<Blob | Buffer | null>;
}
