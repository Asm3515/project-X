/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [
      "mongodb",
      "@napi-rs/snappy",
      "mongodb-connection-string-url",
      "bson",
      "aws4",
    ],
    esmExternals: "loose",
  },
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
        buffer: false, // Changed from require.resolve
        events: false, // Changed from require.resolve
      }

      // Ignore all mongodb-related modules on the client
      config.module.rules.push({
        test: /mongodb|@napi-rs\/snappy|bson|aws4|mongodb-connection-string-url/,
        use: "null-loader",
      })
    }
    return config
  },
}

export default nextConfig
