import SalaryCalculator from './SalaryCalculator';

export const metadata = {
 title: 'Salary Calculator - CTC to In-Hand | MONEX MINT',
  description:
    'Calculate take-home salary from CTC. Includes PF, gratuity, HRA, tax, bonus breakdown. In-hand salary calculator India.',
  keywords: 'salary calculator India, CTC to in-hand, take-home salary calculator, CTC breakdown',
  alternates: {
    canonical: '/salary-tax/salary',
  },
  openGraph: {
    title: 'Salary Calculator - CTC to In-Hand | MONEX MINT',
    description: 'Calculate take-home salary from CTC. Includes PF, gratuity, HRA, tax, bonus breakdown. In-hand salary calculator India.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Salary Calculator - CTC to In-Hand',
  url: 'https://www.monexmint.com/salary-tax/salary',
  description: 'Calculate take-home salary from CTC. Includes PF, gratuity, HRA, tax, bonus breakdown. In-hand salary calculator India.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function SalaryPage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <SalaryCalculator />
    </>
  );
}