/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  output: "export",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    nextScriptWorkers: true,
    webpackBuildWorker: true,
    largePageDataBytes: 128 * 10000,
    optimizePackageImports: ["@next/third-parties"],
  },
};

module.exports = nextConfig;
