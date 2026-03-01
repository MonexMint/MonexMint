import SWPCalculator from './SWPCalculator';

export const metadata = {
  title: 'SWP Calculator | MONEX MINT',
  description:
    'Calculate systematic withdrawal plan returns. Find out how long your corpus lasts with monthly withdrawals.',
  keywords: 'SWP calculator, systematic withdrawal plan, monthly withdrawal from mutual fund India',
  openGraph: {
    title: 'SWP Calculator | MONEX MINT',
    description: 'Calculate systematic withdrawal plan returns. Find out how long your corpus lasts with monthly withdrawals.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SWP  Calculator',
  url: 'https://www.monexmint.com/investments/swp',
  description: 'Calculate systematic withdrawal plan returns. Find out how long your corpus lasts with monthly withdrawals.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function SWPPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <SWPCalculator />
    </>
  );
}