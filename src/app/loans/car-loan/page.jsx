import CarLoanCalculator from './CarLoanCalculator';

export const metadata = {
  title: 'Car Loan EMI Calculator | MONEX MINT',
  description:
    'Calculate car loan EMI with on-road price, RTO charges, insurance, and full amortization schedule. Free car loan calculator India.',
  keywords: 'car loan EMI calculator, auto loan calculator, car loan India, on-road price calculator',
   alternates: {
    canonical: '/loans/car-loan',
  },
  openGraph: {
    title: 'Car Loan EMI Calculator | MONEX MINT',
    description: 'Calculate car loan EMI with on-road price, RTO charges, insurance, and full amortization schedule. Free car loan calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Car Loan EMI Calculator',
  url: 'https://www.monexmint.com/loans/car-loan',
  description: 'Calculate car loan EMI with on-road price, RTO charges, insurance, and full amortization schedule. Free car loan calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CarLoanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <CarLoanCalculator />
    </>
  );
}