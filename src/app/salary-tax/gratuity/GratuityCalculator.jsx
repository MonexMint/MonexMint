'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateGratuity } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

// ─────────────────────────────────────────────────────────────
// Adapter: calculateGratuity() returns { gratuity, taxFreeAmount,
// taxableGratuity, isTaxFree, yearsOfService, lastSalary }
// but the UI needs a richer shape — we build it here.
// ─────────────────────────────────────────────────────────────
function computeGratuity(salary, years, months, isCovered) {
  // Round service: 6+ months = 1 extra year (as per Gratuity Act)
  const effectiveYears = months >= 6 ? years + 1 : years;
  const divisor = isCovered ? 26 : 30;

  // Call the library function (signature: salary, years, isGovt, isCovered)
  const raw = calculateGratuity(salary, effectiveYears, false, isCovered);

  const gratuityAmount = raw.gratuity;
  const taxFreeLimit   = raw.taxFreeAmount;        // min(gratuity, 20L)
  const taxableAmount  = raw.taxableGratuity;
  const estimatedTax   = Math.round(taxableAmount * 0.3);
  const netAmount      = gratuityAmount - estimatedTax;
  const capped         = gratuityAmount > 2000000;

  return {
    lastBasicSalary: salary,
    serviceYears:    effectiveYears,
    divisor,
    isCovered,
    gratuityAmount:  Math.round(gratuityAmount),
    taxFreeLimit:    Math.round(taxFreeLimit),
    taxableAmount:   Math.round(taxableAmount),
    estimatedTax,
    netAmount:       Math.round(netAmount),
    capped,
  };
}

export default function GratuityCalculator() {

  const [formData, setFormData] = useState({
    lastBasicSalary: '50000',
    yearsOfService:  '10',
    monthsOfService: '6',
    isCovered:       true,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const compute = useCallback(() => {
    const salary  = parseFloat(formData.lastBasicSalary) || 0;
    const years   = parseFloat(formData.yearsOfService)  || 0;
    const months  = parseFloat(formData.monthsOfService) || 0;
    const covered = formData.isCovered;

    if (!salary || salary <= 0) {
      setResult(null);
      return;
    }

    const totalYears = years + months / 12;

    if (totalYears < 5) {
      setResult({
        error: 'Not eligible for gratuity. Minimum 5 years of service required.',
        yearsShort: (5 - totalYears).toFixed(1),
      });
      return;
    }

    setLoading(true);
    const data = computeGratuity(salary, years, months, covered);
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

        <Breadcrumb items={BREADCRUMBS.gratuity} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Gratuity Calculator</h1>
          <p className={styles.description}>
            Calculate gratuity amount based on last drawn salary and service years.
            Eligibility: 5+ years of continuous service.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── FORM ──────────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Gratuity Details">
              <div className={styles.form}>

                <Input
                  label="Last Drawn Basic Salary"
                  type="number"
                  name="lastBasicSalary"
                  value={formData.lastBasicSalary}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                  helpText="Monthly basic + DA at time of leaving"
                />

                <Input
                  label="Years of Service"
                  type="number"
                  name="yearsOfService"
                  value={formData.yearsOfService}
                  onChange={handleChange}
                  suffix="years"
                  min="0"
                  max="50"
                  helpText="Completed years (min 5 for eligibility)"
                />

                <Input
                  label="Additional Months"
                  type="number"
                  name="monthsOfService"
                  value={formData.monthsOfService}
                  onChange={handleChange}
                  suffix="months"
                  min="0"
                  max="11"
                  helpText="Extra months (6+ months = 1 year)"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="isCovered"
                      checked={formData.isCovered}
                      onChange={handleChange}
                      style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Covered under Payment of Gratuity Act
                    </span>
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
                    Applies to companies with 10+ employees
                  </p>
                </div>

                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>
            </Card>
          </div>

          {/* ── RESULTS ───────────────────────────────────── */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result && !result.error ? (
              <>
                {/* Hero */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Gratuity Amount</div>
                    <div className={styles.emiValue}>{formatCurrency(result.gratuityAmount)}</div>
                  </div>
                </Card>

                {/* Calculation breakdown */}
                <Card title="Calculation Breakdown">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Last Basic Salary</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.lastBasicSalary)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Service Years</div>
                      <div className={styles.summaryValue}>{result.serviceYears} yrs</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Divisor Used</div>
                      <div className={styles.summaryValue}>{result.divisor} days</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Gratuity Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.gratuityAmount)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Max Limit (₹20L)</div>
                      <div className={styles.summaryValue} style={{ fontSize: '1rem' }}>
                        {result.capped ? '✓ Capped at ₹20L' : '✗ Within limit'}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Formula Used</div>
                      <div className={styles.summaryValue} style={{ fontSize: '1rem' }}>
                        15/{result.divisor} days
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Tax calculation */}
                <Card title="Tax Calculation" variant={result.taxableAmount > 0 ? 'warning' : 'success'}>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Gratuity Received</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.gratuityAmount)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tax-Free Limit</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.taxFreeLimit)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Taxable Amount</div>
                      <div className={styles.summaryValue} style={{ color: result.taxableAmount > 0 ? '#dc2626' : '#10b981' }}>
                        {formatCurrency(result.taxableAmount)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tax @ 30%</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.estimatedTax)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Net in Hand</div>
                      <div className={styles.summaryValue} style={{ color: '#059669', fontSize: '1.5rem' }}>
                        {formatCurrency(result.netAmount)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Status</div>
                      <div className={styles.summaryValue} style={{ fontSize: '0.95rem' }}>
                        {result.taxableAmount === 0 ? '✅ Fully Tax-Free' : '⚠️ Partially Taxable'}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Formula card */}
                <Card>
                  <h3 style={{ margin: '0 0 1rem 0' }}>💰 Gratuity Formula</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.8', color: '#64748b' }}>
                    <p>
                      <strong>Formula:</strong> (Last Salary × Years of Service × 15) ÷ {result.divisor}
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                      <strong>Your Calculation:</strong><br />
                      (₹{formatCurrency(result.lastBasicSalary)} × {result.serviceYears} × 15) ÷ {result.divisor}
                      {' '}= <strong>₹{formatCurrency(result.gratuityAmount)}</strong>
                    </p>
                    {result.capped && (
                      <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '0.5rem', color: '#92400e' }}>
                        ⚠️ Your calculated gratuity exceeds ₹20L limit. Amount capped at ₹20,00,000.
                      </p>
                    )}
                  </div>
                </Card>

                <InvestmentBarChart
                  invested={result.gratuityAmount}
                  returns={result.estimatedTax}
                  labels={{ invested: 'Gratuity', returns: 'Tax' }}
                />
              </>

            ) : result && result.error ? (
              <Card variant="danger">
                <h3 style={{ margin: '0 0 1rem 0', color: '#b91c1c' }}>❌ Not Eligible</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.7', color: '#991b1b' }}>
                  {result.error}
                </p>
                <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#991b1b' }}>
                  You need <strong>{result.yearsShort} more years</strong> of service to become eligible.
                </p>
              </Card>

            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🎁</div>
                  <p className={styles.placeholderText}>Enter your details to calculate gratuity</p>
                </div>
              </Card>
            )}

          </div>
        </div>

        {/* ── INFO SECTION ────────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>Understanding Gratuity</h2>
          <p>
            Gratuity is a lump sum payment made by an employer to an employee as a token of appreciation
            for services rendered. It is governed by the Payment of Gratuity Act, 1972.
          </p>

          <h3>Eligibility Criteria</h3>
          <ul>
            <li><strong>Minimum Service:</strong> 5 years of continuous service (exception: death/disability)</li>
            <li><strong>Applicable to:</strong> Companies with 10 or more employees</li>
            <li><strong>Payment Time:</strong> Within 30 days of becoming eligible</li>
            <li><strong>Maximum Amount:</strong> ₹20,00,000 (tax-free)</li>
          </ul>

          <h3>Gratuity Calculation Formula</h3>
          <p><strong>Covered under Act (26-day divisor):</strong></p>
          <p className={styles.formulaBox}>
            Gratuity = (Last Salary × Years × 15) ÷ 26
          </p>
          <p><strong>Not covered (30-day divisor):</strong></p>
          <p className={styles.formulaBox}>
            Gratuity = (Last Salary × Years × 15) ÷ 30
          </p>

          <h3>When is Gratuity Paid?</h3>
          <ul>
            <li><strong>Resignation:</strong> After completing 5 years</li>
            <li><strong>Retirement:</strong> On reaching retirement age</li>
            <li><strong>Death:</strong> Paid to nominee/legal heir (no 5-year requirement)</li>
            <li><strong>Disability:</strong> Due to accident/disease (no 5-year requirement)</li>
          </ul>

          <h3>Tax Rules</h3>
          <ul>
            <li><strong>Government employees:</strong> Fully tax-free (no limit)</li>
            <li><strong>Private sector (covered):</strong> Tax-free up to ₹20 lakh</li>
            <li><strong>Amount above ₹20L:</strong> Taxable as salary income</li>
            <li><strong>Both regimes:</strong> ₹20L exemption under Section 10(10)</li>
          </ul>

          <h3>Example Calculations</h3>

          <h4>Example 1: Within Limit</h4>
          <div className={styles.exampleBox}>
            <ul>
              <li>Last Basic: ₹50,000 | Service: 10 years</li>
              <li>(₹50,000 × 10 × 15) ÷ 26 = <strong>₹2,88,461</strong> — fully tax-free</li>
            </ul>
          </div>

          <h4>Example 2: Above ₹20L</h4>
          <div className={styles.exampleBox}>
            <ul>
              <li>Gratuity calculated: ₹25,00,000</li>
              <li>Tax-free: ₹20,00,000 | Taxable: ₹5,00,000</li>
              <li>Tax @ 30%: ₹1,50,000 | <strong>Net in hand: ₹23,50,000</strong></li>
            </ul>
          </div>

          <h3>Important Points</h3>
          <ul>
            <li><strong>6+ extra months</strong> counts as a full additional year</li>
            <li><strong>Forfeiture:</strong> Allowed only for misconduct causing loss to employer</li>
            <li><strong>Nomination:</strong> Mandatory — file Form F with employer</li>
            <li><strong>Delayed payment:</strong> Employer must pay interest if delayed beyond 30 days</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}