import SCSSCalculator from './SCSSCalculator';

export const metadata = {
  title: 'SCSS Calculator - Senior Citizen Savings Scheme | MONEX MINT',
  description:
    'Calculate SCSS quarterly interest income. 8.2% p.a., 5-year tenure, max ₹30L deposit for senior citizens (60+).',
  keywords: 'SCSS calculator, senior citizen savings scheme, quarterly interest income, post office scheme India',
  alternates: {
    canonical: '/government/scss',
  },
  openGraph: {
    title: 'SCSS Calculator - Senior Citizen Savings Scheme | MONEX MINT',
    description: 'Calculate SCSS quarterly interest income. 8.2% p.a., 5-year tenure, max ₹30L deposit for senior citizens (60+).',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SCSS Calculator - Senior Citizen Savings Scheme',
  url: 'https://www.monexmint.com/government/scss',
  description: 'Calculate SCSS quarterly interest income. 8.2% p.a., 5-year tenure, max ₹30L deposit for senior citizens (60+).',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function SCSSPage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <SCSSCalculator />
    </>
  );
}