/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ignore TypeScript errors during build for deployment
    ignoreBuildErrors: true,
  },

  // Internationalization configuration - temporarily disabled
  // i18n: {
  //   locales: ['en', 'vi'],
  //   defaultLocale: 'vi', // Vietnam market first, then global
  //   localeDetection: false, // Disable auto-detection for now
  // },

  // Custom domains configuration
  async rewrites() {
    return [
      // Merchant portal routes for subdomain
      {
        source: '/',
        destination: '/dashboard',
        has: [
          {
            type: 'host',
            value: 'merchant.oishimenu.com',
          },
        ],
      },
    ]
  },

  // Add headers to fix Cross-Origin-Opener-Policy for Firebase Auth
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ]
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        os: false,
        path: false,
        zlib: false,
        undici: false,
      }
    }

    // Exclude problematic modules from client bundle
    config.externals = [...(config.externals || []), 'undici']

    // Handle Node.js modules better
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false,
    }

    return config
  },

  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['undici', 'firebase-admin']
  }
}

module.exports = nextConfig