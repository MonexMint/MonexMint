import TDSCalculator from './TDSCalculator';

export const metadata = {
 title: 'TDS Calculator - Tax Deducted at Source | MONEX MINT',
  description:
    'Calculate TDS on salary, interest, rent, professional fees. FY 2024-25 rates and thresholds.',
  keywords: 'TDS calculator India, tax deducted at source, TDS rates 2024, TDS on salary',
  alternates: {
    canonical: '/salary-tax/tds',
  },
  openGraph: {
    title: 'TDS Calculator - Tax Deducted at Source | MONEX MINT',
    description: 'Calculate TDS on salary, interest, rent, professional fees. FY 2024-25 rates and thresholds.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'TDS Calculator - Tax Deducted at Source',
  url: 'https://www.monexmint.com/salary-tax/tds',
  description: 'Calculate TDS on salary, interest, rent, professional fees. FY 2024-25 rates and thresholds.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function TDSPage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <TDSCalculator />
    </>
  );
}