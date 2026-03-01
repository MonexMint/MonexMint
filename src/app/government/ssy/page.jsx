import SSYCalculator from './SSYCalculator';

export const metadata = {
  title: 'SSY Calculator - Sukanya Samriddhi Yojana | MONEX MINT',
  description:
    'Calculate Sukanya Samriddhi Yojana maturity for girl child. 8.2% interest, 21-year maturity with tax benefits.',
  keywords: 'SSY calculator, sukanya samriddhi yojana, girl child savings scheme India, SSY maturity',
  alternates: {
    canonical: '/government/ssy',
  },
  openGraph: {
    title: 'SSY Calculator - Sukanya Samriddhi Yojana | MONEX MINT',
    description: 'Calculate Sukanya Samriddhi Yojana maturity for girl child. 8.2% interest, 21-year maturity with tax benefits.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SSY Calculator - Sukanya Samriddhi Yojana',
  url: 'https://www.monexmint.com/government/ssy',
  description: 'Calculate Sukanya Samriddhi Yojana maturity for girl child. 8.2% interest, 21-year maturity with tax benefits.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function SSYPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <SSYCalculator />
    </>
  );
}