import RealReturnCalculator from './RealReturnCalculator';

export const metadata = {
title: 'Real Return Calculator - Inflation Adjusted Returns | MONEX MINT',
  description:
    'Calculate real rate of return adjusted for inflation. See actual purchasing power gains from investments.',
  keywords: 'real return calculator, inflation adjusted return, real rate of return calculator, purchasing power gain',
  alternates: {
    canonical: '/value-tools/real-rate',
  },
  openGraph: {
    title: 'Real Return Calculator - Inflation Adjusted Returns | MONEX MINT',
    description: 'Calculate real rate of return adjusted for inflation. See actual purchasing power gains from investments.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Real Return Calculator - Inflation Adjusted Returns',
  url: 'https://www.monexmint.com/value-tools/real-rate',
  description: 'Calculate real rate of return adjusted for inflation. See actual purchasing power gains from investments.',
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