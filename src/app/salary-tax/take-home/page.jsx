import TakeHomeSalaryCalculator from './TakeHomeSalaryCalculator';

export const metadata = {
  title: 'Take-Home Salary Calculator | MONEX MINT',
  description:
    'Calculate your monthly take-home salary from CTC. Free in-hand salary calculator with PF, income tax, HRA and all deductions for India.',
  keywords: 'take home salary calculator, in-hand salary, CTC calculator, salary after tax, India',
   alternates: {
    canonical: '/salary-tax/take-home',
  },
  openGraph: {
     title: 'Take-Home Salary Calculator | MONEX MINT',
    description: 'Calculate your monthly take-home salary from CTC. Free in-hand salary calculator with PF, income tax, HRA and all deductions for India.',
    type: 'website',
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Take-Home Salary Calculator',
  url: 'https://www.monexmint.com/salary/take-home',
  description: 'Calculate your monthly take-home salary from CTC. Free in-hand salary calculator with PF, income tax, HRA and all deductions for India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function TakeHomeSalaryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <TakeHomeSalaryCalculator />
    </>
  );
}