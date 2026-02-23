import OverdraftCalculator from './OverdraftCalculator';

export const metadata = {
  title: 'Overdraft Interest Calculator | My Wealth Circle',
  description: 'Calculate overdraft interest charges. Daily reducing balance method, processing fees included. OD calculator India.',
  keywords: 'overdraft calculator, OD interest calculator, bank overdraft charges India, overdraft cost',
};

export default function OverdraftPage() {
  return <OverdraftCalculator />;
}