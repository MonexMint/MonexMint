import HomeLoanCalculator from './HomeLoanCalculator';

export const metadata = {
  title: 'Home Loan EMI Calculator | MONEX MINT',
  description:
    'Calculate home loan EMI with property value, down payment, LTV ratio and full amortization schedule. Free housing loan calculator India.',
  keywords: 'home loan EMI calculator, housing loan calculator, property loan EMI India, LTV calculator',
  alternates: {
    canonical: '/loans/home-loan',
  },
  openGraph: {
    title: 'Home Loan EMI Calculator | MONEX MINT',
    description: 'Calculate home loan EMI with property value, down payment, LTV ratio and full amortization schedule. Free housing loan calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Home Loan EMI Calculator',
  url: 'https://www.monexmint.com/loans/home-loan',
  description: 'Calculate home loan EMI with property value, down payment, LTV ratio and full amortization schedule. Free housing loan calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function HomeLoanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <HomeLoanCalculator />
    </>
  );
}