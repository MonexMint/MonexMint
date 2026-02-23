'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateKVP } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function KVPCalculator() {

  const [formData, setFormData] = useState({
    principal:  '100000',
    annualRate: '7.5',
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

    if (!principal || principal < 1000) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateKVP(principal, rate);
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
          <h1 className={styles.title}>KVP Calculator</h1>
          <p className={styles.description}>
            Calculate Kisan Vikas Patra maturity - doubles your money in 115 months (9 years 7 months) 
            at 7.5% p.a. Safe government-backed investment.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="KVP Investment Details">
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
                  helpText="Current: 7.5% (FY 2024-25)"
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
                    <div className={styles.emiLabel}>Maturity Value (Money Doubled)</div>
                    <div className={styles.emiValue}>{formatCurrency(result.maturityValue)}</div>
                  </div>
                </Card>

                <Card title="KVP Maturity Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Principal</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.principal)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Maturity Value</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.maturityValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Doubling Period</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1', fontSize: '1.25rem' }}>
                        {result.doublingPeriodText}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Doubling (Months)</div>
                      <div className={styles.summaryValue}>{result.doublingMonths} months</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Interest Rate</div>
                      <div className={styles.summaryValue}>{result.annualRate}%</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Return</div>
                      <div className={styles.summaryValue}>100%</div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.principal} returns={result.principal} />
                </Card>

                <Card variant="success">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#059669' }}>💰 Money Doubling Timeline</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#047857' }}>
                    <p><strong>You invest:</strong> ₹{formatCurrency(result.principal)} today</p>
                    <p><strong>You receive:</strong> ₹{formatCurrency(result.maturityValue)} after {result.doublingPeriodText}</p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                      💡 Your money <strong>doubles</strong> with guaranteed government-backed returns!
                    </p>
                  </div>
                </Card>

                <Card title="Growth at Different Milestones">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>After 1 Year</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.value1Year)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>After 3 Years</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.value3Year)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>After 5 Years</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.value5Year)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>At Maturity ({result.doublingYears}y {result.doublingRemMonths}m)</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981', fontSize: '1.5rem' }}>
                        {formatCurrency(result.maturityValue)}
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🌾</div>
                  <p>Enter KVP investment amount</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About KVP (Kisan Vikas Patra)</h2>
          <p>
            KVP is a government savings certificate that doubles your money in a fixed period. 
            Originally designed for farmers, now open to all. Safe, guaranteed returns with no market risk.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Doubling Period:</strong> 115 months (9 years 7 months) at 7.5% p.a.</li>
            <li><strong>Interest Rate:</strong> 7.5% p.a. (FY 2024-25, compounded annually)</li>
            <li><strong>Min Investment:</strong> ₹1,000 | <strong>Max:</strong> No limit</li>
            <li><strong>Maturity:</strong> Amount automatically doubles at maturity</li>
            <li><strong>Transferable:</strong> Can be transferred to another person</li>
            <li><strong>Collateral:</strong> Can be pledged for loans</li>
            <li><strong>Safety:</strong> 100% government-backed</li>
          </ul>

          <h3>Types of KVP</h3>
          <ul>
            <li><strong>Single Holder:</strong> One adult holder</li>
            <li><strong>Joint A Type:</strong> Two adults, payable to both jointly</li>
            <li><strong>Joint B Type:</strong> Two adults, payable to either or survivor</li>
            <li><strong>Minor Account:</strong> By parent/guardian on behalf of minor</li>
          </ul>

          <h3>Tax Implications</h3>
          <ul>
            <li><strong>No 80C Benefit:</strong> Investment NOT eligible for tax deduction</li>
            <li><strong>Interest Taxable:</strong> Annual accrued interest taxable as "Other Income"</li>
            <li><strong>Must Declare:</strong> Show interest in ITR every year (even though received at maturity)</li>
            <li><strong>TDS:</strong> No TDS deducted</li>
            <li><strong>Tax on Maturity:</strong> Full interest earned over tenure is taxable</li>
          </ul>

          <h3>Premature Encashment</h3>
          <ul>
            <li><strong>After 2.5 years:</strong> Allowed (with penalty on interest)</li>
            <li><strong>Before 2.5 years:</strong> Only on death or court order</li>
            <li><strong>Penalty:</strong> Lower interest rate applied for premature withdrawal</li>
            <li><strong>No lock-in:</strong> More flexible than NSC (5-year lock)</li>
          </ul>

          <h3>Doubling Period by Interest Rate</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Rate p.a.</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Doubles In</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>7.0%</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>10 years 2 months</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>7.5%</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>9 years 7 months</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>8.0%</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>9 years 0 months</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
              💡 Rule of 72: Doubling time ≈ 72 ÷ Interest Rate
            </p>
          </div>

          <h3>How to Invest</h3>
          <ul>
            <li>Visit post office or authorized bank with documents</li>
            <li>ID proof: Aadhaar, PAN, Passport, etc.</li>
            <li>Address proof</li>
            <li>Fill KVP application form</li>
            <li>Pay via cash/cheque (above ₹50K requires PAN)</li>
            <li>Certificate issued immediately</li>
          </ul>

          <h3>Transfer Rules</h3>
          <ul>
            <li>Can transfer from one person to another</li>
            <li>Can transfer from one post office to another</li>
            <li>Nomination facility available</li>
            <li>Joint holder can be added/removed</li>
          </ul>

          <h3>KVP vs Other Options</h3>
          <ul>
            <li><strong>KVP vs NSC:</strong> NSC has 80C benefit, KVP doesn't; NSC 5 years vs KVP 115 months</li>
            <li><strong>KVP vs PPF:</strong> PPF better (80C + tax-free interest), but 15-year lock-in</li>
            <li><strong>KVP vs FD:</strong> Similar rates, but FD more flexible; KVP government-backed</li>
            <li><strong>KVP vs RD:</strong> RD needs monthly deposits, KVP one-time</li>
          </ul>

          <h3>Use Cases</h3>
          <ul>
            <li>Long-term savings without monthly commitment</li>
            <li>Gift for children/grandchildren (opens in their name)</li>
            <li>Safe parking for lumpsum money</li>
            <li>Collateral for loans</li>
            <li>Wealth preservation for 10 years</li>
          </ul>

          <h3>Who Should Invest?</h3>
          <ul>
            <li>Risk-averse investors wanting guaranteed doubling</li>
            <li>Those who can lock money for 9-10 years</li>
            <li>Don't need 80C deduction (already exhausted)</li>
            <li>Want government safety without equity risk</li>
            <li>Comfortable paying tax on accrued interest</li>
          </ul>

          <h3>Important Points</h3>
          <ul>
            <li>Interest credited at maturity, not periodically</li>
            <li>No maximum investment limit</li>
            <li>Can buy multiple certificates</li>
            <li>Denominations: ₹1000, ₹5000, ₹10000, ₹50000</li>
            <li>Lost certificate can be duplicate (with indemnity)</li>
            <li>Rate fixed at purchase (not affected by future rate changes)</li>
          </ul>

          <h3>Calculation Example</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Investment:</strong> ₹1,00,000 @ 7.5% p.a.</p>
            <p><strong>Doubling Period:</strong> 115 months (9 years 7 months)</p>
            <p><strong>Maturity Value:</strong> ₹2,00,000 (exactly double)</p>
            <p><strong>Interest Earned:</strong> ₹1,00,000</p>
            <p><strong>Tax (30% bracket):</strong> ₹30,000 (on interest)</p>
            <p><strong>Net Gain:</strong> ₹70,000 after tax</p>
          </div>
        </Card>

      </div>
    </div>
  );
}