import {
  DEFAULT_LOGO_MARGIN,
  DEFAULT_QR_SIZE,
  MAX_QR_SIZE,
  MIN_QR_SIZE,
  QR_CODE_GRADIENT_MODES
} from "./constants";
import type { QRCodeAppearance, QRCodeAppearanceInput, QRCodeGradientMode, QRCodeStyle } from "./types";

export interface ResolvedAppearance {
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

const styleKeys: Array<keyof QRCodeStyle> = [
  "logoUrl",
  "logoPadding",
  "backgroundColor",
  "foregroundColor",
  "eyeOuterColor",
  "eyeInnerColor",
  "transparentBackground",
  "shape"
];

const defaultAppearance: ResolvedAppearance = {
  size: DEFAULT_QR_SIZE,
  logo: null,
  logoMargin: DEFAULT_LOGO_MARGIN,
  colors: {
    bg: "#FFFFFF",
    fg: "#0B0F1A",
    eyeFrame: "#0B0F1A",
    eyeCenter: "#0B0F1A",
    transparent: false
  },
  gradient: {
    enabled: false,
    start: "#0B0F1A",
    end: "#1F6FEB",
    mode: "linear-0"
  },
  shapes: {
    dots: "square",
    cornerSquare: "square",
    cornerDot: "square"
  }
};

const rotationMap: Record<Exclude<QRCodeGradientMode, "radial-center">, number> = {
  "linear-0": 0,
  "linear-45": Math.PI / 4,
  "linear-90": Math.PI / 2,
  "linear-135": (3 * Math.PI) / 4
};

export function clampSize(size: number | undefined): number {
  const raw = Number(size ?? DEFAULT_QR_SIZE);
  if (!Number.isFinite(raw)) return DEFAULT_QR_SIZE;
  return Math.min(MAX_QR_SIZE, Math.max(MIN_QR_SIZE, Math.round(raw)));
}

function isStyleInput(input: QRCodeAppearanceInput): input is QRCodeStyle {
  return styleKeys.some((key) => key in input);
}

export function toLegacyAppearance(style: QRCodeStyle = {}): QRCodeAppearance {
  return {
    size: style.size,
    logo: style.logoUrl,
    logoMargin: style.logoPadding,
    colors: {
      bg: style.backgroundColor,
      fg: style.foregroundColor,
      eyeFrame: style.eyeOuterColor,
      eyeCenter: style.eyeInnerColor,
      transparent: style.transparentBackground
    },
    gradient: {
      enabled: style.gradient?.enabled,
      start: style.gradient?.from,
      end: style.gradient?.to,
      mode: style.gradient?.style
    },
    shapes: {
      dots: style.shape?.body,
      cornerSquare: style.shape?.eyeOuter,
      cornerDot: style.shape?.eyeInner
    }
  };
}

export function normalizeAppearance(appearance: QRCodeAppearanceInput = {}): ResolvedAppearance {
  const normalizedInput = isStyleInput(appearance) ? toLegacyAppearance(appearance) : appearance;
  const gradientMode = normalizedInput.gradient?.mode ?? defaultAppearance.gradient.mode;

  return {
    size: clampSize(normalizedInput.size),
    logo: normalizedInput.logo ?? defaultAppearance.logo,
    logoMargin: Number.isFinite(normalizedInput.logoMargin)
      ? Number(normalizedInput.logoMargin)
      : defaultAppearance.logoMargin,
    colors: {
      bg: normalizedInput.colors?.bg ?? defaultAppearance.colors.bg,
      fg: normalizedInput.colors?.fg ?? defaultAppearance.colors.fg,
      eyeFrame: normalizedInput.colors?.eyeFrame ?? defaultAppearance.colors.eyeFrame,
      eyeCenter: normalizedInput.colors?.eyeCenter ?? defaultAppearance.colors.eyeCenter,
      transparent: normalizedInput.colors?.transparent ?? defaultAppearance.colors.transparent
    },
    gradient: {
      enabled: normalizedInput.gradient?.enabled ?? defaultAppearance.gradient.enabled,
      start: normalizedInput.gradient?.start ?? normalizedInput.colors?.fg ?? defaultAppearance.gradient.start,
      end: normalizedInput.gradient?.end ?? defaultAppearance.gradient.end,
      mode: QR_CODE_GRADIENT_MODES.includes(gradientMode) ? gradientMode : defaultAppearance.gradient.mode
    },
    shapes: {
      dots: normalizedInput.shapes?.dots ?? defaultAppearance.shapes.dots,
      cornerSquare: normalizedInput.shapes?.cornerSquare ?? defaultAppearance.shapes.cornerSquare,
      cornerDot: normalizedInput.shapes?.cornerDot ?? defaultAppearance.shapes.cornerDot
    }
  };
}

function getGradientConfig(mode: QRCodeGradientMode, start: string, end: string) {
  const colorStops = [
    { offset: 0, color: start },
    { offset: 1, color: end }
  ];

  if (mode === "radial-center") {
    return {
      type: "radial" as const,
      rotation: 0,
      colorStops
    };
  }

  return {
    type: "linear" as const,
    rotation: rotationMap[mode],
    colorStops
  };
}

export function getStylingOptions(data: string, appearance: QRCodeAppearanceInput = {}) {
  const normalized = normalizeAppearance(appearance);
  const dotsOptions = normalized.gradient.enabled
    ? {
        type: normalized.shapes.dots,
        gradient: getGradientConfig(normalized.gradient.mode, normalized.gradient.start, normalized.gradient.end),
        color: undefined
      }
    : {
        color: normalized.colors.fg,
        type: normalized.shapes.dots,
        gradient: undefined
      };

  return {
    width: normalized.size,
    height: normalized.size,
    data,
    image: normalized.logo || undefined,
    dotsOptions,
    cornersSquareOptions: {
      color: normalized.colors.eyeFrame,
      type: normalized.shapes.cornerSquare
    },
    cornersDotOptions: {
      color: normalized.colors.eyeCenter,
      type: normalized.shapes.cornerDot
    },
    backgroundOptions: {
      color: normalized.colors.transparent ? "transparent" : normalized.colors.bg
    },
    imageOptions: {
      margin: normalized.logoMargin,
      crossOrigin: "anonymous" as const
    }
  };
}
