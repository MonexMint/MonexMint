import RDCalculator from './RDCalculator';

export const metadata = {
  title: 'RD Calculator - Recurring Deposit Returns | MONEX MINT',
  description:
    'Calculate RD maturity with monthly deposits. Quarterly compounding, senior citizen bonus. Bank RD calculator India.',
  keywords: 'RD calculator, recurring deposit calculator, monthly savings calculator India, bank RD interest',
    alternates: {
    canonical: '/banking/rd',
  },
  openGraph: {
    title: 'RD Calculator - Recurring Deposit Returns | MONEX MINT',
    description: 'Calculate RD maturity with monthly deposits. Quarterly compounding, senior citizen bonus. Bank RD calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RD Calculator - Recurring Deposit Returns',
  url: 'https://www.monexmint.com/banking/rd',
  description: 'Calculate RD maturity with monthly deposits. Quarterly compounding, senior citizen bonus. Bank RD calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function RDPage() {
 return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <RDCalculator />
    </>
  );
}