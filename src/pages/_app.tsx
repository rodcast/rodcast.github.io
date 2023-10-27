import Head from "next/head";
import { GoogleTagManager } from "@next/third-parties/google";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const title = "Rodrigo Castilho (RODCAST)";

const inter = Inter({
  weight: ["400", "600"],
  subsets: ["latin"],
});

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <GoogleTagManager gtmId="G-XDP0PEFNH1" />
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default App;
