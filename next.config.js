/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Updated: moved from experimental.serverComponentsExternalPackages to serverExternalPackages
  serverExternalPackages: ["mongodb", "@napi-rs/snappy", "mongodb-connection-string-url", "bson", "aws4"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve these modules on the client to prevent errors
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        util: false,
        "util/types": false,
        "timers/promises": false,
        stream: false,
        crypto: false,
        zlib: false,
        http: false,
        https: false,
        path: false,
        os: false,
        constants: false,
        assert: false,
        buffer: false,
        events: false,
      }

      // Create empty modules for MongoDB-related packages
      config.resolve.alias = {
        ...config.resolve.alias,
        mongodb: false,
        "@napi-rs/snappy": false,
        bson: false,
        aws4: false,
        "mongodb-connection-string-url": false,
      }
    }
    return config
  },
}

module.exports = nextConfig
