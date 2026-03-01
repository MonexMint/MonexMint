import CAGRCalculator from './CAGRCalculator';

export const metadata = {
  title: 'CAGR Calculator | MONEX MINT',
  description:
    'Calculate Compound Annual Growth Rate of any investment. Free CAGR calculator India.',
  keywords: 'CAGR calculator, compound annual growth rate, investment return calculator India',
  openGraph: {
    title: 'CAGR Calculator | MONEX MINT',
    description: 'Calculate Compound Annual Growth Rate of any investment.Free CAGR calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CAGR Calculator',
  url: 'https://www.monexmint.com/investments/cagr',
  description: 'Calculate Compound Annual Growth Rate of any investment. Free CAGR calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CAGRPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <CAGRCalculator />
    </>
  );
}