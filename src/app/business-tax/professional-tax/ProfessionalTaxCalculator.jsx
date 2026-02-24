'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateProfessionalTax } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

const STATES = [
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'westbengal', label: 'West Bengal' },
  { value: 'andhra', label: 'Andhra Pradesh' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'assam', label: 'Assam' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'meghalaya', label: 'Meghalaya' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'tripura', label: 'Tripura' },
];

export default function ProfessionalTaxCalculator() {

  const [formData, setFormData] = useState({
    monthlyGrossSalary: '50000',
    state:              'maharashtra',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const salary = parseFloat(formData.monthlyGrossSalary);

    if (!salary || salary <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateProfessionalTax(salary, formData.state);
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

        <Breadcrumb items={BREADCRUMBS.professionalTax} />

        <div className={styles.header}>
          <h1 className={styles.title}>Professional Tax Calculator</h1>
          <p className={styles.description}>
            Calculate professional tax (PT) based on monthly salary and state. 
            Maximum ₹2,500/year deducted by employer.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Professional Tax Details">
              <div className={styles.form}>

                <Input
                  label="Monthly Gross Salary"
                  type="number"
                  name="monthlyGrossSalary"
                  value={formData.monthlyGrossSalary}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                  helpText="Gross monthly salary (before deductions)"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                  >
                    {STATES.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    PT rates vary by state
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
                    <div className={styles.emiLabel}>Annual Professional Tax</div>
                    <div className={styles.emiValue}>{formatCurrency(result.annualProfessionalTax)}</div>
                  </div>
                </Card>

                <Card title="Professional Tax Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly Gross Salary</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.monthlyGrossSalary)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly PT</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                        {formatCurrency(result.monthlyProfessionalTax)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Annual PT</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                        {formatCurrency(result.annualProfessionalTax)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>State</div>
                      <div className={styles.summaryValue}>{result.state}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Max PT/Year</div>
                      <div className={styles.summaryValue}>₹2,500</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Deducted By</div>
                      <div className={styles.summaryValue}>Employer</div>
                    </div>

                  </div>
                </Card>

                <Card variant="info">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#0284c7' }}>💡 Professional Tax Info</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#075985' }}>
                    <p>
                      <strong>Monthly Salary:</strong> ₹{formatCurrency(result.monthlyGrossSalary)}
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Monthly PT Deduction:</strong> ₹{formatCurrency(result.monthlyProfessionalTax)}
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Annual PT:</strong> ₹{formatCurrency(result.annualProfessionalTax)}
                    </p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#e0f2fe', borderRadius: '0.5rem' }}>
                      📝 <strong>Note:</strong> Professional tax is deducted by your employer from your monthly salary. 
                      Maximum PT is capped at ₹2,500 per year across all states.
                    </p>
                  </div>
                </Card>

                {result.note && (
                  <Card>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {result.note}
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>📝</div>
                  <p>Enter salary to calculate professional tax</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>Understanding Professional Tax</h2>
          <p>
            Professional Tax (PT) is a state-level tax imposed on salaried employees and professionals. 
            It's deducted monthly by employers from salary and varies by state.
          </p>

          <h3>Key Facts</h3>
          <ul>
            <li><strong>Levied by:</strong> State Government (not all states have PT)</li>
            <li><strong>Deducted by:</strong> Employer (from monthly salary)</li>
            <li><strong>Maximum:</strong> ₹2,500 per year (across all states)</li>
            <li><strong>Payment:</strong> Employer deposits with state government monthly</li>
            <li><strong>Tax Benefit:</strong> Deductible from income (reduces taxable income)</li>
          </ul>

          <h3>States with Professional Tax</h3>
          <ul>
            <li>Maharashtra, Karnataka, West Bengal</li>
            <li>Andhra Pradesh, Telangana</li>
            <li>Gujarat, Assam, Chhattisgarh</li>
            <li>Meghalaya, Odisha, Tripura</li>
            <li>Sikkim (₹100 flat/year)</li>
          </ul>

          <h3>States WITHOUT Professional Tax</h3>
          <ul>
            <li>Delhi, Uttar Pradesh, Rajasthan</li>
            <li>Haryana, Punjab, Himachal Pradesh</li>
            <li>Madhya Pradesh, Jharkhand, Bihar</li>
            <li>Tamil Nadu (abolished in 2011)</li>
          </ul>

          <h3>Professional Tax Slabs by State</h3>

          <h4>Maharashtra</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Monthly Salary</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>PT/Month</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Up to ₹7,500</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>Nil</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹7,501 - ₹10,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹175</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Above ₹10,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹200 (₹300 in Feb)</td></tr>
              </tbody>
            </table>
          </div>

          <h4>Karnataka</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Up to ₹15,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>Nil</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹15,001 - ₹25,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹150</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹25,001 - ₹35,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹200</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Above ₹35,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹200</td></tr>
              </tbody>
            </table>
          </div>

          <h4>West Bengal</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Up to ₹8,500</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>Nil</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹8,501 - ₹10,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹90</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹10,001 - ₹15,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹110</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹15,001 - ₹25,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹130</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹25,001 - ₹40,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹150</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Above ₹40,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹200</td></tr>
              </tbody>
            </table>
          </div>

          <h4>Gujarat</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Up to ₹5,999</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>Nil</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹6,000 - ₹8,999</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹80</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹9,000 - ₹11,999</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹150</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Above ₹12,000</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹200</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Professional Tax Exemptions</h3>
          <ul>
            <li><strong>Persons with Disabilities:</strong> Fully exempt</li>
            <li><strong>Parents/Guardians of Disabled:</strong> Exempt in some states</li>
            <li><strong>Senior Citizens (60+):</strong> Exempt in some states</li>
            <li><strong>Women (in select categories):</strong> Lower rates in some states</li>
            <li><strong>Income Below Threshold:</strong> No PT if salary below minimum slab</li>
          </ul>

          <h3>How PT Works</h3>
          <ul>
            <li>Employer deducts PT from monthly salary</li>
            <li>Employer deposits with state government by 30th of next month</li>
            <li>Employee gets PT deduction in Form 16</li>
            <li>PT is deductible from taxable income (reduces income tax)</li>
          </ul>

          <h3>PT Certificate</h3>
          <ul>
            <li>Employer issues PT registration certificate</li>
            <li>Shows PT deducted and deposited</li>
            <li>Reflected in Form 16 under "Other deductions"</li>
            <li>Can be claimed as deduction in ITR</li>
          </ul>

          <h3>Self-Employed / Business</h3>
          <ul>
            <li><strong>Professionals:</strong> Doctors, CAs, lawyers pay PT</li>
            <li><strong>Rate:</strong> Flat ₹2,500/year (varies by state)</li>
            <li><strong>Payment:</strong> Self-paid (not employer-deducted)</li>
            <li><strong>Registration:</strong> Must register with state PT department</li>
          </ul>

          <h3>Multiple Employers</h3>
          <ul>
            <li>If you have 2 jobs in same state → PT deducted twice</li>
            <li>Maximum PT per year: ₹2,500 (across all employers)</li>
            <li>Claim refund if PT {'>'}₹2,500 paid</li>
            <li>File for PT refund with state government</li>
          </ul>

          <h3>Tax Benefit of PT</h3>
          <ul>
            <li>PT paid is fully deductible from taxable income</li>
            <li>Example: ₹2,400 PT → Saves ₹720 income tax (30% bracket)</li>
            <li>Reflected automatically in Form 16</li>
            <li>No separate claim needed in ITR</li>
          </ul>

          <h3>Common Questions</h3>

          <h4>Q: Is PT applicable on bonuses?</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Yes, if monthly gross (salary + bonus) exceeds the slab limit.
          </p>

          <h4>Q: What if I change jobs mid-month?</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Both employers may deduct PT. Claim refund if total {'>'}₹2,500/year.
          </p>

          <h4>Q: Can I pay PT myself instead of employer?</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            No, for salaried employees, employer must deduct and pay PT.
          </p>

          <h4>Q: Is PT applicable in all cities of a state?</h4>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Yes, PT is state-level, applies throughout the state.
          </p>

          <h3>Pro Tips</h3>
          <ul>
            <li>Check Form 16 to verify PT deducted by employer</li>
            <li>If PT {'>'}₹2,500/year paid (multiple employers), claim refund</li>
            <li>PT is automatically deductible — no extra claim needed in ITR</li>
            <li>Self-employed? Register and pay PT to avoid penalty</li>
            <li>Moving states? PT follows work location, not residence</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}