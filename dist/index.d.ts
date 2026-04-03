import { Q as QRCodePayloadInput, b as QRCodeAppearanceInput, c as QRCodeGradientMode, d as QRCodeStyle, e as QRCodeAppearance, f as QRCodeContentType, g as QRCodeCornerDotShape, h as QRCodeCornerSquareShape, i as QRCodeDotsShape, j as QRCodeOutputFormat, k as QRCodeWifiAuthType, l as QRCodeOptionsCatalog } from './types-CZ3DbJda.js';
export { B as BrowserQRCodeCreateInput, a as BrowserQRCodeInstance, G as GenerateQRCodeNodeInput, m as QRCodeBitcoinInput, n as QRCodeEmailInput, o as QRCodeLocationInput, p as QRCodePayPalInput, q as QRCodePhoneInput, r as QRCodeSmsInput, s as QRCodeTextInput, t as QRCodeUrlInput, u as QRCodeVCardInput, v as QRCodeWhatsAppInput, w as QRCodeWifiInput, x as QRCodeZoomInput } from './types-CZ3DbJda.js';

declare function buildQRCodePayload(input: QRCodePayloadInput | string): string;

interface ResolvedAppearance {
    size: number;
    logo: string | null;
    logoMargin: number;
    colors: {
        bg: string;
        fg: string;
        eyeFrame: string;
        eyeCenter: string;
        transparent: boolean;
    };
    gradient: {
        enabled: boolean;
        start: string;
        end: string;
        mode: QRCodeGradientMode;
    };
    shapes: {
        dots: "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
        cornerSquare: "square" | "dot" | "extra-rounded";
        cornerDot: "square" | "dot";
    };
}
declare function clampSize(size: number | undefined): number;
declare function toLegacyAppearance(style?: QRCodeStyle): QRCodeAppearance;
declare function normalizeAppearance(appearance?: QRCodeAppearanceInput): ResolvedAppearance;
declare function getStylingOptions(data: string, appearance?: QRCodeAppearanceInput): {
    width: number;
    height: number;
    data: string;
    image: string | undefined;
    dotsOptions: {
        type: "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
        gradient: {
            type: "radial";
            rotation: number;
            colorStops: {
                offset: number;
                color: string;
            }[];
        } | {
            type: "linear";
            rotation: number;
            colorStops: {
                offset: number;
                color: string;
            }[];
        };
        color: undefined;
    } | {
        color: string;
        type: "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
        gradient: undefined;
    };
    cornersSquareOptions: {
        color: string;
        type: "square" | "extra-rounded" | "dot";
    };
    cornersDotOptions: {
        color: string;
        type: "square" | "dot";
    };
    backgroundOptions: {
        color: string;
    };
    imageOptions: {
        margin: number;
        crossOrigin: "anonymous";
    };
};

declare const QR_CODE_CONTENT_TYPES: readonly QRCodeContentType[];
declare const QR_CODE_DOTS_SHAPES: readonly QRCodeDotsShape[];
declare const QR_CODE_CORNER_SQUARE_SHAPES: readonly QRCodeCornerSquareShape[];
declare const QR_CODE_CORNER_DOT_SHAPES: readonly QRCodeCornerDotShape[];
declare const QR_CODE_GRADIENT_MODES: readonly QRCodeGradientMode[];
declare const QR_CODE_OUTPUT_FORMATS: readonly QRCodeOutputFormat[];
declare const QR_CODE_WIFI_AUTH_TYPES: readonly QRCodeWifiAuthType[];
declare const DEFAULT_QR_SIZE = 1000;
declare const MIN_QR_SIZE = 200;
declare const MAX_QR_SIZE = 2000;
declare const DEFAULT_LOGO_MARGIN = 6;

declare function getQRCodeOptionsCatalog(): QRCodeOptionsCatalog;

export { DEFAULT_LOGO_MARGIN, DEFAULT_QR_SIZE, MAX_QR_SIZE, MIN_QR_SIZE, QRCodeAppearance, QRCodeAppearanceInput, QRCodeContentType, QRCodeCornerDotShape, QRCodeCornerSquareShape, QRCodeDotsShape, QRCodeGradientMode, QRCodeOptionsCatalog, QRCodeOutputFormat, QRCodePayloadInput, QRCodeStyle, QRCodeWifiAuthType, QR_CODE_CONTENT_TYPES, QR_CODE_CORNER_DOT_SHAPES, QR_CODE_CORNER_SQUARE_SHAPES, QR_CODE_DOTS_SHAPES, QR_CODE_GRADIENT_MODES, QR_CODE_OUTPUT_FORMATS, QR_CODE_WIFI_AUTH_TYPES, buildQRCodePayload, clampSize, getQRCodeOptionsCatalog, getStylingOptions, normalizeAppearance, toLegacyAppearance };
