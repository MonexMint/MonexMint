'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateSalary } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

export default function SalaryCalculator() {

  const [formData, setFormData] = useState({
    ctc:              '1200000',
    bonusPercent:     '10',
    pfOptOut:         false,
    taxRegime:        'old',
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
    const ctc          = parseFloat(formData.ctc);
    const bonusPercent = parseFloat(formData.bonusPercent);
    const pfOptOut     = formData.pfOptOut;
    const taxRegime    = formData.taxRegime;

    if (!ctc || ctc <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateSalary(ctc, bonusPercent, pfOptOut, taxRegime);
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

        <Breadcrumb items={BREADCRUMBS.salary} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Salary Calculator</h1>
          <p className={styles.description}>
            Calculate in-hand salary from CTC. Includes EPF, gratuity, HRA, bonus, and tax deductions 
            for both old and new tax regimes.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Salary Details">
              <div className={styles.form}>

                <Input
                  label="Annual CTC"
                  type="number"
                  name="ctc"
                  value={formData.ctc}
                  onChange={handleChange}
                  prefix="₹"
                  min="100000"
                  step="10000"
                  helpText="Cost to Company (annual package)"
                />

                <Input
                  label="Bonus / Variable Pay"
                  type="number"
                  name="bonusPercent"
                  value={formData.bonusPercent}
                  onChange={handleChange}
                  suffix="% of CTC"
                  min="0"
                  max="50"
                  step="1"
                  helpText="Performance bonus (0-50%)"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="pfOptOut"
                      checked={formData.pfOptOut}
                      onChange={handleChange}
                      style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Opt Out of EPF (Basic  &gt ₹15K)
                    </span>
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
                    Optional if basic salary exceeds ₹15,000
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    Tax Regime
                  </label>
                  <select
                    name="taxRegime"
                    value={formData.taxRegime}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                  >
                    <option value="old">Old Regime (with deductions)</option>
                    <option value="new">New Regime (lower rates, no deductions)</option>
                  </select>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {formData.taxRegime === 'old' ? 'Allows 80C, HRA, etc.' : 'No deductions, lower tax rates'}
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
                    <div className={styles.emiLabel}>Monthly In-Hand Salary</div>
                    <div className={styles.emiValue}>{formatCurrency(result.monthlyInHand)}</div>
                  </div>
                </Card>

                <Card title="CTC Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Annual CTC</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.ctc)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly CTC</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.monthlyCTC)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Basic Salary</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.basicSalary)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>HRA</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.hra)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Special Allowance</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.specialAllowance)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Bonus / Variable</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.bonus)}</div>
                    </div>

                  </div>
                </Card>

                <Card title="Deductions">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>EPF (Employee)</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.epfEmployee)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>EPF (Employer)</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.epfEmployer)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Professional Tax</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.professionalTax)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Income Tax (TDS)</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.incomeTax)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Deductions</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.25rem' }}>
                        {formatCurrency(result.totalDeductions)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Gratuity (annual)</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.gratuity)}
                      </div>
                    </div>

                  </div>
                </Card>

                <Card title="Take-Home Summary" variant="success">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Annual In-Hand</div>
                      <div className={styles.summaryValue} style={{ color: '#059669', fontSize: '1.5rem' }}>
                        {formatCurrency(result.annualInHand)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly In-Hand</div>
                      <div className={styles.summaryValue} style={{ color: '#059669', fontSize: '1.5rem' }}>
                        {formatCurrency(result.monthlyInHand)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Take-Home %</div>
                      <div className={styles.summaryValue}>{result.takeHomePercent}%</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tax Regime</div>
                      <div className={styles.summaryValue}>
                        {result.taxRegime === 'old' ? 'Old' : 'New'}
                      </div>
                    </div>

                  </div>

                  <InvestmentBarChart 
                    invested={result.ctc} 
                    returns={result.totalDeductions}
                    labels={{ invested: 'CTC', returns: 'Deductions' }}
                  />
                </Card>

                <Card>
                  <h3 style={{ margin: '0 0 1rem 0' }}>💡 Understanding Your Salary</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#64748b' }}>
                    <p><strong>CTC (Cost to Company):</strong> Total package including salary, benefits, EPF, gratuity</p>
                    <p><strong>Gross Salary:</strong> CTC minus employer contributions (EPF, gratuity)</p>
                    <p><strong>In-Hand Salary:</strong> Gross salary minus all deductions (EPF employee, tax, PT)</p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                      Your in-hand is <strong>{result.takeHomePercent}%</strong> of CTC. Typical range is 65-80% depending on salary level and tax regime.
                    </p>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>💰</div>
                  <p>Enter your CTC to calculate in-hand salary</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>Understanding CTC Components</h2>
          
          <h3>What is CTC?</h3>
          <p>
            CTC (Cost to Company) is the total amount your employer spends on you annually, 
            including salary, benefits, and statutory contributions. Your in-hand salary is typically 65-80% of CTC.
          </p>

          <h3>CTC Components</h3>
          <ul>
            <li><strong>Basic Salary:</strong> 40-50% of CTC (foundation for all calculations)</li>
            <li><strong>HRA (House Rent Allowance):</strong> 40-50% of Basic (partially tax-exempt)</li>
            <li><strong>Special Allowance:</strong> Remaining amount to reach Gross (fully taxable)</li>
            <li><strong>Bonus / Variable Pay:</strong> Performance-based (5-30% of CTC)</li>
            <li><strong>EPF (Employer):</strong> 12% of Basic (not in your account, but counted in CTC)</li>
            <li><strong>Gratuity:</strong> 4.81% of Basic (paid on leaving after 5 years)</li>
          </ul>

          <h3>Deductions from Gross Salary</h3>
          <ul>
            <li><strong>EPF (Employee):</strong> 12% of Basic (locked till retirement/job change)</li>
            <li><strong>Professional Tax:</strong> ₹200/month (₹2,400/year) in most states</li>
            <li><strong>Income Tax (TDS):</strong> Based on tax regime and total income</li>
          </ul>

          <h3>EPF Calculation</h3>
          <ul>
            <li><strong>Employee Contribution:</strong> 12% of Basic (deducted from salary)</li>
            <li><strong>Employer Contribution:</strong> 12% of Basic split as:
              <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                <li>3.67% → EPF Account (retirement corpus)</li>
                <li>8.33% → EPS (Employee Pension Scheme)</li>
              </ul>
            </li>
            <li><strong>Opt-Out:</strong> Allowed if Basic  &gt ₹15,000 (uncommon, loses retirement benefit)</li>
          </ul>

          <h3>HRA Tax Exemption</h3>
          <ul>
            <li>Least of: (a) Actual HRA received, (b) 50% of Basic (metros) / 40% (non-metros), (c) Rent paid - 10% of Basic</li>
            <li>Only if you're paying rent (owner-occupied = no exemption)</li>
            <li>Rent receipts needed if rent  &gt ₹1L/year</li>
          </ul>

          <h3>Gratuity</h3>
          <ul>
            <li>Paid on leaving the company after 5 years of service</li>
            <li>Formula: (Basic × Years of Service × 15) ÷ 26</li>
            <li>Max: ₹20 lakh (tax-free)</li>
            <li>Included in CTC but received only on exit</li>
          </ul>

          <h3>Old vs New Tax Regime</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Feature</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>Old Regime</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>New Regime</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Deductions (80C, HRA)</td><td style={{ padding: '0.25rem', textAlign: 'center' }}>✓ Allowed</td><td style={{ padding: '0.25rem', textAlign: 'center' }}>✗ Not Allowed</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Tax Rates</td><td style={{ padding: '0.25rem', textAlign: 'center' }}>Higher</td><td style={{ padding: '0.25rem', textAlign: 'center' }}>Lower</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Standard Deduction</td><td style={{ padding: '0.25rem', textAlign: 'center' }}>₹50,000</td><td style={{ padding: '0.25rem', textAlign: 'center' }}>₹50,000</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Best For</td><td style={{ padding: '0.25rem', textAlign: 'center' }}>Tax planning</td><td style={{ padding: '0.25rem', textAlign: 'center' }}>Simple filing</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Sample CTC Breakdown</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>CTC: ₹12,00,000/year</strong></p>
            <table style={{ width: '100%', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Basic Salary (40%)</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹4,80,000</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>HRA (50% of Basic)</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹2,40,000</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Special Allowance</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹3,36,400</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Bonus (10%)</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹1,20,000</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>EPF Employer (3.67%)</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹17,616</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Gratuity (4.81%)</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹23,088</td></tr>
                <tr style={{ borderTop: '2px solid #e2e8f0' }}><td style={{ padding: '0.25rem' }}><strong>Total CTC</strong></td><td style={{ padding: '0.25rem', textAlign: 'right', fontWeight: 700 }}>₹12,00,000</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: '0.5rem' }}>Deductions: EPF ₹57,600 + Tax ~₹1,20,000 + PT ₹2,400 = ~₹1,80,000</p>
            <p><strong>In-Hand: ~₹8,40,000/year (₹70,000/month) = 70% of CTC</strong></p>
          </div>

          <h3>Why In-Hand &gt CTC?</h3>
          <ul>
            <li><strong>EPF Employer + Gratuity:</strong> 8-10% (not liquid, retirement/exit benefit)</li>
            <li><strong>EPF Employee:</strong> 12% of Basic (~5% of CTC)</li>
            <li><strong>Income Tax:</strong> 10-30% depending on salary</li>
            <li><strong>Professional Tax:</strong> ~₹2,400/year</li>
            <li><strong>Total Difference:</strong> 20-35% of CTC</li>
          </ul>

          <h3>Tips to Maximize In-Hand</h3>
          <ul>
            <li>Choose new tax regime if no investments (saves 5-10%)</li>
            <li>Claim HRA exemption (if paying rent)</li>
            <li>Maximize 80C deductions (EPF, PPF, ELSS, insurance)</li>
            <li>Submit investment declarations on time</li>
            <li>Keep rent receipts (if HRA claimed)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}