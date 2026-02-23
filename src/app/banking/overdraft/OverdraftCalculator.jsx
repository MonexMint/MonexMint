'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateOverdraftInterest } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function OverdraftCalculator() {

  const [formData, setFormData] = useState({
    overdraftAmount:       '50000',
    annualRate:            '12',
    utilizationDays:       '30',
    processingFeePercent:  '0.5',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const amount     = parseFloat(formData.overdraftAmount);
    const rate       = parseFloat(formData.annualRate);
    const days       = parseFloat(formData.utilizationDays);
    const feePercent = parseFloat(formData.processingFeePercent);

    if (!amount || amount <= 0 || !days || days <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateOverdraftInterest(amount, rate, days, feePercent);
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

        <div className={styles.header}>
          <h1 className={styles.title}>Overdraft Interest Calculator</h1>
          <p className={styles.description}>
            Calculate overdraft interest charges with daily reducing balance method. 
            Includes processing fees and effective daily rate.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Overdraft Details">
              <div className={styles.form}>

                <Input
                  label="Overdraft Amount Used"
                  type="number"
                  name="overdraftAmount"
                  value={formData.overdraftAmount}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                  helpText="Amount you've utilized from OD limit"
                />

                <Input
                  label="Interest Rate (p.a.)"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Bank OD rates: 10% - 15% typically"
                />

                <Input
                  label="Utilization Period (days)"
                  type="number"
                  name="utilizationDays"
                  value={formData.utilizationDays}
                  onChange={handleChange}
                  suffix="days"
                  min="1"
                  max="365"
                  helpText="How many days you need the OD"
                />

                <Input
                  label="Processing Fee"
                  type="number"
                  name="processingFeePercent"
                  value={formData.processingFeePercent}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="One-time fee: 0.25% - 1%"
                />

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
                    <div className={styles.emiLabel}>Total Cost</div>
                    <div className={styles.emiValue}>{formatCurrency(result.totalCost)}</div>
                  </div>
                </Card>

                <Card title="Overdraft Cost Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>OD Amount</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.overdraftAmount)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Charged</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.interest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Processing Fee</div>
                      <div className={styles.summaryValue} style={{ color: '#ea580c' }}>
                        {formatCurrency(result.processingFee)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Cost</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                        {formatCurrency(result.totalCost)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Daily Rate</div>
                      <div className={styles.summaryValue}>{result.effectiveDailyRate}%</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Period</div>
                      <div className={styles.summaryValue}>{result.utilizationDays} days</div>
                    </div>

                  </div>
                </Card>

                <Card variant="warning">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#92400e' }}>💰 Cost Comparison</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#92400e' }}>
                    <p><strong>Borrowing:</strong> ₹{formatCurrency(result.overdraftAmount)} for {result.utilizationDays} days</p>
                    <p><strong>Total Repayment:</strong> ₹{formatCurrency(result.overdraftAmount + result.totalCost)}</p>
                    <p><strong>Breakdown:</strong></p>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                      <li>Interest: ₹{formatCurrency(result.interest)} ({result.annualRate}% p.a.)</li>
                      <li>Processing Fee: ₹{formatCurrency(result.processingFee)} (one-time)</li>
                      <li><strong>Total Cost: ₹{formatCurrency(result.totalCost)}</strong></li>
                    </ul>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                      💡 <strong>Effective Cost:</strong> {((result.totalCost / result.overdraftAmount) * 100).toFixed(2)}% for {result.utilizationDays} days
                    </p>
                  </div>
                </Card>

                <InvestmentBarChart 
                  invested={result.overdraftAmount} 
                  returns={result.totalCost}
                  labels={{ invested: 'OD Amount', returns: 'Total Cost' }}
                />
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🏦</div>
                  <p>Enter overdraft details</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About Overdraft (OD) Facility</h2>
          <p>
            Overdraft is a credit facility allowing you to withdraw more than your account balance 
            up to a pre-approved limit. Interest is charged only on the utilized amount for actual days used.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Interest Rate:</strong> 10% - 15% p.a. (higher than loans, lower than credit cards)</li>
            <li><strong>Interest Calculation:</strong> Daily reducing balance (only on utilized amount)</li>
            <li><strong>Repayment:</strong> Flexible (no EMI, repay anytime)</li>
            <li><strong>Processing Fee:</strong> 0.25% - 1% one-time</li>
            <li><strong>Limit:</strong> Based on income, credit score, relationship with bank</li>
            <li><strong>Renewal:</strong> Annual (charges apply)</li>
          </ul>

          <h3>Types of Overdraft</h3>
          <ul>
            <li><strong>Salary Account OD:</strong> Auto-approved based on salary (2-3x monthly salary)</li>
            <li><strong>Secured OD:</strong> Against FD, shares, property (lower rates 8-10%)</li>
            <li><strong>Unsecured OD:</strong> Based on creditworthiness (higher rates 12-15%)</li>
            <li><strong>Business OD:</strong> For working capital needs (10-14%)</li>
          </ul>

          <h3>Interest Calculation Method</h3>
          <p><strong>Daily Reducing Balance:</strong></p>
          <ul>
            <li>Interest = (Outstanding Balance × Rate × Days) ÷ 365</li>
            <li>Calculated daily on end-of-day balance</li>
            <li>If you repay ₹10K today, interest stops on that ₹10K from tomorrow</li>
            <li>Most cost-effective vs loans (interest on reducing balance)</li>
          </ul>

          <h3>Example Calculation</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Scenario:</strong> ₹1,00,000 OD @ 12% p.a. for 30 days</p>
            <table style={{ width: '100%', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Daily Rate:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>0.0329%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Interest (30 days):</td><td style={{ padding: '0.25rem', textAlign: 'right', color: '#dc2626' }}>₹986</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Processing Fee (0.5%):</td><td style={{ padding: '0.25rem', textAlign: 'right', color: '#ea580c' }}>₹500</td></tr>
                <tr style={{ borderTop: '2px solid #e2e8f0' }}><td style={{ padding: '0.25rem' }}><strong>Total Cost:</strong></td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>₹1,486</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Effective cost: 1.49% for 30 days</p>
          </div>

          <h3>OD vs Other Credit Options</h3>
          <ul>
            <li><strong>OD vs Personal Loan:</strong> OD 12% flexible vs Loan 11% fixed EMI; OD better for short-term</li>
            <li><strong>OD vs Credit Card:</strong> OD 12% vs CC 36-42%; OD much cheaper</li>
            <li><strong>OD vs Gold Loan:</strong> Gold Loan 10% vs OD 12%; Gold cheaper but needs collateral</li>
            <li><strong>OD vs Business Loan:</strong> OD 12% flexible vs Loan 13% structured; OD for working capital</li>
          </ul>

          <h3>Charges & Fees</h3>
          <ul>
            <li><strong>Processing Fee:</strong> 0.25% - 1% of sanctioned limit (one-time)</li>
            <li><strong>Annual Renewal:</strong> ₹500 - ₹2,000/year</li>
            <li><strong>Overutilization:</strong> Extra 2-3% penalty if exceed limit</li>
            <li><strong>Late Payment:</strong> ₹500 - ₹1,000 if interest not paid on time</li>
            <li><strong>Cheque Bounce:</strong> ₹500 - ₹750 per bounce</li>
          </ul>

          <h3>When to Use Overdraft?</h3>
          <ul>
            <li>✅ Short-term cash flow mismatch (salary delayed, invoice pending)</li>
            <li>✅ Emergency expenses (medical, repairs)</li>
            <li>✅ Business working capital (pay suppliers, bridge gap)</li>
            <li>✅ Temporary shortage (2-30 days)</li>
            <li>✅ When you'll repay quickly (saves EMI commitment)</li>
          </ul>

          <h3>When NOT to Use Overdraft?</h3>
          <ul>
            <li>❌ Long-term needs (&gt; 3 months) — take a loan instead</li>
            <li>❌ Large amounts for long period (interest adds up)</li>
            <li>❌ Discretionary spending (luxury purchases)</li>
            <li>❌ If you can't repay within 30-60 days</li>
            <li>❌ Regular/recurring expenses (indicates budget issue)</li>
          </ul>

          <h3>OD Advantages</h3>
          <ul>
            <li>✅ Flexibility: Use only what you need, when you need</li>
            <li>✅ Interest only on utilized amount (not on limit)</li>
            <li>✅ No prepayment charges (repay anytime)</li>
            <li>✅ Instant access (no approval delay)</li>
            <li>✅ Revolving facility (repay and reuse)</li>
            <li>✅ No fixed EMI commitment</li>
          </ul>

          <h3>OD Disadvantages</h3>
          <ul>
            <li>❌ Higher rate than regular loans (12% vs 10%)</li>
            <li>❌ Easy to over-use (temptation to spend)</li>
            <li>❌ Can become expensive if used long-term</li>
            <li>❌ Annual renewal charges</li>
            <li>❌ Bank can reduce/cancel limit anytime</li>
          </ul>

          <h3>How to Minimize OD Costs</h3>
          <ul>
            <li>Repay as soon as possible (interest stops immediately)</li>
            <li>Use only for genuine emergencies</li>
            <li>Negotiate lower rate (if good credit score)</li>
            <li>Opt for secured OD against FD (8-10% vs 12-15%)</li>
            <li>Compare rates across banks (can differ by 2-3%)</li>
            <li>Avoid overutilization (penalty charges apply)</li>
          </ul>

          <h3>Impact on Credit Score</h3>
          <ul>
            <li><strong>Positive:</strong> Available credit limit improves score</li>
            <li><strong>Neutral:</strong> Using OD doesn't hurt if paid on time</li>
            <li><strong>Negative:</strong> Maxing out limit ( &gt; 90% utilization) drops score</li>
            <li><strong>Negative:</strong> Missing interest payments (reported as default)</li>
            <li><strong>Tip:</strong> Keep utilization below 30% of limit</li>
          </ul>

          <h3>Pro Tips</h3>
          <ul>
            <li>Negotiate rate during good credit score (750+)</li>
            <li>Link to salary account for better terms</li>
            <li>Use OD only for 2-30 days (sweet spot)</li>
            <li>Repay in full once funds available (save interest)</li>
            <li>Monitor utilization (don't exceed 50% regularly)</li>
            <li>Review annual renewal charges (shop around)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}