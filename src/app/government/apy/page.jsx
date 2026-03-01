import APYCalculator from './APYCalculator';

export const metadata = {
  title: 'APY Calculator - Atal Pension Yojana | MONEX MINT',
  description:
    'Calculate APY monthly contribution for guaranteed pension of ₹1000-₹5000. Government co-contribution for unorganized sector.',
  keywords: 'APY calculator, atal pension yojana, government pension scheme India, guaranteed pension',
  alternates: {
    canonical: '/government/apy',
  },
  openGraph: {
    title: 'APY Calculator - Atal Pension Yojana | MONEX MINT',
    description: 'Calculate APY monthly contribution for guaranteed pension of ₹1000-₹5000. Government co-contribution for unorganized sector.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'APY Calculator - Atal Pension Yojana',
  url: 'https://www.monexmint.com/government/apy',
  description: 'Calculate APY monthly contribution for guaranteed pension of ₹1000-₹5000. Government co-contribution for unorganized sector.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function APYPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <APYCalculator />
    </>
  );
}