import NPSCalculator from './Npscalculator.jsx';

export const metadata = {
  title: 'NPS Calculator | MONEX MINT',
  description:
    'Calculate NPS pension and lumpsum with annuity. Market-linked retirement planning with 40% annuity.',
  keywords: 'NPS calculator, national pension scheme, NPS returns India, retirement pension calculator',
  alternates: {
    canonical: '/government/nps',
  },
  openGraph: {
    title: 'NPS Calculator | MONEX MINT',
    description: 'Calculate NPS pension and lumpsum with annuity. Market-linked retirement planning with 40% annuity.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'NPS Calculator',
  url: 'https://www.monexmint.com/government/nps',
  description: 'Calculate NPS pension and lumpsum with annuity. Market-linked retirement planning with 40% annuity.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function NPSPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <NPSCalculator />
    </>
  );
}