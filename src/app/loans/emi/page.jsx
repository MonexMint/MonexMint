// import EMICalculator from './EMICalculator';

// export const metadata = {
//   title: 'EMI Calculator 2026 - Calculate Loan EMI Online with Amortization',
//   description:
//   'Free EMI Calculator 2026. Calculate home, car & personal loan EMI instantly with full amortization schedule. 100% accurate & easy to use.',
//   keywords: 'EMI calculator, loan EMI, monthly installment calculator, India',
//   alternates: {
//     canonical: '/loans/emi',
//   },
//   openGraph: {
//     title: 'EMI Calculator 2026 - Calculate Loan EMI Online with Amortization',
//     description:
//   'Free EMI Calculator 2026. Calculate home, car & personal loan EMI instantly with full amortization schedule. 100% accurate & easy to use.',
//     type: 'website',
//   },
// };

// const SCHEMA = {
//   '@context': 'https://schema.org',
//   '@type': 'WebApplication',
//   name: 'EMI Calculator',
//   url: 'https://www.monexmint.com/loans/emi',
//   description: 'Calculate your loan EMI instantly. Free EMI calculator for home, car & personal loans with full amortisation schedule.',
//   applicationCategory: 'FinanceApplication',
//   operatingSystem: 'All',
//   isAccessibleForFree: true,
//   offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
// };
// const FAQ_SCHEMA = {
//   "@context": "https://schema.org",
//   "@type": "FAQPage",
//   "mainEntity": [
//     {
//       "@type": "Question",
//       "name": "What is EMI?",
//       "acceptedAnswer": {
//         "@type": "Answer",
//         "text": "EMI stands for Equated Monthly Installment. It is the fixed monthly amount paid to repay a loan."
//       }
//     },
//     {
//       "@type": "Question",
//       "name": "How is EMI calculated?",
//       "acceptedAnswer": {
//         "@type": "Answer",
//         "text": "EMI is calculated using principal amount, interest rate and loan tenure using the standard EMI formula."
//       }
//     },
//     {
//       "@type": "Question",
//       "name": "Can I reduce my EMI?",
//       "acceptedAnswer": {
//         "@type": "Answer",
//         "text": "You can reduce EMI by increasing tenure, negotiating interest rate, or making prepayments."
//       }
//     }
//   ]
// };

// export default function EMIPage() {
//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
//       />
//       <EMICalculator />
//     </>
//   );
// }
import EMICalculator from './EMICalculator';

export const metadata = {
  title: 'EMI Calculator 2026 - Calculate Loan EMI Online with Amortization',
  description:
    'Free EMI Calculator 2026. Calculate home, car & personal loan EMI instantly with full amortization schedule. 100% accurate & easy to use.',
  keywords: 'EMI calculator, loan EMI, monthly installment calculator, India',
  alternates: {
    canonical: '/loans/emi',
  },
  openGraph: {
    title: 'EMI Calculator 2026 - Calculate Loan EMI Online with Amortization',
    description:
      'Free EMI Calculator 2026. Calculate home, car & personal loan EMI instantly with full amortization schedule. 100% accurate & easy to use.',
    type: 'website',
  },
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EMI Calculator',
  url: 'https://www.monexmint.com/loans/emi',
  description: 'Calculate your loan EMI instantly. Free EMI calculator for home, car & personal loans with full amortisation schedule.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is EMI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "EMI stands for Equated Monthly Installment. It is the fixed monthly amount paid to repay a loan."
      }
    },
    {
      "@type": "Question",
      "name": "How is EMI calculated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "EMI is calculated using principal amount, interest rate and loan tenure using the standard EMI formula."
      }
    },
    {
      "@type": "Question",
      "name": "Can I reduce my EMI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can reduce EMI by increasing tenure, negotiating interest rate, or making prepayments."
      }
    }
  ]
};

export default function EMIPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <EMICalculator />
    </>
  );
}