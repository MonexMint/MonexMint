'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateTDS } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

// Keys MUST match the tdsRates object inside calculateTDS() in calculators.js
const TDS_CATEGORIES = [
  { value: 'fdInterest',      label: 'FD / Bank Interest (194A)',         rate: '10%',      section: '194A' },
  { value: 'rentLand',        label: 'Rent — Land / Building (194I)',      rate: '10%',      section: '194I(b)' },
  { value: 'rentMachinery',   label: 'Rent — Plant / Machinery (194I)',    rate: '2%',       section: '194I(a)' },
  { value: 'professionalFee', label: 'Professional / Technical Fees (194J)', rate: '10%',   section: '194J' },
  { value: 'contractPayment', label: 'Contractor Payment (194C)',           rate: '1%',      section: '194C' },
  { value: 'commission',      label: 'Commission / Brokerage (194H)',       rate: '5%',      section: '194H' },
  { value: 'lottery',         label: 'Lottery / Winnings (194B)',           rate: '30%',     section: '194B' },
  { value: 'insurance',       label: 'Life Insurance Maturity (194DA)',     rate: '5%',      section: '194DA' },
  { value: 'dividends',       label: 'Dividend (194)',                      rate: '10%',     section: '194' },
];

export default function TDSCalculator() {

  const [formData, setFormData] = useState({
    category:     'fdInterest',
    amount:       '50000',
    panAvailable: true,
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
    const amount = parseFloat(formData.amount) || 0;
    const { category, panAvailable } = formData;

    if (!amount || amount <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const raw = calculateTDS(amount, category, panAvailable);

    if (raw.error) {
      setResult({ error: raw.error });
      setLoading(false);
      return;
    }

    // calculateTDS returns: { amount, paymentType, section, tdsRate,
    //   threshold, aboveThreshold, tdsAmount, netAmount, hasPAN }
    // Normalise into a shape the UI can use uniformly
    const normalRate = panAvailable ? raw.tdsRate : (() => {
      // Back-calculate normal rate: re-call with PAN = true
      const withPAN = calculateTDS(amount, category, true);
      return withPAN.tdsRate;
    })();

    setResult({
      grossAmount:     raw.amount,
      tdsRate:         raw.tdsRate,
      tdsAmount:       raw.tdsAmount,
      netAmount:       raw.netAmount,
      section:         raw.section,
      threshold:       raw.threshold,
      aboveThreshold:  raw.aboveThreshold,
      panAvailable:    raw.hasPAN,
      normalRate,
    });
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const selectedCategory = TDS_CATEGORIES.find(c => c.value === formData.category);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>TDS Calculator</h1>
          <p className={styles.description}>
            Calculate Tax Deducted at Source (TDS) on various income types.
            FY 2024-25 rates — interest, rent, professional fees, and more.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── FORM ──────────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="TDS Details">
              <div className={styles.form}>

                {/* Category dropdown */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary, #0f172a)' }}>
                    Income / Payment Category
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.5rem 0.75rem 0.875rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        appearance: 'none',
                        background: '#fff',
                        color: 'var(--text-primary, #0f172a)',
                        cursor: 'pointer',
                      }}
                    >
                      {TDS_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label} — {cat.rate}
                        </option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>▾</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Select the type of income or payment
                  </p>
                </div>

                <Input
                  label="Gross Payment Amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  prefix="₹"
                  min="100"
                  step="100"
                  helpText="Total amount before TDS deduction"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="panAvailable"
                      checked={formData.panAvailable}
                      onChange={handleChange}
                      style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      PAN Available
                    </span>
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
                    TDS doubles to 20% if PAN is not provided
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
                    <div className={styles.emiLabel}>TDS Amount</div>
                    <div className={styles.emiValue}>{formatCurrency(result.tdsAmount)}</div>
                  </div>
                </Card>

                {/* Main breakdown */}
                <Card title="TDS Calculation">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Gross Amount</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.grossAmount)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>TDS Rate</div>
                      <div className={styles.summaryValue}>{result.tdsRate}%</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>TDS Deducted</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.tdsAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Net Received</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.netAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Section</div>
                      <div className={styles.summaryValue} style={{ fontSize: '1rem' }}>
                        {result.section}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Threshold Limit</div>
                      <div className={styles.summaryValue} style={{ fontSize: '1rem' }}>
                        {result.threshold ? `₹${formatCurrency(result.threshold)}` : 'N/A'}
                      </div>
                    </div>

                  </div>

                  {/* Status message */}
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    background: result.aboveThreshold ? '#f0fdf4' : '#fef9c3',
                    color: result.aboveThreshold ? '#047857' : '#854d0e',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}>
                    {result.aboveThreshold
                      ? `✅ TDS of ₹${formatCurrency(result.tdsAmount)} is applicable. You will receive ₹${formatCurrency(result.netAmount)}.`
                      : `ℹ️ No TDS — amount is below the threshold of ₹${formatCurrency(result.threshold)}.`}
                  </div>
                </Card>

                {/* No PAN warning */}
                {!result.panAvailable && (
                  <Card variant="warning">
                    <h3 style={{ margin: '0 0 0.75rem 0', color: '#92400e' }}>⚠️ Higher TDS Without PAN</h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.7', color: '#92400e' }}>
                      TDS is <strong>20%</strong> without PAN vs <strong>{result.normalRate}%</strong> with PAN.
                      You are paying{' '}
                      <strong>₹{formatCurrency(result.tdsAmount - Math.round(result.grossAmount * result.normalRate / 100))}</strong>{' '}
                      extra in TDS. Always provide PAN to the payer.
                    </p>
                  </Card>
                )}

                {/* Category info */}
                <Card>
                  <h3 style={{ margin: '0 0 1rem 0' }}>💡 {selectedCategory?.label}</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.8', color: '#64748b' }}>
                    <p><strong>Section:</strong> {result.section}</p>
                    <p><strong>Normal Rate (with PAN):</strong> {result.normalRate}%</p>
                    <p><strong>Rate without PAN:</strong> 20%</p>
                    {result.threshold > 0 && (
                      <p><strong>Threshold:</strong> TDS applies only if amount exceeds ₹{formatCurrency(result.threshold)}</p>
                    )}
                  </div>
                </Card>
              </>

            ) : result && result.error ? (
              <Card variant="warning">
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>⚠️ Calculation Error</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e' }}>{result.error}</p>
              </Card>

            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>📋</div>
                  <p className={styles.placeholderText}>Enter payment details to calculate TDS</p>
                </div>
              </Card>
            )}

          </div>
        </div>

        {/* ── INFO SECTION ────────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About TDS (Tax Deducted at Source)</h2>
          <p>
            TDS is tax collected at source by the payer and deposited with the government.
            It ensures advance tax collection and reduces tax evasion.
          </p>

          <h3>Common TDS Sections & Rates</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Section</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Payment Type</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Rate</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Threshold</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['194A',    'FD / Bank Interest',           '10%',  '₹40K (₹50K Sr)'],
                  ['194I(b)', 'Rent — Land/Building',         '10%',  '₹2.4L'],
                  ['194I(a)', 'Rent — Plant/Machinery',       '2%',   '₹2.4L'],
                  ['194J',    'Professional/Technical Fees',  '10%',  '₹30K'],
                  ['194C',    'Contractor Payment',           '1%',   '₹30K'],
                  ['194H',    'Commission/Brokerage',         '5%',   '₹15K'],
                  ['194B',    'Lottery/Winnings',             '30%',  '₹10K'],
                  ['194DA',   'Insurance Maturity',           '5%',   '₹1L'],
                  ['194',     'Dividend',                     '10%',  '₹5K'],
                ].map(([sec, type, rate, threshold]) => (
                  <tr key={sec} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.4rem 0.5rem', fontWeight: 600, color: '#10b981' }}>{sec}</td>
                    <td style={{ padding: '0.4rem 0.5rem' }}>{type}</td>
                    <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>{rate}</td>
                    <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>{threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>TDS Without PAN</h3>
          <ul>
            <li><strong>Rate:</strong> 20% (flat) if PAN not provided to payer</li>
            <li><strong>Example:</strong> ₹1L professional fee → ₹20K TDS vs ₹10K with PAN</li>
            <li><strong>Tip:</strong> Always share PAN with the payer immediately</li>
          </ul>

          <h3>Form 15G / 15H — Avoid TDS</h3>
          <ul>
            <li><strong>Form 15G:</strong> Below 60 years, total income below taxable limit</li>
            <li><strong>Form 15H:</strong> Senior citizens (60+), no tax liability</li>
            <li><strong>Purpose:</strong> Request payer not to deduct TDS</li>
            <li><strong>Valid for:</strong> One financial year — renew each April</li>
          </ul>

          <h3>How to Claim TDS Credit</h3>
          <ul>
            <li><strong>Form 26AS:</strong> Download from income-tax portal — shows all TDS entries</li>
            <li><strong>ITR Filing:</strong> Claim TDS credit in your tax return</li>
            <li><strong>Refund:</strong> If TDS paid exceeds actual tax, refund is issued after ITR processing</li>
          </ul>

          <h3>TDS Certificates</h3>
          <ul>
            <li><strong>Form 16:</strong> TDS on salary — issued by employer by 15 June</li>
            <li><strong>Form 16A:</strong> TDS on non-salary — issued quarterly by payer</li>
          </ul>

          <h3>TDS Due Dates</h3>
          <ul>
            <li><strong>Deposit:</strong> 7th of the following month</li>
            <li><strong>Quarterly Returns:</strong> Q1 → 31 Jul | Q2 → 31 Oct | Q3 → 31 Jan | Q4 → 31 May</li>
            <li><strong>Late deposit interest:</strong> 1.5% per month</li>
            <li><strong>Late return penalty:</strong> ₹200 per day</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}