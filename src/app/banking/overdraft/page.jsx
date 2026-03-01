import OverdraftCalculator from './OverdraftCalculator';

export const metadata = {
  title: 'Overdraft Interest Calculator | MONEX MINT',
  description:
    'Calculate overdraft interest charges. Daily reducing balance method, processing fees included. OD calculator India.',
  keywords: 'overdraft calculator, OD interest calculator, bank overdraft charges India, overdraft cost',
  alternates: {
    canonical: '/banking/overdraft',
  },
  openGraph: {
    title: 'Overdraft Interest Calculator | MONEX MINT',
    description: 'Calculate overdraft interest charges. Daily reducing balance method, processing fees included. OD calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Overdraft Interest Calculator',
  url: 'https://www.monexmint.com/banking/overdraft',
  description: 'Calculate overdraft interest charges. Daily reducing balance method, processing fees included. OD calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function OverdraftPage() {
   return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <OverdraftCalculator />
    </>
  );
}