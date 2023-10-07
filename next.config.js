/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    largePageDataBytes: 128 * 100000,
  },
};

module.exports = nextConfig;
