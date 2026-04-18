# NoTracer - Documentación Técnica Completa

## Índice

1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Módulos y Funcionalidades](#módulos-y-funcionalidades)
6. [Instalación Local](#instalación-local)
7. [Variables de Entorno](#variables-de-entorno)
8. [Despliegue en Vercel](#despliegue-en-vercel)
9. [API Endpoints](#api-endpoints)
10. [Extensión de Navegador](#extensión-de-navegador)
11. [Resolución de Problemas](#resolución-de-problemas)
12. [Glosario](#glosario)

---

## Visión General

**NoTracer** es una suite de herramientas de privacidad técnica diseñada para eliminar rastro digital de las actividades en línea. El proyecto nació como respuesta directa a la monetización de metadatos en internet.

### Propósito

- **Limpiar URLs** de parámetros de rastreo (`utm_*`, `fbclid`, `gclid`, etc.)
- **Convertir imágenes** a formato WebP para reducir tamaño y eliminar metadatos EXIF
- **Test de velocidad** sin analíticas ni terceros
- **Gestión de enlaces** con cacheo en Redis

### Estado Actual

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| LINK_PURGER | ✅ Operativo | Limpiador de URLs |
| MEDIA_SHIFTER | ✅ Operativo | Convertidor a WebP |
| SPEED_TEST | ✅ Operativo | Test de velocidad |
| GHOST_SEND | 🔲 WIP | Mensajes efímeros |
| SECURE_QR | 🔲 WIP | QR con privacidad |

---

## Stack Tecnológico

| Tecnología | Propósito | Versión |
|------------|----------|--------|
| **SvelteKit 2** | Framework full-stack | ^2.50.2 |
| **Svelte 5** | UI Framework | ^5.51.0 |
| **PostgreSQL** | Base de datos | Neon |
| **Prisma 6** | ORM | 6.4.1 |
| **Redis** | Cache/cola | Upstash |
| **Tailwind CSS 4** | Estilos | ^4.1.18 |
| **Sharp** | Procesamiento de imágenes | ^0.34.5 |
| **Vercel** | Despliegue | - |

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  (SvelteKit + Svelte 5 + Tailwind CSS 4)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ LINK_PURGER  │  │MEDIA_SHIFTER│  │ SPEED_TEST  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                        BACKEND                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Vercel Serverless Functions              │    │
│  │                                                     │    │
│  │  +── Routes API (Node.js runtime)                   │    │
│  │  +── Pages (SSR + hydration)                        │    │
│  │  +── Edge Functions (selectos endpoints)       │    │
│  └──────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │ Prisma ORM │ ←→ │ PostgreSQL │    │  Upstash  │      │
│  │           │    │  (Neon)  │    │  Redis   │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario** →请求 → **SvelteKit** (SSR/Edge)
2. **SvelteKit** valida y procesa
3. **Redis** (Upstash) → Cache rápido
4. **PostgreSQL** (Neon) → Persistencia
5. **Respuesta** → Usuario

---

## Estructura del Proyecto

```
notracer/
├── docs/                          # Documentación
├── extension/                     # Extensión Chrome/Firefox
│   ├── manifest.json              # Manifest v3
│   ├── icons/                  # Íconos
│   └── scripts/                # Service Worker + Content Scripts
├── prisma/
│   └── schema.prisma           # Modelos de datos
├── scripts/
│   └── diagnostic.ts          # Scripts de diagnóstico
├── src/
│   ├── lib/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── data/            # Posts del blog
│   │   ├── i18n/           # Internacionalización
│   │   ├── server/          # utilities del servidor
│   │   │   ├── cleaner.ts   # Motor de limpieza de URLs
│   │   │   ├── db.ts       # Prisma Client
│   │   │   ├── email.ts     # Envío de emails
│   │   │   └── redis.ts    # Upstash Redis
│   │   └── index.ts         # Exports públicos
│   ├── routes/
│   │   ├── api/            # Endpoints API
│   │   │   ├── convert/    # Conversión WebP
│   │   │   ├── links/     # Creación de enlaces
│   │   │   └── speedtest/  # Test de velocidad
│   │   ├── [...slug]/      # Redirección de enlaces
│   │   ├── about/         # Acerca de
│   │   ├── blog/         # Blog
│   │   ├── dashboard/    # Panel de usuario
│   │   ├── link/         # LINK_PURGER UI
│   │   ├── login/        # Login OTP
│   │   ├── media/       # MEDIA_SHIFTER UI
│   │   ├── register/    # Registro OTP
│   │   ├── speedtest/    # SPEED_TEST UI
│   │   └── ...
│   ├── app.d.ts           # Tipos de SvelteKit
│   ├── hooks.server.ts    # Hooks del servidor
│   └── app.html         # HTML base
├── static/                     # Archivos estáticos
├── package.json
├── svelte.config.js          # Config de SvelteKit
├── vite.config.ts             # Config de Vite
├── vercel.json               # Config de Vercel
└── tsconfig.json
```

---

## Módulos y Funcionalidades

### M-01: LINK_PURGER

Elimina parámetros de rastreo de URLs.

**Sitios soportados:**
- Amazon (`ref`, `pd_rd_*`)
- Facebook/Meta (`mibextid`, `igsh`)
- Instagram (`mibextid`, `igsh`)
- YouTube (`si`, `pp`, `feature`)
- TikTok (`_r`, `_t`, `ttclid`)
- Twitter/X (`t`, `s`, `ref_src`)
- MercadoLibre (`tracking_id`, `component_id`)
- AliExpress (`_ppc`, `pvid`, `btsid`)
- LinkedIn (`trackingid`, `lipi`)
- Google Analytics (`_ga`, `_gl`)
- Spotify (`si`, `context`)

**Parámetros globales eliminados:**
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- `utm_id`, `utm_source_platform`, `utm_creative_format`
- `fbclid`, `gclid`, `gclsrc`, `dclid`, `msclkid`
- `wbraid`, `gbraid`, `mc_eid`

### M-02: MEDIA_SHIFTER

Convierte imágenes JPEG/PNG a WebP.

**Características:**
- Calidad: 90%
- Tamaño máximo: 10MB
- Procesamiento en memoria (no se almacena)
- Batch processing

### M-05: SPEED_TEST

Mide ancho de banda sin terceros.

**Métricas:**
- Latencia (ping)
- Download
- Upload

---

## Instalación Local

```bash
# 1. Clonar repositorio
git clone https://github.com/roymercenteno7/notracer.git
cd notracer

# 2. Instalar dependencias
npm install

# 3. Configurar entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Generar Prisma Client
npm run build
# o: npx prisma generate

# 5. Inicializar base de datos
npx prisma db push

# 6. Ejecutar en desarrollo
npm run dev
```

### Requisitos

- Node.js 18+
- PostgreSQL (Neon o local)
- Redis (Upstash)
- SMTP para emails (Gmail, Resend, etc.)

---

## Variables de Entorno

### Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|--------|
| `DATABASE_URL` | PostgreSQL de Neon | `postgresql://...` |
| `UPSTASH_REDIS_REST_URL` | URL de Upstash | `https://....upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Token de Upstash | `AX...` |

### Opcionales

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PUBLIC_BETA` | Registro público | `true` |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile | - |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile | - |
| `SMTP_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Puerto SMTP | `465` |
| `SMTP_USER` | Usuario SMTP | - |
| `SMTP_PASS` | Contraseña SMTP | - |

### Archivo `.env` de ejemplo

```env
# DATABASE (Neon)
DATABASE_URL="postgresql://user:password@host.neon.tech/db?sslmode=require"

# REDIS (Upstash)
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxxxxx"

# SEGURIDAD
PUBLIC_BETA="true"
PUBLIC_TURNSTILE_SITE_KEY="0xxxxxx"
TURNSTILE_SECRET_KEY="0xxxxx"

# EMAIL (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="tu@email.com"
SMTP_PASS="tu_password"

# ENTORNO
NODE_ENV="development"
```

---

## Despliegue en Vercel

### Pasos

1. **Importar repositorio** en Vercel
2. **Configurar variables** de entorno en Settings > Environment Variables
3. **Framework** detectado automáticamente: SvelteKit
4. **Build Command**: `npm run build`
5. **Output Directory**: `.svelte-kit/output`

### Runtimes

| Endpoint | Runtime | Nota |
|----------|---------|------|
| `/api/convert` | `nodejs` | Requiere binaries nativos (Sharp) |
| `/api/links/*` | Edge | Por defecto |
| `/[...slug]` | Edge | Redirect rápido |
| `/speedtest/*` | Edge | Por defecto |

### cold start

El endpoint `/api/convert` tiene `runtime: 'nodejs'` para soportar Sharp. Esto aumenta el cold start time pero garantiza funcionamiento correcto.

---

## API Endpoints

### POST /api/convert

Convierte imágenes a WebP.

**Request:**
```
POST /api/convert
Content-Type: multipart/form-data

images: File (JPEG/PNG, máx 10MB)
```

**Response:**
```json
{
  "success": true,
  "isBatch": false,
  "results": {
    "original": {
      "size": 102400,
      "width": 1920,
      "height": 1080,
      "type": "image/jpeg",
      "name": "foto.jpg"
    },
    "converted": {
      "size": 45321,
      "dataUrl": "data:image/webp;base64,...",
      "format": "webp"
    },
    "savings": 55.7
  }
}
```

### POST /api/links/create

Crea un enlace limpio (requiere auth).

**Headers:**
```
Cookie: session=<session_id>
```

**Request:**
```json
{
  "url": "https://amazon.com/product?q=1&utm_source=facebook",
  "customSlug": "mi-producto"
}
```

**Response:**
```json
{
  "success": true,
  "slug": "mi-producto",
  "cleanedUrl": "https://amazon.com/product?q=1",
  "shortlink": "https://notracer.com/mi-producto"
}
```

### GET /[slug]

Redirecciona a URL limpia.

- Query Redis primero
- Fallback a PostgreSQL
- Incrementa contador de clicks
- Redirección 301 (permanente)

### GET /api/speedtest/ping

Test de latencia.

**Response:**
```json
{
  "timestamp": 1234567890,
  "pong": true
}
```

### POST /api/speedtest/download

Test de download.

**Response:**
- Chunk de datos aleatorios

### POST /api/speedtest/upload

Test de upload.

**Request:**
- Datos aleatorios (丢弃)

---

## Extensión de Navegador

### INSTALACIÓN MANUAL

1. Descargar/clonar el proyecto
2. Abrir `chrome://extensions`
3. Activar **Developer mode**
4. Click **Load unpacked**
5. Seleccionar carpeta `extension/`

### FUNCIONALIDADES

- **Sentinela** (content script)
  - Detecta enlaces con tracking en páginas
  - Muestra indicador visual
  - Limpia al hacer click

- **Background** (service worker)
  - Maneja mensajes
  - Consulta API de limpieza

### ARCHIVOS

| Archivo | Propósito |
|---------|------------|
| `manifest.json` | Configuración MV3 |
| `scripts/background.js` | Service Worker |
| `scripts/sentinela.js` | Content Script |
| `styles/sentinela.css` | Estilos del indicador |

### Permisos

```json
{
  "permissions": ["storage", "cookies"],
  "host_permissions": [
    "https://notracer.com/*",
    "*://*/*"
  ]
}
```

---

## Resolución de Problemas

### WebP Conversion No Funciona

**Síntoma:** Error 500 al convertir imágenes.

**Causa:** El endpoint corre en Edge runtime.

**Solución:**
```typescript
// src/routes/api/convert/+server.ts
export const config = {
    runtime: 'nodejs'
};
```

### Error de Conexión a Redis

**Síntoma:** `ECONNREFUSED` o timeout.

**Causas:**
1. Variables de entorno incorrectas
2. Redis inactivo
3. Rate limit excedido

**Solución:**
1. Verificar `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`
2. Revisar consola de Upstash
3. Implementar retry logic

### Error de Prisma en Producción

**Síntoma:** `prisma client not found`

**Solución:**
```bash
npm run build
# o
npx prisma generate
```

El script `postinstall` en `package.json` lo hace automáticamente.

### Sesión No Persiste

**Síntoma:** Login funciona pero no guarda sesión.

**Causas:**
1. Redis no guarda la sesión
2. Cookie mal configurada
3. Dominio diferente

**Solución:**
```typescript
// Verificar que Redis guarda la sesión
await redis.set(`notracer:session:${sessionId}`, userId, { ex: 2592000 });
```

### Images No Cargan en Media Shifter

**Síntoma:** Preview no muestra.

**Causa:** Tamaño de archivo > 10MB o tipo no soportado.

**Solución:**
- Verificar tipo: JPEG o PNG
- Verificar tamaño: < 10MB

---

## Glosario

| Término | Definición |
|---------|-----------|
| **ASIN** | Amazon Standard Identification Number |
| **cleaner.ts** | Motor de limpieza de URLs |
| **edge** | Runtime liviano de Vercel |
| **nodejs** | Runtime completo de Node.js |
| **OTT** | One-Time Token (código efímero) |
| **OTP** | One-Time Password |
| **Redis** | Base de datos en memoria |
| **slug** | Identificador corto de URL |
| **TTL** | Time To Live (expiración) |
| **utm_** |Urchin Tracking Module (parámetros) |
| **WebP** | Formato de imagen moderno |

---

## Más Información

- ** repo **: https://github.com/roymercenteno7/notracer
- ** Web **: https://notracer.com
- ** Email **: hello@notracer.com

---

> // COMPARTELO: EL CONTENIDO. NO TUS DATOS.