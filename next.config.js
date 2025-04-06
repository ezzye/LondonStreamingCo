/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Add trailingSlash to ensure proper routing
  trailingSlash: true,
  // Configure basePath if needed
  basePath: '',
  // Ensure proper asset handling
  assetPrefix: '',
  // Disable static optimization for pages that need client-side features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@aws-amplify/ui-react'],
  },
  // Configure webpack to handle client-side dependencies
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    return config
  },
  // Configure rewrites for client-side routing
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ]
  },
}

module.exports = nextConfig 