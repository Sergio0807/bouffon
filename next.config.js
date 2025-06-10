/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true
    },
  },
  output: 'standalone'
}

module.exports = nextConfig
