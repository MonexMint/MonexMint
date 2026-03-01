import LoanEligibilityCalculator from './LoanEligibilityCalculator';

export const metadata = {
  title: 'Loan Eligibility Calculator | MONEX MINT',
  description:
    'Check how much home or personal loan you are eligible for based on income, existing EMIs and FOIR. Free loan eligibility calculator India.',
  keywords: 'loan eligibility calculator, how much loan can I get, FOIR calculator, home loan eligibility India',
   alternates: {
    canonical: '/loans/eligibility',
  },
  openGraph: {
    title: 'Loan Eligibility Calculator | MONEX MINT',
    description: 'Check how much home or personal loan you are eligible for based on income, existing EMIs and FOIR. Free loan eligibility calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Loan Eligibility Calculator',
  url: 'https://www.monexmint.com/loans/eligibility',
  description: 'Check how much home or personal loan you are eligible for based on income, existing EMIs and FOIR. Free loan eligibility calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function LoanEligibilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <LoanEligibilityCalculator />
    </>
  );
}