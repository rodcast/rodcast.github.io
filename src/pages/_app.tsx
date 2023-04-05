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
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

          ga('create', 'G-XDP0PEFNH1', 'auto');
          ga('send', 'pageview');
        `}
      </Script>
      <main className={openSans.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
