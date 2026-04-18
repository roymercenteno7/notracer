# Changelog

All notable changes to this project will be documented in this file.

## [0.0.1] - 2026-04-18

### Added

- **LINK_PURGER (M-01)**
  - URL cleaning engine with +50 tracking patterns
  - Support for Amazon, Meta, TikTok, MercadoLibre, AliExpress, Google, Spotify, LinkedIn, Pinterest, YouTube
  - ASIN extraction for Amazon product URLs
  - Custom slug support for registered users

- **MEDIA_SHIFTER (M-02)**
  - JPEG/PNG to WebP conversion
  - Sharp-based processing with quality 90%
  - EXIF metadata stripping
  - Batch processing support
  - File size limit: 10MB

- **SPEED_TEST (M-05)**
  - Latency (ping) testing
  - Download speed test
  - Upload speed test
  - Zero analytics, local data generation

- **Authentication**
  - OTP-based login/register via email
  - Session management with Redis
  - Cloudflare Turnstile integration

- **Browser Extension**
  - Chrome Manifest v3
  - Sentinel content script for tracking detection
  - Background service worker

### Fixed

- WebP conversion runtime (Edge → Node.js for Sharp compatibility)

---

## [0.0.0] - 2026-03-12

### Added

- Initial project setup
- Basic SvelteKit + Prisma + Redis structure