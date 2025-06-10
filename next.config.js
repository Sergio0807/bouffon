/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true
    },
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
