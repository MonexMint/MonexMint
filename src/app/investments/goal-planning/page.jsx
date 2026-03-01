import GoalPlanningCalculator from './GoalPlanningCalculator';

export const metadata = {
   title: 'Goal Planning Calculator | MONEX MINT',
  description:
    'Plan for education, house, retirement. Calculate required SIP and lumpsum for your financial goals with inflation adjustment.',
  keywords: 'goal planning calculator, financial goal calculator, retirement planning, education fund calculator India',
  alternates: {
    canonical: '/investments/goal-planning',
  },
  openGraph: {
    title: 'Goal Planning Calculator | MONEX MINT',
    description: 'Plan for education, house, retirement. Calculate required SIP and lumpsum for your financial goals with inflation adjustment.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Goal Planning Calculator',
  url: 'https://www.monexmint.com/investments/goal-planning',
  description: 'Plan for education, house, retirement. Calculate required SIP and lumpsum for your financial goals with inflation adjustment.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function GoalPlanningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <GoalPlanningCalculator />
    </>
  );
}