import PersonalLoanCalculator from './PersonalLoanCalculator';

export const metadata = {
  title: 'Personal Loan EMI Calculator | MONEX MINT',
  description:
    'Calculate personal loan EMI with processing fee, effective APR, and full amortization schedule. Free unsecured loan calculator India.',
  keywords: 'personal loan EMI calculator, unsecured loan calculator, personal loan India, effective APR calculator',
  alternates: {
    canonical: '/loans/personal-loan',
  },
  openGraph: {
    title: 'Personal Loan EMI Calculator | MONEX MINT',
    description: 'Calculate personal loan EMI with processing fee, effective APR, and full amortization schedule. Free unsecured loan calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Personal Loan EMI Calculator',
  url: 'https://www.monexmint.com/loans/personal-loan',
  description: 'Calculate personal loan EMI with processing feeCalculate personal loan EMI with processing fee, effective APR, and full amortization schedule. Free unsecured loan calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function PersonalLoanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <PersonalLoanCalculator />
    </>
  );
}