import IncomeTaxCalculator from './IncomeTaxCalculator';

export const metadata = {
  title: 'Income Tax Calculator FY 2024-25 | MONEX MINT',
  description:
    'Calculate income tax with old vs new regime comparison. FY 2024-25 tax slabs, deductions, and take-home salary.',
  keywords: 'income tax calculator India FY 2024-25, tax calculator new regime, old vs new tax regime',
  alternates: {
    canonical: '/salary-tax/income-tax',
  },
  openGraph: {
    title: 'Income Tax Calculator FY 2024-25 | MONEX MINT',
    description: 'Calculate income tax with old vs new regime comparison. FY 2024-25 tax slabs, deductions, and take-home salary.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Income Tax Calculator FY 2024-25',
  url: 'https://www.monexmint.com/salary-tax/income-tax',
  description: 'Calculate income tax with old vs new regime comparison. FY 2024-25 tax slabs, deductions, and take-home salary.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function IncomeTaxPage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <IncomeTaxCalculator />
    </>
  );
}