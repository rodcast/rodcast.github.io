import Document, { Head, Html, Main, NextScript } from 'next/document';

interface RobotsMetaProps {
  robots: {
    index: boolean;
    follow: boolean;
    nocache: boolean;
    noarchive: boolean;
    googleBot?: {
      index: boolean;
      follow: boolean;
      noimageindex: boolean;
      'max-video-preview': number;
      'max-image-preview': string;
      'max-snippet': number;
    };
  };
}

function RobotsMeta({ robots }: RobotsMetaProps) {
  return (
    <>
      <meta
        name="robots"
        content={`${robots.index ? 'index' : 'noindex'}, ${
          robots.follow ? 'follow' : 'nofollow'
        }, ${robots.nocache ? 'nocache' : ''}, ${
          robots.noarchive ? 'noarchive' : ''
        }`}
      />
      {robots.googleBot && (
        <>
          <meta
            name="googlebot"
            content={`${
              robots.googleBot.index ? 'index' : 'noindex'
            }, ${robots.googleBot.follow ? 'follow' : 'nofollow'}`}
          />
          <meta
            name="googlebot"
            content={`noimageindex=${
              robots.googleBot.noimageindex ? 'on' : 'off'
            }`}
          />
          <meta
            name="googlebot"
            content={`max-video-preview=${robots.googleBot['max-video-preview']}`}
          />
          <meta
            name="googlebot"
            content={`max-image-preview=${robots.googleBot['max-image-preview']}`}
          />
          <meta
            name="googlebot"
            content={`max-snippet=${robots.googleBot['max-snippet']}`}
          />
        </>
      )}
    </>
  );
}

const metadata = {
  title: 'Rodrigo Castilho (RODCAST)',
  description:
    'Staff Frontend Engineer and ex-@Yahoo in a serious relationship with programming languages and the gym.',
  keywords: [
    'Next.js',
    'React',
    'JavaScript',
    'TypeScript',
    'CSS',
    'HTML',
    'GitHub',
    'Medium',
  ],
  authors: [
    { name: 'Rodrigo Castilho', url: 'https://rodrigocastilho.com/' },
  ],
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
    description:
      'Staff Frontend Engineer and ex-@Yahoo in a serious relationship with programming languages and the gym.',
    image: 'https://rodrigocastilho.com/rodrigo-castilho-rodcast_card.jpg',
    url: 'https://rodrigocastilho.com/',
  },
  twitter: {
    card: 'summary',
    title: 'Rodrigo Castilho (RODCAST)',
    description:
      'Staff Frontend Engineer and ex-@Yahoo in a serious relationship with programming languages and the gym.',
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

interface OpenGraphMetaProps {
  openGraph: {
    type: string;
    title: string;
    description: string;
    image: string;
    url: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
    site: string;
    creator: string;
  };
}

function OpenGraphMeta({ openGraph, twitter }: OpenGraphMetaProps) {
  return (
    <>
      <meta property="og:type" content={openGraph.type} />
      <meta property="og:title" content={openGraph.title} />
      <meta property="og:description" content={openGraph.description} />
      <meta property="og:image" content={openGraph.image} />
      <meta property="og:url" content={openGraph.url} />

      <meta name="twitter:card" content={twitter.card} />
      <meta name="twitter:title" content={twitter.title} />
      <meta name="twitter:description" content={twitter.description} />
      <meta name="twitter:image" content={twitter.image} />
      <meta name="twitter:site" content={twitter.site} />
      <meta name="twitter:creator" content={twitter.creator} />
    </>
  );
}

// JSON-LD structured data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://www.rodrigocastilho.com/#person',
      name: 'Rodrigo Castilho',
      alternateName: 'RODCAST',
      description: metadata.description,
      url: 'https://www.rodrigocastilho.com/',
      image: {
        '@type': 'ImageObject',
        '@id': 'https://www.rodrigocastilho.com/#image',
        url: 'https://www.rodrigocastilho.com/rodrigo-castilho-rodcast_photo.jpg',
        contentUrl: 'https://www.rodrigocastilho.com/rodrigo-castilho-rodcast_photo.jpg',
        width: 400,
        height: 400,
        caption: 'Rodrigo Castilho (RODCAST) - Staff Frontend Engineer',
      },
      jobTitle: 'Staff Frontend Engineer',
      worksFor: {
        '@type': 'Organization',
        name: 'Yahoo',
      },
      knowsAbout: [
        'JavaScript',
        'TypeScript',
        'React',
        'Next.js',
        'Frontend Development',
        'Web Development',
        'CSS',
        'HTML',
      ],
      sameAs: [
        'https://twitter.com/rodcast',
        'https://github.com/rodcast',
        'https://medium.com/@rodcast',
        'https://www.linkedin.com/in/rodrigocastilho',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.rodrigocastilho.com/#website',
      url: 'https://www.rodrigocastilho.com/',
      name: 'Rodrigo Castilho (RODCAST)',
      description: metadata.description,
      publisher: {
        '@id': 'https://www.rodrigocastilho.com/#person',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.rodrigocastilho.com/#webpage',
      url: 'https://www.rodrigocastilho.com/',
      name: metadata.title,
      description: metadata.description,
      isPartOf: {
        '@id': 'https://www.rodrigocastilho.com/#website',
      },
      about: {
        '@id': 'https://www.rodrigocastilho.com/#person',
      },
      primaryImageOfPage: {
        '@id': 'https://www.rodrigocastilho.com/#image',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'ProfilePage',
      '@id': 'https://www.rodrigocastilho.com/#profilepage',
      url: 'https://www.rodrigocastilho.com/',
      name: metadata.title,
      description: metadata.description,
      isPartOf: {
        '@id': 'https://www.rodrigocastilho.com/#website',
      },
      mainEntity: {
        '@id': 'https://www.rodrigocastilho.com/#person',
      },
      inLanguage: 'en-US',
    },
  ],
};

/** Custom document */
class MyDocument extends Document {
  /** Render document structure */
  render() {
    return (
      <Html
        lang="en"
        dir="ltr"
        itemScope
        itemType="http://schema.org/Person"
        data-theme="light"
      >
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#1c1c1c" />
          <meta
            name="theme-color"
            content="#ffffff"
            media="(prefers-color-scheme: light)"
          />
          <meta
            name="theme-color"
            content="#1c1c1c"
            media="(prefers-color-scheme: dark)"
          />

          {/* SEO Meta Tags */}
          <meta name="title" content={metadata.title} />
          <meta name="description" content={metadata.description} />
          <meta name="keywords" content={metadata.keywords.join(', ')} />
          <meta name="language" content="en" />
          <meta name="revisit-after" content="7 days" />
          <meta name="rating" content="General" />
          <meta name="distribution" content="global" />
          <meta name="HandheldFriendly" content="true" />
          <meta name="MobileOptimized" content="320" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          {metadata.authors.map((author) => (
            <meta key={author.name} name="author" content={author.name} />
          ))}
          <meta name="creator" content={metadata.creator} />
          <meta name="publisher" content={metadata.publisher} />
          <meta
            name="format-detection"
            content={`email=${
              metadata.formatDetection.email ? 'on' : 'off'
            }, address=${
              metadata.formatDetection.address ? 'on' : 'off'
            }, telephone=${metadata.formatDetection.telephone ? 'on' : 'off'}`}
          />

          <OpenGraphMeta openGraph={metadata.openGraph} twitter={metadata.twitter} />

          <RobotsMeta robots={metadata.robots} />

          {/* Favicons and PWA */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="canonical" href="https://rodrigocastilho.com/" />

          {/* DNS Prefetch & Preconnect for Performance */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* Resource Hints */}
          <link
            rel="preload"
            href="/rodrigo-castilho-rodcast_photo.jpg"
            as="image"
          />
          <link rel="prefetch" href="/rodrigo-castilho-rodcast_card.jpg" />

          {/* Additional SEO Links */}
          <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Rodrigo Castilho RSS Feed"
            href="/feed.xml"
          />

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
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
