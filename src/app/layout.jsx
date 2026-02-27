import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/context/ThemeContext';
import '@/styles/globals.css';

export const metadata = {
   alternates: {
    canonical: '/',
  },

  /*
    metadataBase: Fixes the Next.js console warning:
    "metadataBase property in metadata export is not set"
    Without this, OG/Twitter image URLs can't be resolved in dev.
  */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.monexmint.com'
  ),

  title: {
    default:  'MONEX MINT - Smart Financial Calculators',
    template: '%s | MONEX MINT',   // individual pages: "EMI Calculator | MONEX MINT"
  },
  description:
    'Free financial calculators for EMI, SIP, income tax, FD, GST and 50+ tools. No signup needed.',
  keywords:
    'EMI calculator, SIP calculator, income tax calculator, FD calculator, GST calculator India',

  icons: {
    icon:    [{ url: '/logoMM.png', type: 'image/png', sizes: 'any' }],
    apple:   [{ url: '/logoMM.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/logoMM.png',
  },

  openGraph: {
    title:       'MONEX MINT - Smart Financial Calculators',
    description: 'Free financial calculators for EMI, SIP, tax, FD and more.',
    url:         'https://www.monexmint.com',
    siteName:    'MONEX MINT',
    type:        'website',
    images: [{ url: '/logoMM.png', width: 512, height: 512, alt: 'MONEX MINT Logo' }],
  },

  twitter: {
    card:        'summary',
    title:       'MONEX MINT - Smart Financial Calculators',
    description: 'Free financial calculators for EMI, SIP, tax, FD and more.',
    images:      ['/logoMM.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    /*
      data-scroll-behavior="smooth" added to <html> to silence Next.js warning
      about scroll-behavior being set via CSS.
    */
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Explicit favicon tags for all browsers + localhost dev */}
        <link rel="icon"             href="/logoMM.png" type="image/png" />
        <link rel="shortcut icon"    href="/logoMM.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logoMM.png" />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          {/*
            padding-top: 64px = header height
            Prevents ALL page content from hiding under the fixed header.
          */}
          <main style={{ paddingTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}