'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateSavingsAccountInterest } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function SavingsInterestCalculator() {

  const [formData, setFormData] = useState({
    averageMonthlyBalance: '50000',
    annualRate:            '3',
    months:                '12',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const balance = parseFloat(formData.averageMonthlyBalance);
    const rate    = parseFloat(formData.annualRate);
    const months  = parseFloat(formData.months);

    if (!balance || balance <= 0 || !months || months <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateSavingsAccountInterest(balance, rate, months);
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
          <h1 className={styles.title}>Savings Account Interest Calculator</h1>
          <p className={styles.description}>
            Calculate interest earned on your savings account balance. Daily balance method, 
            quarterly credit. See how much your idle cash earns!
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Savings Account Details">
              <div className={styles.form}>

                <Input
                  label="Average Monthly Balance"
                  type="number"
                  name="averageMonthlyBalance"
                  value={formData.averageMonthlyBalance}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                  helpText="Typical balance you maintain"
                />

                <Input
                  label="Interest Rate (p.a.)"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Bank rates: 2.7% - 4% typically"
                />

                <Input
                  label="Period (months)"
                  type="number"
                  name="months"
                  value={formData.months}
                  onChange={handleChange}
                  suffix="months"
                  min="1"
                  max="120"
                  helpText="How long to calculate interest"
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
                    <div className={styles.emiLabel}>Annual Interest Earned</div>
                    <div className={styles.emiValue}>{formatCurrency(result.annualInterest)}</div>
                  </div>
                </Card>

                <Card title="Interest Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Average Balance</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.averageMonthlyBalance)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Rate</div>
                      <div className={styles.summaryValue}>{result.annualRate}% p.a.</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Daily Rate</div>
                      <div className={styles.summaryValue}>{(result.dailyRate * 100).toFixed(4)}%</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly Interest</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.monthlyInterest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Quarterly Interest</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.quarterlyInterest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Annual Interest</div>
                      <div className={styles.summaryValue} style={{ color: '#8b5cf6' }}>
                        {formatCurrency(result.annualInterest)}
                      </div>
                    </div>

                  </div>
                </Card>

                <Card title="Interest for Period ({formData.months} months)">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Period Interest</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981', fontSize: '1.5rem' }}>
                        {formatCurrency(result.periodInterest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>TDS Applicable?</div>
                      <div className={styles.summaryValue} style={{ 
                        color: result.tdsApplicable ? '#dc2626' : '#059669' 
                      }}>
                        {result.tdsApplicable ? '✓ Yes' : '✗ No'}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>TDS Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.tdsAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>TDS Threshold</div>
                      <div className={styles.summaryValue}>₹10,000/year</div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.averageMonthlyBalance} returns={result.periodInterest} />
                </Card>

                <Card variant={result.tdsApplicable ? 'warning' : 'success'}>
                  <h3 style={{ margin: '0 0 1rem 0', color: result.tdsApplicable ? '#92400e' : '#059669' }}>
                    {result.tdsApplicable ? '⚠️ TDS Note' : '✅ Interest Summary'}
                  </h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: result.tdsApplicable ? '#92400e' : '#047857' }}>
                    {result.tdsApplicable ? (
                      <>
                        <p>Your annual interest (₹{formatCurrency(result.annualInterest)}) exceeds ₹10,000 threshold.</p>
                        <p><strong>TDS:</strong> 10% (₹{formatCurrency(result.tdsAmount)}) will be deducted.</p>
                        <p>Submit Form 15G/15H if income below taxable limit to avoid TDS.</p>
                      </>
                    ) : (
                      <>
                        <p>Your average balance of <strong>₹{formatCurrency(result.averageMonthlyBalance)}</strong> earns:</p>
                        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                          <li><strong>Monthly:</strong> ₹{formatCurrency(result.monthlyInterest)}</li>
                          <li><strong>Quarterly:</strong> ₹{formatCurrency(result.quarterlyInterest)} (credited to account)</li>
                          <li><strong>Yearly:</strong> ₹{formatCurrency(result.annualInterest)}</li>
                        </ul>
                        <p style={{ marginTop: '1rem' }}>💡 No TDS as annual interest is below ₹10,000 threshold.</p>
                      </>
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>💰</div>
                  <p>Enter savings account balance</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About Savings Account Interest</h2>
          <p>
            Savings account interest is calculated daily on your end-of-day balance and credited quarterly 
            (every 3 months). It's the safest, most liquid investment but offers lowest returns.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Interest Rates:</strong> 2.7% - 4% p.a. (regular banks 3%, some digital banks 7%)</li>
            <li><strong>Calculation Method:</strong> Daily balance (end of day)</li>
            <li><strong>Credit Frequency:</strong> Quarterly (Mar 31, Jun 30, Sep 30, Dec 31)</li>
            <li><strong>Liquidity:</strong> 100% (withdraw anytime)</li>
            <li><strong>Safety:</strong> DICGC insured up to ₹5L per depositor per bank</li>
            <li><strong>TDS:</strong> 10% if interest &gt; ₹10,000/year</li>
          </ul>

          <h3>How Interest is Calculated</h3>
          <p><strong>Daily Balance Method:</strong></p>
          <ul>
            <li>Interest = (Daily Balance × Rate × Days) ÷ 365</li>
            <li>Calculated daily on closing balance</li>
            <li>Summed for entire quarter</li>
            <li>Credited on last day of quarter</li>
          </ul>

          <h3>Example Calculation</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Average Balance:</strong> ₹1,00,000 @ 3% p.a.</p>
            <table style={{ width: '100%', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Daily Interest:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹8.22</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Monthly Interest:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹250</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Quarterly Credit:</td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 600, color: '#10b981' }}>₹750</td></tr>
                <tr style={{ borderTop: '2px solid #e2e8f0' }}><td style={{ padding: '0.25rem' }}><strong>Annual Interest:</strong></td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 700, color: '#6366f1' }}>₹3,000</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Savings Account Interest Rates (2024)</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Bank Type</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Rate p.a.</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Public Sector (SBI, PNB)</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>2.7% - 3%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Private (HDFC, ICICI, Axis)</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>3% - 3.5%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Small Finance Banks</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>4% - 7%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Digital Banks (Jupiter, Fi)</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>6% - 7%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Post Office Savings</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>4%</td></tr>
              </tbody>
            </table>
          </div>

          <h3>TDS on Savings Interest</h3>
          <ul>
            <li><strong>Threshold:</strong> ₹10,000/year (for all, no senior citizen benefit)</li>
            <li><strong>Rate:</strong> 10% TDS if annual interest exceeds ₹10,000</li>
            <li><strong>Form 15G/15H:</strong> Submit to avoid TDS if income below taxable limit</li>
            <li><strong>Example:</strong> ₹3.5L balance @ 3% = ₹10,500 interest → TDS ₹1,050</li>
            <li><strong>PAN Required:</strong> 20% TDS if PAN not linked</li>
          </ul>

          <h3>Minimum Balance Requirements</h3>
          <ul>
            <li><strong>Metro/Urban:</strong> ₹5,000 - ₹10,000 (varies by bank)</li>
            <li><strong>Semi-Urban:</strong> ₹2,500 - ₹5,000</li>
            <li><strong>Rural:</strong> ₹1,000 - ₹2,500</li>
            <li><strong>Penalty:</strong> ₹100 - ₹600/month if not maintained</li>
            <li><strong>Zero Balance:</strong> Some banks (PMJDY, digital banks)</li>
          </ul>

          <h3>Savings vs Other Options</h3>
          <ul>
            <li><strong>Savings vs FD:</strong> Savings 3% liquid vs FD 7% locked</li>
            <li><strong>Savings vs Liquid Funds:</strong> Savings 3% vs Liquid MF 6-7%</li>
            <li><strong>Savings vs Sweep FD:</strong> Sweep auto-converts excess to FD (best of both)</li>
          </ul>

          <h3>High-Interest Savings Accounts</h3>
          <ul>
            <li><strong>Small Finance Banks:</strong> 5-7% but limited branch network</li>
            <li><strong>Digital Banks:</strong> 6-7% but app-only, no branch</li>
            <li><strong>Post Office:</strong> 4% govt-backed, safe</li>
            <li><strong>Trade-off:</strong> Higher rate = fewer branches/services</li>
          </ul>

          <h3>When to Keep Money in Savings?</h3>
          <ul>
            <li><strong>Emergency Fund:</strong> 3-6 months expenses (immediate liquidity)</li>
            <li><strong>Short-term Needs:</strong> Money needed within days/weeks</li>
            <li><strong>Monthly Expenses:</strong> Bill payments, rent, EMIs</li>
            <li><strong>Avoid:</strong> Keeping large idle cash (loses to inflation)</li>
          </ul>

          <h3>Maximizing Savings Interest</h3>
          <ul>
            <li>✅ Maintain higher average balance (not just month-end)</li>
            <li>✅ Choose bank with higher rate (compare 3% vs 7%)</li>
            <li>✅ Use sweep-in facility (auto-creates FD for excess)</li>
            <li>✅ Link PAN to avoid 20% TDS</li>
            <li>✅ Submit Form 15G/15H if no tax liability</li>
          </ul>

          <h3>Sweep-in Facility</h3>
          <ul>
            <li>Auto-converts balance above threshold to FD</li>
            <li>Example: Keep ₹50K in savings, rest in FD</li>
            <li>Auto-breaks FD if need more cash</li>
            <li>Earns FD rate (7%) on excess, savings rate (3%) on minimum</li>
            <li>Best of both: Liquidity + higher returns</li>
          </ul>

          <h3>Inflation Impact</h3>
          <ul>
            <li><strong>Savings Rate:</strong> 3% p.a.</li>
            <li><strong>Inflation:</strong> 6% p.a.</li>
            <li><strong>Real Return:</strong> -3% (losing purchasing power!)</li>
            <li><strong>Don't keep large amounts:</strong> Invest surplus in FD/MF</li>
          </ul>

          <h3>Pro Tips</h3>
          <ul>
            <li>Keep only 3-6 months expenses in savings (emergency fund)</li>
            <li>Invest rest in FD (7%) or liquid funds (6-7%)</li>
            <li>Use sweep-in if offered (free liquidity + FD returns)</li>
            <li>Compare bank rates (7% vs 3% = 133% more interest!)</li>
            <li>Link PAN and submit Form 15G/15H to avoid TDS</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}