import GSTCalculator from './GSTCalculator';

export const metadata = {
    title: 'GST Calculator - Add/Remove GST from Amount | MONEX MINT',
  description:
    'Calculate GST on base amount or remove GST from total. CGST, SGST, IGST breakdown. GST calculator India.',
  keywords: 'GST calculator India, add GST, remove GST, CGST SGST calculator, GST inclusive exclusive',
  alternates: {
    canonical: '/business-tax/gst',
  },
  openGraph: {
    title: 'GST Calculator - Add/Remove GST from Amount | MONEX MINT',
    description: 'Calculate GST on base amount or remove GST from total. CGST, SGST, IGST breakdown. GST calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GST Calculator - Add/Remove GST from Amount',
  url: 'https://www.monexmint.com/business-tax/gst',
  description: 'Calculate GST on base amount or remove GST from total. CGST, SGST, IGST breakdown. GST calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function GSTPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <GSTCalculator />
    </>
  );
}