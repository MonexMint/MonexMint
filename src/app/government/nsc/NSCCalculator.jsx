'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateNSC } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function NSCCalculator() {

  const [formData, setFormData] = useState({
    principal:   '100000',
    annualRate:  '7.7',
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

    if (!principal || principal < 1000 || !years || years < 5) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateNSC(principal, rate, years);
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
          <h1 className={styles.title}>NSC Calculator</h1>
          <p className={styles.description}>
            Calculate National Savings Certificate maturity with 7.7% interest. 5-year fixed term 
            with 80C tax benefits on principal and annual reinvested interest.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="NSC Investment Details">
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
                  helpText="Min: ₹1,000, No maximum limit"
                />

                <Input
                  label="Interest Rate (p.a.)"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Current: 7.7% (FY 2024-25)"
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
                  helpText="Fixed 5-year maturity"
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
                    <div className={styles.emiLabel}>Maturity Value (5 Years)</div>
                    <div className={styles.emiValue}>{formatCurrency(result.maturityValue)}</div>
                  </div>
                </Card>

                <Card title="NSC Summary">
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
                      <div className={styles.summaryLabel}>Maturity Value</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.maturityValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Rate</div>
                      <div className={styles.summaryValue}>{result.annualRate}%</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tenure</div>
                      <div className={styles.summaryValue}>{result.tenureYears} years</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Return %</div>
                      <div className={styles.summaryValue}>
                        {((result.totalInterest / result.principal) * 100).toFixed(2)}%
                      </div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.principal} returns={result.totalInterest} />
                </Card>

                <Card title="80C Tax Benefit - Year-wise Interest" variant="success">
                  <div className={styles.tableWrapper}>
                    <table className={styles.amortTable}>
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th>Interest Earned</th>
                          <th>Reinvested</th>
                          <th>80C Deduction</th>
                          <th>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearlyInterest.map((row) => (
                          <tr key={row.year}>
                            <td>{row.year}</td>
                            <td style={{ color: '#10b981' }}>{formatCurrency(row.interestEarned)}</td>
                            <td>{row.deductibleUnder80C ? '✓ Yes' : '✗ No'}</td>
                            <td style={{ color: row.deductibleUnder80C ? '#059669' : '#94a3b8' }}>
                              {row.deductibleUnder80C ? formatCurrency(row.interestEarned) : '-'}
                            </td>
                            <td style={{ color: '#6366f1', fontWeight: 600 }}>{formatCurrency(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#047857', marginTop: '1rem' }}>
                    💡 <strong>Tax Benefit:</strong> Interest earned each year (except last) is deemed reinvested and 
                    eligible for 80C deduction in that year, over and above initial investment.
                  </p>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🏛️</div>
                  <p>Enter NSC investment amount</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About NSC (National Savings Certificate)</h2>
          <p>
            NSC is a government-backed fixed-income investment scheme offering guaranteed returns. 
            Popular for its safety, fixed tenure, and attractive tax benefits under Section 80C.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Tenure:</strong> 5 years (fixed, no premature withdrawal)</li>
            <li><strong>Interest Rate:</strong> 7.7% p.a. (FY 2024-25, revised quarterly)</li>
            <li><strong>Compounding:</strong> Annual compounding, paid at maturity</li>
            <li><strong>Min Investment:</strong> ₹1,000 | <strong>Max:</strong> No limit</li>
            <li><strong>Tax Benefit:</strong> 80C deduction on principal + reinvested interest (up to ₹1.5L)</li>
            <li><strong>Safety:</strong> 100% government-backed, zero risk</li>
          </ul>

          <h3>Tax Benefits (80C)</h3>
          <ul>
            <li><strong>Initial Investment:</strong> Fully deductible under 80C</li>
            <li><strong>Reinvested Interest:</strong> Interest earned in Years 1-4 is deemed reinvested and qualifies for 80C</li>
            <li><strong>Example:</strong> ₹1L investment → Year 1 interest ₹7,700 also gets 80C in Year 1</li>
            <li><strong>Total Benefit:</strong> Can exceed ₹1L in deductions over 5 years</li>
            <li><strong>Year 5 Interest:</strong> Not deductible (paid at maturity, not reinvested)</li>
          </ul>

          <h3>Maturity Taxation</h3>
          <ul>
            <li><strong>Interest Income:</strong> Fully taxable as "Income from Other Sources"</li>
            <li><strong>Taxed as per slab:</strong> Added to total income in maturity year</li>
            <li><strong>TDS:</strong> No TDS deducted by post office</li>
            <li><strong>Must declare:</strong> In ITR for maturity year</li>
          </ul>

          <h3>Types of NSC</h3>
          <ul>
            <li><strong>NSC VIII Issue (Current):</strong> Single holder</li>
            <li><strong>NSC IX Issue:</strong> Joint holder (A or B type)</li>
            <li><strong>Minor Account:</strong> Can be opened by guardian</li>
          </ul>

          <h3>Unique Features</h3>
          <ul>
            <li><strong>Transferable:</strong> Can transfer to another person/post office</li>
            <li><strong>Nomination:</strong> Available</li>
            <li><strong>Loan Collateral:</strong> Can be pledged for loans</li>
            <li><strong>Premature Closure:</strong> Only on death or court order</li>
            <li><strong>Joint Account:</strong> Allowed (max 3 adults)</li>
          </ul>

          <h3>NSC Calculation Example</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Investment:</strong> ₹1,00,000 @ 7.7% for 5 years</p>
            <table style={{ width: '100%', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Year</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Interest</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>80C?</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>1</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹7,700</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>✓</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹1,07,700</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>2</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹8,293</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>✓</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹1,15,993</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>3</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹8,931</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>✓</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹1,24,924</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>4</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹9,619</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>✓</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹1,34,543</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>5</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹10,360</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>✗</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹1,44,903</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              <strong>Maturity:</strong> ₹1,44,903 | <strong>Total 80C:</strong> ₹1,34,543
            </p>
          </div>

          <h3>NSC vs Other Options</h3>
          <ul>
            <li><strong>NSC vs FD:</strong> NSC has 80C benefit, FD doesn't (except tax-saver FD)</li>
            <li><strong>NSC vs PPF:</strong> PPF has higher rate (7.1% vs 7.7% — wait, NSC higher!), 15-year lock-in vs 5 years</li>
            <li><strong>NSC vs Tax-Saver FD:</strong> NSC rate usually higher, both 80C, but NSC 5 years vs FD 5 years</li>
            <li><strong>NSC vs Post Office TD:</strong> NSC has 80C + better rate</li>
          </ul>

          <h3>How to Invest</h3>
          <ul>
            <li>Visit any post office with ID, address proof, and PAN</li>
            <li>Fill NSC application form</li>
            <li>Payment via cash/cheque/demand draft</li>
            <li>Certificate issued immediately (passbook style)</li>
            <li>Keep certificate safe (required at maturity)</li>
          </ul>

          <h3>Premature Encashment</h3>
          <ul>
            <li><strong>Not allowed</strong> except in special cases:</li>
            <li>Death of holder/joint holder</li>
            <li>Court order or pledge to government</li>
            <li>Forfeiture by law enforcement</li>
          </ul>

          <h3>Who Should Invest in NSC?</h3>
          <ul>
            <li>Risk-averse investors wanting guaranteed returns</li>
            <li>Those exhausting ₹1.5L 80C limit (PPF + NSC)</li>
            <li>5-year investment horizon acceptable</li>
            <li>Want government-backed safety</li>
            <li>Prefer post office over banks</li>
          </ul>

          <h3>Important Points</h3>
          <ul>
            <li>Interest rate set by government, revised quarterly</li>
            <li>Certificate is physical (not dematerialized)</li>
            <li>Lost certificate can be reissued (with indemnity)</li>
            <li>Can buy in denomination of ₹1000, ₹5000, ₹10000, etc.</li>
            <li>No upper age limit</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}