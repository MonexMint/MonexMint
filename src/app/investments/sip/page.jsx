import SIPCalculator from './SIPCalculator';

export const metadata = {
  title: 'SIP Calculator | MONEX MINT',
  description:
    'Calculate SIP returns, maturity value and wealth gained. Free SIP calculator for mutual fund investments with yearly breakdown. India.',
  keywords: 'SIP calculator, mutual fund SIP, systematic investment plan calculator, SIP returns India',
   alternates: {
    canonical: '/investments/sip',
  },
  openGraph: {
    title: 'SIP Calculator | MONEX MINT',
    description: 'Calculate SIP returns, maturity value and wealth gained. Free SIP calculator for mutual fund investments with yearly breakdown. India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SIP Calculator',
  url: 'https://www.monexmint.com/investments/sip',
  description: 'Calculate SIP returns, maturity value and wealth gained. Free SIP calculator for mutual fund investments with yearly breakdown. India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function SIPPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <SIPCalculator />
    </>
  );
}