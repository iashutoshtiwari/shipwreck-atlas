/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  turbopack: {
    rules: {
      '*.geojson': [
        {
          loaders: [],
          as: '*.json'
        }
      ]
    }
  }
};

module.exports = nextConfig;