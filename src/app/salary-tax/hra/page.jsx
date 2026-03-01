import HRACalculator from './HRACalculator';

export const metadata = {
  title: 'HRA Calculator - House Rent Allowance Exemption | MONEX MINT',
  description:
    'Calculate HRA tax exemption based on salary, rent paid, and city. Save tax on house rent allowance India.',
  keywords: 'HRA calculator India, house rent allowance exemption, HRA tax benefit calculator, rent exemption',
  alternates: {
    canonical: '/salary-tax/hra',
  },
  openGraph: {
    title: 'HRA Calculator - House Rent Allowance Exemption | MONEX MINT',
    description: 'Calculate HRA tax exemption based on salary, rent paid, and city. Save tax on house rent allowance India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'HRA Calculator - House Rent Allowance Exemption',
  url: 'https://www.monexmint.com/salary-tax/hra',
  description: 'Calculate HRA tax exemption based on salary, rent paid, and city. Save tax on house rent allowance India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function HRAPage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <HRACalculator />
    </>
  );
}