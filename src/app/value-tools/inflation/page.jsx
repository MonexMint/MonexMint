import InflationCalculator from './InflationCalculator';

export const metadata = {
  title: 'Inflation Calculator - Future Cost Calculator | MONEX MINT',
  description:
    'Calculate future cost due to inflation. See how inflation erodes purchasing power over time. India inflation calculator.',
  keywords: 'inflation calculator India, future cost calculator, purchasing power calculator, inflation impact',
  alternates: {
    canonical: '/value-tools/inflation',
  },
  openGraph: {
    title: 'Inflation Calculator - Future Cost Calculator | MONEX MINT',
    description: 'Calculate future cost due to inflation. See how inflation erodes purchasing power over time. India inflation calculator.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Inflation Calculator - Future Cost Calculator',
  url: 'https://www.monexmint.com/value-tools/inflation',
  description: 'Calculate future cost due to inflation. See how inflation erodes purchasing power over time. India inflation calculator.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function InflationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <InflationCalculator />
    </>
  );
}