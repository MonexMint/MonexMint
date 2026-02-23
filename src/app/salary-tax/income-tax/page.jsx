import IncomeTaxCalculator from './IncomeTaxCalculator';

export const metadata = {
  title: 'Income Tax Calculator FY 2024-25 | My Wealth Circle',
  description: 'Calculate income tax with old vs new regime comparison. FY 2024-25 tax slabs, deductions, and take-home salary.',
  keywords: 'income tax calculator India FY 2024-25, tax calculator new regime, old vs new tax regime',
};

export default function IncomeTaxPage() {
  return <IncomeTaxCalculator />;
}