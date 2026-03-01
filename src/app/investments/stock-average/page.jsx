import StockAverageCalculator from './StockAverageCalculator';

export const metadata = {
  title: 'Stock Average Calculator | MONEX MINT',
  description:
    'Calculate average buy price across multiple stock purchases. Free stock averaging down calculator India.',
  keywords: 'stock average calculator, averaging down, stock portfolio average price India',
  alternates: {
    canonical: '/investments/stock-average',
  },
  openGraph: {
    title: 'Stock Average Calculator | MONEX MINT',
    description: 'Calculate average buy price across multiple stock purchases. Free stock averaging down calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Stock Average Calculator',
  url: 'https://www.monexmint.com/investments/stock-average',
  description: 'Calculate average buy price across multiple stock purchases. Free stock averaging down calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function StockAveragePage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <StockAverageCalculator />
    </>
  );
}