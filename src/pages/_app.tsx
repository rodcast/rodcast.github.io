import Head from "next/head";
import Script from "next/script";
import type { AppProps } from "next/app";
import "@/styles/globals.css";

const title = "Rodrigo Castilho (RODCAST)";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{title}</title>

        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </Head>
      <Script
        id="google-tag-manager"
        strategy="worker"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
      />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default App;
