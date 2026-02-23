'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateFD } from '@/lib/calculators';
import { formatCurrency, COMPOUNDING_OPTIONS } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function FDCalculator() {

  const [formData, setFormData] = useState({
    principal:              '100000',
    annualRate:             '7',
    tenureMonths:           '12',
    compoundingFrequency:   '4',
    isSeniorCitizen:        false,
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
    const principal  = parseFloat(formData.principal);
    const rate       = parseFloat(formData.annualRate);
    const months     = parseFloat(formData.tenureMonths);
    const frequency  = parseInt(formData.compoundingFrequency, 10);
    const senior     = formData.isSeniorCitizen;

    if (!principal || principal <= 0 || !months || months <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateFD(principal, rate, months, frequency, senior);
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const frequencyLabel = COMPOUNDING_OPTIONS.find(o => o.value === parseInt(formData.compoundingFrequency))?.label || 'Quarterly';

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>FD Calculator</h1>
          <p className={styles.description}>
            Calculate Fixed Deposit maturity with quarterly compounding. Check TDS, compare rates, 
            and see senior citizen bonus (+0.5% extra rate).
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="FD Details">
              <div className={styles.form}>

                <Input
                  label="Deposit Amount"
                  type="number"
                  name="principal"
                  value={formData.principal}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                  helpText="Minimum varies by bank (₹1,000 - ₹10,000)"
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
                  min="1"
                  max="120"
                  helpText="Min: 7 days, Max: 10 years (most banks)"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    Compounding Frequency
                  </label>
                  <select
                    name="compoundingFrequency"
                    value={formData.compoundingFrequency}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                  >
                    {COMPOUNDING_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Most banks: Quarterly
                  </p>
                </div>

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

                <Card title="FD Summary">
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
                      <div className={styles.summaryLabel}>Maturity Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.maturityAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Effective Rate</div>
                      <div className={styles.summaryValue} style={{ color: '#8b5cf6' }}>
                        {result.effectiveAnnualRate}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Applied Rate</div>
                      <div className={styles.summaryValue}>
                        {result.effectiveRate}% {result.isSeniorCitizen && <span style={{ color: '#10b981' }}>✓ Senior</span>}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Compounding</div>
                      <div className={styles.summaryValue}>{frequencyLabel}</div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.principal} returns={result.totalInterest} />
                </Card>

                {/* TDS CARD */}
                <Card title="TDS (Tax Deducted at Source)" variant={result.tdsApplicable ? 'warning' : 'success'}>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Annual Interest</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.annualInterest)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>TDS Threshold</div>
                      <div className={styles.summaryValue}>
                        {result.isSeniorCitizen ? '₹50,000' : '₹40,000'}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>TDS Applicable?</div>
                      <div className={styles.summaryValue} style={{ 
                        color: result.tdsApplicable ? '#dc2626' : '#059669' 
                      }}>
                        {result.tdsApplicable ? '✓ Yes (10%)' : '✗ No'}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>TDS Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.tdsAmount)}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', marginTop: '1rem', lineHeight: '1.7', color: result.tdsApplicable ? '#92400e' : '#047857' }}>
                    {result.tdsApplicable ? (
                      <>💡 <strong>TDS will be deducted.</strong> Net maturity: ₹{formatCurrency(result.netMaturity)}. Submit Form 15G/15H if income is below taxable limit to avoid TDS.</>
                    ) : (
                      <>✅ <strong>No TDS.</strong> Your annual interest (₹{formatCurrency(result.annualInterest)}) is below the threshold.</>
                    )}
                  </p>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🏦</div>
                  <p>Enter FD details</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About Fixed Deposit (FD)</h2>
          <p>
            Fixed Deposit is a safe investment where you deposit a lump sum for a fixed period at a fixed interest rate. 
            Principal and interest are guaranteed by the bank/DICGC (up to ₹5 lakh per depositor per bank).
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Interest Rates:</strong> 6% - 8% p.a. (varies by bank and tenure)</li>
            <li><strong>Tenure:</strong> 7 days to 10 years (most banks)</li>
            <li><strong>Compounding:</strong> Quarterly (most banks), some offer monthly/half-yearly</li>
            <li><strong>Senior Citizen Bonus:</strong> +0.25% to +0.75% extra (most banks +0.5%)</li>
            <li><strong>Safety:</strong> DICGC insured up to ₹5L per depositor per bank</li>
            <li><strong>Premature Withdrawal:</strong> Allowed (penalty: 0.5% - 1% on rate)</li>
          </ul>

          <h3>Types of FD</h3>
          <ul>
            <li><strong>Regular FD:</strong> Fixed rate for entire tenure</li>
            <li><strong>Tax-Saver FD:</strong> 5-year lock-in, 80C benefit (up to ₹1.5L)</li>
            <li><strong>Cumulative FD:</strong> Interest compounded, paid at maturity</li>
            <li><strong>Non-Cumulative FD:</strong> Interest paid monthly/quarterly/yearly</li>
            <li><strong>Flexi FD:</strong> Linked to savings, auto-sweep facility</li>
          </ul>

          <h3>Interest Payment Options</h3>
          <ul>
            <li><strong>Cumulative:</strong> Interest reinvested, lumpsum at maturity (highest returns)</li>
            <li><strong>Monthly Payout:</strong> Interest paid every month (for regular income)</li>
            <li><strong>Quarterly:</strong> Interest paid every 3 months</li>
            <li><strong>Yearly:</strong> Interest paid annually</li>
            <li><strong>At Maturity:</strong> Simple interest paid at end (lowest returns)</li>
          </ul>

          <h3>TDS (Tax Deducted at Source)</h3>
          <ul>
            <li><strong>Threshold:</strong> ₹40,000/year (₹50,000 for senior citizens 60+)</li>
            <li><strong>Rate:</strong> 10% TDS if interest exceeds threshold</li>
            <li><strong>Form 15G/15H:</strong> Submit if income below taxable limit to avoid TDS</li>
            <li><strong>PAN Required:</strong> 20% TDS if PAN not provided</li>
            <li><strong>Interest Taxable:</strong> Added to income, taxed as per slab</li>
          </ul>

          <h3>Premature Withdrawal</h3>
          <ul>
            <li>Allowed after minimum period (varies: 7 days to 3 months)</li>
            <li>Penalty: 0.5% - 1% reduction in interest rate</li>
            <li>Some banks: No penalty for senior citizens/medical emergencies</li>
            <li>Interest paid: At reduced rate for actual period held</li>
          </ul>

          <h3>Tax-Saver FD (80C)</h3>
          <ul>
            <li><strong>Lock-in:</strong> 5 years (no premature withdrawal)</li>
            <li><strong>Tax Benefit:</strong> 80C deduction up to ₹1.5L</li>
            <li><strong>Interest:</strong> Taxable (no exemption unlike PPF)</li>
            <li><strong>Rate:</strong> Usually same as regular 5-year FD</li>
            <li><strong>Who Should Choose:</strong> Those needing 80C benefit with safety</li>
          </ul>

          <h3>FD Interest Rates by Tenure (Indicative)</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Tenure</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>General</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Senior (60+)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>7 days - 45 days</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>3.0%</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>3.5%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>46 days - 6 months</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>5.5%</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>6.0%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>6 months - 1 year</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>6.5%</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>7.0%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>1 year - 2 years</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>7.0%</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>7.5%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>2 years - 3 years</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>7.25%</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>7.75%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>3 years - 5 years</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>7.5%</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>8.0%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>5 years - 10 years</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>7.0%</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>7.5%</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
              💡 Rates vary by bank. Check with your bank for exact rates.
            </p>
          </div>

          <h3>FD vs Other Options</h3>
          <ul>
            <li><strong>FD vs Savings:</strong> FD 6-8% vs Savings 3-4%; FD locked, Savings liquid</li>
            <li><strong>FD vs RD:</strong> FD lumpsum, RD monthly; FD slightly higher rate</li>
            <li><strong>FD vs PPF:</strong> PPF 7.1% tax-free vs FD 7% taxable; PPF 15-year lock-in</li>
            <li><strong>FD vs Mutual Funds:</strong> FD safe 7% vs MF risky 10-12%; FD guaranteed</li>
          </ul>

          <h3>When to Choose FD?</h3>
          <ul>
            <li>Need guaranteed returns (no market risk)</li>
            <li>Short to medium term (1-5 years)</li>
            <li>Park emergency fund surplus</li>
            <li>Senior citizens seeking regular income</li>
            <li>Conservative investors avoiding equity</li>
          </ul>

          <h3>Pro Tips</h3>
          <ul>
            <li>Ladder FDs (different maturities) for liquidity + higher returns</li>
            <li>Choose cumulative for highest returns (compounding)</li>
            <li>Compare rates across banks (small finance banks offer 8-9%)</li>
            <li>Senior citizens: Always mention age for bonus rate</li>
            <li>Submit Form 15G/15H if no tax liability</li>
            <li>Avoid premature withdrawal (loses ~1% interest)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}