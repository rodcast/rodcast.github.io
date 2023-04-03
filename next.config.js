/** @type {import('next').NextConfig} */
const nextConfig = {
  target: "serverless",
  exportTrailingSlash: true,
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
