import Document, { Html, Head, Main, NextScript } from 'next/document';

const metadata = {
  title: 'Rodrigo Castilho (RODCAST)',
  description: 'Staff Frontend Engineer and ex-@Yahoo in a serious relationship with programming languages and the gym.',
  keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'GitHub', 'Medium'],
  authors: [{ name: 'Rodrigo Castilho', url: 'https://rodrigocastilho.com' }],
  creator: 'Rodrigo Castilho',
  publisher: 'Rodrigo Castilho',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'profile',
    title: 'Rodrigo Castilho (RODCAST)',
    description: 'Staff Frontend Engineer and ex-@Yahoo in a serious relationship with programming languages and the gym.',
    image: '/rodrigo-castilho-rodcast_card.jpg',
    url: 'https://rodrigocastilho.com/',
  },
  twitter: {
    title: 'Rodrigo Castilho (RODCAST)',
    description: 'Staff Frontend Engineer and ex-@Yahoo in a serious relationship with programming languages and the gym.',
    image: '/rodrigo-castilho-rodcast_card.jpg',
    site: '@rodcast',
    creator: '@rodcast',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    noarchive: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

class MyDocument extends Document {
  render() {
    const { openGraph, twitter, robots } = metadata;

    return (
      <Html lang="en" dir="ltr" itemScope itemType="http://schema.org/Person" data-theme="light">
        <Head>
          <meta name="title" content={metadata.title} />
          <meta name="description" content={metadata.description} />
          <meta name="keywords" content={metadata.keywords.join(', ')} />
          {metadata.authors.map(author => (
            <meta key={author.name} name="author" content={author.name} />
          ))}
          <meta name="creator" content={metadata.creator} />
          <meta name="publisher" content={metadata.publisher} />
          <meta name="format-detection" content={`email=${metadata.formatDetection.email ? 'on' : 'off'}, address=${metadata.formatDetection.address ? 'on' : 'off'}, telephone=${metadata.formatDetection.telephone ? 'on' : 'off'}`} />

          <meta property="og:type" content={openGraph.type} />
          <meta property="og:title" content={openGraph.title} />
          <meta property="og:description" content={openGraph.description} />
          <meta property="og:image" content={openGraph.image} />
          <meta property="og:url" content={openGraph.url} />

          <meta name="twitter:title" content={twitter.title} />
          <meta name="twitter:description" content={twitter.description} />
          <meta name="twitter:image" content={twitter.image} />
          <meta name="twitter:site" content={twitter.site} />
          <meta name="twitter:creator" content={twitter.creator} />

          <meta name="robots" content={`${robots.index ? 'index' : 'noindex'}, ${robots.follow ? 'follow' : 'nofollow'}, ${robots.nocache ? 'nocache' : ''}, ${robots.noarchive ? 'noarchive' : ''}`} />
          {robots.googleBot && (
            <>
              <meta name="googlebot" content={`${robots.googleBot.index ? 'index' : 'noindex'}, ${robots.googleBot.follow ? 'follow' : 'nofollow'}`} />
              <meta name="googlebot" content={`noimageindex=${robots.googleBot.noimageindex ? 'on' : 'off'}`} />
              <meta name="googlebot" content={`max-video-preview=${robots.googleBot['max-video-preview']}`} />
              <meta name="googlebot" content={`max-image-preview=${robots.googleBot['max-image-preview']}`} />
              <meta name="googlebot" content={`max-snippet=${robots.googleBot['max-snippet']}`} />
            </>
          )}
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
