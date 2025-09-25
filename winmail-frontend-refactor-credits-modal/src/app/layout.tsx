import type { Metadata } from 'next';
import './globals.css';
import './menu-button.css';
import '@silevis/reactgrid/styles.css';
import { Providers } from './providers';
import { Box, Flex } from '@chakra-ui/react';
import localFont from 'next/font/local';
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';

const sfProDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://app.mailerone.in'),
  title: 'Mailer One',
  description:
    'Unlock the power of limitless email marketing with MailerOne! Featuring an intuitive editor, advanced segmentation and in-depth analytics. MailerOne empowers you to connect, engage, and grow your audience effortlessly. Start with unlimited emails and affordable plans.',
  openGraph: {
    title: 'MailerOne by SapMen C.',
    description:
      'Unlock the power of limitless email marketing with MailerOne! Featuring an intuitive editor, advanced segmentation and in-depth analytics. MailerOne empowers you to connect, engage, and grow your audience effortlessly. Start with unlimited emails and affordable plans.',
    countryName: 'India',
    ttl: 60,
    images: '/opengraph-image.png',
  },
  category: 'marketing',
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
    other: {
      me: ['product.sapmenc@gmail.com', 'https://sapmenc.com'],
    },
  },
};

export default async function RootLayout({
  children,
  sidebar,
  header,
  modal,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-5V7VNSRM" />
      <body className={sfProDisplay.className}>
        <Providers>
          {process.env.NODE_ENV === 'development' && (
            <div
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                transformOrigin: 'center',
                position: 'fixed',
                top: '80%',
                left: 0,
                backgroundColor: 'red',
                color: 'white',
                padding: '0.5rem',
                fontSize: '0.75rem',
                zIndex: 50,
                borderRadius: '0.5rem 0 0 0.5rem',
                opacity: 0.6,
              }}
            >
              DEVELOPMENT
            </div>
          )}
          {modal}
          <Flex as="main" bg={'header.bg'} color={'text.dark'} my={4}>
            <Box as="header">{header}</Box>
          </Flex>
          <Flex>
            <Box as="aside">{sidebar}</Box>
            {children}
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
