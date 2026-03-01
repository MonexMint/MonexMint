import LumpsumCalculator from './LumpsumCalculator';

export const metadata = {
  title: 'Lumpsum Calculator | MONEX MINT',
  description:
    'Calculate lumpsum mutual fund investment returns. One-time investment future value calculator India.',
  keywords: 'lumpsum calculator, one time investment calculator, mutual fund lumpsum India',
  openGraph: {
    title: 'Lumpsum Calculator | MONEX MINT',
    description: 'Calculate lumpsum mutual fund investment returns. One-time investment future value calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lumpsum Investment Calculator',
  url: 'https://www.monexmint.com/investments/lumpsum',
  description: 'Calculate lumpsum mutual fund investment returns. One-time investment future value calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function LumpsumPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <LumpsumCalculator />
    </>
  );
}