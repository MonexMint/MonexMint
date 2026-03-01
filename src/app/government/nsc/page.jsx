import NSCCalculator from './NSCCalculator';

export const metadata = {
  title: 'NSC Calculator - National Savings Certificate | MONEX MINT',
  description:
    'Calculate NSC maturity with 7.7% interest. 5-year fixed term with 80C tax benefits on principal and reinvested interest.',
  keywords: 'NSC calculator, national savings certificate, NSC returns India, 80C tax saving',
  alternates: {
    canonical: '/government/nsc',
  },
  openGraph: {
    title: 'NSC Calculator - National Savings Certificate | MONEX MINT',
    description: 'Calculate NSC maturity with 7.7% interest. 5-year fixed term with 80C tax benefits on principal and reinvested interest.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'NSC Calculator - National Savings Certificate',
  url: 'https://www.monexmint.com/government/nsc',
  description: 'Calculate NSC maturity with 7.7% interest. 5-year fixed term with 80C tax benefits on principal and reinvested interest.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function NSCPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <NSCCalculator />
    </>
  );
}