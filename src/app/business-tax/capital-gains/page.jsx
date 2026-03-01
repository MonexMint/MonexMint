import CapitalGainsCalculator from './CapitalGainsCalculator';

export const metadata = {
  title: 'Capital Gains Calculator - LTCG STCG Tax | MONEX MINT',
  description:
    'Calculate capital gains tax on stocks, property, mutual funds, gold. LTCG 10%, STCG 15% calculator India.',
  keywords: 'capital gains calculator India, LTCG STCG calculator, stock profit tax, property capital gains',
  alternates: {
    canonical: '/business-tax/capital-gains',
  },
  openGraph: {
    title: 'Capital Gains Calculator - LTCG STCG Tax | MONEX MINT',
    description: 'Calculate capital gains tax on stocks, property, mutual funds, gold. LTCG 10%, STCG 15% calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Capital Gains Calculator - LTCG STCG Tax',
  url: 'https://www.monexmint.com/business-tax/capital-gains',
  description: 'Calculate capital gains tax on stocks, property, mutual funds, gold. LTCG 10%, STCG 15% calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CapitalGainsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <CapitalGainsCalculator />
    </>
  );
}