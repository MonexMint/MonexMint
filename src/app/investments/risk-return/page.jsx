import RiskReturnCalculator from './RiskReturnCalculator';

export const metadata = {
  title: 'Risk Return Calculator | MONEX MINT',
  description:
    'Use our risk return calculator to calculate results instantly.',
  keywords: 'risk return calculator, finance calculator, India',
  alternates: {
    canonical: '/investments/risk-return',
  },
  openGraph: {
    title: 'Risk Return Calculator | MONEX MINT',
    description: 'Use our risk return calculator to calculate results instantly.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Risk Return Calculator',
  url: 'https://www.monexmint.com/investments/risk-return',
  description: 'Use our risk return calculator to calculate results instantly.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <RiskReturnCalculator />
    </>
  );
}