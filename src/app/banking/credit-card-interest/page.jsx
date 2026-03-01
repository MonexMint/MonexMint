import CreditCardCalculator from './CreditCardCalculator';

export const metadata = {
  title: 'Credit Card Interest Calculator | MONEX MINT',
  description:
    'Calculate credit card interest and payoff time. Monthly compounding, minimum payment trap explained. CC debt calculator India.',
  keywords: 'credit card calculator, CC interest calculator, credit card payoff calculator India, minimum payment trap',
  alternates: {
    canonical: '/banking/credit-card-interest',
  },
  openGraph: {
    title: 'Credit Card Interest Calculator | MONEX MINT',
    description: 'Calculate credit card interest and payoff time. Monthly compounding, minimum payment trap explained. CC debt calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Credit Card Interest Calculator',
  url: 'https://www.monexmint.com/banking/credit-card-interest',
  description: 'Calculate credit card interest and payoff time. Monthly compounding, minimum payment trap explained. CC debt calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CreditCardPage() {
 return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <CreditCardCalculator />
    </>
  );
}