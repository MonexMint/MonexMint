/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Standalone output for faster deploys ──────────────
  // output: 'standalone',  // uncomment for Docker/VPS deploy

  // ── Image optimization ────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    // Allow local images without domain restriction
    remotePatterns: [],
  },

  // ── Compiler optimizations ────────────────────────────
  compiler: {
    // Remove console.log in production builds
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // ── Experimental: faster dev compilation ──────────────
  experimental: {
    // Turbopack is faster in dev (Next.js 14+)
    // Run with: next dev --turbo
    // turbo: {},

    // Optimize CSS — fixes the CSS preload warning
    optimizeCss: true,

    // Faster page loading
    optimisticClientCache: true,
  },



  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'monexmint.com' }],
        destination: 'https://www.monexmint.com/:path*',
        permanent: true,
      },
    ];
  },

  // ── Headers: security + cache ─────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Cache static assets for 1 year
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache images for 1 week
        source: '/(.*)\\.(png|jpg|jpeg|gif|ico|svg|webp)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};


module.exports = nextConfig;