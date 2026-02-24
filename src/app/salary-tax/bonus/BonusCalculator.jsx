'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateBonus } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

export default function BonusCalculator() {

  const [formData, setFormData] = useState({
    annualCTC:          '1200000',
    bonusPercent:       '10',
    annualGrossIncome:  '1000000',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const ctc    = parseFloat(formData.annualCTC);
    const bonus  = parseFloat(formData.bonusPercent);
    const gross  = parseFloat(formData.annualGrossIncome);

    if (!ctc || ctc <= 0 || !bonus || bonus < 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateBonus(ctc, bonus, gross);
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

        <Breadcrumb items={BREADCRUMBS.bonus} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Bonus Calculator</h1>
          <p className={styles.description}>
            Calculate your in-hand bonus after income tax deduction. See the effective tax rate on your performance bonus or variable pay.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Bonus Details">
              <div className={styles.form}>

                <Input
                  label="Annual CTC"
                  type="number"
                  name="annualCTC"
                  value={formData.annualCTC}
                  onChange={handleChange}
                  prefix="₹"
                  min="100000"
                  step="10000"
                  helpText="Your total annual package"
                />

                <Input
                  label="Bonus Percentage"
                  type="number"
                  name="bonusPercent"
                  value={formData.bonusPercent}
                  onChange={handleChange}
                  suffix="% of CTC"
                  min="0"
                  max="100"
                  step="1"
                  helpText="Performance bonus as % of CTC"
                />

                <Input
                  label="Annual Gross Income (existing)"
                  type="number"
                  name="annualGrossIncome"
                  value={formData.annualGrossIncome}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="10000"
                  helpText="Your taxable income before bonus"
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
                    <div className={styles.emiLabel}>In-Hand Bonus</div>
                    <div className={styles.emiValue}>{formatCurrency(result.inHandBonus)}</div>
                  </div>
                </Card>

                <Card title="Bonus Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Gross Bonus</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.bonusAmount)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tax on Bonus</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.taxOnBonus)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>In-Hand Bonus</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981', fontSize: '1.5rem' }}>
                        {formatCurrency(result.inHandBonus)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Effective Tax Rate</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {result.effectiveTaxRate}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>In-Hand %</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {result.inHandPercent}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Bonus % of CTC</div>
                      <div className={styles.summaryValue}>{formData.bonusPercent}%</div>
                    </div>

                  </div>
                </Card>

                <Card variant="warning">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#92400e' }}>💰 Bonus Tax Impact</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#92400e' }}>
                    <p>Your gross bonus of <strong>₹{formatCurrency(result.bonusAmount)}</strong> is added to your annual income and taxed accordingly.</p>
                    <p style={{ marginTop: '1rem' }}>
                      <strong>Tax Deducted:</strong> ₹{formatCurrency(result.taxOnBonus)} ({result.effectiveTaxRate}% effective rate)
                    </p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                      💡 You'll receive <strong>₹{formatCurrency(result.inHandBonus)}</strong> in hand — that's {result.inHandPercent}% of your gross bonus.
                    </p>
                  </div>
                </Card>

                <InvestmentBarChart 
                  invested={result.bonusAmount} 
                  returns={result.taxOnBonus}
                  labels={{ invested: 'Gross Bonus', returns: 'Tax' }}
                />
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🎁</div>
                  <p>Enter bonus details to calculate</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>Understanding Bonus Taxation</h2>
          <p>
            Bonus, variable pay, and performance incentives are fully taxable as "Salary Income". 
            They're added to your annual income and taxed as per your income tax slab.
          </p>

          <h3>How Bonus is Taxed</h3>
          <ul>
            <li><strong>Added to Income:</strong> Bonus is added to your total annual income</li>
            <li><strong>Taxed as Salary:</strong> No separate tax rate — same slabs apply</li>
            <li><strong>TDS Deducted:</strong> Employer deducts TDS before paying bonus</li>
            <li><strong>Higher Tax Bracket:</strong> Large bonus may push you to higher slab</li>
          </ul>

          <h3>Types of Bonus</h3>
          <ul>
            <li><strong>Performance Bonus:</strong> Based on individual/company performance (5-30% of CTC)</li>
            <li><strong>Statutory Bonus:</strong> Minimum wage act — 8.33% of basic (up to ₹7K wage)</li>
            <li><strong>Joining Bonus:</strong> One-time payment for new joiners</li>
            <li><strong>Retention Bonus:</strong> To retain employees (usually tax-heavy)</li>
            <li><strong>Diwali Bonus:</strong> Festival bonus (taxable)</li>
          </ul>

          <h3>Tax Calculation Example</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Scenario:</strong> Annual Income ₹10L + Bonus ₹1.5L</p>
            <ul style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <li>Total Income: ₹11.5L</li>
              <li>Tax Without Bonus (₹10L): ₹1,12,500</li>
              <li>Tax With Bonus (₹11.5L): ₹1,57,500</li>
              <li><strong>Tax on Bonus:</strong> ₹45,000 (30% slab rate)</li>
              <li><strong>In-Hand Bonus:</strong> ₹1,05,000 (70% of ₹1.5L)</li>
            </ul>
          </div>

          <h3>TDS on Bonus</h3>
          <ul>
            <li><strong>Deducted by Employer:</strong> TDS based on projected annual income</li>
            <li><strong>Form 16:</strong> Bonus TDS reflected in annual Form 16</li>
            <li><strong>Adjustment:</strong> If TDS insufficient, pay advance tax</li>
            <li><strong>Refund:</strong> If excess TDS, get refund after ITR filing</li>
          </ul>

          <h3>Bonus Payment Timing</h3>
          <ul>
            <li><strong>Annual Bonus:</strong> Usually paid in Apr-May (after appraisal)</li>
            <li><strong>Quarterly Bonus:</strong> Sales roles — every 3 months</li>
            <li><strong>Festival Bonus:</strong> Diwali, New Year (Oct-Dec)</li>
            <li><strong>Year-End Bonus:</strong> March (end of FY)</li>
            <li><strong>Tax Year:</strong> Taxed in year received, not earned</li>
          </ul>

          <h3>Deferred Bonus (ESOP/RSU)</h3>
          <ul>
            <li><strong>Stock Options (ESOP):</strong> Taxed on exercise (FMV - Exercise Price)</li>
            <li><strong>RSU (Restricted Stock Units):</strong> Taxed on vesting (FMV at vesting)</li>
            <li><strong>Perquisite Tax:</strong> Added to salary in year of vesting</li>
            <li><strong>Capital Gains:</strong> On sale — STCG 15% / LTCG 10%</li>
          </ul>

          <h3>Tax-Saving on Bonus</h3>
          <ul>
            <li>✅ <strong>80C Investments:</strong> Invest bonus in PPF, ELSS, NPS (up to ₹1.5L)</li>
            <li>✅ <strong>NPS Additional:</strong> 80CCD(1B) — Extra ₹50K deduction</li>
            <li>✅ <strong>Home Loan:</strong> Principal ₹1.5L + Interest ₹2L deduction</li>
            <li>✅ <strong>Health Insurance:</strong> 80D — ₹25K-₹50K deduction</li>
            <li>❌ <strong>Can't Avoid:</strong> Bonus is salary income, fully taxable</li>
          </ul>

          <h3>Bonus vs Salary Increment</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Aspect</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Bonus</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Increment</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Frequency</td><td style={{ padding: '0.25rem' }}>One-time/Annual</td><td style={{ padding: '0.25rem' }}>Permanent (monthly)</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Guaranteed</td><td style={{ padding: '0.25rem' }}>No (performance)</td><td style={{ padding: '0.25rem' }}>Yes (part of CTC)</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Tax</td><td style={{ padding: '0.25rem' }}>30% in high bracket</td><td style={{ padding: '0.25rem' }}>Spread over year</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Benefits</td><td style={{ padding: '0.25rem' }}>No PF/Gratuity</td><td style={{ padding: '0.25rem' }}>Increases PF/Gratuity</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Common Questions</h3>

          <h4>Q: Is bonus fully taxable?</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Yes, 100% taxable as salary income. No exemptions available.
          </p>

          <h4>Q: Can I reduce tax on bonus?</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Invest in 80C (₹1.5L), NPS (₹50K), Home loan, Health insurance to reduce overall tax liability.
          </p>

          <h4>Q: Bonus paid in next FY — when to pay tax?</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Taxed in the year received, not earned. Example: FY 2023-24 bonus paid in Apr 2024 → taxed in FY 2024-25.
          </p>

          <h4>Q: Large bonus pushing me to 30% bracket?</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Yes, bonus increases your total income. If it crosses ₹10L threshold, marginal rate becomes 30%.
          </p>

          <h4>Q: Employer not deducting TDS on bonus?</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            You must pay advance tax by March 15. Else, interest charged under 234B/234C.
          </p>

          <h3>Pro Tips</h3>
          <ul>
            <li>Negotiate for stock options (RSU/ESOP) instead of cash bonus — tax deferral benefit</li>
            <li>Ask employer to spread large bonus across 2 months (March + April) for lower TDS</li>
            <li>Immediately invest in 80C instruments to reduce tax liability</li>
            <li>Check Form 26AS to ensure employer deducted correct TDS</li>
            <li>If bonus {'>'} ₹50K, consider voluntary advance tax payment</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}