import SavingsInterestCalculator from './SavingsInterestCalculator';

export const metadata = {
    title: 'Savings Account Interest Calculator | MONEX MINT',
  description:
    'Calculate interest earned on savings account balance. Daily balance method, quarterly credit. Bank savings interest India.',
  keywords: 'savings account interest calculator, bank savings interest, daily balance interest India',
  alternates: {
    canonical: '/banking/savings-interest',
  },
  openGraph: {
    title: 'Savings Account Interest Calculator | MONEX MINT',
    description: 'Calculate interest earned on savings account balance. Daily balance method, quarterly credit. Bank savings interest India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Savings Account Interest Calculator',
  url: 'https://www.monexmint.com/banking/savings-interest',
  description: 'Calculate interest earned on savings account balance. Daily balance method, quarterly credit. Bank savings interest India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function SavingsInterestPage() {
   return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <SavingsInterestCalculator />
    </>
  );
}