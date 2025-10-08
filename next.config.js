import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  outputFileTracingRoot: __dirname,
  poweredByHeader: false,
  reactStrictMode: true,
  cleanDistDir: true,
  images: {
    unoptimized: true,
    qualities: [75, 100],
  },
  trailingSlash: true,
  experimental: {
    webpackBuildWorker: true,
    largePageDataBytes: 256 * 1024,
    optimizePackageImports: ['@builder.io/partytown', '@next/third-parties'],
  },
};

export default nextConfig;
