import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  compress: true,
  cleanDistDir: true,
  poweredByHeader: false,
  generateEtags: false,
  productionBrowserSourceMaps: true,
  images: {
    unoptimized: true,
    qualities: [75, 100],
  },
  trailingSlash: true,
  experimental: {
    webpackBuildWorker: true,
    serverSourceMaps: false,
    inlineCss: true,
  },
};

export default nextConfig;
