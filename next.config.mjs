import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  trailingSlash: true,
  compress: true,
  cleanDistDir: true,
  poweredByHeader: false,
  generateEtags: false,
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true,
    qualities: [100, 75],
  },
  experimental: {
    webpackBuildWorker: true,
    inlineCss: true,
  },
};

export default nextConfig;
