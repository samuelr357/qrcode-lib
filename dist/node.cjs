"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/node.ts
var node_exports = {};
__export(node_exports, {
  generateQRCodeBuffer: () => generateQRCodeBuffer,
  generateQrCodeBuffer: () => generateQrCodeBuffer
});
module.exports = __toCommonJS(node_exports);

// src/payload.ts
var trimValue = (value) => String(value ?? "").trim();
var escapeWifiValue = (value) => value.replace(/([\\;,:"])/g, "\\$1");
function buildQRCodePayload(input) {
  if (typeof input === "string") {
    return trimValue(input) || "https://seusite.com";
  }
  switch (input.type) {
    case "url":
      return trimValue(input.url) || "https://seusite.com";
    case "text":
      return trimValue(input.text) || "Ola!";
    case "location": {
      const lat = trimValue(input.lat);
      const lng = trimValue(input.lng);
      if (!lat || !lng) return "geo:-23.561684,-46.655981";
      return `geo:${lat},${lng}`;
    }
    case "phone": {
      const phone = trimValue(input.phone);
      return phone ? `tel:${phone}` : "tel:+5511900000000";
    }
    case "email": {
      const to = trimValue(input.email);
      const subject = encodeURIComponent(trimValue(input.subject));
      const body = encodeURIComponent(trimValue(input.body));
      if (!to) return "mailto:contato@email.com";
      const params = [];
      if (subject) params.push(`subject=${subject}`);
      if (body) params.push(`body=${body}`);
      return `mailto:${to}${params.length ? `?${params.join("&")}` : ""}`;
    }
    case "sms": {
      const phone = trimValue(input.phone);
      const body = trimValue(input.body);
      if (!phone) return "SMSTO:+5511900000000:Ola";
      return `SMSTO:${phone}:${body}`;
    }
    case "bitcoin": {
      const address = trimValue(input.address);
      const amount = trimValue(input.amount);
      if (!address) return "bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
      return amount ? `bitcoin:${address}?amount=${amount}` : `bitcoin:${address}`;
    }
    case "paypal": {
      const username = trimValue(input.username);
      const amount = trimValue(input.amount);
      const currency = trimValue(input.currency);
      if (!username) return "https://paypal.me/seunome";
      const base = amount ? `https://paypal.me/${username}/${amount}` : `https://paypal.me/${username}`;
      return currency ? `${base}?currency=${currency}` : base;
    }
    case "vcard": {
      const name = trimValue(input.name) || "Seu Nome";
      const organization = trimValue(input.organization);
      const phone = trimValue(input.phone);
      const email = trimValue(input.email);
      const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${name}`, `FN:${name}`];
      if (organization) lines.push(`ORG:${organization}`);
      if (phone) lines.push(`TEL:${phone}`);
      if (email) lines.push(`EMAIL:${email}`);
      lines.push("END:VCARD");
      return lines.join("\n");
    }
    case "whatsapp": {
      const phone = trimValue(input.phone);
      const message = encodeURIComponent(trimValue(input.message));
      if (!phone) return "https://wa.me/5511900000000";
      return message ? `https://wa.me/${phone}?text=${message}` : `https://wa.me/${phone}`;
    }
    case "wifi": {
      const ssid = trimValue(input.ssid);
      const password = trimValue(input.password);
      const authType = input.authType ?? "WPA";
      const hidden = Boolean(input.hidden);
      if (!ssid) return "WIFI:T:WPA;S:MinhaRede;P:senha;H:false;;";
      const auth = authType === "nopass" ? "nopass" : authType;
      const escapedSsid = escapeWifiValue(ssid);
      const escapedPass = escapeWifiValue(password);
      const parts = [`T:${auth}`, `S:${escapedSsid}`];
      if (auth !== "nopass" && escapedPass) {
        parts.push(`P:${escapedPass}`);
      }
      parts.push(`H:${hidden ? "true" : "false"}`);
      return `WIFI:${parts.join(";")};;`;
    }
    case "zoom":
      return trimValue(input.url) || "https://zoom.us/j/123456789";
    default:
      return "https://seusite.com";
  }
}

// src/constants.ts
var QR_CODE_GRADIENT_MODES = [
  "linear-0",
  "linear-45",
  "linear-90",
  "linear-135",
  "radial-center"
];
var DEFAULT_QR_SIZE = 1e3;
var MIN_QR_SIZE = 200;
var MAX_QR_SIZE = 2e3;
var DEFAULT_LOGO_MARGIN = 6;

// src/style.ts
var styleKeys = [
  "logoUrl",
  "logoPadding",
  "backgroundColor",
  "foregroundColor",
  "eyeOuterColor",
  "eyeInnerColor",
  "transparentBackground",
  "shape"
];
var defaultAppearance = {
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
var rotationMap = {
  "linear-0": 0,
  "linear-45": Math.PI / 4,
  "linear-90": Math.PI / 2,
  "linear-135": 3 * Math.PI / 4
};
function clampSize(size) {
  const raw = Number(size ?? DEFAULT_QR_SIZE);
  if (!Number.isFinite(raw)) return DEFAULT_QR_SIZE;
  return Math.min(MAX_QR_SIZE, Math.max(MIN_QR_SIZE, Math.round(raw)));
}
function isStyleInput(input) {
  return styleKeys.some((key) => key in input);
}
function toLegacyAppearance(style = {}) {
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
function normalizeAppearance(appearance = {}) {
  const normalizedInput = isStyleInput(appearance) ? toLegacyAppearance(appearance) : appearance;
  const gradientMode = normalizedInput.gradient?.mode ?? defaultAppearance.gradient.mode;
  return {
    size: clampSize(normalizedInput.size),
    logo: normalizedInput.logo ?? defaultAppearance.logo,
    logoMargin: Number.isFinite(normalizedInput.logoMargin) ? Number(normalizedInput.logoMargin) : defaultAppearance.logoMargin,
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
function getGradientConfig(mode, start, end) {
  const colorStops = [
    { offset: 0, color: start },
    { offset: 1, color: end }
  ];
  if (mode === "radial-center") {
    return {
      type: "radial",
      rotation: 0,
      colorStops
    };
  }
  return {
    type: "linear",
    rotation: rotationMap[mode],
    colorStops
  };
}
function getStylingOptions(data, appearance = {}) {
  const normalized = normalizeAppearance(appearance);
  const dotsOptions = normalized.gradient.enabled ? {
    type: normalized.shapes.dots,
    gradient: getGradientConfig(normalized.gradient.mode, normalized.gradient.start, normalized.gradient.end),
    color: void 0
  } : {
    color: normalized.colors.fg,
    type: normalized.shapes.dots,
    gradient: void 0
  };
  return {
    width: normalized.size,
    height: normalized.size,
    data,
    image: normalized.logo || void 0,
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
      crossOrigin: "anonymous"
    }
  };
}

// src/node.ts
async function loadNodeDeps() {
  const [qrCodeStylingMod, canvasMod, jsdomMod] = await Promise.all([
    import("qr-code-styling/lib/qr-code-styling.common.js"),
    import("canvas"),
    import("jsdom")
  ]);
  const ctor = qrCodeStylingMod.default ?? qrCodeStylingMod;
  if (typeof ctor !== "function") {
    throw new Error("Nao foi possivel carregar qr-code-styling no Node.js.");
  }
  const nodeCanvas = canvasMod.default ?? canvasMod;
  const JSDOM = jsdomMod.JSDOM;
  if (!JSDOM) {
    throw new Error("Dependencia jsdom nao encontrada. Instale: npm i jsdom");
  }
  return {
    QRCodeStyling: ctor,
    nodeCanvas,
    JSDOM
  };
}
async function toBuffer(value) {
  if (!value) {
    throw new Error("Falha ao gerar QR Code.");
  }
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    return value;
  }
  if (typeof Blob !== "undefined" && value instanceof Blob) {
    const arrayBuffer = await value.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  if (value && typeof value.arrayBuffer === "function") {
    const arrayBuffer = await value.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  throw new Error("Tipo de retorno nao suportado ao gerar QR Code.");
}
async function generateQRCodeBuffer(input) {
  const { QRCodeStyling, nodeCanvas, JSDOM } = await loadNodeDeps();
  const payload = buildQRCodePayload(input.content);
  const baseOptions = getStylingOptions(payload, input.style ?? input.appearance);
  const qrCode = new QRCodeStyling({
    ...baseOptions,
    nodeCanvas,
    jsdom: JSDOM
  });
  return toBuffer(await qrCode.getRawData(input.format ?? "png"));
}
var generateQrCodeBuffer = generateQRCodeBuffer;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateQRCodeBuffer,
  generateQrCodeBuffer
});
