import XIRRCalculator from './XIRRCalculator';

export const metadata = {
 title: 'XIRR Calculator | MONEX MINT',
  description:
    'Calculate XIRR for irregular mutual fund SIP investments. Extended Internal Rate of Return calculator India.',
  keywords: 'XIRR calculator, mutual fund XIRR, irregular SIP return calculator India',
  alternates: {
    canonical: '/investments/xirr',
  },
  openGraph: {
    title: 'XIRR Calculator | MONEX MINT',
    description: 'Calculate XIRR for irregular mutual fund SIP investments. Extended Internal Rate of Return calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'XIRR Calculator',
  url: 'https://www.monexmint.com/investments/xirr',
  description: 'Calculate XIRR for irregular mutual fund SIP investments. Extended Internal Rate of Return calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function XIRRPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <XIRRCalculator />
    </>
  );
}