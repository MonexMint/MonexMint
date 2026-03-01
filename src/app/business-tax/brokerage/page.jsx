import BrokerageCalculator from './Brokeragecalculator.jsx';

export const metadata = {
  title: 'Brokerage Calculator - Trading Charges & Net P&L | MONEX MINT',
  description:
    'Calculate brokerage, STT, exchange charges, GST on stock trades. Equity delivery, intraday, F&O calculator India.',
  keywords: 'brokerage calculator India, stock trading charges, Zerodha charges, STT calculator, breakeven price',
  alternates: {
    canonical: '/business-tax/brokerage',
  },
  openGraph: {
    title: 'Brokerage Calculator - Trading Charges & Net P&L | MONEX MINT',
    description: 'Calculate brokerage, STT, exchange charges, GST on stock trades. Equity delivery, intraday, F&O calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Brokerage Calculator - Trading Charges & Net P&L',
  url: 'https://www.monexmint.com/business-tax/brokerage',
  description: 'Calculate brokerage, STT, exchange charges, GST on stock trades. Equity delivery, intraday, F&O calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};


export default function BrokeragePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <BrokerageCalculator />
    </>
  );
}