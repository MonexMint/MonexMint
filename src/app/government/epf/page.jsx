import EPFCalculator from './Epfcalculator.jsx';

export const metadata = {
  title: 'EPF Calculator | MONEX MINT',
  description:
    'Calculate Employee Provident Fund maturity with 8.25% interest. 12% employee + 3.67% employer contribution.',
  keywords: 'EPF calculator, employee provident fund, PF calculator India, retirement planning',
  alternates: {
    canonical: '/government/epf',
  },
  openGraph: {
    title: 'EPF Calculator | MONEX MINT',
    description: 'Calculate Employee Provident Fund maturity with 8.25% interest. 12% employee + 3.67% employer contribution.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EPF Calculator',
  url: 'https://www.monexmint.com/government/epf',
  description: 'Calculate Employee Provident Fund maturity with 8.25% interest. 12% employee + 3.67% employer contribution.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function EPFPage() {
 
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <EPFCalculator />
    </>
  );
}