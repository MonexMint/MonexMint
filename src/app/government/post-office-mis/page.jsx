import PostOfficeMISCalculator from './PostOfficeMISCalculator';

export const metadata = {
  title: 'Post Office MIS Calculator - Monthly Income Scheme | MONEX MINT',
  description:
    'Calculate Post Office MIS monthly income. 7.4% p.a., 5-year tenure, max ₹9L single/₹15L joint account.',
  keywords: 'post office MIS calculator, monthly income scheme, POMIS calculator India, regular income',
  alternates: {
    canonical: '/government/post-office-mis',
  },
  openGraph: {
    title: 'Post Office MIS Calculator - Monthly Income Scheme | MONEX MINT',
    description: 'Calculate Post Office MIS monthly income. 7.4% p.a., 5-year tenure, max ₹9L single/₹15L joint account.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Post Office MIS Calculator - Monthly Income Scheme',
  url: 'https://www.monexmint.com/government/post-office-mis',
  description: 'Calculate Post Office MIS monthly income. 7.4% p.a., 5-year tenure, max ₹9L single/₹15L joint account.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function PostOfficeMISPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <PostOfficeMISCalculator />
    </>
  );
}