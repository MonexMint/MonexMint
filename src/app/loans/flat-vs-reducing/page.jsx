import FlatVsReducingCalculator from './flatvsreducingcalculator';

export const metadata = {
  title: 'Flat vs Reducing Interest Rate Calculator | MONEX MINT',
  description:
    'Compare flat rate vs reducing balance rate on your loan. Find the equivalent reducing rate for any flat rate loan.',
  keywords: 'flat rate vs reducing rate, loan interest comparison calculator India',
  alternates: {
    canonical: '/loans/flat-vs-reducing',
  },
  openGraph: {
    title: 'Flat vs Reducing Interest Rate Calculator | MONEX MINT',
    description: 'Compare flat rate vs reducing balance rate on your loan. Find the equivalent reducing rate for any flat rate loan.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Flat vs Reducing Interest Rate Calculator',
  url: 'https://www.monexmint.com/loans/flat-vs-reducing',
  description: 'Compare flat rate vs reducing balance rate on your loan. Find the equivalent reducing rate for any flat rate loan.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function FlatVsReducingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <FlatVsReducingCalculator />
    </>
  );
}