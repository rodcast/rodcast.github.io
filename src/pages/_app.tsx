import CookieConsent from '@/components/CookieConsent';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

import '@/styles/globals.css';

const NEXT_PUBLIC_GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
const title = 'Rodrigo Castilho';

/** Main app component */
function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => undefined;
    }

    let isSettled = false;

    /** Registers WebMCP tools with all available APIs once, without retry loops. */
    const registerTools = async () => {
      if (isSettled) {
        return;
      }

      const { buildWebMCPTools, toRegisterToolPayload } =
        await import('@/utils/webmcpTools');
      const navCtx = navigator.modelContext;
      const docCtx = document.modelContext;
      const canonicalTools = buildWebMCPTools().map(toRegisterToolPayload);

      let didRegister = false;

      if (navCtx?.registerTool) {
        for (const tool of canonicalTools) {
          try {
            await navCtx.registerTool(tool);
            didRegister = true;
          } catch {
            // Some implementations reject individual tools; keep going.
          }
        }
      }

      if (navCtx?.provideContext) {
        try {
          await navCtx.provideContext({ tools: canonicalTools });
          didRegister = true;
        } catch {
          // Ignore unsupported provideContext implementations.
        }
      }

      if (docCtx?.registerTool) {
        for (const tool of canonicalTools) {
          try {
            await docCtx.registerTool(tool);
            didRegister = true;
          } catch {
            // Ignore individual failures and continue with the remaining tools.
          }
        }
      }

      isSettled = didRegister;
    };

    registerTools().catch(() => undefined);

    return () => {
      isSettled = true;
    };
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      {NEXT_PUBLIC_GA_TRACKING_ID && (
        <>
          <CookieConsent />
          <GoogleAnalytics gaId={NEXT_PUBLIC_GA_TRACKING_ID} />
        </>
      )}
    </>
  );
}

export default App;
