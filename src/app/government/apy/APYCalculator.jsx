'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateAPY } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

export default function APYCalculator() {

  const [formData, setFormData] = useState({
    currentAge:             '25',
    desiredMonthlyPension:  '5000',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const age     = parseInt(formData.currentAge);
    const pension = parseInt(formData.desiredMonthlyPension);

    if (age < 18 || age > 40) {
      setResult({ error: 'APY is available for ages 18 to 40 only.' });
      return;
    }

    setLoading(true);
    const data = calculateAPY(age, pension);
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const pensionOptions = [1000, 2000, 3000, 4000, 5000];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

          <Breadcrumb items={BREADCRUMBS.apy} />
          
        <div className={styles.header}>
          <h1 className={styles.title}>APY Calculator</h1>
          <p className={styles.description}>
            Calculate Atal Pension Yojana contribution for guaranteed monthly pension of ₹1,000 to ₹5,000 
            at age 60. Government-backed pension for unorganized sector workers.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Your Details">
              <div className={styles.form}>

                <Input
                  label="Current Age"
                  type="number"
                  name="currentAge"
                  value={formData.currentAge}
                  onChange={handleChange}
                  suffix="years"
                  min="18"
                  max="40"
                  helpText="Entry age: 18-40 years"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    Desired Monthly Pension
                  </label>
                  <select
                    name="desiredMonthlyPension"
                    value={formData.desiredMonthlyPension}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                  >
                    {pensionOptions.map(amt => (
                      <option key={amt} value={amt}>₹{formatCurrency(amt)}/month</option>
                    ))}
                  </select>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Government-guaranteed pension at age 60
                  </p>
                </div>

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
                    <div className={styles.emiLabel}>Monthly Contribution</div>
                    <div className={styles.emiValue}>{formatCurrency(result.monthlyContribution)}</div>
                  </div>
                </Card>

                <Card title="APY Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly Contribution</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.monthlyContribution)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Yearly Contribution</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.yearlyContribution)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Years to 60</div>
                      <div className={styles.summaryValue}>{result.yearsToRetirement} years</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Contribution</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.totalContribution)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Guaranteed Pension</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981', fontSize: '1.75rem' }}>
                        {formatCurrency(result.guaranteedMonthlyPension)}/mo
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Yearly Pension</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.guaranteedMonthlyPension * 12)}/yr
                      </div>
                    </div>

                  </div>
                </Card>

                <Card variant="success">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#059669' }}>Benefits at Age 60</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#047857' }}>
                    <p>✅ <strong>Monthly Pension:</strong> ₹{formatCurrency(result.guaranteedMonthlyPension)} guaranteed for life</p>
                    <p>✅ <strong>Spouse Pension:</strong> Same amount continues to spouse after your death</p>
                    <p>✅ <strong>Nominee Lumpsum:</strong> ₹{formatCurrency(result.nomineeLumpsum)} (approx.) to nominee after both deaths</p>
                  </div>
                </Card>

                <Card title="What You Get">
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#64748b' }}>
                    <p><strong>Investment:</strong> Pay ₹{formatCurrency(result.monthlyContribution)}/month till age 60</p>
                    <p><strong>Total Paid:</strong> ₹{formatCurrency(result.totalContribution)} over {result.yearsToRetirement} years</p>
                    <p><strong>Guaranteed Return:</strong> ₹{formatCurrency(result.guaranteedMonthlyPension)}/month for life from age 60</p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem', color: '#047857' }}>
                      💡 If you live 20 years post-retirement (till 80), you receive ₹{formatCurrency(result.guaranteedMonthlyPension * 12 * 20)} 
                      — <strong>{((result.guaranteedMonthlyPension * 12 * 20) / result.totalContribution).toFixed(1)}x</strong> your contribution!
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
                  <div className={styles.placeholderIcon}>🏛️</div>
                  <p>Enter your age to see APY contribution</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>About APY (Atal Pension Yojana)</h2>
          <p>
            APY is a government-backed pension scheme for unorganized sector workers. It guarantees fixed 
            monthly pension of ₹1,000 to ₹5,000 at age 60 based on your contribution.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Entry Age:</strong> 18-40 years</li>
            <li><strong>Pension Age:</strong> 60 years</li>
            <li><strong>Pension Options:</strong> ₹1,000, ₹2,000, ₹3,000, ₹4,000, ₹5,000/month</li>
            <li><strong>Government Co-contribution:</strong> 50% for 5 years (for eligible subscribers joining before Dec 2015)</li>
            <li><strong>Auto-debit:</strong> From savings account</li>
            <li><strong>Guaranteed:</strong> Government-backed pension amount</li>
          </ul>

          <h3>Eligibility</h3>
          <ul>
            <li>Age: 18-40 years at time of joining</li>
            <li>Indian citizen</li>
            <li>Savings bank account</li>
            <li>Mobile number linked to Aadhaar</li>
            <li>Not covered under EPF/EPS/NPS Tier-I</li>
            <li>Not income tax payer</li>
          </ul>

          <h3>What Happens After 60?</h3>
          <ul>
            <li><strong>Subscriber alive:</strong> Gets monthly pension for life</li>
            <li><strong>Subscriber dies:</strong> Spouse gets same pension for life</li>
            <li><strong>Both die:</strong> Nominee gets accumulated corpus (pension wealth)</li>
            <li><strong>Premature death (before 60):</strong> Spouse can continue or get refund with interest</li>
          </ul>

          <h3>Monthly Contribution by Age (for ₹5,000 pension)</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Age</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Monthly</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Age</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Monthly</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>18</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹210</td><td style={{ padding: '0.25rem' }}>30</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹577</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>20</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹248</td><td style={{ padding: '0.25rem' }}>35</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹902</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>25</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹376</td><td style={{ padding: '0.25rem' }}>40</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹1,454</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
              💡 Younger you join, lower the contribution!
            </p>
          </div>

          <h3>Tax Benefits</h3>
          <ul>
            <li><strong>80CCD(1):</strong> Contributions eligible for deduction up to ₹1.5L (within overall 80C limit)</li>
            <li><strong>Pension Income:</strong> Taxable as per income slab</li>
            <li><strong>Corpus to Nominee:</strong> Tax-free</li>
          </ul>

          <h3>Premature Exit</h3>
          <ul>
            <li><strong>Before 60:</strong> Refund of contribution with/without interest (as per scheme rules)</li>
            <li><strong>After 60:</strong> Cannot exit, pension continues for life</li>
            <li><strong>Critical illness:</strong> Can exit with accumulated corpus</li>
          </ul>

          <h3>APY vs NPS</h3>
          <ul>
            <li><strong>APY:</strong> Fixed pension guaranteed, lower contribution, for unorganized sector</li>
            <li><strong>NPS:</strong> Market-linked returns, higher corpus, tax benefit ₹2L, for all</li>
            <li>APY simpler, NPS offers more flexibility</li>
            <li>Can have both NPS (Tier-I) and APY? No, mutually exclusive</li>
          </ul>

          <h3>Important Points</h3>
          <ul>
            <li>Auto-debit from bank — ensure sufficient balance</li>
            <li>Default penalty if contribution missed (restore account with penalty)</li>
            <li>Cannot increase/decrease pension amount once selected</li>
            <li>Can open only 1 APY account per person</li>
            <li>PRAN (Permanent Retirement Account Number) allotted</li>
          </ul>

          <h3>Who Should Choose APY?</h3>
          <ul>
            <li>Unorganized sector workers (no EPF)</li>
            <li>Low-income individuals seeking guaranteed pension</li>
            <li>Risk-averse investors wanting government guarantee</li>
            <li>Those wanting simple, fixed pension (no market risk)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}