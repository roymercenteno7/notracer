<div align="center">
  <img src="src/lib/assets/favicon.svg" width="80" alt="NoTracer Logo">
  <h1>NoTracer</h1>
  <p><strong>Zero Tracking. Full Privacy.</strong></p>
</div>

---

NoTracer es una **suite de herramientas de privacidad técnica**. Elimina rastreadores de URLs, convierte imágenes a WebP y mide tu velocidad de conexión sin analíticas.

## 🛡️ Módulos

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| LINK_PURGER | ✅ | Elimina `utm_*`, `fbclid`, `gclid` y +50 vectores de tracking |
| MEDIA_SHIFTER | ✅ | Convierte JPEG/PNG a WebP, elimina metadatos EXIF |
| SPEED_TEST | ✅ | Mide ancho de banda sin terceros |
| GHOST_SEND | 🔲 WIP | Mensajes efímeros con encriptación |
| SECURE_QR | 🔲 WIP | Códigos QR con relevos de privacidad |

## ⚡ Características

- **Estética Cyber-Terminal** — Minimalista, verde neón sobre negro
- **Deep Clean Engine** — +50 reglas de rastreo para Amazon, Meta, TikTok, MercadoLibre, AliExpress
- **Cacheo Redis** — Redirecciones en microsegundos via Upstash
- **Autenticación Sin Password** — Login/Registro via OTP email
- **Bot-Shield** — Cloudflare Turnstile integrado
- **Zero Logs** — TTL agresivo, metadatos se incineran automáticamente

## 🛠 Stack

- [SvelteKit 2](https://kit.svelte.dev/) — Full-stack framework
- [Svelte 5](https://svelte.dev/) — UI
- [Tailwind CSS 4](https://tailwindcss.com/) — Estilos
- [Prisma](https://www.prisma.io/) — ORM (PostgreSQL/Neon)
- [Upstash Redis](https://upstash.com/) — Cache
- [Sharp](https://sharp.pics/) — Procesamiento de imágenes
- [Vercel](https://vercel.com/) — Despliegue

## 🚀 Instalación Local

```bash
# Clonar
git clone https://github.com/roymercenteno7/notracer.git
cd notracer

# Instalar
npm install

# Configurar entorno
cp .env.example .env
# Edita .env con tus credenciales

# Build (genera Prisma Client)
npm run build

# Inicializar DB
npx prisma db push

# Ejecutar
npm run dev
```

### Variables Requeridas

```env
# PostgreSQL (Neon)
DATABASE_URL="postgresql://..."

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://xxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxxxxx"

# Opcional: Email SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="tu@email.com"
SMTP_PASS="password"
```

## ☁️ Despliegue en Vercel

1. Importa el repositorio en Vercel
2. Configura las Environment Variables
3. Deploy automático

NoTracer usa `@sveltejs/adapter-vercel` con SSR y Edge Functions.

## 🌐 Links

- **Web**: [notracer.com](https://notracer.com)
- **Docs**: [docs/README.md](./docs/README.md)
- **Email**: hello@notracer.com

## 📜 Licencia

MIT — Comparte el contenido. No tus datos.

---

> // Zero Tracking. Full Privacy.