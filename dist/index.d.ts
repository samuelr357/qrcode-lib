import { Q as QRCodePayloadInput, b as QRCodeAppearance, c as QRCodeGradientMode, d as QRCodeContentType, e as QRCodeCornerDotShape, f as QRCodeCornerSquareShape, g as QRCodeDotsShape, h as QRCodeOutputFormat, i as QRCodeWifiAuthType, j as QRCodeOptionsCatalog } from './types-DqOMAUZW.js';
export { B as BrowserQRCodeCreateInput, a as BrowserQRCodeInstance, G as GenerateQRCodeNodeInput, k as QRCodeBitcoinInput, l as QRCodeEmailInput, m as QRCodeLocationInput, n as QRCodePayPalInput, o as QRCodePhoneInput, p as QRCodeSmsInput, q as QRCodeTextInput, r as QRCodeUrlInput, s as QRCodeVCardInput, t as QRCodeWhatsAppInput, u as QRCodeWifiInput, v as QRCodeZoomInput } from './types-DqOMAUZW.js';

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
declare function normalizeAppearance(appearance?: QRCodeAppearance): ResolvedAppearance;
declare function getStylingOptions(data: string, appearance?: QRCodeAppearance): {
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

export { DEFAULT_LOGO_MARGIN, DEFAULT_QR_SIZE, MAX_QR_SIZE, MIN_QR_SIZE, QRCodeAppearance, QRCodeContentType, QRCodeCornerDotShape, QRCodeCornerSquareShape, QRCodeDotsShape, QRCodeGradientMode, QRCodeOptionsCatalog, QRCodeOutputFormat, QRCodePayloadInput, QRCodeWifiAuthType, QR_CODE_CONTENT_TYPES, QR_CODE_CORNER_DOT_SHAPES, QR_CODE_CORNER_SQUARE_SHAPES, QR_CODE_DOTS_SHAPES, QR_CODE_GRADIENT_MODES, QR_CODE_OUTPUT_FORMATS, QR_CODE_WIFI_AUTH_TYPES, buildQRCodePayload, clampSize, getQRCodeOptionsCatalog, getStylingOptions, normalizeAppearance };
