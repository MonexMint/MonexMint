import RealReturnCalculator from '../real-rate/RealReturnCalculator';

export const metadata = {
  title: 'Real Return Calculator - Inflation Adjusted Returns | MONEX MINT',
  description:
    'Calculate real rate of return adjusted for inflation and understand your actual purchasing power gains.',
  keywords: 'real return calculator, inflation adjusted return calculator, real rate of return, purchasing power',
  alternates: {
    canonical: '/value-tools/real-return',
  },
  openGraph: {
    title: 'Real Return Calculator - Inflation Adjusted Returns | MONEX MINT',
    description: 'Calculate real rate of return adjusted for inflation and understand your actual purchasing power gains.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Real Return Calculator - Inflation Adjusted Returns',
  url: 'https://www.monexmint.com/value-tools/real-return',
  description: 'Calculate real rate of return adjusted for inflation and understand your actual purchasing power gains.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function RealReturnPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <RealReturnCalculator />
    </>
  );
}