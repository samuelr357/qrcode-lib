# qrcode-lib

Biblioteca TypeScript para gerar QR Codes estilizados com os mesmos recursos do frontend original.

## Recursos

- Tipos de conteudo: `url`, `text`, `location`, `phone`, `email`, `sms`, `bitcoin`, `paypal`, `vcard`, `whatsapp`, `wifi`, `zoom`
- Estilo completo: tamanho, formas, cor de fundo, cor principal, cor de olho (moldura/centro), fundo transparente
- Gradiente no corpo do QR: `linear-0`, `linear-45`, `linear-90`, `linear-135`, `radial-center`
- Logo central e margem da logo
- Saida em `png` e `svg`
- API para Node.js, browser e Next.js

## Instalacao

```bash
npm i @samuel/qrcode-lib qr-code-styling
```

Para usar no Node.js (gerar Buffer):

```bash
npm i canvas jsdom
```

## Mostrar opcoes disponiveis

Use `getQRCodeOptionsCatalog()` antes de gerar para listar dinamicamente tudo que o usuario pode escolher.

```ts
import { getQRCodeOptionsCatalog } from "@samuel/qrcode-lib";

const options = getQRCodeOptionsCatalog();

console.log(options.contentTypes);
console.log(options.dotsShapes);
console.log(options.cornerSquareShapes);
console.log(options.cornerDotShapes);
console.log(options.gradientModes);
console.log(options.outputFormats);
console.log(options.wifiAuthTypes);
console.log(options.limits);
```

## API compartilhada

Importe do pacote raiz para funcoes comuns:

```ts
import {
  buildQRCodePayload,
  getQRCodeOptionsCatalog,
  normalizeAppearance,
  getStylingOptions
} from "@samuel/qrcode-lib";
```

## Node.js / Next.js server

Importe do subpath `@samuel/qrcode-lib/node`.

```ts
import { writeFileSync } from "node:fs";
import { generateQRCodeBuffer } from "@samuel/qrcode-lib/node";

const buffer = await generateQRCodeBuffer({
  format: "png",
  content: {
    type: "url",
    url: "https://exemplo.com"
  },
  appearance: {
    size: 1000,
    colors: {
      bg: "#FFFFFF",
      fg: "#0B0F1A",
      eyeFrame: "#0B0F1A",
      eyeCenter: "#0B0F1A",
      transparent: false
    },
    gradient: {
      enabled: true,
      start: "#0B0F1A",
      end: "#1F6FEB",
      mode: "linear-45"
    },
    shapes: {
      dots: "rounded",
      cornerSquare: "extra-rounded",
      cornerDot: "dot"
    },
    logoMargin: 6
  }
});

writeFileSync("./qr.png", buffer);
```

## Browser / Next.js client

Importe do subpath `@samuel/qrcode-lib/browser` e use apenas em Client Components.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { createBrowserQRCode } from "@samuel/qrcode-lib/browser";

export default function QrPreview() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!ref.current) return;

      const qr = await createBrowserQRCode({
        element: ref.current,
        content: { type: "whatsapp", phone: "5511900000000", message: "Ola" },
        appearance: {
          size: 800,
          gradient: { enabled: true, mode: "radial-center", start: "#111827", end: "#2563EB" },
          shapes: { dots: "classy-rounded", cornerSquare: "dot", cornerDot: "dot" }
        }
      });

      if (!mounted) return;

      qr.update({
        content: { type: "url", url: "https://meusite.com" },
        appearance: { size: 1000 }
      });

      qr.download("meu-qr", "png");
    }

    run();

    return () => {
      mounted = false;
    };
  }, []);

  return <div ref={ref} />;
}
```

## Tipos de conteudo

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

Todos mantem o mesmo comportamento/default do frontend legado.

## Opcoes de estilo

`appearance` aceita:

- `size`: numero entre `200` e `2000` (clamp automatico)
- `logo`: URL/data URL da imagem
- `logoMargin`: margem da logo
- `colors.bg`: cor de fundo
- `colors.fg`: cor do corpo do QR
- `colors.eyeFrame`: cor da moldura do olho
- `colors.eyeCenter`: cor do centro do olho
- `colors.transparent`: fundo transparente
- `gradient.enabled`: habilita gradiente no corpo do QR
- `gradient.start`: cor inicial do gradiente
- `gradient.end`: cor final do gradiente
- `gradient.mode`: `linear-0 | linear-45 | linear-90 | linear-135 | radial-center`
- `shapes.dots`: `square | rounded | dots | classy | classy-rounded | extra-rounded`
- `shapes.cornerSquare`: `square | dot | extra-rounded`
- `shapes.cornerDot`: `square | dot`

## Scripts

```bash
npm run typecheck
npm run build
```

## Publicacao

Ajuste `name`, `author` e `version` no `package.json` antes de publicar no npm.
