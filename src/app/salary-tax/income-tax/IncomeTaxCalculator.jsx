'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateIncomeTax } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

// ─────────────────────────────────────────────────────────────
// Local helper: wraps calculateIncomeTax to return the
// { old, new, betterRegime, savings } shape the UI expects
// ─────────────────────────────────────────────────────────────
function computeTax(income, deductions80C, deductionsOther, hra, rentPaid) {
  const basicSalaryEstimate = income * 0.4; // ~40% of income

  // HRA exemption: min(HRA received, 50% basic, rent - 10% basic)
  const hraExemption =
    rentPaid > 0
      ? Math.min(
          hra,
          rentPaid - basicSalaryEstimate * 0.1,
          basicSalaryEstimate * 0.5
        )
      : 0;

  const oldDeductions = {
    section80C:       Math.min(deductions80C, 150000),
    section80D:       Math.min(deductionsOther, 25000),
    hraExemption:     Math.max(0, hraExemption),
    standardDeduction: 50000,
  };

  const newDeductions = {
    standardDeduction: 50000,
  };

  const oldResult = calculateIncomeTax(income, 'old', oldDeductions);
  const newResult = calculateIncomeTax(income, 'new', newDeductions);

  const totalOldDeductions =
    oldDeductions.section80C +
    oldDeductions.section80D +
    oldDeductions.hraExemption +
    oldDeductions.standardDeduction;

  const savings = Math.abs(oldResult.totalTax - newResult.totalTax);
  const betterRegime = oldResult.totalTax <= newResult.totalTax ? 'old' : 'new';

  return {
    old: {
      grossIncome:      income,
      totalDeductions:  totalOldDeductions,
      taxableIncome:    oldResult.taxableIncome,
      taxBeforeCess:    oldResult.incomeTax,
      cess:             oldResult.cess,
      totalTax:         oldResult.totalTax,
      netIncome:        oldResult.netIncome,
      effectiveRate:    oldResult.effectiveTaxRate,
      monthlyIncome:    Math.round(oldResult.netIncome / 12),
      standardDeduction: 50000,
      deductions80C:    oldDeductions.section80C,
      hraExemption:     oldDeductions.hraExemption,
      otherDeductions:  oldDeductions.section80D,
    },
    new: {
      grossIncome:       income,
      standardDeduction: 50000,
      taxableIncome:     newResult.taxableIncome,
      taxBeforeCess:     newResult.incomeTax,
      cess:              newResult.cess,
      totalTax:          newResult.totalTax,
      netIncome:         newResult.netIncome,
      effectiveRate:     newResult.effectiveTaxRate,
      monthlyIncome:     Math.round(newResult.netIncome / 12),
    },
    betterRegime,
    savings,
  };
}

export default function IncomeTaxCalculator() {

  const [formData, setFormData] = useState({
    grossIncome:      '1200000',
    deductions80C:    '150000',
    deductionsOther:  '50000',
    hra:              '240000',
    rentPaid:         '180000',
    compareRegimes:   true,
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
    const income          = parseFloat(formData.grossIncome)     || 0;
    const deductions80C   = parseFloat(formData.deductions80C)   || 0;
    const deductionsOther = parseFloat(formData.deductionsOther) || 0;
    const hra             = parseFloat(formData.hra)             || 0;
    const rentPaid        = parseFloat(formData.rentPaid)        || 0;

    if (!income || income <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = computeTax(income, deductions80C, deductionsOther, hra, rentPaid);
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

        <Breadcrumb items={BREADCRUMBS.incomeTax} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Income Tax Calculator FY 2024-25</h1>
          <p className={styles.description}>
            Calculate income tax with old vs new regime comparison. See which regime saves you more
            based on your income and deductions.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── FORM ────────────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Income & Deductions">
              <div className={styles.form}>

                <Input
                  label="Gross Annual Income"
                  type="number"
                  name="grossIncome"
                  value={formData.grossIncome}
                  onChange={handleChange}
                  prefix="₹"
                  min="100000"
                  step="10000"
                  helpText="Salary + other income (before deductions)"
                />

                <Input
                  label="80C Deductions"
                  type="number"
                  name="deductions80C"
                  value={formData.deductions80C}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  max="150000"
                  step="10000"
                  helpText="EPF, PPF, ELSS, Insurance (max ₹1.5L)"
                />

                <Input
                  label="Other Deductions (80D, 80E etc.)"
                  type="number"
                  name="deductionsOther"
                  value={formData.deductionsOther}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="10000"
                  helpText="80D health insurance, 80E education loan, etc."
                />

                <Input
                  label="HRA Received (annual)"
                  type="number"
                  name="hra"
                  value={formData.hra}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="10000"
                  helpText="House Rent Allowance received per year"
                />

                <Input
                  label="Rent Paid (annual)"
                  type="number"
                  name="rentPaid"
                  value={formData.rentPaid}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="10000"
                  helpText="Annual rent paid (for HRA exemption calculation)"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="compareRegimes"
                      checked={formData.compareRegimes}
                      onChange={handleChange}
                      style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Compare Old vs New Regime
                    </span>
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
                    See which regime is better for you
                  </p>
                </div>

                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>
            </Card>
          </div>

          {/* ── RESULTS ─────────────────────────────────────── */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {formData.compareRegimes ? (
                  /* ── COMPARISON MODE ── */
                  <>
                    <Card variant="gradient" className={styles.emiCard}>
                      <div className={styles.emiResult}>
                        <div className={styles.emiLabel}>
                          {result.betterRegime === 'old' ? '✅ Old Regime Better' : '✅ New Regime Better'}
                        </div>
                        <div className={styles.emiValue} style={{ fontSize: '2rem' }}>
                          Save {formatCurrency(result.savings)}
                        </div>
                      </div>
                    </Card>

                    {/* Old Regime Card */}
                    <Card title="Old Regime (with Deductions)">
                      <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Gross Income</div>
                          <div className={styles.summaryValue}>{formatCurrency(result.old.grossIncome)}</div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Total Deductions</div>
                          <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                            {formatCurrency(result.old.totalDeductions)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Taxable Income</div>
                          <div className={styles.summaryValue}>{formatCurrency(result.old.taxableIncome)}</div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Total Tax</div>
                          <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                            {formatCurrency(result.old.totalTax)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Net Income</div>
                          <div className={styles.summaryValue} style={{ color: '#059669' }}>
                            {formatCurrency(result.old.netIncome)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Effective Tax Rate</div>
                          <div className={styles.summaryValue}>{result.old.effectiveRate}%</div>
                        </div>
                      </div>
                    </Card>

                    {/* New Regime Card */}
                    <Card title="New Regime (Lower Rates, No Deductions)">
                      <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Gross Income</div>
                          <div className={styles.summaryValue}>{formatCurrency(result.new.grossIncome)}</div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Standard Deduction</div>
                          <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                            {formatCurrency(result.new.standardDeduction)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Taxable Income</div>
                          <div className={styles.summaryValue}>{formatCurrency(result.new.taxableIncome)}</div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Total Tax</div>
                          <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                            {formatCurrency(result.new.totalTax)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Net Income</div>
                          <div className={styles.summaryValue} style={{ color: '#059669' }}>
                            {formatCurrency(result.new.netIncome)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Effective Tax Rate</div>
                          <div className={styles.summaryValue}>{result.new.effectiveRate}%</div>
                        </div>
                      </div>
                    </Card>

                    {/* Recommendation */}
                    <Card variant={result.betterRegime === 'old' ? 'success' : 'warning'}>
                      <h3 style={{ margin: '0 0 1rem 0', color: result.betterRegime === 'old' ? '#059669' : '#92400e' }}>
                        {result.betterRegime === 'old' ? '✅ Old Regime Recommended' : '✅ New Regime Recommended'}
                      </h3>
                      <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: result.betterRegime === 'old' ? '#047857' : '#92400e' }}>
                        <p>
                          <strong>{result.betterRegime === 'old' ? 'Old Regime' : 'New Regime'}</strong> saves you{' '}
                          <strong>{formatCurrency(result.savings)}</strong> compared to the{' '}
                          {result.betterRegime === 'old' ? 'New' : 'Old'} Regime.
                        </p>
                        <p style={{ marginTop: '1rem' }}>
                          {result.betterRegime === 'old'
                            ? 'Your deductions (80C, HRA, etc.) make Old Regime more beneficial.'
                            : 'Lower tax rates in New Regime outweigh your deductions.'}
                        </p>
                        <p style={{
                          marginTop: '1rem', padding: '0.75rem',
                          background: result.betterRegime === 'old' ? '#f0fdf4' : '#fef3c7',
                          borderRadius: '0.5rem'
                        }}>
                          💡 Net monthly take-home:{' '}
                          <strong>
                            {formatCurrency(
                              result.betterRegime === 'old'
                                ? result.old.monthlyIncome
                                : result.new.monthlyIncome
                            )}
                          </strong>
                        </p>
                      </div>
                    </Card>

                    <InvestmentBarChart
                      invested={result.old.totalTax}
                      returns={result.new.totalTax}
                      labels={{ invested: 'Old Regime Tax', returns: 'New Regime Tax' }}
                    />
                  </>
                ) : (
                  /* ── SINGLE REGIME (OLD) ── */
                  <>
                    <Card variant="gradient" className={styles.emiCard}>
                      <div className={styles.emiResult}>
                        <div className={styles.emiLabel}>Total Tax (Old Regime)</div>
                        <div className={styles.emiValue}>{formatCurrency(result.old.totalTax)}</div>
                      </div>
                    </Card>

                    <Card title="Tax Calculation Breakdown">
                      <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Gross Income</div>
                          <div className={styles.summaryValue}>{formatCurrency(result.old.grossIncome)}</div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Standard Deduction</div>
                          <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                            {formatCurrency(result.old.standardDeduction)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>80C Deductions</div>
                          <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                            {formatCurrency(result.old.deductions80C)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>HRA Exemption</div>
                          <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                            {formatCurrency(result.old.hraExemption)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Other Deductions</div>
                          <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                            {formatCurrency(result.old.otherDeductions)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Total Deductions</div>
                          <div className={styles.summaryValue} style={{ color: '#10b981', fontSize: '1.25rem' }}>
                            {formatCurrency(result.old.totalDeductions)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Taxable Income</div>
                          <div className={styles.summaryValue} style={{ fontSize: '1.25rem' }}>
                            {formatCurrency(result.old.taxableIncome)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Tax Before Cess</div>
                          <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                            {formatCurrency(result.old.taxBeforeCess)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Cess (4%)</div>
                          <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                            {formatCurrency(result.old.cess)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Total Tax</div>
                          <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                            {formatCurrency(result.old.totalTax)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Net Income</div>
                          <div className={styles.summaryValue} style={{ color: '#059669', fontSize: '1.5rem' }}>
                            {formatCurrency(result.old.netIncome)}
                          </div>
                        </div>
                        <div className={styles.summaryItem}>
                          <div className={styles.summaryLabel}>Effective Rate</div>
                          <div className={styles.summaryValue}>{result.old.effectiveRate}%</div>
                        </div>
                      </div>

                      <InvestmentBarChart
                        invested={result.old.grossIncome}
                        returns={result.old.totalTax}
                        labels={{ invested: 'Gross Income', returns: 'Tax' }}
                      />
                    </Card>

                    <Card>
                      <h3 style={{ margin: '0 0 1rem 0' }}>💰 Monthly Breakdown</h3>
                      <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#64748b' }}>
                        <p><strong>Gross Monthly:</strong> {formatCurrency(result.old.grossIncome / 12)}</p>
                        <p><strong>Monthly Tax:</strong> {formatCurrency(result.old.totalTax / 12)}</p>
                        <p><strong>Net Monthly:</strong> {formatCurrency(result.old.monthlyIncome)}</p>
                        <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                          💡 You pay <strong>{result.old.effectiveRate}%</strong> effective tax on your gross income.
                        </p>
                      </div>
                    </Card>
                  </>
                )}
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🧾</div>
                  <p>Enter your income to calculate tax</p>
                </div>
              </Card>
            )}

          </div>
        </div>

        {/* ── INFO SECTION ────────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>Income Tax Slabs FY 2024-25</h2>

          <h3>Old Tax Regime (with Deductions)</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Income Range</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Up to ₹2.5 lakh</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>Nil</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹2.5L - ₹5L</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>5%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹5L - ₹10L</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>20%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Above ₹10L</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>30%</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>+ 4% Health & Education Cess on total tax</p>
          </div>

          <h3>New Tax Regime (Lower Rates, No Deductions)</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Income Range</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Up to ₹3 lakh</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>Nil</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹3L - ₹7L</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>5%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹7L - ₹10L</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>10%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹10L - ₹12L</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>15%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>₹12L - ₹15L</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>20%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Above ₹15L</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>30%</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>+ 4% Health & Education Cess | No tax up to ₹7L (Rebate 87A)</p>
          </div>

          <h3>Available Deductions (Old Regime Only)</h3>
          <ul>
            <li><strong>Standard Deduction:</strong> ₹50,000 (for salaried)</li>
            <li><strong>80C:</strong> ₹1.5 lakh (EPF, PPF, ELSS, Insurance, Tuition fees)</li>
            <li><strong>80D:</strong> ₹25K health insurance (₹50K for senior citizens)</li>
            <li><strong>80E:</strong> Full interest on education loan</li>
            <li><strong>80G:</strong> 50-100% of donations</li>
            <li><strong>HRA:</strong> Exemption on house rent (if rent paid)</li>
          </ul>

          <h3>Old vs New: Which to Choose?</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Scenario</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>Better Regime</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>High deductions ({'>'}₹2L)</td><td style={{ padding: '0.25rem', textAlign: 'center', color: '#059669', fontWeight: 600 }}>Old</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Paying house rent (HRA)</td><td style={{ padding: '0.25rem', textAlign: 'center', color: '#059669', fontWeight: 600 }}>Old</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Low deductions (&lt;₹1L)</td><td style={{ padding: '0.25rem', textAlign: 'center', color: '#ea580c', fontWeight: 600 }}>New</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Income ₹7-12L, no investments</td><td style={{ padding: '0.25rem', textAlign: 'center', color: '#ea580c', fontWeight: 600 }}>New</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Want simple filing</td><td style={{ padding: '0.25rem', textAlign: 'center', color: '#ea580c', fontWeight: 600 }}>New</td></tr>
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}