'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateGST } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

const GST_RATES = [
  { value: 0,    label: '0% — Exempted' },
  { value: 0.25, label: '0.25% — Rough Diamonds' },
  { value: 3,    label: '3% — Gold, Silver' },
  { value: 5,    label: '5% — Essential Items' },
  { value: 12,   label: '12% — Standard Rate' },
  { value: 18,   label: '18% — Most Goods & Services' },
  { value: 28,   label: '28% — Luxury Items' },
];

export default function GSTCalculator() {

  const [formData, setFormData] = useState({
    amount:          '10000',
    gstRate:         '18',
    isInclusive:     false,
    transactionType: 'intra',
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
    const rate   = parseFloat(formData.gstRate)  || 0;

    if (!amount || amount <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateGST(amount, rate, formData.isInclusive, formData.transactionType);
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

        <Breadcrumb items={BREADCRUMBS.gst} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>GST Calculator</h1>
          <p className={styles.description}>
            Add or remove GST from any amount. Calculate CGST + SGST (intra-state)
            or IGST (inter-state) with all GST rate slabs.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── FORM ──────────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="GST Calculation">
              <div className={styles.form}>

                <Input
                  label={formData.isInclusive ? 'Total Amount (GST Inclusive)' : 'Base Amount (Excluding GST)'}
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="100"
                  helpText={formData.isInclusive ? 'Final amount including GST' : 'Amount before adding GST'}
                />

                {/* GST Rate dropdown */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    GST Rate
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      name="gstRate"
                      value={formData.gstRate}
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
                      {GST_RATES.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>▾</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Select applicable GST rate
                  </p>
                </div>

                {/* GST Inclusive checkbox */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="isInclusive"
                      checked={formData.isInclusive}
                      onChange={handleChange}
                      style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      GST Inclusive (Remove GST)
                    </span>
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', marginLeft: '1.75rem' }}>
                    Check if your amount already includes GST
                  </p>
                </div>

                {/* Transaction type */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    Transaction Type
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      name="transactionType"
                      value={formData.transactionType}
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
                      <option value="intra">Intra-State (CGST + SGST)</option>
                      <option value="inter">Inter-State (IGST)</option>
                    </select>
                    <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>▾</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Within state → CGST + SGST | Between states → IGST
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
                {/* Hero */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>
                      {formData.isInclusive ? 'Base Amount' : 'Total Amount (with GST)'}
                    </div>
                    <div className={styles.emiValue}>
                      {formatCurrency(formData.isInclusive ? result.baseAmount : result.totalAmount)}
                    </div>
                  </div>
                </Card>

                {/* Main breakdown */}
                <Card title="GST Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Base Amount</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.baseAmount)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>GST Rate</div>
                      <div className={styles.summaryValue}>{result.gstRate}%</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>GST Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                        {formatCurrency(result.gstAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1', fontSize: '1.5rem' }}>
                        {formatCurrency(result.totalAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Transaction Type</div>
                      <div className={styles.summaryValue} style={{ fontSize: '1rem' }}>
                        {result.transactionType === 'intra' ? 'Intra-State' : 'Inter-State'}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Calculation Mode</div>
                      <div className={styles.summaryValue} style={{ fontSize: '1rem' }}>
                        {result.isInclusive ? 'GST Removed' : 'GST Added'}
                      </div>
                    </div>

                  </div>
                </Card>

                {/* CGST/SGST or IGST */}
                <Card title={result.transactionType === 'intra' ? 'CGST + SGST Breakdown' : 'IGST Breakdown'}>
                  {result.transactionType === 'intra' ? (
                    <div className={styles.summaryGrid}>
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryLabel}>CGST ({result.gstRate / 2}%)</div>
                        <div className={styles.summaryValue} style={{ color: '#0284c7' }}>
                          {formatCurrency(result.cgst)}
                        </div>
                      </div>
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryLabel}>SGST ({result.gstRate / 2}%)</div>
                        <div className={styles.summaryValue} style={{ color: '#0284c7' }}>
                          {formatCurrency(result.sgst)}
                        </div>
                      </div>
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryLabel}>Total GST</div>
                        <div className={styles.summaryValue} style={{ color: '#0284c7' }}>
                          {formatCurrency(result.gstAmount)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.summaryGrid}>
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryLabel}>IGST ({result.gstRate}%)</div>
                        <div className={styles.summaryValue} style={{ color: '#7c3aed', fontSize: '1.5rem' }}>
                          {formatCurrency(result.igst)}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Formula */}
                <Card>
                  <h3 style={{ margin: '0 0 1rem 0' }}>💡 Calculation Formula</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#64748b' }}>
                    {result.isInclusive ? (
                      <>
                        <p><strong>Remove GST from inclusive amount:</strong></p>
                        <p style={{ marginTop: '0.5rem', fontFamily: 'monospace', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
                          Base Amount = Total ÷ (1 + GST%/100)<br />
                          = ₹{formatCurrency(parseFloat(formData.amount))} ÷ {(1 + parseFloat(formData.gstRate) / 100).toFixed(2)}<br />
                          = ₹{formatCurrency(result.baseAmount)}<br />
                          GST = ₹{formatCurrency(parseFloat(formData.amount))} − ₹{formatCurrency(result.baseAmount)} = ₹{formatCurrency(result.gstAmount)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p><strong>Add GST to base amount:</strong></p>
                        <p style={{ marginTop: '0.5rem', fontFamily: 'monospace', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
                          GST = ₹{formatCurrency(result.baseAmount)} × {result.gstRate}% = ₹{formatCurrency(result.gstAmount)}<br />
                          Total = ₹{formatCurrency(result.baseAmount)} + ₹{formatCurrency(result.gstAmount)}<br />
                          = ₹{formatCurrency(result.totalAmount)}
                        </p>
                      </>
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🧾</div>
                  <p>Enter amount to calculate GST</p>
                </div>
              </Card>
            )}

          </div>
        </div>

        {/* ── INFO SECTION ────────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>Understanding GST</h2>
          <p>
            GST (Goods and Services Tax) is an indirect tax levied on supply of goods and services in India.
            It replaced multiple indirect taxes like VAT, Service Tax, and Excise Duty.
          </p>

          <h3>GST Structure</h3>
          <ul>
            <li><strong>CGST:</strong> Central GST — goes to Central Government</li>
            <li><strong>SGST:</strong> State GST — goes to State Government</li>
            <li><strong>IGST:</strong> Integrated GST — for inter-state transactions</li>
            <li><strong>UTGST:</strong> Union Territory GST — for Union Territories</li>
          </ul>

          <h3>Intra-State vs Inter-State</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Intra-State (Within Same State):</strong></p>
            <ul style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <li>Example: Mumbai seller → Pune buyer (both Maharashtra)</li>
              <li>GST splits equally: CGST 9% + SGST 9% = 18%</li>
            </ul>
            <p style={{ marginTop: '1rem' }}><strong>Inter-State (Between States):</strong></p>
            <ul style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <li>Example: Mumbai seller → Delhi buyer</li>
              <li>Single tax: IGST 18%</li>
            </ul>
          </div>

          <h3>GST Rate Slabs</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Rate</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Examples</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['0%',     'Fresh fruits, vegetables, milk, bread, eggs'],
                  ['0.25%',  'Rough diamonds, precious stones'],
                  ['3%',     'Gold, silver ornaments'],
                  ['5%',     'Sugar, tea, coffee, edible oil, coal'],
                  ['12%',    'Computers, processed food, medicines'],
                  ['18%',    'Mobile phones, electronics, restaurants, most services'],
                  ['28%',    'Luxury items: AC, refrigerator, automobiles, cigarettes'],
                ].map(([rate, examples]) => (
                  <tr key={rate} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.375rem 0.5rem', fontWeight: 700, color: '#10b981' }}>{rate}</td>
                    <td style={{ padding: '0.375rem 0.5rem' }}>{examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>GST Calculation Examples</h3>

          <h4>Example 1: Add GST (Exclusive)</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            <ul>
              <li>Product Price: ₹10,000</li>
              <li>GST Rate: 18%</li>
              <li>GST: ₹10,000 × 18% = ₹1,800</li>
              <li>CGST: ₹900 | SGST: ₹900 (intra-state)</li>
              <li><strong>Total Invoice: ₹11,800</strong></li>
            </ul>
          </div>

          <h4>Example 2: Remove GST (Inclusive)</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            <ul>
              <li>Total Amount: ₹11,800 (GST included)</li>
              <li>GST Rate: 18%</li>
              <li>Base: ₹11,800 ÷ 1.18 = ₹10,000</li>
              <li>GST: ₹11,800 − ₹10,000 = ₹1,800</li>
            </ul>
          </div>

          <h3>Input Tax Credit (ITC)</h3>
          <ul>
            <li><strong>Concept:</strong> GST paid on purchases can be claimed as credit against output tax</li>
            <li><strong>Benefit:</strong> Eliminates tax-on-tax cascading effect</li>
            <li><strong>Example:</strong> Bought goods for ₹10K + ₹1.8K GST → ITC ₹1.8K available</li>
          </ul>

          <h3>GST Registration</h3>
          <ul>
            <li><strong>Mandatory:</strong> Turnover &gt; ₹40L (goods) or &gt; ₹20L (services)</li>
            <li><strong>GSTIN:</strong> 15-digit unique registration number</li>
            <li><strong>E-way Bill:</strong> Required for goods &gt; ₹50K</li>
            <li><strong>Returns:</strong> GSTR-1, GSTR-3B monthly or quarterly</li>
          </ul>

          <h3>Common GST Mistakes</h3>
          <ul>
            <li>❌ Confusing GST inclusive vs exclusive prices in quotes</li>
            <li>❌ Using CGST+SGST for inter-state sales (should be IGST)</li>
            <li>❌ Not claiming Input Tax Credit (ITC)</li>
            <li>❌ Missing e-way bill for goods &gt; ₹50K</li>
            <li>❌ Late GST return filing (penalty ₹50/day, max ₹5,000)</li>
          </ul>

          <h3>Pro Tips</h3>
          <ul>
            <li>Always clarify GST inclusive/exclusive in invoices and quotations</li>
            <li>Maintain proper tax invoices for claiming ITC</li>
            <li>Verify GSTIN of suppliers on the GST portal before claiming ITC</li>
            <li>File returns on time — late fees compound quickly</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}