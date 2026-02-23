# Monex Mint - Financial Calculators

A comprehensive Next.js 14 application with 40+ financial calculators for loans, investments, government schemes, banking, taxes, inflation, and more. **100% frontend with zero API dependencies.**

## 🎯 Features

### ✅ All 41 Calculators Implemented

#### 1. Loan Calculators (9)
- ✅ EMI Calculator
- ✅ Home Loan Calculator
- ✅ Car Loan Calculator
- ✅ Personal Loan Calculator
- ✅ Loan Eligibility Calculator
- ✅ Prepayment Calculator
- ✅ Flat vs Reducing Rate Calculator
- ✅ Loan Tenure Calculator
- ✅ Balance Transfer Calculator

#### 2. Investment Calculators (10)
- ✅ SIP Calculator
- ✅ Step-up SIP Calculator
- ✅ Lumpsum Calculator
- ✅ SWP Calculator
- ✅ CAGR Calculator
- ✅ Compound Interest Calculator
- ✅ Stock Average Calculator
- ✅ XIRR Calculator
- ✅ Goal Planning Calculator
- ✅ Mutual Fund Returns Calculator
- ✅ Risk-Return Calculator

#### 3. Government Scheme Calculators (9)
- ✅ PPF Calculator
- ✅ EPF Calculator
- ✅ NPS Calculator
- ✅ SSY (Sukanya Samriddhi Yojana)
- ✅ APY (Atal Pension Yojana)
- ✅ NSC (National Savings Certificate)
- ✅ Post Office MIS
- ✅ KVP (Kisan Vikas Patra)
- ✅ SCSS (Senior Citizen Savings Scheme)

#### 4. Banking Calculators (5)
- ✅ Fixed Deposit (FD) with TDS
- ✅ Recurring Deposit (RD)
- ✅ Savings Account Interest
- ✅ Overdraft Interest
- ✅ Credit Card Interest

#### 5. Salary & Tax Calculators (6)
- ✅ Salary Calculator (CTC to In-Hand)
- ✅ TDS Calculator
- ✅ Income Tax Calculator (Old vs New Regime)
- ✅ HRA Calculator
- ✅ Gratuity Calculator
- ✅ Bonus Calculator

#### 6. Tax & Business Calculators (5)
- ✅ GST Calculator
- ✅ Brokerage Calculator
- ✅ Capital Gains Calculator (LTCG/STCG)
- ✅ Stamp Duty Calculator (14 states)
- ✅ Professional Tax Calculator

#### 7. Inflation & Value Calculators (3)
- ✅ Inflation Calculator
- ✅ Real Return Calculator
- ✅ Future Value Calculator

---

## 🏗️ Architecture

### Pure Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: CSS Modules with custom design system
- **Charts**: Recharts for data visualization
- **Calculations**: Pure JavaScript in `src/lib/calculators.js`
- **No Backend Required**: All calculations done client-side
- **Fonts**: Sora & Inter

---

## 📋 Prerequisites

- Node.js 18.17 or later
- npm or yarn

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd my-wealth-circle
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
my-wealth-circle/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.jsx                # Root layout
│   │   ├── page.jsx                  # Home page
│   │   │
│   │   ├── loans/                    # Loan calculators
│   │   │   ├── emi/
│   │   │   ├── home-loan/
│   │   │   ├── car-loan/
│   │   │   ├── personal-loan/
│   │   │   ├── loan-eligibility/
│   │   │   ├── prepayment/
│   │   │   ├── flat-vs-reducing/
│   │   │   ├── loan-tenure/
│   │   │   └── balance-transfer/
│   │   │
│   │   ├── investments/              # Investment calculators
│   │   │   ├── sip/
│   │   │   ├── step-up-sip/
│   │   │   ├── lumpsum/
│   │   │   ├── swp/
│   │   │   ├── cagr/
│   │   │   ├── compound-interest/
│   │   │   ├── stock-average/
│   │   │   ├── xirr/
│   │   │   ├── goal-planning/
│   │   │   ├── mutual-fund-returns/
│   │   │   └── risk-return/
│   │   │
│   │   ├── government-schemes/       # Government scheme calculators
│   │   │   ├── ppf/
│   │   │   ├── epf/
│   │   │   ├── nps/
│   │   │   ├── ssy/
│   │   │   ├── apy/
│   │   │   ├── nsc/
│   │   │   ├── post-office-mis/
│   │   │   ├── kvp/
│   │   │   └── scss/
│   │   │
│   │   ├── banking/                  # Banking calculators
│   │   │   ├── fd/
│   │   │   ├── rd/
│   │   │   ├── savings-interest/
│   │   │   ├── overdraft/
│   │   │   └── credit-card/
│   │   │
│   │   ├── salary-tax/               # Salary & tax calculators
│   │   │   ├── salary-calculator/
│   │   │   ├── tds-calculator/
│   │   │   ├── income-tax-calculator/
│   │   │   ├── hra-calculator/
│   │   │   ├── gratuity-calculator/
│   │   │   └── bonus-calculator/
│   │   │
│   │   ├── tax-business/             # Tax & business calculators
│   │   │   ├── gst-calculator/
│   │   │   ├── brokerage-calculator/
│   │   │   ├── capital-gains/
│   │   │   ├── stamp-duty/
│   │   │   └── professional-tax/
│   │   │
│   │   └── inflation-value/          # Inflation & value calculators
│   │       ├── inflation-calculator/
│   │       ├── real-return-calculator/
│   │       └── future-value-calculator/
│   │
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Card.jsx
│   │   ├── charts/                   # Chart components
│   │   │   ├── LoanPieChart.jsx
│   │   │   └── InvestmentBarChart.jsx
│   │   ├── ads/                      # Ad placeholder components
│   │   │   └── AdSlot.jsx
│   │   └── layout/                   # Layout components
│   │       └── Header.jsx
│   │
│   ├── lib/
│   │   ├── calculators.js            # ALL calculator functions (2500+ lines)
│   │   └── constants.js              # Utilities & formatters
│   │
│   └── styles/
│       └── globals.css               # Global styles
│
├── public/                           # Static assets
├── .gitignore                        # Git ignore rules
├── jsconfig.json                     # Path aliases
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies
├── package-lock.json                 # Dependency lock file
└── README.md                         # This file
```

---

## 🎨 Design System

### Colors
- **Primary**: #6366f1 (Indigo)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Danger**: #ef4444 (Red)

### Typography
- **Primary Font**: Sora (Display & UI)
- **Monospace**: Inter (Numbers & Code)

### Components
- **Button**: Multiple variants (primary, secondary, outline, danger, success)
- **Input**: With prefix/suffix support, validation states
- **Card**: Hoverable, gradient, outlined, success, warning, danger variants
- **Charts**: Pie charts, bar charts with custom tooltips

---

## 🔧 Calculator Functions

All calculator logic is in `src/lib/calculators.js`:

```javascript
// Loan Calculators
calculateEMI(principal, annualRate, tenureMonths)
calculateHomeLoanEMI(propertyValue, downPaymentPercent, annualRate, tenureYears, processingFeePercent)
calculateCarLoanEMI(exShowroomPrice, downPaymentAmount, annualRate, tenureYears, insuranceAmount, rtoPercent)
// ... 40+ more functions

// Investment Calculators
calculateSIP(monthlyInvestment, annualReturnRate, tenureYears)
calculateLumpsum(principal, annualReturnRate, tenureYears)
// ... and more

// Government Schemes
calculatePPF(yearlyDeposit, tenureYears, annualRate)
calculateEPF(monthlyBasicPlusDa, employeeContributionPercent, currentCorpus, tenureYears, annualRate)
// ... and more
```

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly UI elements
- Collapsible navigation on mobile

---

## 🚀 Production Build

```bash
npm run build
npm start
```

Or deploy to Vercel:

```bash
npm install -g vercel
vercel
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] All 41 calculators load without errors
- [ ] Input validation works correctly
- [ ] Calculations are accurate
- [ ] Charts render properly
- [ ] Mobile responsive on all pages
- [ ] No console errors

---

## 📝 Key Features

### 1. **Zero Dependencies on Backend**
All calculations run in the browser using pure JavaScript.

### 2. **Instant Results**
No API calls = No loading time. Results appear as you type (300ms debounce).

### 3. **Comprehensive Educational Content**
Each calculator includes:
- How it works
- Formula explanations
- Example calculations
- Pro tips
- Common mistakes to avoid

### 4. **Professional UI**
- Clean, modern design
- Green gradient theme
- Interactive charts
- Smooth animations

### 5. **SEO Optimized**
- Unique meta titles and descriptions for all 41 pages
- Keyword-rich content
- Next.js 14 App Router for best SEO

---

## 🎯 Usage Examples

### EMI Calculator
```javascript
import { calculateEMI } from '@/lib/calculators';

const result = calculateEMI(
  1000000,  // Principal: ₹10 lakh
  8.5,      // Interest: 8.5% p.a.
  240       // Tenure: 20 years (240 months)
);

console.log(result.emi);              // ₹8,678
console.log(result.totalInterest);    // ₹10,82,720
console.log(result.totalPayable);     // ₹20,82,720
```

### SIP Calculator
```javascript
import { calculateSIP } from '@/lib/calculators';

const result = calculateSIP(
  10000,  // Monthly SIP: ₹10,000
  12,     // Expected return: 12% p.a.
  10      // Tenure: 10 years
);

console.log(result.maturityValue);   // ₹23,23,391
console.log(result.totalInvested);   // ₹12,00,000
console.log(result.totalReturns);    // ₹11,23,391
```

---

## 🐛 Common Issues

### Issue: "Module not found: Can't resolve '@/components/...'"

**Solution**: Check `jsconfig.json` has correct path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Charts not rendering

**Solution**: Ensure `recharts` is installed:
```bash
npm install recharts
```

---

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (ES6+)
- **Styling**: CSS Modules
- **Charts**: Recharts
- **Icons**: Lucide React (if needed)
- **Deployment**: Vercel (recommended)

---

## 🤝 Contributing

Feel free to:
1. Add new calculators
2. Improve existing formulas
3. Enhance UI/UX
4. Fix bugs
5. Add tests

---

## 📄 License

MIT License - Free to use for personal and commercial projects.

---

## 📞 Support

For issues or questions:
1. Check existing calculator implementations as examples
2. Review `src/lib/calculators.js` for formula references
3. Refer to component documentation in `src/components/`

---

## 🎉 Acknowledgments

- Formula references: RBI, PFRDA, Income Tax Department India
- Design inspiration: Modern financial apps
- Built with ❤️ for Indian finance calculations

---

**Status**: ✅ Production Ready  
**Calculators**: 41/41 Complete  
**Backend**: None (Pure Frontend)  
**Deployment**: Vercel Ready  

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel
```

Visit [http://localhost:3000](http://localhost:3000) and start calculating! 🎯