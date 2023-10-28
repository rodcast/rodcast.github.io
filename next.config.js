/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  distDir: "out",
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
};

module.exports = nextConfig;
