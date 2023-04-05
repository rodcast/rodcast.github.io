import Head from 'next/head';
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
      <main className={openSans.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
