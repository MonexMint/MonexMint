import GratuityCalculator from './GratuityCalculator';

export const metadata = {
  title: 'Gratuity Calculator - Calculate Gratuity Amount | MONEX MINT',
  description:
    'Calculate gratuity based on last salary and service years. Understand eligibility, tax rules, and payment formula India.',
  keywords: 'gratuity calculator India, gratuity calculation formula, gratuity eligibility, retirement gratuity',
  alternates: {
    canonical: '/salary-tax/gratuity',
  },
  openGraph: {
    title: 'Gratuity Calculator - Calculate Gratuity Amount | MONEX MINT',
    description: 'Calculate gratuity based on last salary and service years. Understand eligibility, tax rules, and payment formula India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gratuity Calculator - Calculate Gratuity Amount',
  url: 'https://www.monexmint.com/salary-tax/gratuity',
  description: 'Calculate gratuity based on last salary and service years. Understand eligibility, tax rules, and payment formula India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function GratuityPage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <GratuityCalculator />
    </>
  );
}