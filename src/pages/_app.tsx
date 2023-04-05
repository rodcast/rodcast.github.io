import Head from 'next/head';
import Script from 'next/script';
import { Open_Sans } from 'next/font/google';
import { IMyApp } from '@/interfaces/index';
import '@/styles/globals.css';

const title = 'Rodrigo Castilho (RODCAST)';

const openSans = Open_Sans({
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: IMyApp) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XDP0PEFNH1"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-XDP0PEFNH1');
        `}
      </Script>
      <main className={openSans.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
