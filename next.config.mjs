// next.config.js
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { canvas: false }
    return config
  },
  turbopack: {},
}

export default nextConfig