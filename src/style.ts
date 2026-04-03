import {
  DEFAULT_LOGO_MARGIN,
  DEFAULT_QR_SIZE,
  MAX_QR_SIZE,
  MIN_QR_SIZE,
  QR_CODE_GRADIENT_MODES
} from "./constants";
import type { QRCodeAppearance, QRCodeGradientMode } from "./types";

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

export function normalizeAppearance(appearance: QRCodeAppearance = {}): ResolvedAppearance {
  const gradientMode = appearance.gradient?.mode ?? defaultAppearance.gradient.mode;

  return {
    size: clampSize(appearance.size),
    logo: appearance.logo ?? defaultAppearance.logo,
    logoMargin: Number.isFinite(appearance.logoMargin)
      ? Number(appearance.logoMargin)
      : defaultAppearance.logoMargin,
    colors: {
      bg: appearance.colors?.bg ?? defaultAppearance.colors.bg,
      fg: appearance.colors?.fg ?? defaultAppearance.colors.fg,
      eyeFrame: appearance.colors?.eyeFrame ?? defaultAppearance.colors.eyeFrame,
      eyeCenter: appearance.colors?.eyeCenter ?? defaultAppearance.colors.eyeCenter,
      transparent: appearance.colors?.transparent ?? defaultAppearance.colors.transparent
    },
    gradient: {
      enabled: appearance.gradient?.enabled ?? defaultAppearance.gradient.enabled,
      start: appearance.gradient?.start ?? appearance.colors?.fg ?? defaultAppearance.gradient.start,
      end: appearance.gradient?.end ?? defaultAppearance.gradient.end,
      mode: QR_CODE_GRADIENT_MODES.includes(gradientMode) ? gradientMode : defaultAppearance.gradient.mode
    },
    shapes: {
      dots: appearance.shapes?.dots ?? defaultAppearance.shapes.dots,
      cornerSquare: appearance.shapes?.cornerSquare ?? defaultAppearance.shapes.cornerSquare,
      cornerDot: appearance.shapes?.cornerDot ?? defaultAppearance.shapes.cornerDot
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

export function getStylingOptions(data: string, appearance: QRCodeAppearance = {}) {
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
