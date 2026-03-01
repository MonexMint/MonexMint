import BonusCalculator from './BonusCalculator';

export const metadata = {
  title: 'Bonus Calculator - Calculate In-Hand Bonus After Tax | MONEX MINT',
  description:
    'Calculate bonus after tax deduction. See how much bonus you receive in hand after income tax.',
  keywords: 'bonus calculator India, performance bonus tax, variable pay calculator, bonus after tax',
  alternates: {
    canonical: '/salary-tax/bonus',
  },
  openGraph: {
    title: 'Bonus Calculator - Calculate In-Hand Bonus After Tax | MONEX MINT',
    description: 'Calculate bonus after tax deduction. See how much bonus you receive in hand after income tax.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bonus Calculator - Calculate In-Hand Bonus After Tax',
  url: 'https://www.monexmint.com/salary-tax/bonus',
  description: 'Calculate bonus after tax deduction. See how much bonus you receive in hand after income tax.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function BonusPage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <BonusCalculator />
    </>
  );
}