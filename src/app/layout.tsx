import { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: 'Next.js',
  title: 'Rodrigo Castilho (RODCAST)',
  description: 'Staff Frontend Engineer and ex-@Yahoo in a serious relationship with programming languages and the gym.',
  keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript'],
  authors: [{ name: 'Rodrigo Castilho', url: 'https://rodrigocastilho.com' }],
  creator: 'Rodrigo Castilho',
  publisher: 'Rodrigo Castilho',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Rodrigo Castilho (RODCAST)',
    description: 'Staff Frontend Engineer and ex-@Yahoo in a serious relationship with programming languages and the gym.',
    url: 'https://rodricastilho.com',
    siteName: 'Rodrigo Castilho (RODCAST)',
    authors: ['Rodrigo Castilho']
  },
  twitter: {
    title: 'Rodrigo Castilho (RODCAST)',
    description: 'Staff Frontend Engineer and ex-@Yahoo in a serious relationship with programming languages and the gym.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" itemScope itemType="http://schema.org/Person" className={`${openSans.className} light`}>
      <body>{children}</body>
    </html>
  );
}
