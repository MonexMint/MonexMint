import CompoundInterestCalculator from './CompoundInterestCalculator';

export const metadata = {
  title: 'Compound Interest Calculator | MONEX MINT',
  description:
    'Calculate compound interest with daily, monthly, quarterly or annual compounding. Free CI calculator India.',
  keywords: 'compound interest calculator, CI calculator, compounding frequency, investment calculator India',
  alternates: {
    canonical: '/investments/compound-interest',
  },
  openGraph: {
    title: 'Compound Interest Calculator | MONEX MINT',
    description: 'Calculate compound interest with daily, monthly, quarterly or annual compounding. Free CI calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Compound Interest Calculator',
  url: 'https://www.monexmint.com/investments/compound-interest',
  description: 'Calculate compound interest with daily, monthly, quarterly or annual compounding. Free CI calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CompoundInterestPage() {
  return (
    <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <CompoundInterestCalculator />
    </>
  );
}