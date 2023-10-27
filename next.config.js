/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  images: { unoptimized: false },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
};

module.exports = nextConfig;
