const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  cleanDistDir: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  logging: {
    fetches: {
      fullUrl: isDev,
      hmrRefreshes: isDev,
    },
    browserToTerminal: isDev,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
