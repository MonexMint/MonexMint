'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateSCSS } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

export default function SCSSCalculator() {

  const [formData, setFormData] = useState({
    principal:   '1500000',
    annualRate:  '8.2',
    tenureYears: '5',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const principal = parseFloat(formData.principal);
    const rate      = parseFloat(formData.annualRate);
    const years     = parseFloat(formData.tenureYears);

    if (!principal || principal < 1000 || principal > 3000000) {
      setResult({ error: principal > 3000000 ? 'Maximum deposit in SCSS is ₹30,00,000.' : 'Minimum deposit is ₹1,000.' });
      return;
    }

    setLoading(true);
    const data = calculateSCSS(principal, rate, years);
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <Breadcrumb items={BREADCRUMBS.scss} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>SCSS Calculator</h1>
          <p className={styles.description}>
            Calculate Senior Citizen Savings Scheme quarterly interest income. 8.2% p.a., 
            5-year tenure (extendable 3 years), max ₹30 lakh deposit for 60+ citizens.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="SCSS Investment Details">
              <div className={styles.form}>

                <Input
                  label="Investment Amount"
                  type="number"
                  name="principal"
                  value={formData.principal}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  max="3000000"
                  step="10000"
                  helpText="Min: ₹1,000, Max: ₹30,00,000"
                />

                <Input
                  label="Interest Rate (p.a.)"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Current: 8.2% (FY 2024-25)"
                />

                <Input
                  label="Tenure (years)"
                  type="number"
                  name="tenureYears"
                  value={formData.tenureYears}
                  onChange={handleChange}
                  suffix="years"
                  min="5"
                  max="8"
                  step="1"
                  helpText="5 years (extendable by 3 years)"
                />

                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>
            </Card>
          </div>

          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result && !result.error ? (
              <>
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Quarterly Interest Income</div>
                    <div className={styles.emiValue}>{formatCurrency(result.quarterlyInterest)}</div>
                  </div>
                </Card>

                <Card title="Interest Payout Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Quarterly Interest</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981', fontSize: '1.5rem' }}>
                        {formatCurrency(result.quarterlyInterest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly Equivalent</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.monthlyEquivalent)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Yearly Interest</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.yearlyInterest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Rate</div>
                      <div className={styles.summaryValue}>{result.annualRate}%</div>
                    </div>

                  </div>
                </Card>

                <Card title="Total Returns">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Principal</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.principal)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Interest ({formData.tenureYears} yrs)</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.totalInterest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Maturity Value</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.maturityValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tenure</div>
                      <div className={styles.summaryValue}>{result.tenureYears} years</div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.principal} returns={result.totalInterest} />
                </Card>

                <Card variant="success">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#059669' }}>💰 Regular Income for Seniors</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#047857' }}>
                    <p>✅ <strong>Quarterly Payout:</strong> ₹{formatCurrency(result.quarterlyInterest)} every 3 months (Apr, Jul, Oct, Jan)</p>
                    <p>✅ <strong>Yearly Income:</strong> ₹{formatCurrency(result.yearlyInterest)} total per year</p>
                    <p>✅ <strong>Monthly Equivalent:</strong> ~₹{formatCurrency(result.monthlyEquivalent)}/month for regular expenses</p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                      💡 At maturity, you get back your principal ₹{formatCurrency(result.principal)} + total interest ₹{formatCurrency(result.totalInterest)} 
                      = <strong>₹{formatCurrency(result.maturityValue)}</strong>
                    </p>
                  </div>
                </Card>
              </>
            ) : result && result.error ? (
              <Card variant="danger">
                <p style={{ color: '#dc2626', margin: 0 }}>{result.error}</p>
              </Card>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>👴</div>
                  <p>Enter SCSS investment amount</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About SCSS (Senior Citizen Savings Scheme)</h2>
          <p>
            SCSS is a government-backed savings scheme exclusively for senior citizens (60+). 
            Offers highest interest rate among post office schemes with guaranteed quarterly income.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Eligibility:</strong> 60+ years (or 55-60 if retired under VRS)</li>
            <li><strong>Interest Rate:</strong> 8.2% p.a. (FY 2024-25, highest among small savings)</li>
            <li><strong>Tenure:</strong> 5 years (extendable by 3 years once)</li>
            <li><strong>Min Deposit:</strong> ₹1,000 | <strong>Max Deposit:</strong> ₹30,00,000 (₹15L per account, max 2 accounts)</li>
            <li><strong>Interest Payout:</strong> Quarterly (1st Apr, Jul, Oct, Jan)</li>
            <li><strong>Tax Benefit:</strong> 80C deduction on principal (up to ₹1.5L)</li>
            <li><strong>Interest Taxable:</strong> Yes, TDS if interest &gt; ₹50,000/year</li>
          </ul>

          <h3>Eligibility Criteria</h3>
          <ul>
            <li><strong>Age 60+:</strong> All citizens</li>
            <li><strong>Age 55-60:</strong> Retired under Voluntary Retirement Scheme (VRS) or Superannuation</li>
            <li><strong>Retired Defense:</strong> 50+ (ex-servicemen)</li>
            <li><strong>Investment Period:</strong> Within 1 month of retirement (for VRS/retirees)</li>
            <li><strong>Nationality:</strong> Indian citizen or NRI (NRI can open, but on return)</li>
          </ul>

          <h3>Account Types</h3>
          <ul>
            <li><strong>Single:</strong> One account holder</li>
            <li><strong>Joint:</strong> With spouse (both must be eligible)</li>
            <li><strong>Multiple Accounts:</strong> Max 2 accounts (total ₹30L limit)</li>
            <li><strong>HUF:</strong> Not allowed</li>
          </ul>

          <h3>Interest Payment Schedule</h3>
          <ul>
            <li><strong>1st April:</strong> Q4 interest (Jan-Mar)</li>
            <li><strong>1st July:</strong> Q1 interest (Apr-Jun)</li>
            <li><strong>1st October:</strong> Q2 interest (Jul-Sep)</li>
            <li><strong>1st January:</strong> Q3 interest (Oct-Dec)</li>
            <li><strong>Auto-credit:</strong> To savings account (must be linked)</li>
          </ul>

          <h3>Premature Closure</h3>
          <ul>
            <li><strong>After 1 year:</strong> Allowed, but 1.5% penalty on principal</li>
            <li><strong>After 2 years:</strong> Allowed, but 1% penalty on principal</li>
            <li><strong>Before 1 year:</strong> Not allowed (except on death)</li>
            <li><strong>On Death:</strong> No penalty, interest paid till date</li>
          </ul>

          <h3>Extension Rules</h3>
          <ul>
            <li>Can extend for 3 more years after initial 5 years</li>
            <li>Extension request: Within 1 year before maturity</li>
            <li>Same interest rate continues (rate at extension time)</li>
            <li>No additional deposit during extension</li>
            <li>Can be extended only once</li>
          </ul>

          <h3>Tax Implications</h3>
          <ul>
            <li><strong>80C Deduction:</strong> Principal investment (up to ₹1.5L limit)</li>
            <li><strong>Interest Income:</strong> Fully taxable as "Income from Other Sources"</li>
            <li><strong>TDS:</strong> 10% if annual interest &gt; ₹50,000 (&gt;40,000 for others)</li>
            <li><strong>Form 15H:</strong> Submit to avoid TDS (if income below taxable limit)</li>
            <li><strong>Maturity:</strong> Principal returned tax-free</li>
          </ul>

          <h3>Example Calculation</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Deposit:</strong> ₹15,00,000 @ 8.2% for 5 years</p>
            <table style={{ width: '100%', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Quarterly Interest:</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 600 }}>₹30,750</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Monthly Equivalent:</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 600 }}>₹10,250</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Yearly Interest:</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 600 }}>₹1,23,000</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Total Interest (5y):</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 600, color: '#10b981' }}>₹6,15,000</td></tr>
                <tr style={{ borderTop: '2px solid #e2e8f0' }}><td style={{ padding: '0.25rem' }}><strong>At Maturity:</strong></td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 700, color: '#6366f1' }}>₹21,15,000</td></tr>
              </tbody>
            </table>
          </div>

          <h3>How to Open SCSS Account</h3>
          <ul>
            <li>Visit post office or authorized bank (SBI, ICICI, HDFC, etc.)</li>
            <li>Documents: Age proof, ID, address proof, PAN</li>
            <li>Fill SCSS application form</li>
            <li>Deposit via cash/cheque/DD</li>
            <li>Passbook issued</li>
            <li>Nomination mandatory</li>
          </ul>

          <h3>SCSS vs Other Senior Citizen Options</h3>
          <ul>
            <li><strong>SCSS vs Senior Citizen FD:</strong> SCSS 8.2% vs FD 7-8%; SCSS has 80C, FD doesn't</li>
            <li><strong>SCSS vs PPF:</strong> SCSS higher rate, quarterly payout vs PPF lumpsum at maturity</li>
            <li><strong>SCSS vs Post Office MIS:</strong> SCSS 8.2% vs MIS 7.4%; SCSS for 60+, MIS for all</li>
            <li><strong>SCSS vs POMIS:</strong> Similar, but POMIS monthly payout, SCSS quarterly</li>
          </ul>

          <h3>Benefits for Senior Citizens</h3>
          <ul>
            <li>✅ Highest guaranteed returns (8.2% vs FD ~7%)</li>
            <li>✅ Regular quarterly income (like pension)</li>
            <li>✅ Government-backed safety (zero risk)</li>
            <li>✅ 80C tax benefit on investment</li>
            <li>✅ Can extend tenure (total 8 years)</li>
            <li>✅ Premature withdrawal allowed (after 1 year)</li>
          </ul>

          <h3>Important Points</h3>
          <ul>
            <li>Joint account: Both must be eligible (60+)</li>
            <li>NRI: Can hold till maturity, but can't open new after NRSR status</li>
            <li>Passbook issued (like savings account)</li>
            <li>Nomination: Mandatory, can change anytime</li>
            <li>Lost passbook: Duplicate issued</li>
            <li>Interest rate: Fixed for tenure (not affected by future changes)</li>
          </ul>

          <h3>Who Should Invest?</h3>
          <ul>
            <li>Senior citizens (60+) needing regular income</li>
            <li>Those with retirement corpus seeking guaranteed returns</li>
            <li>Risk-averse retirees avoiding market volatility</li>
            <li>VRS/superannuation retirees (55-60 age)</li>
            <li>Those wanting 80C deduction + high interest</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}