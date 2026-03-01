import FDCalculator from './FDCalculator';

export const metadata = {
  title: 'FD Calculator - Fixed Deposit Returns | MONEX MINT',
  description:
    'Calculate FD maturity with quarterly compounding. Compare rates, check TDS, senior citizen bonus. Bank FD calculator India.',
  keywords: 'FD calculator, fixed deposit calculator, FD maturity calculator India, bank FD interest',
   alternates: {
    canonical: '/banking/fd',
  },
  openGraph: {
    title: 'FD Calculator - Fixed Deposit Returns | MONEX MINT',
    description: 'Calculate FD maturity with quarterly compounding. Compare rates, check TDS, senior citizen bonus. Bank FD calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FD Calculator - Fixed Deposit Returns',
  url: 'https://www.monexmint.com/banking/fd',
  description: 'Calculate FD maturity with quarterly compounding. Compare rates, check TDS, senior citizen bonus. Bank FD calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function FDPage() {
   return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <FDCalculator />
    </>
  );
}