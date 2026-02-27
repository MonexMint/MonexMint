// src/app/loans/emi/page.jsx — SERVER COMPONENT (no 'use client')

import EMICalculator from './EMICalculator';

export const metadata = {
  title: 'EMI Calculator',        // FIX: removed trailing space after 'Calculator '
  description:
    'Calculate your loan EMI instantly. Free EMI calculator for home, car & personal loans with full amortisation schedule.',
  keywords: 'EMI calculator, loan EMI, monthly installment calculator, India',
  alternates: {
    canonical: '/loans/emi',
  },
  openGraph: {
    title: 'EMI Calculator | MONEX MINT',
    description: 'Calculate your loan EMI instantly. Free EMI calculator for home, car & personal loans.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EMI Calculator',
  url: 'https://www.monexmint.com/loans/emi',
  description: 'Free EMI calculator for home, car and personal loans.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function EMIPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <EMICalculator />
    </>
  );
}