import StepUpSIPCalculator from './StepUpSIPCalculator';

export const metadata = {
  title: 'Step-Up SIP Calculator | MONEX MINT',
  description:
    'Calculate step-up SIP returns with annual increment. See how increasing your SIP yearly grows wealth faster. Free step-up SIP calculator India.',
  keywords: 'step up SIP calculator, top up SIP, increasing SIP calculator, step up mutual fund India',
  alternates: {
    canonical: '/investments/step-up-sip',
  },
  openGraph: {
    title: 'Step-Up SIP Calculator | MONEX MINT',
    description: 'Calculate step-up SIP returns with annual increment. See how increasing your SIP yearly grows wealth faster. Free step-up SIP calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Step-Up SIP Calculator',
  url: 'https://www.monexmint.com/investments/step-up-sip',
  description: 'Calculate step-up SIP returns. See how increasing your SIP yearly grows wealth faster. Free step-up SIP calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function StepUpSIPPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <StepUpSIPCalculator />
    </>
  );
}