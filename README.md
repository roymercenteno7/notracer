<div align="center">
  <img src="src/lib/assets/favicon.svg" width="80" alt="NoTracer Logo">
  <h1>NoTracer 🟢</h1>
  <p><strong>El acortador de URLs Anti-Rastreo definitivo con estética Cyber-Terminal.</strong></p>
</div>

---

NoTracer (mvp) es una herramienta web extrema de privacidad. Limpia de raíz los molestos parámetros de rastreo (`utm_*`, `fbclid`, `gclid`, IDs de afiliados ocultos) en URLs de redes sociales y comercio electrónico, devolviendo un enlace corto y totalmente sanitizado. 

Desarrollado end-to-end con SvelteKit, Prisma, PostgreSQL y Upstash (Redis) para trabajar nativamente bajo **Edge Serverless en Vercel**.

## 🚀 Características (Phase 2)

- **Estética Cyber-Terminal**: CSS Vanilla minimalista 100% Hacker (`#00FF41` puro sobre negro). 
- **Deep Clean Engine**: Blacklist riguroso de parámetros de rastreo (+50 reglas soportadas) para Amazon, Meta, Google, TikTok, MercadoLibre y AliExpress.
- **Micro-Redirección LFU/LRU**: Cache rápido en **Upstash Redis** para resolución de `/[slug]` en microsegundos. 
- **Gestión de Cuentas (BETA)**: Login / Registro de usuarios con `bcrypt` y persistencia de links.
- **Expiración Dinámica**: Los links de visita anónima **se auto-destruyen en 48 horas**. Los links de usuarios registrados son perpetuos.
- **Bot-Shield Integration**: Protegido robustamente con **Cloudflare Turnstile** para evitar spam abuse.
- **Copy-to-Clipboard Automático**: One-click zero-friction UI.

## 🛠 Stack Tecnológico

- **Frontend SSR**: [SvelteKit 2](https://kit.svelte.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Database ORM**: [Prisma Client](https://www.prisma.io/) (PostgreSQL via Neon)
- **Fast Global Cache**: [@upstash/redis](https://upstash.com/)
- **Security Check**: Cloudflare Turnstile
- **Deployment Platform**: Vercel (Edge Serverless)

## 📦 Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/roymercenteno7/notracer.git
cd notracer

# 2. Instalar dependencias
npm install
npm run build # Dispara la compilación del cliente nativo de Prisma (v6.4.1)

# 3. Configurar Entorno
cp .env.example .env
# IMPORTANTE: Reemplaza las variables DATABASE_URL y UPSTASH_REST en el archivo .env con tus credenciales.

# 4. Inicializar Base de Datos
npx prisma db push

# 5. Ejecutar la terminal
npm run dev
```

## ☁️ Despliegue en Vercel

NoTracer está pre-configurado para desplegarse fluidamente en Vercel usando `@sveltejs/adapter-vercel`.

1. Importa el Repositorio de GitHub desde tu cuenta de Vercel.
2. Ve a las configuraciones del entorno (`Settings > Environment Variables`).
3. Añade absolutamente todas tus credenciales (Db de Neon, Redis de Upstash, Secretos de Cloudflare).
4. El script `postinstall` (`prisma generate`) se asegura que el Edge API tenga acceso a PostgreSQL automáticamente sin configuración extra en el pipeline CICD de Vercel.

---
> Construido de cero buscando limpiar la web. Zero Tracking, Full Privacy.
