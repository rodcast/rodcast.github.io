import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import '@/styles/globals.css';

const title = 'Rodrigo Castilho (RODCAST)';

/** Main app component */
function App({ Component, pageProps }: AppProps) {
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
        <SpeedInsights />
      </main>
    </>
  );
}

export default App;
