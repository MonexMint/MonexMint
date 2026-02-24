'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculatePostOfficeMIS } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

export default function PostOfficeMISCalculator() {

  const [formData, setFormData] = useState({
    principal:   '450000',
    annualRate:  '7.4',
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

    if (!principal || principal < 1000) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculatePostOfficeMIS(principal, rate, years);
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const showWarning = result && result.principal > 900000;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <Breadcrumb items={BREADCRUMBS.postOfficeMis} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Post Office MIS Calculator</h1>
          <p className={styles.description}>
            Calculate Post Office Monthly Income Scheme returns. 7.4% p.a., 5-year tenure, 
            max ₹9L (single) / ₹15L (joint) with monthly interest payout.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Post Office MIS Details">
              <div className={styles.form}>

                <Input
                  label="Investment Amount"
                  type="number"
                  name="principal"
                  value={formData.principal}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                  helpText="Min: ₹1,000, Max: ₹9L (single) / ₹15L (joint)"
                />

                <Input
                  label="Interest Rate (p.a.)"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Current: 7.4% (FY 2024-25)"
                />

                <Input
                  label="Tenure (years)"
                  type="number"
                  name="tenureYears"
                  value={formData.tenureYears}
                  onChange={handleChange}
                  suffix="years"
                  min="5"
                  max="5"
                  step="0"
                  helpText="Fixed 5-year tenure"
                />

                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>
            </Card>
          </div>

          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {showWarning && (
                  <Card variant="warning">
                    <p style={{ margin: 0, color: '#92400e' }}>
                      ⚠️ Maximum investment for single account is ₹9,00,000. For higher amounts, consider joint account (max ₹15L).
                    </p>
                  </Card>
                )}

                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Monthly Income</div>
                    <div className={styles.emiValue}>{formatCurrency(result.monthlyInterest)}</div>
                  </div>
                </Card>

                <Card title="Interest Income Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly Interest</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981', fontSize: '1.5rem' }}>
                        {formatCurrency(result.monthlyInterest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Quarterly Interest</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.quarterlyInterest)}
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

                <Card title="Total Returns (5 Years)">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Principal</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.principal)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Interest</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.totalInterest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>At Maturity</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.maturityValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Returns</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.totalReturns)}
                      </div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.principal} returns={result.totalInterest} />
                </Card>

                <Card variant="success">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#059669' }}>💰 Your Monthly Income Stream</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#047857' }}>
                    <p>✅ <strong>Monthly Payout:</strong> ₹{formatCurrency(result.monthlyInterest)} credited to your account</p>
                    <p>✅ <strong>Yearly Income:</strong> ₹{formatCurrency(result.yearlyInterest)} total per year</p>
                    <p>✅ <strong>5-Year Total:</strong> ₹{formatCurrency(result.totalInterest)} interest earned</p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                      💡 At maturity, you get back your <strong>principal ₹{formatCurrency(result.principal)}</strong> 
                      (interest already paid monthly). Total received over 5 years = <strong>₹{formatCurrency(result.totalReturns)}</strong>
                    </p>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>📬</div>
                  <p>Enter Post Office MIS amount</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About Post Office MIS (Monthly Income Scheme)</h2>
          <p>
            Post Office MIS is a low-risk investment scheme offering guaranteed monthly income. 
            Ideal for retirees, homemakers, and anyone seeking regular income with capital safety.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Interest Rate:</strong> 7.4% p.a. (FY 2024-25, revised quarterly)</li>
            <li><strong>Tenure:</strong> 5 years (fixed, no extension)</li>
            <li><strong>Min Deposit:</strong> ₹1,000 | <strong>Max:</strong> ₹9L (single), ₹15L (joint)</li>
            <li><strong>Interest Payout:</strong> Monthly (simple interest, not compounded)</li>
            <li><strong>Principal:</strong> Returned at maturity (interest already paid)</li>
            <li><strong>Safety:</strong> 100% government-backed</li>
            <li><strong>No TDS:</strong> Interest below ₹50,000/year (for senior citizens)</li>
          </ul>

          <h3>Account Types</h3>
          <ul>
            <li><strong>Single:</strong> Max ₹9,00,000</li>
            <li><strong>Joint (2 adults):</strong> Max ₹15,00,000 (payable to either/survivor)</li>
            <li><strong>Joint (3 adults):</strong> Max ₹15,00,000 (all must be joint holders)</li>
            <li><strong>Minor:</strong> By guardian (till 18, then transferred)</li>
            <li><strong>Multiple Accounts:</strong> Allowed (total within max limit)</li>
          </ul>

          <h3>Interest Payment</h3>
          <ul>
            <li><strong>Monthly:</strong> Simple interest credited every month</li>
            <li><strong>Auto-credit:</strong> To linked savings account</li>
            <li><strong>No Compounding:</strong> Interest on principal only (not on interest)</li>
            <li><strong>First Payment:</strong> One month after opening date</li>
            <li><strong>Example:</strong> Account opened 10th Jan → 1st payment 10th Feb</li>
          </ul>

          <h3>Premature Closure</h3>
          <ul>
            <li><strong>Before 1 year:</strong> Not allowed</li>
            <li><strong>After 1 year:</strong> Allowed, 2% penalty on principal</li>
            <li><strong>After 3 years:</strong> Allowed, 1% penalty on principal</li>
            <li><strong>On Death:</strong> No penalty, interest paid till date</li>
            <li><strong>Interest Adjustment:</strong> Already paid interest deducted from principal</li>
          </ul>

          <h3>Tax Implications</h3>
          <ul>
            <li><strong>No 80C Benefit:</strong> Investment NOT eligible for tax deduction</li>
            <li><strong>Interest Taxable:</strong> As "Income from Other Sources"</li>
            <li><strong>TDS:</strong> No TDS for senior citizens (if &lt; ₹50K/year)</li>
            <li><strong>TDS for Others:</strong> 10% if interest &gt; ₹40,000/year</li>
            <li><strong>Form 15G/15H:</strong> Submit to avoid TDS (if income below taxable limit)</li>
          </ul>

          <h3>Example Calculation</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Deposit:</strong> ₹9,00,000 (max single) @ 7.4% for 5 years</p>
            <table style={{ width: '100%', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Monthly Interest:</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 600 }}>₹5,550</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Yearly Interest:</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 600 }}>₹66,600</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Total Interest (5y):</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 600, color: '#10b981' }}>₹3,33,000</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Principal Returned:</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 600 }}>₹9,00,000</td></tr>
                <tr style={{ borderTop: '2px solid #e2e8f0' }}><td style={{ padding: '0.25rem' }}><strong>Total Received:</strong></td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 700, color: '#6366f1' }}>₹12,33,000</td></tr>
              </tbody>
            </table>
          </div>

          <h3>How to Open MIS Account</h3>
          <ul>
            <li>Visit any post office with ID, address proof, PAN</li>
            <li>Fill MIS application form</li>
            <li>Payment via cash/cheque/DD</li>
            <li>Link savings account for auto-credit of interest</li>
            <li>Passbook issued</li>
            <li>Nomination mandatory</li>
          </ul>

          <h3>MIS vs Other Options</h3>
          <ul>
            <li><strong>MIS vs SCSS:</strong> SCSS 8.2% vs MIS 7.4%; SCSS for 60+, MIS for all ages</li>
            <li><strong>MIS vs Bank FD:</strong> Similar rates, but MIS monthly payout vs FD lumpsum</li>
            <li><strong>MIS vs NSC:</strong> NSC 7.7% with 80C, MIS 7.4% without 80C; MIS monthly income</li>
            <li><strong>MIS vs PPF:</strong> PPF 7.1% with tax-free interest, MIS taxable; MIS monthly vs PPF maturity</li>
          </ul>

          <h3>Advantages</h3>
          <ul>
            <li>✅ Regular monthly income (like pension)</li>
            <li>✅ Government-backed safety</li>
            <li>✅ Higher rate than savings account (7.4% vs 3-4%)</li>
            <li>✅ No market risk (guaranteed returns)</li>
            <li>✅ Joint account allowed (up to ₹15L)</li>
            <li>✅ Premature withdrawal after 1 year</li>
          </ul>

          <h3>Disadvantages</h3>
          <ul>
            <li>❌ No 80C tax benefit</li>
            <li>❌ Interest fully taxable (not tax-free like PPF)</li>
            <li>❌ Lower returns than equity/mutual funds</li>
            <li>❌ No compounding (simple interest only)</li>
            <li>❌ Penalty on premature withdrawal</li>
            <li>❌ Cannot extend tenure beyond 5 years</li>
          </ul>

          <h3>Who Should Invest?</h3>
          <ul>
            <li>Retirees needing regular monthly income</li>
            <li>Homemakers seeking financial independence</li>
            <li>Conservative investors avoiding market risk</li>
            <li>Those with surplus cash not needed for 5 years</li>
            <li>People in low tax brackets (interest taxable)</li>
          </ul>

          <h3>Important Points</h3>
          <ul>
            <li>Interest credited monthly (not accumulated)</li>
            <li>Passbook shows monthly credit entries</li>
            <li>Rate fixed for 5 years (not revised during tenure)</li>
            <li>Nomination can be changed anytime</li>
            <li>Lost passbook: Duplicate issued with indemnity</li>
            <li>Transferable to another post office</li>
          </ul>

          <h3>Common Use Cases</h3>
          <ul>
            <li><strong>Retirement Income:</strong> Supplement pension with guaranteed monthly income</li>
            <li><strong>Parked Funds:</strong> Keep FD/lumpsum idle money earning regular income</li>
            <li><strong>Gift to Parents:</strong> Open in parent's name for their monthly expenses</li>
            <li><strong>Education Fund:</strong> Monthly income for tuition/coaching fees</li>
            <li><strong>Rent Replacement:</strong> Generate monthly cash flow similar to rent</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}