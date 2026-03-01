import LoanTenureCalculator from './tenurecalculator';

export const metadata = {
  title: 'Loan Tenure Calculator | MONEX MINT',
  description:
    'Find the exact loan tenure for your desired EMI amount. Free loan tenure calculator India.',
  keywords: 'loan tenure calculator, EMI to tenure calculator India',
  alternates: {
    canonical: '/loans/tenure',
  },
  openGraph: {
    title: 'Loan Tenure Calculator | MONEX MINT',
    description: 'Find the exact loan tenure for your desired EMI amount. Free loan tenure calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Loan Tenure Calculator',
  url: 'https://www.monexmint.com/loans/tenure',
  description: 'Find the exact loan tenure for your desired EMI amount. Free loan tenure calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function LoanTenurePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <LoanTenureCalculator />
    </>
  );
}