import CreditCardCalculator from './CreditCardCalculator';

export const metadata = {
  title: 'Credit Card Interest Calculator | My Wealth Circle',
  description: 'Calculate credit card interest and payoff time. Monthly compounding, minimum payment trap explained. CC debt calculator India.',
  keywords: 'credit card calculator, CC interest calculator, credit card payoff calculator India, minimum payment trap',
};

export default function CreditCardPage() {
  return <CreditCardCalculator />;
}