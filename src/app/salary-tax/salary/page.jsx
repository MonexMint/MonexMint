import SalaryCalculator from './SalaryCalculator';

export const metadata = {
  title: 'Salary Calculator - CTC to In-Hand | MonexMint',
  description: 'Calculate take-home salary from CTC. Includes PF, gratuity, HRA, tax, bonus breakdown. In-hand salary calculator India.',
  keywords: 'salary calculator India, CTC to in-hand, take-home salary calculator, CTC breakdown',
};

export default function SalaryPage() {
  return <SalaryCalculator />;
}