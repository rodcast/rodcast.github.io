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
    image: 'https://rodrigocastilho.com/rodrigo-castilho-rodcast_card.jpg',
    url: 'https://rodrigocastilho.com/',
  },
  twitter: {
    card: 'summary',
    title: 'Rodrigo Castilho (RODCAST)',
    description: 'Staff Frontend Engineer and ex-@Yahoo in a serious relationship with programming languages and the gym.',
    image: 'https://rodrigocastilho.com/rodrigo-castilho-rodcast_card.jpg',
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

          <meta property="og:type" content={metadata.openGraph.type} />
          <meta property="og:title" content={metadata.openGraph.title} />
          <meta property="og:description" content={metadata.openGraph.description} />
          <meta property="og:image" content={metadata.openGraph.image} />
          <meta property="og:url" content={metadata.openGraph.url} />

          <meta name="twitter:card" content={metadata.twitter.card} />
          <meta name="twitter:title" content={metadata.twitter.title} />
          <meta name="twitter:description" content={metadata.twitter.description} />
          <meta name="twitter:image" content={metadata.twitter.image} />
          <meta name="twitter:site" content={metadata.twitter.site} />
          <meta name="twitter:creator" content={metadata.twitter.creator} />

          <meta name="robots" content={`${metadata.robots.index ? 'index' : 'noindex'}, ${metadata.robots.follow ? 'follow' : 'nofollow'}, ${metadata.robots.nocache ? 'nocache' : ''}, ${metadata.robots.noarchive ? 'noarchive' : ''}`} />
          {metadata.robots.googleBot && (
            <>
              <meta name="googlebot" content={`${metadata.robots.googleBot.index ? 'index' : 'noindex'}, ${metadata.robots.googleBot.follow ? 'follow' : 'nofollow'}`} />
              <meta name="googlebot" content={`noimageindex=${metadata.robots.googleBot.noimageindex ? 'on' : 'off'}`} />
              <meta name="googlebot" content={`max-video-preview=${metadata.robots.googleBot['max-video-preview']}`} />
              <meta name="googlebot" content={`max-image-preview=${metadata.robots.googleBot['max-image-preview']}`} />
              <meta name="googlebot" content={`max-snippet=${metadata.robots.googleBot['max-snippet']}`} />
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
