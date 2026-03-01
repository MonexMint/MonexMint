import KVPCalculator from './KVPCalculator';

export const metadata = {
  title: 'KVP Calculator - Kisan Vikas Patra | MONEX MINT',
  description:
    'Calculate KVP maturity - doubles your money in 115 months at 7.5% p.a. Safe government scheme.',
  keywords: 'KVP calculator, kisan vikas patra, money doubling scheme India, post office savings',
  alternates: {
    canonical: '/government/kvp',
  },
  openGraph: {
    title: 'KVP Calculator - Kisan Vikas Patra | MONEX MINT',
    description: 'Calculate KVP maturity - doubles your money in 115 months at 7.5% p.a. Safe government scheme.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'KVP Calculator - Kisan Vikas Patra',
  url: 'https://www.monexmint.com/government/kvp',
  description: 'Calculate KVP maturity - doubles your money in 115 months at 7.5% p.a. Safe government scheme.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function KVPPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <KVPCalculator />
    </>
  );
}