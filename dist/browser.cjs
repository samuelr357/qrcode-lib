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

// src/browser.ts
var browser_exports = {};
__export(browser_exports, {
  createBrowserQRCode: () => createBrowserQRCode
});
module.exports = __toCommonJS(browser_exports);

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
function normalizeAppearance(appearance = {}) {
  const gradientMode = appearance.gradient?.mode ?? defaultAppearance.gradient.mode;
  return {
    size: clampSize(appearance.size),
    logo: appearance.logo ?? defaultAppearance.logo,
    logoMargin: Number.isFinite(appearance.logoMargin) ? Number(appearance.logoMargin) : defaultAppearance.logoMargin,
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

// src/browser.ts
async function loadBrowserQRCodeStyling() {
  const mod = await import("qr-code-styling");
  const ctor = mod.default ?? mod;
  if (typeof ctor !== "function") {
    throw new Error("Nao foi possivel carregar qr-code-styling no browser.");
  }
  return ctor;
}
function resolvePayload(content) {
  return buildQRCodePayload(content);
}
function resolveOptions(content, appearance) {
  return getStylingOptions(resolvePayload(content), appearance);
}
async function createBrowserQRCode(input) {
  const QRCodeStyling = await loadBrowserQRCodeStyling();
  const qrCode = new QRCodeStyling(resolveOptions(input.content, input.appearance));
  qrCode.append(input.element);
  return {
    update: ({ content, appearance }) => {
      qrCode.update(resolveOptions(content, appearance));
    },
    download: (fileName = "qr-code", extension = "png") => {
      qrCode.download({ name: fileName, extension });
    },
    getRawData: (extension = "png") => qrCode.getRawData(extension)
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createBrowserQRCode
});
