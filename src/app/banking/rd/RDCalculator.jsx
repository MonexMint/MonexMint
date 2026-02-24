'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateRD } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

export default function RDCalculator() {

  const [formData, setFormData] = useState({
    monthlyDeposit:  '5000',
    annualRate:      '7',
    tenureMonths:    '12',
    isSeniorCitizen: false,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const compute = useCallback(() => {
    const monthly = parseFloat(formData.monthlyDeposit);
    const rate    = parseFloat(formData.annualRate);
    const months  = parseFloat(formData.tenureMonths);
    const senior  = formData.isSeniorCitizen;

    if (!monthly || monthly <= 0 || !months || months <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateRD(monthly, rate, months, senior);
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

        <Breadcrumb items={BREADCRUMBS.rd} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>RD Calculator</h1>
          <p className={styles.description}>
            Calculate Recurring Deposit maturity with monthly installments. Quarterly compounding, 
            senior citizen bonus. Build savings systematically!
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="RD Details">
              <div className={styles.form}>

                <Input
                  label="Monthly Deposit"
                  type="number"
                  name="monthlyDeposit"
                  value={formData.monthlyDeposit}
                  onChange={handleChange}
                  prefix="₹"
                  min="100"
                  step="100"
                  helpText="Min ₹100 (varies by bank)"
                />

                <Input
                  label="Interest Rate (p.a.)"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Bank rates: 6.5% - 8% typically"
                />

                <Input
                  label="Tenure (months)"
                  type="number"
                  name="tenureMonths"
                  value={formData.tenureMonths}
                  onChange={handleChange}
                  suffix="months"
                  min="6"
                  max="120"
                  helpText="Min: 6 months, Max: 10 years"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="isSeniorCitizen"
                      checked={formData.isSeniorCitizen}
                      onChange={handleChange}
                      style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Senior Citizen (60+)
                    </span>
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
                    Get +0.5% extra interest rate
                  </p>
                </div>

                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>
            </Card>
          </div>

          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Maturity Amount</div>
                    <div className={styles.emiValue}>{formatCurrency(result.maturityAmount)}</div>
                  </div>
                </Card>

                <Card title="RD Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly Deposit</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.monthlyDeposit)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Deposited</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.totalDeposited)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Earned</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.interestEarned)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Maturity Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.maturityAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Applied Rate</div>
                      <div className={styles.summaryValue}>
                        {result.effectiveRate}% {result.isSeniorCitizen && <span style={{ color: '#10b981' }}>✓ Senior</span>}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tenure</div>
                      <div className={styles.summaryValue}>{result.tenureMonths} months</div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.totalDeposited} returns={result.interestEarned} />
                </Card>

                <Card variant="success">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#059669' }}>💰 Disciplined Savings Reward</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#047857' }}>
                    <p>✅ <strong>Monthly Commitment:</strong> Deposit ₹{formatCurrency(result.monthlyDeposit)} every month</p>
                    <p>✅ <strong>Total Saved:</strong> ₹{formatCurrency(result.totalDeposited)} over {result.tenureMonths} months</p>
                    <p>✅ <strong>Interest Bonus:</strong> ₹{formatCurrency(result.interestEarned)} earned through compounding</p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                      💡 At maturity, receive <strong>₹{formatCurrency(result.maturityAmount)}</strong> — that's {((result.interestEarned / result.totalDeposited) * 100).toFixed(1)}% more than what you deposited!
                    </p>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>💵</div>
                  <p>Enter RD details</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About Recurring Deposit (RD)</h2>
          <p>
            Recurring Deposit is a systematic savings plan where you deposit a fixed amount every month 
            for a fixed period. Ideal for salaried individuals building a savings habit.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Interest Rates:</strong> 6% - 8% p.a. (similar to FD rates)</li>
            <li><strong>Tenure:</strong> 6 months to 10 years (most banks)</li>
            <li><strong>Min Deposit:</strong> ₹100/month (varies: ₹100 - ₹1,000)</li>
            <li><strong>Max Deposit:</strong> No limit (some banks have upper limit)</li>
            <li><strong>Compounding:</strong> Quarterly (like FD)</li>
            <li><strong>Senior Citizen Bonus:</strong> +0.5% extra (most banks)</li>
            <li><strong>Premature Closure:</strong> Allowed (penalty: 1% on rate)</li>
          </ul>

          <h3>How RD Works</h3>
          <ul>
            <li>Open RD account with fixed monthly deposit amount</li>
            <li>Deposit same amount every month on same date</li>
            <li>Interest calculated quarterly on accumulated deposits</li>
            <li>Missed deposit: Penalty (₹1-₹5 per ₹100 per month)</li>
            <li>At maturity: Principal + interest credited</li>
          </ul>

          <h3>RD Formula</h3>
          <p><strong>M = P × [(1+r)^n - 1] / [1 - (1+r)^(-1/3)]</strong></p>
          <ul>
            <li><strong>M</strong> = Maturity Amount</li>
            <li><strong>P</strong> = Monthly Deposit × 3 (per quarter)</li>
            <li><strong>r</strong> = Quarterly Interest Rate</li>
            <li><strong>n</strong> = Number of Quarters</li>
          </ul>

          <h3>RD vs Other Savings Options</h3>
          <ul>
            <li><strong>RD vs FD:</strong> RD monthly deposits vs FD lumpsum; RD builds discipline</li>
            <li><strong>RD vs SIP:</strong> RD guaranteed 7% vs SIP risky 10-12%; SIP for long-term</li>
            <li><strong>RD vs Savings:</strong> RD 7% locked vs Savings 3-4% liquid</li>
            <li><strong>RD vs PPF:</strong> PPF 7.1% tax-free, 15-year vs RD 7% taxable, flexible tenure</li>
          </ul>

          <h3>Penalty for Missed Deposits</h3>
          <ul>
            <li>Late payment charge: ₹1 - ₹5 per ₹100 per month delayed</li>
            <li>Example: ₹5,000 deposit missed 2 months → Penalty ₹100-₹500</li>
            <li>Repeated defaults: Account can be closed by bank</li>
            <li>Grace period: Usually 2-3 months before closure</li>
          </ul>

          <h3>Premature Closure</h3>
          <ul>
            <li>Allowed after minimum period (usually 3-6 months)</li>
            <li>Penalty: 1% reduction in interest rate</li>
            <li>Interest calculated: At reduced rate for actual months held</li>
            <li>Some banks: Penalty waived for senior citizens/emergencies</li>
          </ul>

          <h3>Tax on RD Interest</h3>
          <ul>
            <li><strong>Interest Taxable:</strong> As "Income from Other Sources"</li>
            <li><strong>TDS:</strong> 10% if interest &gt; ₹40,000/year (&gt;₹50,000 for seniors)</li>
            <li><strong>Form 15G/15H:</strong> Submit to avoid TDS if no tax liability</li>
            <li><strong>No 80C Benefit:</strong> RD investment NOT eligible for deduction</li>
          </ul>

          <h3>Example Calculation</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Monthly Deposit:</strong> ₹10,000 @ 7.5% for 5 years (60 months)</p>
            <table style={{ width: '100%', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Total Deposited:</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 600 }}>₹6,00,000</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Interest Earned:</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 600, color: '#10b981' }}>₹1,21,212</td></tr>
                <tr style={{ borderTop: '2px solid #e2e8f0' }}><td style={{ padding: '0.25rem' }}><strong>Maturity Value:</strong></td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 700, color: '#6366f1' }}>₹7,21,212</td></tr>
              </tbody>
            </table>
          </div>

          <h3>When to Choose RD?</h3>
          <ul>
            <li>Salaried individuals saving monthly from income</li>
            <li>Building emergency fund systematically</li>
            <li>Saving for specific goal (vacation, gadget, down payment)</li>
            <li>Want guaranteed returns without market risk</li>
            <li>Lack discipline for manual monthly savings</li>
          </ul>

          <h3>RD Benefits</h3>
          <ul>
            <li>✅ Builds savings discipline (forced monthly commitment)</li>
            <li>✅ Safe investment (bank-backed, no risk)</li>
            <li>✅ Higher returns than savings account (7% vs 3-4%)</li>
            <li>✅ Flexible tenure (6 months to 10 years)</li>
            <li>✅ Senior citizen bonus (+0.5%)</li>
            <li>✅ Loan facility (against RD, 80-90% of balance)</li>
          </ul>

          <h3>RD Limitations</h3>
          <ul>
            <li>❌ Lower returns than mutual funds/stocks (7% vs 10-12%)</li>
            <li>❌ No tax benefit (unlike PPF, ELSS)</li>
            <li>❌ Interest fully taxable (no exemption)</li>
            <li>❌ Penalty on missed deposits</li>
            <li>❌ Premature withdrawal penalty</li>
          </ul>

          <h3>Pro Tips</h3>
          <ul>
            <li>Set up auto-debit from salary account (never miss)</li>
            <li>Choose tenure matching your goal timeline</li>
            <li>Compare rates across banks (small finance banks offer higher)</li>
            <li>Senior citizens: Always mention age for bonus rate</li>
            <li>Link to same bank savings for easy deposits</li>
            <li>Start small (₹1K/month) and increase later</li>
          </ul>

          <h3>Common Mistakes to Avoid</h3>
          <ul>
            <li>❌ Starting with unaffordable amount (risk of defaults)</li>
            <li>❌ Not setting up auto-debit (forgetting deposits)</li>
            <li>❌ Breaking RD prematurely (loses 1% interest)</li>
            <li>❌ Not comparing bank rates (missing 0.5-1% extra)</li>
            <li>❌ Ignoring senior citizen benefit</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}