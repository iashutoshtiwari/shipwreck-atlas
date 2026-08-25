/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  turbopack: {
    rules: {
      '*.geojson': [
        {
          loaders: ['./scripts/geojson-loader.cjs'],
          as: '*.js',
        },
      ],
    },
  },
}

module.exports = nextConfig
