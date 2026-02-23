import APYCalculator from './APYCalculator';

export const metadata = {
  title: 'APY Calculator - Atal Pension Yojana | My Wealth Circle',
  description: 'Calculate APY monthly contribution for guaranteed pension of ₹1000-₹5000. Government co-contribution for unorganized sector.',
  keywords: 'APY calculator, atal pension yojana, government pension scheme India, guaranteed pension',
};

export default function APYPage() {
  return <APYCalculator />;
}