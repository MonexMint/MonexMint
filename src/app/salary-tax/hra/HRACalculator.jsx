'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateHRAExemption } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

// ─────────────────────────────────────────────────────────────
// Local helper: wraps calculateHRAExemption (annual params)
// into the monthly-input shape this component uses,
// and returns all the extra fields the UI renders.
// ─────────────────────────────────────────────────────────────
function computeHRA(basicMonthly, daMonthly, hraMonthly, rentMonthly, isMetro) {
  const basicPlusDA      = basicMonthly + daMonthly;
  const annualBasicPlusDA = basicPlusDA * 12;

  // The three components (monthly)
  const component1 = hraMonthly;                                   // Actual HRA received
  const tenPercent  = basicPlusDA * 0.1;
  const component2 = Math.max(0, rentMonthly - tenPercent);        // Rent - 10% of (Basic+DA)
  const component3 = basicPlusDA * (isMetro ? 0.5 : 0.4);         // 50%/40% of (Basic+DA)

  const monthlyExemption = Math.min(component1, component2, component3);

  // Which component was the lowest?
  const minVal = monthlyExemption;
  let lowestComponent = 'actual';
  if (minVal === component2 && component2 <= component1 && component2 <= component3) {
    lowestComponent = 'excess';
  } else if (minVal === component3 && component3 <= component1 && component3 <= component2) {
    lowestComponent = 'percentage';
  }

  const annualExemption = monthlyExemption * 12;
  const taxableHRA      = Math.max(0, hraMonthly - monthlyExemption);
  const taxSaved        = Math.round(annualExemption * 0.3); // assuming 30% bracket

  return {
    basicPlusDA,
    hraReceived:      hraMonthly,
    rentPaid:         rentMonthly,
    isMetro,
    component1,
    component2,
    component3,
    tenPercent,
    lowestComponent,
    monthlyExemption: Math.round(monthlyExemption * 100) / 100,
    annualExemption:  Math.round(annualExemption * 100) / 100,
    taxableHRA:       Math.round(taxableHRA * 100) / 100,
    taxSaved,
  };
}

export default function HRACalculator() {

  const [formData, setFormData] = useState({
    basicSalary:        '40000',
    dearnessAllowance:  '0',
    hraReceived:        '20000',
    rentPaid:           '15000',
    isMetro:            true,
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
    const basic = parseFloat(formData.basicSalary)       || 0;
    const da    = parseFloat(formData.dearnessAllowance) || 0;
    const hra   = parseFloat(formData.hraReceived)       || 0;
    const rent  = parseFloat(formData.rentPaid)          || 0;
    const metro = formData.isMetro;

    if (!basic || basic <= 0 || !hra || hra <= 0 || !rent || rent <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = computeHRA(basic, da, hra, rent, metro);
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
          <h1 className={styles.title}>HRA Calculator</h1>
          <p className={styles.description}>
            Calculate House Rent Allowance (HRA) tax exemption based on salary, rent paid, and city type.
            Save income tax on your rent!
          </p>
        </div>

        <div className={styles.content}>

          {/* ── FORM ──────────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="HRA Details">
              <div className={styles.form}>

                <Input
                  label="Monthly Basic Salary"
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                  helpText="Basic salary per month"
                />

                <Input
                  label="Monthly Dearness Allowance (DA)"
                  type="number"
                  name="dearnessAllowance"
                  value={formData.dearnessAllowance}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="500"
                  helpText="DA per month (if applicable)"
                />

                <Input
                  label="Monthly HRA Received"
                  type="number"
                  name="hraReceived"
                  value={formData.hraReceived}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="1000"
                  helpText="HRA component in salary"
                />

                <Input
                  label="Monthly Rent Paid"
                  type="number"
                  name="rentPaid"
                  value={formData.rentPaid}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="1000"
                  helpText="Actual rent you pay"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="isMetro"
                      checked={formData.isMetro}
                      onChange={handleChange}
                      style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Metro City (Mumbai, Delhi, Kolkata, Chennai)
                    </span>
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
                    50% exemption in metros, 40% in non-metros
                  </p>
                </div>

                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>
            </Card>
          </div>

          {/* ── RESULTS ───────────────────────────────────── */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {/* Hero card */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Monthly HRA Exemption</div>
                    <div className={styles.emiValue}>{formatCurrency(result.monthlyExemption)}</div>
                  </div>
                </Card>

                {/* Basic breakdown */}
                <Card title="HRA Calculation Breakdown">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>HRA Received</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.hraReceived)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Rent Paid</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.rentPaid)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Basic + DA</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.basicPlusDA)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>City Type</div>
                      <div className={styles.summaryValue} style={{ fontSize: '1rem' }}>
                        {result.isMetro ? 'Metro (50%)' : 'Non-Metro (40%)'}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Three-formula breakdown */}
                <Card title="Three Formula Components">
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.8', color: '#64748b' }}>
                    <p style={{ marginBottom: '0.75rem' }}>
                      HRA exemption is <strong>minimum</strong> of these 3:
                    </p>

                    {/* Component 1 */}
                    <div style={{
                      padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem',
                      marginBottom: '0.5rem',
                      border: result.lowestComponent === 'actual' ? '2px solid #10b981' : '1px solid #e2e8f0',
                    }}>
                      <strong>1. Actual HRA Received:</strong>
                      <div style={{
                        marginTop: '0.25rem',
                        color: result.lowestComponent === 'actual' ? '#10b981' : '#64748b',
                        fontWeight: result.lowestComponent === 'actual' ? 700 : 400,
                      }}>
                        {formatCurrency(result.component1)}
                        {result.lowestComponent === 'actual' && ' ✓ (Lowest — used for exemption)'}
                      </div>
                    </div>

                    {/* Component 2 */}
                    <div style={{
                      padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem',
                      marginBottom: '0.5rem',
                      border: result.lowestComponent === 'excess' ? '2px solid #10b981' : '1px solid #e2e8f0',
                    }}>
                      <strong>2. Rent − 10% of (Basic + DA):</strong>
                      <div style={{
                        marginTop: '0.25rem',
                        color: result.lowestComponent === 'excess' ? '#10b981' : '#64748b',
                        fontWeight: result.lowestComponent === 'excess' ? 700 : 400,
                      }}>
                        {formatCurrency(result.rentPaid)} − {formatCurrency(result.tenPercent)} = {formatCurrency(result.component2)}
                        {result.lowestComponent === 'excess' && ' ✓ (Lowest — used for exemption)'}
                      </div>
                    </div>

                    {/* Component 3 */}
                    <div style={{
                      padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem',
                      border: result.lowestComponent === 'percentage' ? '2px solid #10b981' : '1px solid #e2e8f0',
                    }}>
                      <strong>3. {result.isMetro ? '50%' : '40%'} of (Basic + DA):</strong>
                      <div style={{
                        marginTop: '0.25rem',
                        color: result.lowestComponent === 'percentage' ? '#10b981' : '#64748b',
                        fontWeight: result.lowestComponent === 'percentage' ? 700 : 400,
                      }}>
                        {formatCurrency(result.component3)}
                        {result.lowestComponent === 'percentage' && ' ✓ (Lowest — used for exemption)'}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Tax benefit summary */}
                <Card title="Tax Benefit Summary">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly Exemption</div>
                      <div className={styles.summaryValue} style={{ color: '#059669' }}>
                        {formatCurrency(result.monthlyExemption)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Annual Exemption</div>
                      <div className={styles.summaryValue} style={{ color: '#059669' }}>
                        {formatCurrency(result.annualExemption)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Taxable HRA (monthly)</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.taxableHRA)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tax Saved @ 30%</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.taxSaved)}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Explanation card */}
                <Card>
                  <h3 style={{ margin: '0 0 1rem 0' }}>💡 How HRA Exemption Works</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#64748b' }}>
                    <p>
                      Out of your monthly HRA of {formatCurrency(result.hraReceived)}, you get exemption of{' '}
                      <strong>{formatCurrency(result.monthlyExemption)}</strong>.
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                      The remaining {formatCurrency(result.taxableHRA)} is added to your taxable income.
                    </p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem', color: '#047857' }}>
                      <strong>Annual Tax Saving:</strong> {formatCurrency(result.taxSaved)} (assuming 30% tax bracket)
                    </p>
                  </div>
                </Card>

                <InvestmentBarChart
                  invested={result.hraReceived}
                  returns={result.monthlyExemption}
                  labels={{ invested: 'HRA Received', returns: 'Exemption' }}
                />
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🏠</div>
                  <p className={styles.placeholderText}>Enter HRA and rent details</p>
                </div>
              </Card>
            )}

          </div>
        </div>

        {/* ── INFO SECTION ────────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>Understanding HRA Exemption</h2>
          <p>
            HRA (House Rent Allowance) is a salary component that provides tax exemption for rent paid.
            The exemption is calculated using 3 formulas, and the lowest amount is exempt from tax.
          </p>

          <h3>HRA Exemption Formula</h3>
          <p>Tax-exempt HRA = <strong>Minimum</strong> of the following three:</p>
          <ul>
            <li><strong>Actual HRA received</strong> from employer</li>
            <li><strong>Rent paid minus 10% of (Basic + DA)</strong></li>
            <li><strong>50% of (Basic + DA)</strong> if metro city (Mumbai, Delhi, Kolkata, Chennai)</li>
            <li><strong>40% of (Basic + DA)</strong> if non-metro city</li>
          </ul>

          <h3>Eligibility for HRA Exemption</h3>
          <ul>
            <li>✅ You must be <strong>living in rented accommodation</strong></li>
            <li>✅ You must be <strong>paying rent</strong> (proof required if {'>'}₹1L/year)</li>
            <li>✅ HRA component must be part of salary structure</li>
            <li>✅ Available only under <strong>Old Tax Regime</strong></li>
            <li>❌ NOT available if you own the house you're living in</li>
            <li>❌ NOT available in New Tax Regime</li>
          </ul>

          <h3>Documents Required</h3>
          <ul>
            <li><strong>Rent receipts:</strong> If annual rent {'>'}₹1,00,000</li>
            <li><strong>Landlord's PAN:</strong> If annual rent {'>'}₹1,00,000</li>
            <li><strong>Rental agreement:</strong> Recommended (not mandatory)</li>
            <li><strong>Bank statement:</strong> Showing rent payments (recommended)</li>
          </ul>

          <h3>Tips to Maximise HRA Benefit</h3>
          <ul>
            <li>✅ Ensure HRA is 50% of Basic (standard practice)</li>
            <li>✅ Pay rent to parents (legal, but they must show it as rental income)</li>
            <li>✅ Keep rent receipts and payment proof</li>
            <li>✅ If rent {'>'}₹1L/year, collect landlord's PAN</li>
            <li>✅ Submit HRA proofs before Feb–Mar (for tax adjustment)</li>
            <li>✅ Living in metro? Mention it to employer for 50% exemption</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}