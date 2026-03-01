import PPFCalculator from './Ppfcalculator.jsx';

export const metadata = {
  title: 'PPF Calculator | MONEX MINT',
  description:
    'Calculate PPF maturity value with 7.1% interest rate. 15-year lock-in with yearly breakdown.',
  keywords: 'PPF calculator, public provident fund, PPF returns India, 80C tax saving',
  alternates: {
    canonical: '/government/ppf',
  },
  openGraph: {
    title: 'PPF Calculator | MONEX MINT',
    description: 'Calculate PPF maturity value with 7.1% interest rate. 15-year lock-in with yearly breakdown.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PPF Calculator',
  url: 'https://www.monexmint.com/government/ppf',
  description: 'Calculate PPF maturity value with 7.1% interest rate. 15-year lock-in with yearly breakdown.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function PPFPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <PPFCalculator />
    </>
  );
}