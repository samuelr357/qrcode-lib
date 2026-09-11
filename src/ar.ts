import { getStylingOptions, normalizeAppearance } from "./style";
import type {
  QRCodeAppearanceInput,
  QRCodeARProfile,
  QRCodeARValidationResult,
  QRCodeReadbackResult,
  QRCodeValidationIssue
} from "./types";

const DEFAULT_MIN_CONTRAST = 4.5;
const DEFAULT_MIN_PHYSICAL_MM = 50;
const DEFAULT_MAX_LOGO_RATIO = 0.3;
const DEFAULT_SAFE_QUIET_ZONE_RATIO = 0.05;
const DEFAULT_MIN_QUIET_ZONE_PX = 16;

interface RGB {
  r: number;
  g: number;
  b: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function parseColor(value: string): RGB | null {
  const color = value.trim().toLowerCase();

  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return {
      r: parseInt(color[1] + color[1], 16),
      g: parseInt(color[2] + color[2], 16),
      b: parseInt(color[3] + color[3], 16)
    };
  }

  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return {
      r: parseInt(color.slice(1, 3), 16),
      g: parseInt(color.slice(3, 5), 16),
      b: parseInt(color.slice(5, 7), 16)
    };
  }

  const rgb = color.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
  if (!rgb) return null;

  return {
    r: clamp(Number(rgb[1]), 0, 255),
    g: clamp(Number(rgb[2]), 0, 255),
    b: clamp(Number(rgb[3]), 0, 255)
  };
}

function channelLuminance(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(rgb: RGB): number {
  return 0.2126 * channelLuminance(rgb.r) + 0.7152 * channelLuminance(rgb.g) + 0.0722 * channelLuminance(rgb.b);
}

export function getColorContrastRatio(foreground: string, background: string): number | null {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  if (!fg || !bg) return null;

  const lighter = Math.max(luminance(fg), luminance(bg));
  const darker = Math.min(luminance(fg), luminance(bg));
  return (lighter + 0.05) / (darker + 0.05);
}

function getPhysicalDimensions(profile: QRCodeARProfile) {
  const fallback = Number(profile.physicalSizeMm);
  const width = Number(profile.physicalWidthMm ?? fallback);
  const height = Number(profile.physicalHeightMm ?? fallback);
  return { width, height };
}

function getSafeQuietZonePx(size: number): number {
  return Math.max(DEFAULT_MIN_QUIET_ZONE_PX, Math.ceil(size * DEFAULT_SAFE_QUIET_ZONE_RATIO));
}

function pushIssue(
  issues: QRCodeValidationIssue[],
  code: QRCodeValidationIssue["code"],
  severity: QRCodeValidationIssue["severity"],
  message: string,
  value?: number | string | boolean
) {
  issues.push({ code, severity, message, value });
}

export function validateQRCodeForAR(input: {
  profile: QRCodeARProfile;
  style?: QRCodeAppearanceInput;
}): QRCodeARValidationResult {
  const { profile } = input;
  const normalized = normalizeAppearance(input.style);
  const issues: QRCodeValidationIssue[] = [];
  const minContrast = profile.minimumContrastRatio ?? DEFAULT_MIN_CONTRAST;
  const minPhysicalMm = profile.minimumPhysicalSizeMm ?? DEFAULT_MIN_PHYSICAL_MM;
  const maxLogoRatio = profile.maximumLogoRatio ?? DEFAULT_MAX_LOGO_RATIO;
  const { width, height } = getPhysicalDimensions(profile);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    pushIssue(issues, "physical-size-invalid", "error", "As dimensoes fisicas do QR devem ser maiores que zero.");
  } else if (Math.min(width, height) < minPhysicalMm) {
    pushIssue(
      issues,
      "physical-size-small",
      "error",
      `Para o perfil AR, o menor lado do QR deve ter pelo menos ${minPhysicalMm} mm.`,
      Math.min(width, height)
    );
  } else if (Math.min(width, height) < Math.max(75, minPhysicalMm)) {
    pushIssue(
      issues,
      "physical-size-borderline",
      "warning",
      "O QR esta dentro do limite minimo, mas um tamanho fisico maior melhora a aquisicao de pose a distancia.",
      Math.min(width, height)
    );
  }

  const background = normalized.colors.bg;
  const foregroundCandidates = normalized.gradient.enabled
    ? [normalized.gradient.start, normalized.gradient.end, normalized.colors.eyeFrame, normalized.colors.eyeCenter]
    : [normalized.colors.fg, normalized.colors.eyeFrame, normalized.colors.eyeCenter];

  let minimumMeasuredContrast: number | null = null;
  if (normalized.colors.transparent) {
    pushIssue(
      issues,
      "transparent-background",
      "warning",
      "Fundo transparente nao garante contraste depois da impressao; prefira um fundo solido para marcadores AR."
    );
  } else {
    for (const color of foregroundCandidates) {
      const ratio = getColorContrastRatio(color, background);
      if (ratio === null) {
        pushIssue(
          issues,
          "unsupported-color-format",
          "warning",
          `Nao foi possivel calcular contraste para a cor ${color}.`,
          color
        );
        continue;
      }
      minimumMeasuredContrast = minimumMeasuredContrast === null ? ratio : Math.min(minimumMeasuredContrast, ratio);
    }

    if (profile.minimumContrast !== false && minimumMeasuredContrast !== null) {
      if (minimumMeasuredContrast < 3) {
        pushIssue(
          issues,
          "contrast-invalid",
          "error",
          "O contraste do QR e insuficiente para uso confiavel como marcador AR.",
          Number(minimumMeasuredContrast.toFixed(2))
        );
      } else if (minimumMeasuredContrast < minContrast) {
        pushIssue(
          issues,
          "contrast-low",
          "warning",
          `O contraste esta abaixo da meta de ${minContrast}:1.`,
          Number(minimumMeasuredContrast.toFixed(2))
        );
      }
    }
  }

  const logoRatio = normalized.logo ? normalized.logoSizeRatio ?? 0.4 : 0;
  if (normalized.logo && logoRatio > maxLogoRatio) {
    pushIssue(
      issues,
      "logo-too-large",
      logoRatio >= 0.4 ? "error" : "warning",
      `A logo ocupa uma area central grande demais para o perfil AR. Limite recomendado: ${Math.round(maxLogoRatio * 100)}%.`,
      logoRatio
    );
  }

  const requiredQuietZone = getSafeQuietZonePx(normalized.size);
  if (profile.enforceQuietZone !== false && normalized.quietZonePx < requiredQuietZone) {
    pushIssue(
      issues,
      "quiet-zone-will-be-enforced",
      "warning",
      `A quiet zone configurada sera elevada para ${requiredQuietZone}px durante a geracao AR.`,
      normalized.quietZonePx
    );
  }

  if (normalized.gradient.enabled && normalized.shapes.dots === "dots") {
    pushIssue(
      issues,
      "complex-style",
      "warning",
      "Gradiente combinado com corpo em pontos aumenta o risco de leitura em angulos obliquos."
    );
  }

  const hasError = issues.some((issue) => issue.severity === "error");
  const hasWarning = issues.some((issue) => issue.severity === "warning");

  let quality: QRCodeARValidationResult["quality"];
  if (hasError) {
    quality = "invalid";
  } else if (hasWarning) {
    quality = "risky";
  } else if (
    (minimumMeasuredContrast ?? minContrast) >= 7 &&
    Math.min(width, height) >= 75 &&
    logoRatio <= 0.2
  ) {
    quality = "excellent";
  } else {
    quality = "good";
  }

  return {
    quality,
    valid: !hasError,
    issues,
    metrics: {
      contrastRatio: minimumMeasuredContrast === null ? null : Number(minimumMeasuredContrast.toFixed(2)),
      physicalWidthMm: Number.isFinite(width) ? width : null,
      physicalHeightMm: Number.isFinite(height) ? height : null,
      logoSizeRatio: logoRatio,
      requiredQuietZonePx: requiredQuietZone
    }
  };
}

export function getARStylingOptions(
  data: string,
  style: QRCodeAppearanceInput | undefined,
  profile: QRCodeARProfile
) {
  const options = getStylingOptions(data, style);
  if (profile.enforceQuietZone === false) return options;

  const normalized = normalizeAppearance(style);
  return {
    ...options,
    margin: Math.max(normalized.quietZonePx, getSafeQuietZonePx(normalized.size))
  };
}

export function validateQRCodeReadback(input: {
  expectedPayload: string;
  decodedPayload: string | null | undefined;
}): QRCodeReadbackResult {
  const decodedPayload = input.decodedPayload?.trim() || null;
  const expectedPayload = input.expectedPayload.trim();

  if (!decodedPayload) {
    return {
      readable: false,
      matches: false,
      expectedPayload,
      decodedPayload: null,
      error: "generated-qr-unreadable"
    };
  }

  return {
    readable: true,
    matches: decodedPayload === expectedPayload,
    expectedPayload,
    decodedPayload,
    error: decodedPayload === expectedPayload ? null : "generated-qr-payload-mismatch"
  };
}
