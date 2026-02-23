import TDSCalculator from './TDSCalculator';

export const metadata = {
  title: 'TDS Calculator - Tax Deducted at Source | My Wealth Circle',
  description: 'Calculate TDS on salary, interest, rent, professional fees. FY 2024-25 rates and thresholds.',
  keywords: 'TDS calculator India, tax deducted at source, TDS rates 2024, TDS on salary',
};

export default function TDSPage() {
  return <TDSCalculator />;
}