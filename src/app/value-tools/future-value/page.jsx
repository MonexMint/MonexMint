import FutureValueCalculator from './FutureValueCalculator';

export const metadata = {
    title: 'Future Value Calculator - Money Growth Calculator | MONEX MINT',
  description:
    'Calculate future value of money with compound interest. See how your investment grows over time.',
  keywords: 'future value calculator, money growth calculator, compound interest calculator, investment growth',
  alternates: {
    canonical: '/value-tools/future-value',
  },
  openGraph: {
    title: 'Future Value Calculator - Money Growth Calculator | MONEX MINT',
    description: 'Calculate future value of money with compound interest. See how your investment grows over time.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Future Value Calculator - Money Growth Calculator',
  url: 'https://www.monexmint.com/value-tools/future-value',
  description: 'Calculate future value of money with compound interest. See how your investment grows over time.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function FutureValuePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <FutureValueCalculator />
    </>
  );
}