type QRCodeContentType = "url" | "text" | "location" | "phone" | "email" | "sms" | "bitcoin" | "paypal" | "vcard" | "whatsapp" | "wifi" | "zoom";
type QRCodeDotsShape = "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
type QRCodeCornerSquareShape = "square" | "dot" | "extra-rounded";
type QRCodeCornerDotShape = "square" | "dot";
type QRCodeGradientMode = "linear-0" | "linear-45" | "linear-90" | "linear-135" | "radial-center";
type QRCodeOutputFormat = "png" | "svg";
type QRCodeWifiAuthType = "WPA" | "WEP" | "nopass";
interface QRCodeAppearance {
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
interface QRCodeStyle {
    size?: number;
    logoUrl?: string | null;
    logoPadding?: number;
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
type QRCodeAppearanceInput = QRCodeAppearance | QRCodeStyle;
interface QRCodeUrlInput {
    type: "url";
    url?: string;
}
interface QRCodeTextInput {
    type: "text";
    text?: string;
}
interface QRCodeLocationInput {
    type: "location";
    lat?: string | number;
    lng?: string | number;
}
interface QRCodePhoneInput {
    type: "phone";
    phone?: string;
}
interface QRCodeEmailInput {
    type: "email";
    email?: string;
    subject?: string;
    body?: string;
}
interface QRCodeSmsInput {
    type: "sms";
    phone?: string;
    body?: string;
}
interface QRCodeBitcoinInput {
    type: "bitcoin";
    address?: string;
    amount?: string | number;
}
interface QRCodePayPalInput {
    type: "paypal";
    username?: string;
    amount?: string | number;
    currency?: string;
}
interface QRCodeVCardInput {
    type: "vcard";
    name?: string;
    organization?: string;
    phone?: string;
    email?: string;
}
interface QRCodeWhatsAppInput {
    type: "whatsapp";
    phone?: string;
    message?: string;
}
interface QRCodeWifiInput {
    type: "wifi";
    ssid?: string;
    password?: string;
    authType?: QRCodeWifiAuthType;
    hidden?: boolean;
}
interface QRCodeZoomInput {
    type: "zoom";
    url?: string;
}
type QRCodePayloadInput = QRCodeUrlInput | QRCodeTextInput | QRCodeLocationInput | QRCodePhoneInput | QRCodeEmailInput | QRCodeSmsInput | QRCodeBitcoinInput | QRCodePayPalInput | QRCodeVCardInput | QRCodeWhatsAppInput | QRCodeWifiInput | QRCodeZoomInput;
interface QRCodeOptionsCatalog {
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
interface GenerateQRCodeNodeInput {
    content: QRCodePayloadInput | string;
    appearance?: QRCodeAppearance;
    style?: QRCodeStyle;
    format?: QRCodeOutputFormat;
}
interface BrowserQRCodeCreateInput {
    element: HTMLElement;
    content: QRCodePayloadInput | string;
    appearance?: QRCodeAppearance;
    style?: QRCodeStyle;
}
interface BrowserQRCodeInstance {
    update: (input: {
        content: QRCodePayloadInput | string;
        appearance?: QRCodeAppearance;
        style?: QRCodeStyle;
    }) => void;
    download: (fileName?: string, extension?: QRCodeOutputFormat) => void;
    getRawData: (extension?: QRCodeOutputFormat) => Promise<Blob | Buffer | null>;
}

export type { BrowserQRCodeCreateInput as B, GenerateQRCodeNodeInput as G, QRCodePayloadInput as Q, BrowserQRCodeInstance as a, QRCodeAppearanceInput as b, QRCodeGradientMode as c, QRCodeStyle as d, QRCodeAppearance as e, QRCodeContentType as f, QRCodeCornerDotShape as g, QRCodeCornerSquareShape as h, QRCodeDotsShape as i, QRCodeOutputFormat as j, QRCodeWifiAuthType as k, QRCodeOptionsCatalog as l, QRCodeBitcoinInput as m, QRCodeEmailInput as n, QRCodeLocationInput as o, QRCodePayPalInput as p, QRCodePhoneInput as q, QRCodeSmsInput as r, QRCodeTextInput as s, QRCodeUrlInput as t, QRCodeVCardInput as u, QRCodeWhatsAppInput as v, QRCodeWifiInput as w, QRCodeZoomInput as x };
