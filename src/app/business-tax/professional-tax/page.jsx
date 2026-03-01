import ProfessionalTaxCalculator from './ProfessionalTaxCalculator';

export const metadata = {
  title: 'Professional Tax Calculator - Monthly PT | MONEX MINT',
  description:
    'Calculate professional tax based on monthly salary and state. State-wise PT slabs India.',
  keywords: 'professional tax calculator India, PT calculator, monthly professional tax, state wise PT',
  alternates: {
    canonical: '/business-tax/professional-tax',
  },
  openGraph: {
    title: 'Professional Tax Calculator - Monthly PT | MONEX MINT',
    description: 'Calculate professional tax based on monthly salary and state. State-wise PT slabs India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Professional Tax Calculator - Monthly PT',
  url: 'https://www.monexmint.com/business-tax/professional-tax',
  description: 'Calculate professional tax based on monthly salary and state. State-wise PT slabs India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function ProfessionalTaxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <ProfessionalTaxCalculator />
    </>
  );
}