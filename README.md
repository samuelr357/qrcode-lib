# qrcode-lib

Biblioteca TypeScript para geração de QR Codes estilizados em Browser, Next.js e Node.js.

## Funcionalidades

- Geração de QR em `png` e `svg`
- API para Browser (`createQrCode`) e Node (`generateQrCodeBuffer`)
- Suporte a 12 tipos de conteúdo: `url`, `text`, `location`, `phone`, `email`, `sms`, `bitcoin`, `paypal`, `vcard`, `whatsapp`, `wifi`, `zoom`
- Personalização completa de estilo: tamanho, formas, cores, gradiente, fundo transparente e logo central
- Catálogo de opções em runtime via `getQRCodeOptionsCatalog()`

## Requisitos

- Node.js `>= 18.18.0`

## Instalação

```bash
npm install @samuel/qrcode-lib qr-code-styling
```

Para geração no servidor (Node):

```bash
npm install canvas jsdom
```

## Estrutura de imports

- API compartilhada: `@samuel/qrcode-lib`
- Browser/Client: `@samuel/qrcode-lib/browser`
- Node/Server: `@samuel/qrcode-lib/node`

## Guia rápido

### Browser / Next.js Client Component

```tsx
"use client";

import { useEffect, useRef } from "react";
import { createQrCode } from "@samuel/qrcode-lib/browser";

export default function QrPreview() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    async function run() {
      const qr = await createQrCode({
        element: ref.current!,
        content: { type: "url", url: "https://example.com" },
        style: {
          size: 400,
          foregroundColor: "#0B0F1A",
          backgroundColor: "#FFFFFF",
          shape: { body: "rounded", eyeOuter: "extra-rounded", eyeInner: "dot" },
          gradient: { enabled: true, from: "#1F6FEB", to: "#0B0F1A", style: "radial-center" }
        }
      });

      qr.download("qr-code", "png");
    }

    run();
  }, []);

  return <div ref={ref} />;
}
```

### Node.js / Server

```ts
import { writeFileSync } from "node:fs";
import { generateQrCodeBuffer } from "@samuel/qrcode-lib/node";

const buffer = await generateQrCodeBuffer({
  format: "png",
  content: { type: "url", url: "https://example.com" },
  style: {
    size: 1000,
    foregroundColor: "#0B0F1A",
    backgroundColor: "#FFFFFF",
    shape: { body: "rounded", eyeOuter: "extra-rounded", eyeInner: "dot" }
  }
});

writeFileSync("./qr.png", buffer);
```

## API

### `createQrCode(input)` (Browser)

Alias de `createBrowserQRCode`.

Parâmetros:

- `element: HTMLElement` container do QR
- `content: QRCodePayloadInput | string`
- `style?: QRCodeStyle` formato recomendado
- `appearance?: QRCodeAppearance` formato legado (compatível)

Retorno:

- `update({ content, style?, appearance? })`
- `download(fileName?, extension?)`
- `getRawData(extension?)`

### `generateQrCodeBuffer(input)` (Node)

Alias de `generateQRCodeBuffer`.

Parâmetros:

- `content: QRCodePayloadInput | string`
- `format?: "png" | "svg"` (padrão: `"png"`)
- `style?: QRCodeStyle` formato recomendado
- `appearance?: QRCodeAppearance` formato legado (compatível)

Retorno:

- `Promise<Buffer>`

### `buildQRCodePayload(input)`

Gera a string final do payload a partir do objeto tipado.

### `getQRCodeOptionsCatalog()`

Retorna lista de opções suportadas:

- tipos de conteúdo
- formas do corpo e olhos
- modos de gradiente
- formatos de saída
- limites de tamanho e margens padrão

## Configuração de estilo

### Formato recomendado: `style`

```ts
type QRCodeStyle = {
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
    style?: "linear-0" | "linear-45" | "linear-90" | "linear-135" | "radial-center";
  };
  shape?: {
    body?: "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
    eyeOuter?: "square" | "dot" | "extra-rounded";
    eyeInner?: "square" | "dot";
  };
}
```

### Formato legado: `appearance` (compatibilidade)

O formato antigo permanece suportado para evitar quebra de integração.

## Tipos de conteúdo

- `url`: `{ type: "url", url }`
- `text`: `{ type: "text", text }`
- `location`: `{ type: "location", lat, lng }`
- `phone`: `{ type: "phone", phone }`
- `email`: `{ type: "email", email, subject, body }`
- `sms`: `{ type: "sms", phone, body }`
- `bitcoin`: `{ type: "bitcoin", address, amount }`
- `paypal`: `{ type: "paypal", username, amount, currency }`
- `vcard`: `{ type: "vcard", name, organization, phone, email }`
- `whatsapp`: `{ type: "whatsapp", phone, message }`
- `wifi`: `{ type: "wifi", ssid, password, authType, hidden }`
- `zoom`: `{ type: "zoom", url }`

## Exemplo prático

```ts
await createQrCode({
  element: qrContainerRef.current!,
  content: { type: "url", url: window.location.href },
  style: {
    size: 400,
    logoUrl: "/logo/logo.svg",
    logoPadding: 6,
    foregroundColor: "#0B0F1A",
    backgroundColor: "#FFFFFF",
    eyeOuterColor: "#0B0F1A",
    eyeInnerColor: "#0B0F1A",
    transparentBackground: false,
    gradient: {
      enabled: true,
      from: "#1F6FEB",
      to: "#0B0F1A",
      style: "radial-center"
    },
    shape: {
      body: "rounded",
      eyeOuter: "extra-rounded",
      eyeInner: "dot"
    }
  }
});
```

## Desenvolvimento

```bash
npm run typecheck
npm run build
```
