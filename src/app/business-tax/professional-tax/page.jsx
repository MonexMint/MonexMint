import ProfessionalTaxCalculator from './ProfessionalTaxCalculator';

export const metadata = {
  title: 'Professional Tax Calculator - Monthly PT | My Wealth Circle',
  description: 'Calculate professional tax based on monthly salary and state. State-wise PT slabs India.',
  keywords: 'professional tax calculator India, PT calculator, monthly professional tax, state wise PT',
};

export default function ProfessionalTaxPage() {
  return <ProfessionalTaxCalculator />;
}