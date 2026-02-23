// ─────────────────────────────────────────────────────────────
// app/salary/take-home/page.jsx  →  SERVER COMPONENT (no 'use client')
// Rule: metadata export ONLY works in Server Components
// This file ONLY does: SEO metadata + JSON-LD + renders client component
// ─────────────────────────────────────────────────────────────

import TakeHomeSalaryCalculator from './TakeHomeSalaryCalculator';

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata = {
  title: 'Take-Home Salary Calculator | MonexMint',
  description:
    'Calculate your monthly take-home salary from CTC. Free in-hand salary calculator with PF, income tax, HRA and all deductions for India.',
  keywords: 'take home salary calculator, in-hand salary, CTC calculator, salary after tax, India',
  openGraph: {
    title: 'Take-Home Salary Calculator | MonexMint',
    description:
      'Calculate your monthly take-home salary from CTC with all deductions including PF, income tax, and more.',
    type: 'website',
  },
};

// ─── JSON-LD Schema ───────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Take-Home Salary Calculator',
  url: 'https://mywealthcircle.in/salary/take-home',
  description: 'Free take-home salary calculator for India. Calculate in-hand salary from CTC.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

// ─── Page (Server Component) ───────────────────────────────────
export default function TakeHomeSalaryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <TakeHomeSalaryCalculator />
    </>
  );
}