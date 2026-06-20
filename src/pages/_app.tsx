import { GoogleAnalytics } from '@next/third-parties/google';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

import '@/styles/globals.css';

const title = 'Rodrigo Castilho';

/** Main app component */
function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => undefined;
    }

    const abortController = new AbortController();

    /** Registers WebMCP tools with all available APIs; returns true when any path succeeds. */
    const registerTools = async () => {
      const { buildWebMCPTools, toRegisterToolPayload } =
        await import('@/utils/webmcpTools');
      const signal = abortController.signal;
      const navCtx = navigator.modelContext;
      const docCtx = document.modelContext;
      const canonicalTools = buildWebMCPTools().map(toRegisterToolPayload);
      let didRegister = false;

      if (navCtx?.registerTool) {
        for (const tool of canonicalTools) {
          try {
            await navCtx.registerTool(tool, { signal });
            didRegister = true;
          } catch {
            // Some implementations reject individual tools; keep trying others.
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
            await docCtx.registerTool(tool, { signal });
            didRegister = true;
          } catch {
            // Ignore individual failures and continue with the remaining tools.
          }
        }
      }

      return didRegister;
    };

    const maxAttempts = 5;
    let attempts = 0;

    /** Tries tool registration repeatedly for a short window while APIs initialize. */
    const tryRegister = async () => {
      if (abortController.signal.aborted) {
        return;
      }

      attempts += 1;
      const success = await registerTools().catch(() => false);

      if (!success && attempts < maxAttempts) {
        window.setTimeout(tryRegister, 500);
      }
    };

    tryRegister().catch(() => undefined);

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_TRACKING_ID} />
      )}
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default App;
