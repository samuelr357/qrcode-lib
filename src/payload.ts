import type { QRCodePayloadInput } from "./types";

const trimValue = (value: unknown): string => String(value ?? "").trim();

const escapeWifiValue = (value: string): string => value.replace(/([\\;,:"])/g, "\\$1");

export function buildQRCodePayload(input: QRCodePayloadInput | string): string {
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
      const params: string[] = [];
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
