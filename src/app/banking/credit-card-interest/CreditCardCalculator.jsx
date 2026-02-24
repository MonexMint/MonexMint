'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateCreditCardInterest } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

export default function CreditCardCalculator() {

  const [formData, setFormData] = useState({
    outstandingBalance: '50000',
    annualRate:         '36',
    months:             '12',
    monthlyPayment:     '5000',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const balance = parseFloat(formData.outstandingBalance);
    const rate    = parseFloat(formData.annualRate);
    const months  = parseFloat(formData.months);
    const payment = parseFloat(formData.monthlyPayment);

    if (!balance || balance <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateCreditCardInterest(balance, rate, months, payment);
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const minPayment = Math.max(200, parseFloat(formData.outstandingBalance) * 0.05);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <Breadcrumb items={BREADCRUMBS.creditCard} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Credit Card Interest Calculator</h1>
          <p className={styles.description}>
            Calculate credit card interest and total payoff cost. Monthly compounding at 36-42% p.a. 
            See the minimum payment trap!
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Credit Card Debt Details">
              <div className={styles.form}>

                <Input
                  label="Outstanding Balance"
                  type="number"
                  name="outstandingBalance"
                  value={formData.outstandingBalance}
                  onChange={handleChange}
                  prefix="₹"
                  min="100"
                  step="100"
                  helpText="Total amount you owe"
                />

                <Input
                  label="Interest Rate (p.a.)"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="CC rates: 36% - 42% typically"
                />

                <Input
                  label="Time Period (months)"
                  type="number"
                  name="months"
                  value={formData.months}
                  onChange={handleChange}
                  suffix="months"
                  min="1"
                  max="60"
                  helpText="How long if no payment made"
                />

                <Input
                  label="Monthly Payment (optional)"
                  type="number"
                  name="monthlyPayment"
                  value={formData.monthlyPayment}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="100"
                  helpText="Leave 0 to see compounding only"
                />

                <div style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#92400e' }}>
                  💡 <strong>Minimum Payment:</strong> ₹{formatCurrency(minPayment)} (5% of balance or ₹200, whichever higher)
                </div>

                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>
            </Card>
          </div>

          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {formData.monthlyPayment > 0 ? (
                  /* WITH MONTHLY PAYMENT */
                  <>
                    <Card variant="gradient" className={styles.emiCard}>
                      <div className={styles.emiResult}>
                        <div className={styles.emiLabel}>Total Amount Paid</div>
                        <div className={styles.emiValue}>{formatCurrency(result.totalAmountPaid)}</div>
                      </div>
                    </Card>

                    <Card title="Payoff Summary">
                      <div className={styles.summaryGrid}>

                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Outstanding</div>
                          <div className={styles.summaryValue}>{formatCurrency(result.outstandingBalance)}</div>
                        </div>

                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Monthly Payment</div>
                          <div className={styles.summaryValue}>{formatCurrency(result.monthlyPayment)}</div>
                        </div>

                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Months to Payoff</div>
                          <div className={styles.summaryValue} style={{ color: '#6366f1', fontSize: '1.5rem' }}>
                            {result.monthsToPayoff}
                          </div>
                        </div>

                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Total Interest</div>
                          <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                            {formatCurrency(result.totalInterestPaid)}
                          </div>
                        </div>

                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Total Paid</div>
                          <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                            {formatCurrency(result.totalAmountPaid)}
                          </div>
                        </div>

                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Monthly Rate</div>
                          <div className={styles.summaryValue}>{result.monthlyRate}%</div>
                        </div>

                      </div>
                    </Card>

                    {/* MINIMUM PAYMENT TRAP WARNING */}
                    {result.minPaymentMonths && (
                      <Card variant="danger">
                        <h3 style={{ margin: '0 0 1rem 0', color: '#b91c1c' }}>🚨 Minimum Payment Trap</h3>
                        <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#991b1b' }}>
                          <p><strong>If you pay MINIMUM ONLY:</strong></p>
                          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Payoff Time: <strong>{result.minPaymentMonths} months</strong> ({(result.minPaymentMonths / 12).toFixed(1)} years!)</li>
                            <li>Total Interest: <strong>₹{formatCurrency(result.minPaymentInterest)}</strong></li>
                          </ul>
                          <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '0.5rem' }}>
                            💰 <strong>You SAVE ₹{formatCurrency(result.interestSavedVsMinPayment)}</strong> by paying ₹{formatCurrency(result.monthlyPayment)}/month instead of minimum!
                          </p>
                        </div>
                      </Card>
                    )}

                    <InvestmentBarChart 
                      invested={result.outstandingBalance} 
                      returns={result.totalInterestPaid}
                      labels={{ invested: 'Principal', returns: 'Interest Cost' }}
                    />
                  </>
                ) : (
                  /* WITHOUT PAYMENT (COMPOUNDING ONLY) */
                  <>
                    <Card variant="gradient" className={styles.emiCard}>
                      <div className={styles.emiResult}>
                        <div className={styles.emiLabel}>Total After {formData.months} Months</div>
                        <div className={styles.emiValue}>{formatCurrency(result.totalAmount)}</div>
                      </div>
                    </Card>

                    <Card title="Compounding Impact (No Payment)">
                      <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Starting Balance</div>
                          <div className={styles.summaryValue}>{formatCurrency(result.outstandingBalance)}</div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Interest Accrued</div>
                          <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                            {formatCurrency(result.totalInterest)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Total After {formData.months}m</div>
                          <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                            {formatCurrency(result.totalAmount)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Monthly Rate</div>
                          <div className={styles.summaryValue}>{result.monthlyRate}%</div>
                        </div>
                      </div>
                    </Card>

                    <Card variant="danger">
                      <h3 style={{ margin: '0 0 1rem 0', color: '#b91c1c' }}>⚠️ Warning</h3>
                      <p style={{ margin: 0, color: '#991b1b', fontSize: '0.875rem', lineHeight: '1.7' }}>
                        Without any payments, your ₹{formatCurrency(result.outstandingBalance)} debt grows to 
                        ₹{formatCurrency(result.totalAmount)} in just {formData.months} months due to monthly compounding at {result.annualRate}%!
                      </p>
                    </Card>
                  </>
                )}
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>💳</div>
                  <p>Enter credit card details</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About Credit Card Interest</h2>
          <p>
            Credit cards charge the HIGHEST interest rates among all credit products (36-42% p.a.). 
            Interest compounds monthly, creating a debt trap if only minimum payments are made.
          </p>

          <h3>Key Facts</h3>
          <ul>
            <li><strong>Interest Rate:</strong> 36% - 42% p.a. (3% - 3.5% per month)</li>
            <li><strong>Compounding:</strong> Monthly (not annual!)</li>
            <li><strong>Minimum Payment:</strong> 5% of outstanding or ₹200, whichever higher</li>
            <li><strong>Grace Period:</strong> 18-50 days (interest-free if full payment)</li>
            <li><strong>Late Payment Fee:</strong> ₹500 - ₹1,500</li>
            <li><strong>Overlimit Penalty:</strong> ₹500 + interest on excess</li>
          </ul>

          <h3>How CC Interest Works</h3>
          <ul>
            <li><strong>Pay in Full by Due Date:</strong> NO interest (grace period applies)</li>
            <li><strong>Pay Minimum or Less:</strong> Interest on ENTIRE outstanding from transaction date</li>
            <li><strong>Monthly Compounding:</strong> 3% per month = 42.6% p.a. effectively</li>
            <li><strong>No Grace Period:</strong> Once you revolve, interest starts from day 1</li>
          </ul>

          <h3>Minimum Payment Trap</h3>
          <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Example:</strong> ₹50,000 debt @ 36% p.a.</p>
            <table style={{ width: '100%', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #fecaca' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Payment</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Months</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Interest</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Minimum (5%)</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>83 months</td><td style={{ padding: '0.25rem', textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>₹58,000</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹5,000/month</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>12 months</td><td style={{ padding: '0.25rem', textAlign: 'right', color: '#059669', fontWeight: 600 }}>₹10,200</td></tr>
                <tr style={{ borderTop: '2px solid #fecaca' }}><td style={{ padding: '0.25rem' }}><strong>Savings</strong></td><td style={{ padding: '0.25rem', textAlign: 'right' }}>71 months</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 700, color: '#059669' }}>₹47,800</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: '0.5rem', color: '#991b1b' }}>
              💰 Paying ₹5,000 vs minimum saves <strong>₹47,800</strong> and clears debt in 1 year instead of 7 years!
            </p>
          </div>

          <h3>CC Interest vs Other Loans</h3>
          <ul>
            <li><strong>Credit Card:</strong> 36-42% p.a.</li>
            <li><strong>Personal Loan:</strong> 10-15% p.a. (3x cheaper!)</li>
            <li><strong>Overdraft:</strong> 10-15% p.a.</li>
            <li><strong>Home Loan:</strong> 8-9% p.a.</li>
            <li><strong>FD Interest:</strong> 7% p.a. (earning vs losing!)</li>
          </ul>

          <h3>How to Avoid CC Interest</h3>
          <ul>
            <li>✅ Pay full outstanding by due date (grace period = 0 interest)</li>
            <li>✅ Auto-pay setup (never miss due date)</li>
            <li>✅ Track spending (don't exceed 30% of limit)</li>
            <li>✅ Use only for convenience, not credit</li>
            <li>✅ Emergency fund (avoid CC for emergencies)</li>
          </ul>

          <h3>If You Have CC Debt</h3>
          <ul>
            <li><strong>Priority #1:</strong> Stop using the card (cut it if needed!)</li>
            <li><strong>Priority #2:</strong> Pay MORE than minimum (at least 20% of outstanding)</li>
            <li><strong>Priority #3:</strong> Consider balance transfer @ 0% (12-18 months interest-free)</li>
            <li><strong>Priority #4:</strong> Take personal loan @ 12% to pay off CC @ 36% (save 24%!)</li>
            <li><strong>Priority #5:</strong> Debt snowball/avalanche method</li>
          </ul>

          <h3>Balance Transfer Option</h3>
          <ul>
            <li>Transfer CC debt to another card @ 0% interest for 6-18 months</li>
            <li>Processing fee: 1-3% of transferred amount</li>
            <li>Pay off during 0% period (saves 36% interest!)</li>
            <li>Avoid new spending on transferred card</li>
            <li>Set reminder before 0% period ends</li>
          </ul>

          <h3>CC Charges to Watch Out</h3>
          <ul>
            <li><strong>Annual Fee:</strong> ₹500 - ₹10,000 (waived on spending target)</li>
            <li><strong>Late Payment:</strong> ₹500 - ₹1,500</li>
            <li><strong>Cash Withdrawal:</strong> 2.5% + ₹500 (no grace period, interest from day 1)</li>
            <li><strong>Foreign Transaction:</strong> 3.5% markup</li>
            <li><strong>Overlimit:</strong> ₹500 + interest on excess</li>
            <li><strong>Cheque Bounce:</strong> ₹500 - ₹750</li>
          </ul>

          <h3>Golden Rules for CC Usage</h3>
          <ul>
            <li>✅ Use for convenience and rewards ONLY (not for credit)</li>
            <li>✅ Pay FULL bill every month (not minimum!)</li>
            <li>✅ Auto-pay setup (never miss due date)</li>
            <li>✅ Keep utilization {'>'}30% (credit score health)</li>
            <li>✅ Track every transaction (budgeting apps)</li>
            <li>✅ Emergency fund = 6 months expenses (don't use CC)</li>
            <li>❌ NEVER withdraw cash (2.5% + interest from day 1)</li>
            <li>❌ NEVER pay minimum only (debt trap!)</li>
          </ul>

          <h3>CC Debt Red Flags</h3>
          <ul>
            <li>🚩 Paying only minimum for 3+ months</li>
            <li>🚩 Using CC for daily expenses (groceries, petrol)</li>
            <li>🚩 Cash withdrawals from CC</li>
            <li>🚩 Maxing out limit ({'>'}90% utilization)</li>
            <li>🚩 Using one CC to pay another</li>
            <li>🚩 Missing payments or paying late</li>
          </ul>

          <h3>Debt Repayment Strategies</h3>
          <ul>
            <li><strong>Avalanche Method:</strong> Pay highest interest CC first (saves most money)</li>
            <li><strong>Snowball Method:</strong> Pay smallest balance first (psychological wins)</li>
            <li><strong>Balance Transfer:</strong> Move to 0% card, pay off during promo period</li>
            <li><strong>Personal Loan:</strong> Consolidate @ 12% instead of 36%</li>
            <li><strong>Side Hustle:</strong> Extra income = faster payoff</li>
          </ul>

          <h3>Impact on Credit Score</h3>
          <ul>
            <li><strong>High Utilization (&gt;50%):</strong> Drops score by 50-100 points</li>
            <li><strong>Missed Payment:</strong> Drops score by 100+ points</li>
            <li><strong>Multiple Cards Maxed:</strong> Major red flag</li>
            <li><strong>Good Behavior:</strong> &lt; 30% utilization + full payments = score boost</li>
          </ul>

          <h3>When to Close CC?</h3>
          <ul>
            <li>❌ DON'T close oldest card (hurts credit history length)</li>
            <li>✅ DO close if you're struggling with debt</li>
            <li>✅ DO close if annual fee not worth rewards</li>
            <li>✅ DO close duplicate cards from same bank</li>
            <li>⚠️ Close after paying off completely (not before!)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}