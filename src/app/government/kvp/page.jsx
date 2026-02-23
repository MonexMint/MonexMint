import KVPCalculator from './KVPCalculator';

export const metadata = {
  title: 'KVP Calculator - Kisan Vikas Patra | My Wealth Circle',
  description: 'Calculate KVP maturity - doubles your money in 115 months at 7.5% p.a. Safe government scheme.',
  keywords: 'KVP calculator, kisan vikas patra, money doubling scheme India, post office savings',
};

export default function KVPPage() {
  return <KVPCalculator />;
}