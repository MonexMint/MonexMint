/**
 * MONEX MINT — Central Breadcrumb Config
 * 
 * Usage in any calculator client component:
 *   import { BREADCRUMBS } from '@/lib/breadcrumbs';
 *   <Breadcrumb items={BREADCRUMBS.emi} />
 */

const CALC = { label: 'Calculators', href: '/calculators' };

export const BREADCRUMBS = {

  // ── LOAN CALCULATORS ──────────────────────────────────────
  emi:             [CALC, { label: 'Loan Calculators', href: '/calculators' }, { label: 'EMI Calculator' }],
  homeLoan:        [CALC, { label: 'Loan Calculators', href: '/calculators' }, { label: 'Home Loan' }],
  carLoan:         [CALC, { label: 'Loan Calculators', href: '/calculators' }, { label: 'Car Loan' }],
  personalLoan:    [CALC, { label: 'Loan Calculators', href: '/calculators' }, { label: 'Personal Loan' }],
  loanEligibility: [CALC, { label: 'Loan Calculators', href: '/calculators' }, { label: 'Loan Eligibility' }],
  prepayment:      [CALC, { label: 'Loan Calculators', href: '/calculators' }, { label: 'Prepayment Calculator' }],
  flatVsReducing:  [CALC, { label: 'Loan Calculators', href: '/calculators' }, { label: 'Flat vs Reducing Rate' }],
  loanTenure:      [CALC, { label: 'Loan Calculators', href: '/calculators' }, { label: 'Loan Tenure Calculator' }],
  balanceTransfer: [CALC, { label: 'Loan Calculators', href: '/calculators' }, { label: 'Balance Transfer' }],

  // ── INVESTMENT CALCULATORS ────────────────────────────────
  sip:             [CALC, { label: 'Investment & Wealth', href: '/calculators' }, { label: 'SIP Calculator' }],
  stepUpSip:       [CALC, { label: 'Investment & Wealth', href: '/calculators' }, { label: 'Step-Up SIP Calculator' }],
  lumpsum:         [CALC, { label: 'Investment & Wealth', href: '/calculators' }, { label: 'Lumpsum Calculator' }],
  swp:             [CALC, { label: 'Investment & Wealth', href: '/calculators' }, { label: 'SWP Calculator' }],
  cagr:            [CALC, { label: 'Investment & Wealth', href: '/calculators' }, { label: 'CAGR Calculator' }],
  compoundInterest:[CALC, { label: 'Investment & Wealth', href: '/calculators' }, { label: 'Compound Interest' }],
  stockAverage:    [CALC, { label: 'Investment & Wealth', href: '/calculators' }, { label: 'Stock Average Calculator' }],
  xirr:            [CALC, { label: 'Investment & Wealth', href: '/calculators' }, { label: 'XIRR Calculator' }],
  goalPlanning:    [CALC, { label: 'Investment & Wealth', href: '/calculators' }, { label: 'Goal Planning' }],
  mutualFund:      [CALC, { label: 'Investment & Wealth', href: '/calculators' }, { label: 'Mutual Fund Returns' }],
  riskReturn:      [CALC, { label: 'Investment & Wealth', href: '/calculators' }, { label: 'Risk vs Return' }],

  // ── GOVERNMENT SAVINGS ────────────────────────────────────
  ppf:             [CALC, { label: 'Government Savings', href: '/calculators' }, { label: 'PPF Calculator' }],
  epf:             [CALC, { label: 'Government Savings', href: '/calculators' }, { label: 'EPF Calculator' }],
  nps:             [CALC, { label: 'Government Savings', href: '/calculators' }, { label: 'NPS Calculator' }],
  ssy:             [CALC, { label: 'Government Savings', href: '/calculators' }, { label: 'Sukanya Samriddhi (SSY)' }],
  apy:             [CALC, { label: 'Government Savings', href: '/calculators' }, { label: 'Atal Pension (APY)' }],
  nsc:             [CALC, { label: 'Government Savings', href: '/calculators' }, { label: 'NSC Calculator' }],
  kvp:             [CALC, { label: 'Government Savings', href: '/calculators' }, { label: 'KVP Calculator' }],
  scss:            [CALC, { label: 'Government Savings', href: '/calculators' }, { label: 'SCSS Calculator' }],
  postOfficeMis:   [CALC, { label: 'Government Savings', href: '/calculators' }, { label: 'Post Office MIS' }],

  // ── BANKING ───────────────────────────────────────────────
  fd:              [CALC, { label: 'Banking & Deposits', href: '/calculators' }, { label: 'FD Calculator' }],
  rd:              [CALC, { label: 'Banking & Deposits', href: '/calculators' }, { label: 'RD Calculator' }],
  savingsInterest: [CALC, { label: 'Banking & Deposits', href: '/calculators' }, { label: 'Savings Interest' }],
  overdraft:       [CALC, { label: 'Banking & Deposits', href: '/calculators' }, { label: 'Overdraft Calculator' }],
  creditCard:      [CALC, { label: 'Banking & Deposits', href: '/calculators' }, { label: 'Credit Card Interest' }],

  // ── SALARY & TAX ──────────────────────────────────────────
  incomeTax:       [CALC, { label: 'Salary & Tax', href: '/calculators' }, { label: 'Income Tax Calculator' }],
  salary:          [CALC, { label: 'Salary & Tax', href: '/calculators' }, { label: 'Salary Calculator' }],
  takeHome:        [CALC, { label: 'Salary & Tax', href: '/calculators' }, { label: 'Take Home Salary' }],
  hra:             [CALC, { label: 'Salary & Tax', href: '/calculators' }, { label: 'HRA Calculator' }],
  gratuity:        [CALC, { label: 'Salary & Tax', href: '/calculators' }, { label: 'Gratuity Calculator' }],
  tds:             [CALC, { label: 'Salary & Tax', href: '/calculators' }, { label: 'TDS Calculator' }],
  bonus:           [CALC, { label: 'Salary & Tax', href: '/calculators' }, { label: 'Bonus Calculator' }],

  // ── BUSINESS TAX ──────────────────────────────────────────
  gst:             [CALC, { label: 'Tax & Business', href: '/calculators' }, { label: 'GST Calculator' }],
  brokerage:       [CALC, { label: 'Tax & Business', href: '/calculators' }, { label: 'Brokerage Calculator' }],
  capitalGains:    [CALC, { label: 'Tax & Business', href: '/calculators' }, { label: 'Capital Gains Tax' }],
  stampDuty:       [CALC, { label: 'Tax & Business', href: '/calculators' }, { label: 'Stamp Duty Calculator' }],
  professionalTax: [CALC, { label: 'Tax & Business', href: '/calculators' }, { label: 'Professional Tax' }],

  // ── INFLATION & VALUE ─────────────────────────────────────
  inflation:       [CALC, { label: 'Inflation & Value', href: '/calculators' }, { label: 'Inflation Calculator' }],
  realRate:        [CALC, { label: 'Inflation & Value', href: '/calculators' }, { label: 'Real Rate of Return' }],
  futureValue:     [CALC, { label: 'Inflation & Value', href: '/calculators' }, { label: 'Future Value Calculator' }],
};