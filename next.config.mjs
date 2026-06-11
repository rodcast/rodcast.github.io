const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  compress: true,
  cleanDistDir: true,
  poweredByHeader: false,
  generateEtags: false,
  productionBrowserSourceMaps: false,
  logging: {
    fetches: {
      fullUrl: isDev,
      hmrRefreshes: isDev
    },
    browserToTerminal: isDev
  },
  images: {
    unoptimized: true,
    qualities: [100, 75],
  },
  experimental: {
    inlineCss: true,
    turbopackFileSystemCacheForDev: true
  },
};

export default nextConfig;
