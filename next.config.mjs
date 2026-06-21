import { createHash } from 'node:crypto';
import { relative, sep } from 'node:path';

const isDev = process.env.NODE_ENV === 'development';

// Generate short, stable CSS Module class names using only a hash.
// The hash includes the source file path and original local class name,
// which keeps names deterministic and reduces collision risk across files.
const cssModuleLocalIdent = (context, _localIdentName, localName) => {
  const resourcePath = relative(context.rootContext, context.resourcePath)
    .split(sep)
    .join('/');

  const hash = createHash('sha256')
    .update(`${resourcePath}\0${localName}`)
    .digest('base64')
    .replace(/[^a-zA-Z0-9]/g, '');

  const firstLetterIndex = hash.search(/[a-zA-Z]/);

  return hash.slice(firstLetterIndex, firstLetterIndex + 6);
};

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
    qualities: [100, 75],
  },
  experimental: {
    inlineCss: true,
  },
  // Use compact CSS Module class names in production builds.
  // We do this by overriding css-loader's local ident generator.
  // Turbopack does not currently expose this setting, so webpack is used
  // (via the --webpack flag in package.json) for this customization.
  // Development keeps Next.js defaults for easier debugging.
  webpack(config, { dev }) {
    if (dev) return config;

    const oneOf = config.module.rules.find((rule) =>
      Array.isArray(rule.oneOf)
    )?.oneOf;

    oneOf
      ?.flatMap((rule) => (Array.isArray(rule.use) ? rule.use : []))
      .forEach((loader) => {
        if (
          typeof loader.loader === 'string' &&
          loader.loader.includes('css-loader') &&
          !loader.loader.includes('postcss-loader') &&
          loader.options?.modules
        ) {
          loader.options.modules.getLocalIdent = cssModuleLocalIdent;
        }
      });

    return config;
  },
};

export default nextConfig;
