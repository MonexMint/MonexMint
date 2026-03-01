import StampDutyCalculator from './StampDutyCalculator';

export const metadata = {
  title: 'Stamp Duty Calculator - Property Registration Charges | MONEX MINT',
  description:
    'Calculate stamp duty and registration charges on property purchase. State-wise rates, male/female/joint ownership India.',
  keywords: 'stamp duty calculator India, property registration charges, state wise stamp duty, Maharashtra stamp duty',
  alternates: {
    canonical: '/business-tax/stamp-duty',
  },
  openGraph: {
    title: 'Stamp Duty Calculator - Property Registration Charges | MONEX MINT',
    description: 'Calculate stamp duty and registration charges on property purchase. State-wise rates, male/female/joint ownership India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Stamp Duty Calculator - Property Registration Charges',
  url: 'https://www.monexmint.com/business-tax/stamp-duty',
  description: 'Calculate stamp duty and registration charges on property purchase. State-wise rates, male/female/joint ownership India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function StampDutyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <StampDutyCalculator />
    </>
  );
}