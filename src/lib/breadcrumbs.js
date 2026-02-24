/**
 * MONEX MINT — Breadcrumb Config
 *
 * RULE: Last item must have NO href — it renders as <span> (current page)
 * All other items must have href — they render as <a> links
 *
 * Breadcrumb component checks: crumb.href ? <a> : <span>
 * This makes server/client output identical = no hydration errors
 */

export const BREADCRUMBS = {

  // ── LOAN CALCULATORS ─────────────────────────────────────
  emi:             [{ label: 'Calculators', href: '/calculators' }, { label: 'EMI Calculator' }],
  homeLoan:        [{ label: 'Calculators', href: '/calculators' }, { label: 'Home Loan' }],
  carLoan:         [{ label: 'Calculators', href: '/calculators' }, { label: 'Car Loan' }],
  personalLoan:    [{ label: 'Calculators', href: '/calculators' }, { label: 'Personal Loan' }],
  loanEligibility: [{ label: 'Calculators', href: '/calculators' }, { label: 'Loan Eligibility' }],
  prepayment:      [{ label: 'Calculators', href: '/calculators' }, { label: 'Prepayment Calculator' }],
  flatVsReducing:  [{ label: 'Calculators', href: '/calculators' }, { label: 'Flat vs Reducing Rate' }],
  loanTenure:      [{ label: 'Calculators', href: '/calculators' }, { label: 'Loan Tenure Calculator' }],
  balanceTransfer: [{ label: 'Calculators', href: '/calculators' }, { label: 'Balance Transfer' }],

  // ── INVESTMENT CALCULATORS ────────────────────────────────
  sip:             [{ label: 'Calculators', href: '/calculators' }, { label: 'SIP Calculator' }],
  stepUpSip:       [{ label: 'Calculators', href: '/calculators' }, { label: 'Step-Up SIP Calculator' }],
  lumpsum:         [{ label: 'Calculators', href: '/calculators' }, { label: 'Lumpsum Calculator' }],
  swp:             [{ label: 'Calculators', href: '/calculators' }, { label: 'SWP Calculator' }],
  cagr:            [{ label: 'Calculators', href: '/calculators' }, { label: 'CAGR Calculator' }],
  compoundInterest:[{ label: 'Calculators', href: '/calculators' }, { label: 'Compound Interest' }],
  stockAverage:    [{ label: 'Calculators', href: '/calculators' }, { label: 'Stock Average Calculator' }],
  xirr:            [{ label: 'Calculators', href: '/calculators' }, { label: 'XIRR Calculator' }],
  goalPlanning:    [{ label: 'Calculators', href: '/calculators' }, { label: 'Goal Planning' }],
  mutualFund:      [{ label: 'Calculators', href: '/calculators' }, { label: 'Mutual Fund Returns' }],
  riskReturn:      [{ label: 'Calculators', href: '/calculators' }, { label: 'Risk vs Return' }],

  // ── GOVERNMENT SAVINGS ────────────────────────────────────
  ppf:             [{ label: 'Calculators', href: '/calculators' }, { label: 'PPF Calculator' }],
  epf:             [{ label: 'Calculators', href: '/calculators' }, { label: 'EPF Calculator' }],
  nps:             [{ label: 'Calculators', href: '/calculators' }, { label: 'NPS Calculator' }],
  ssy:             [{ label: 'Calculators', href: '/calculators' }, { label: 'Sukanya Samriddhi (SSY)' }],
  apy:             [{ label: 'Calculators', href: '/calculators' }, { label: 'Atal Pension (APY)' }],
  nsc:             [{ label: 'Calculators', href: '/calculators' }, { label: 'NSC Calculator' }],
  kvp:             [{ label: 'Calculators', href: '/calculators' }, { label: 'KVP Calculator' }],
  scss:            [{ label: 'Calculators', href: '/calculators' }, { label: 'SCSS Calculator' }],
  postOfficeMis:   [{ label: 'Calculators', href: '/calculators' }, { label: 'Post Office MIS' }],

  // ── BANKING ───────────────────────────────────────────────
  fd:              [{ label: 'Calculators', href: '/calculators' }, { label: 'FD Calculator' }],
  rd:              [{ label: 'Calculators', href: '/calculators' }, { label: 'RD Calculator' }],
  savingsInterest: [{ label: 'Calculators', href: '/calculators' }, { label: 'Savings Interest' }],
  overdraft:       [{ label: 'Calculators', href: '/calculators' }, { label: 'Overdraft Calculator' }],
  creditCard:      [{ label: 'Calculators', href: '/calculators' }, { label: 'Credit Card Interest' }],

  // ── SALARY & TAX ──────────────────────────────────────────
  incomeTax:       [{ label: 'Calculators', href: '/calculators' }, { label: 'Income Tax Calculator' }],
  salary:          [{ label: 'Calculators', href: '/calculators' }, { label: 'Salary Calculator' }],
  takeHome:        [{ label: 'Calculators', href: '/calculators' }, { label: 'Take Home Salary' }],
  hra:             [{ label: 'Calculators', href: '/calculators' }, { label: 'HRA Calculator' }],
  gratuity:        [{ label: 'Calculators', href: '/calculators' }, { label: 'Gratuity Calculator' }],
  tds:             [{ label: 'Calculators', href: '/calculators' }, { label: 'TDS Calculator' }],
  bonus:           [{ label: 'Calculators', href: '/calculators' }, { label: 'Bonus Calculator' }],

  // ── BUSINESS TAX ──────────────────────────────────────────
  gst:             [{ label: 'Calculators', href: '/calculators' }, { label: 'GST Calculator' }],
  brokerage:       [{ label: 'Calculators', href: '/calculators' }, { label: 'Brokerage Calculator' }],
  capitalGains:    [{ label: 'Calculators', href: '/calculators' }, { label: 'Capital Gains Tax' }],
  stampDuty:       [{ label: 'Calculators', href: '/calculators' }, { label: 'Stamp Duty Calculator' }],
  professionalTax: [{ label: 'Calculators', href: '/calculators' }, { label: 'Professional Tax' }],

  // ── INFLATION & VALUE ─────────────────────────────────────
  inflation:       [{ label: 'Calculators', href: '/calculators' }, { label: 'Inflation Calculator' }],
  realRate:        [{ label: 'Calculators', href: '/calculators' }, { label: 'Real Rate of Return' }],
  futureValue:     [{ label: 'Calculators', href: '/calculators' }, { label: 'Future Value Calculator' }],
};