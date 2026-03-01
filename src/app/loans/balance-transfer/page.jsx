import BalanceTransferCalculator from './balancetransfercalculator';

export const metadata = {
  title: 'Loan Balance Transfer Calculator | MONEX MINT',
  description:
    'Calculate savings from transferring your loan to a lower interest rate lender. Break-even analysis included.',
  keywords: 'loan balance transfer calculator, home loan transfer savings India',
  alternates: {
    canonical: '/loans/balance-transfer',
  },
  openGraph: {
    title: 'Loan Balance Transfer Calculator | MONEX MINT',
    description: 'Calculate savings from transferring your loan to a lower interest rate lender.Break-even analysis included.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Loan Balance Transfer Calculator',
  url: 'https://www.monexmint.com/loans/balance-transfer',
  description: 'Calculate savings from transferring your loan to a lower interest rate lender. Break-even analysis included.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function BalanceTransferPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <BalanceTransferCalculator />
    </>
  );
}