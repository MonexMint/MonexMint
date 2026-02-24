import BrokerageCalculator from './Brokeragecalculator.jsx';

export const metadata = {
  title: 'Brokerage Calculator - Trading Charges & Net P&L | My Wealth Circle',
  description: 'Calculate brokerage, STT, exchange charges, GST on stock trades. Equity delivery, intraday, F&O calculator India.',
  keywords: 'brokerage calculator India, stock trading charges, Zerodha charges, STT calculator, breakeven price',
};

export default function BrokeragePage() {
  return <BrokerageCalculator />;
}