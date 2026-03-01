import MutualFundReturnsCalculator from './MutualFundReturnsCalculator';

export const metadata = {
  title: 'Mutual Fund Returns Calculator | MONEX MINT',
  description:
    'Use our mutual fund returns calculator to calculate results instantly.',
  keywords: 'mutual fund returns calculator, finance calculator, India',
  alternates: {
    canonical: '/investments/mutual-fund-returns',
  },
  openGraph: {
    title: 'Mutual Fund Returns Calculator | MONEX MINT',
    description: 'Use our mutual fund returns calculator to calculate results instantly.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mutual Fund Returns Calculator',
  url: 'https://www.monexmint.com/investments/mutual-fund-returns',
  description: 'Use our mutual fund returns calculator to calculate results instantly.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <MutualFundReturnsCalculator />
    </>
  );
}