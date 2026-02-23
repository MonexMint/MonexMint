import GSTCalculator from './GSTCalculator';

export const metadata = {
  title: 'GST Calculator - Add/Remove GST from Amount | My Wealth Circle',
  description: 'Calculate GST on base amount or remove GST from total. CGST, SGST, IGST breakdown. GST calculator India.',
  keywords: 'GST calculator India, add GST, remove GST, CGST SGST calculator, GST inclusive exclusive',
};

export default function GSTPage() {
  return <GSTCalculator />;
}