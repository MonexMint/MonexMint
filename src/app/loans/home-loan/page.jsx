
// ─────────────────────────────────────────────────────────────
// app/loans/home-loan/page.jsx  →  SERVER COMPONENT
// ─────────────────────────────────────────────────────────────

import HomeLoanCalculator from './HomeLoanCalculator';

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata = {
  title: 'Home Loan EMI Calculator | MonexMint',
  description:
    'Calculate home loan EMI with property value, down payment, LTV ratio and full amortization schedule. Free housing loan calculator India.',
  keywords: 'home loan EMI calculator, housing loan calculator, property loan EMI India, LTV calculator',
  openGraph: {
    title: 'Home Loan EMI Calculator | MonexMint',
    description: 'Calculate home loan EMI with down payment and amortization schedule.',
    type: 'website',
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Home Loan EMI Calculator',
  url: 'https://mywealthcircle.in/loans/home-loan',
  description: 'Calculate home loan EMI with property value and down payment.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

// ─── Page ─────────────────────────────────────────────────────
export default function HomeLoanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <HomeLoanCalculator />
    </>
  );
}