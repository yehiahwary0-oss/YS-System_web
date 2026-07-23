import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

const csp = [
  `default-src 'self'`,
  `script-src 'self'${isDev ? " 'unsafe-eval'" : ''} 'unsafe-inline'`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  `img-src 'self' http://localhost:8000 data: blob:`,
  `connect-src 'self' http://localhost:8000`,
  `frame-ancestors 'none'`,
  `form-action 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
]

const nextConfig: NextConfig = {
  compress:       true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port:     '8000',
        pathname: '/storage/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control',          value: 'on' },
          { key: 'Referrer-Policy',                 value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options',          value: 'nosniff' },
          { key: 'X-Frame-Options',                 value: 'DENY' },
          { key: 'Permissions-Policy',              value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Content-Security-Policy',          value: csp.join('; ') },
        ],
      },
    ]
  },
}

export default nextConfig
