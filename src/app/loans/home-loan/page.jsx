// src/app/loans/home-loan/page.jsx — SERVER COMPONENT (no 'use client')

import HomeLoanCalculator from './HomeLoanCalculator';

export const metadata = {
  title: 'Home Loan EMI Calculator',
  description:
    'Calculate home loan EMI with property value, down payment, LTV ratio and full amortization schedule. Free housing loan calculator India.',
  keywords: 'home loan EMI calculator, housing loan calculator, property loan EMI India, LTV calculator',
  openGraph: {
    title: 'Home Loan EMI Calculator | MONEX MINT',
    description: 'Calculate home loan EMI with down payment and amortization schedule.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Home Loan EMI Calculator',
  url: 'https://monexmint.com/loans/home-loan',
  description: 'Calculate home loan EMI with property value and down payment.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

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