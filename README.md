<div align="center">
  <img src="src/lib/assets/favicon.svg" width="80" alt="NoTracer Logo">
  <h1>NoTracer</h1>
  <p><strong>Zero Tracking. Full Privacy.</strong></p>
</div>

---

NoTracer is a **privacy-first toolkit suite** that strips tracker garbage from URLs, converts images to WebP, and measures your connection speed — all without analytics.

## Módulos

| Module | Status | Description |
|--------|--------|-------------|
| LINK_PURGER | READY | Removes `utm_*`, `fbclid`, `gclid` and +50 tracking vectors |
| MEDIA_SHIFTER | READY | Converts JPEG/PNG to WebP, strips EXIF metadata |
| SPEED_TEST | READY | Measures bandwidth without third parties |
| GHOST_SEND | WIP | Ephemeral messages with encryption |
| SECURE_QR | WIP | QR codes with privacy relays |

## Características

- **Cyber-Terminal Aesthetic** — Minimalist, neon-green on black
- **Deep Clean Engine** — +50 tracking rules for Amazon, Meta, TikTok, MercadoLibre, AliExpress
- **Redis Cache** — Microsecond redirects via Upstash
- **Passwordless Auth** — Login/Register via email OTP
- **Bot-Shield** — Cloudflare Turnstile integrated
- **Zero Logs** — Aggressive TTL, metadata auto-incinerated

## Stack

- [SvelteKit 2](https://kit.svelte.dev/) — Full-stack framework
- [Svelte 5](https://svelte.dev/) — UI
- [Tailwind CSS 4](https://tailwindcss.com/) — Styles
- [Prisma](https://www.prisma.io/) — ORM (PostgreSQL/Neon)
- [Upstash Redis](https://upstash.com/) — Cache
- [Sharp](https://sharp.pics/) — Image processing
- [Vercel](https://vercel.com/) — Deployment

## Install

```bash
# Clone
git clone https://github.com/ariroy/notracer.git
cd notracer

# Install
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Build (generates Prisma Client)
npm run build

# Initialize DB
npx prisma db push

# Run
npm run dev
```

### Required Environment Variables

```env
# PostgreSQL (Neon)
DATABASE_URL="postgresql://..."

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://xxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxxxxx"

# Cloudflare Turnstile
PUBLIC_TURNSTILE_SITE_KEY="0x4AAAAAA..."
TURNSTILE_SECRET_KEY="0x4AAAAAA..."

# Optional: Email SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="your@email.com"
SMTP_PASS="password"
```

## Deploy to Vercel

1. Import repository in Vercel
2. Configure Environment Variables
3. Automatic deploy

NoTracer uses `@sveltejs/adapter-vercel` with SSR and Edge Functions.

## Links

- **Web**: [notracer.com](https://notracer.com)
- **Docs**: [docs/README.md](./docs/README.md)
- **Email**: hello@notracer.com

## License

MIT — Share the content. Not your data.

---

> // Zero Tracking. Full Privacy.