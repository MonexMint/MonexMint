'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateStampDuty } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

const STATES = [
  { value: 'maharashtra', label: 'Maharashtra', male: 6, female: 5 },
  { value: 'delhi', label: 'Delhi', male: 6, female: 4 },
  { value: 'karnataka', label: 'Karnataka', male: 5, female: 5 },
  { value: 'tamilnadu', label: 'Tamil Nadu', male: 7, female: 7 },
  { value: 'gujarat', label: 'Gujarat', male: 4.9, female: 4.9 },
  { value: 'rajasthan', label: 'Rajasthan', male: 6, female: 5 },
  { value: 'uttarpradesh', label: 'Uttar Pradesh', male: 7, female: 6 },
  { value: 'westbengal', label: 'West Bengal', male: 6, female: 6 },
  { value: 'telangana', label: 'Telangana', male: 5, female: 5 },
  { value: 'andhra', label: 'Andhra Pradesh', male: 5, female: 5 },
  { value: 'kerala', label: 'Kerala', male: 8, female: 8 },
  { value: 'haryana', label: 'Haryana', male: 7, female: 5 },
  { value: 'madhyapradesh', label: 'Madhya Pradesh', male: 7.5, female: 7.5 },
  { value: 'punjab', label: 'Punjab', male: 7, female: 5 },
];

export default function StampDutyCalculator() {

  const [formData, setFormData] = useState({
    propertyValue:   '5000000',
    state:           'maharashtra',
    ownershipType:   'male',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const value = parseFloat(formData.propertyValue);

    if (!value || value <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateStampDuty(value, formData.state, formData.ownershipType);
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const selectedState = STATES.find(s => s.value === formData.state);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Stamp Duty Calculator</h1>
          <p className={styles.description}>
            Calculate stamp duty and registration charges on property purchase. 
            State-wise rates with male/female/joint ownership options.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Property Details">
              <div className={styles.form}>

                <Input
                  label="Property Value"
                  type="number"
                  name="propertyValue"
                  value={formData.propertyValue}
                  onChange={handleChange}
                  prefix="₹"
                  min="100000"
                  step="100000"
                  helpText="Market value or circle rate (whichever higher)"
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
                        {opt.label} (Male: {opt.male}%, Female: {opt.female}%)
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Rates vary by state
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    Ownership Type
                  </label>
                  <select
                    name="ownershipType"
                    value={formData.ownershipType}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                  >
                    <option value="male">Male (Sole Owner)</option>
                    <option value="female">Female (Sole Owner)</option>
                    <option value="joint">Joint Ownership</option>
                  </select>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Female owners get concession in most states
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
                    <div className={styles.emiLabel}>Total Cost</div>
                    <div className={styles.emiValue}>{formatCurrency(result.totalCost)}</div>
                  </div>
                </Card>

                <Card title="Cost Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Property Value</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.propertyValue)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Stamp Duty Rate</div>
                      <div className={styles.summaryValue}>{result.stampDutyRate}%</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Stamp Duty</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                        {formatCurrency(result.stampDuty)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Registration Charges</div>
                      <div className={styles.summaryValue} style={{ color: '#ea580c' }}>
                        {formatCurrency(result.registrationCharge)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Charges</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.25rem' }}>
                        {formatCurrency(result.totalCharges)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Cost</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1', fontSize: '1.5rem' }}>
                        {formatCurrency(result.totalCost)}
                      </div>
                    </div>

                  </div>
                </Card>

                <Card variant="info">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#0284c7' }}>
                    💡 {selectedState?.label} - {formData.ownershipType === 'male' ? 'Male' : formData.ownershipType === 'female' ? 'Female' : 'Joint'} Ownership
                  </h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#075985' }}>
                    <p>
                      <strong>Property Value:</strong> ₹{formatCurrency(result.propertyValue)}
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Stamp Duty:</strong> {result.stampDutyRate}% = ₹{formatCurrency(result.stampDuty)}
                    </p>
                    <p>
                      <strong>Registration:</strong> 1% = ₹{formatCurrency(result.registrationCharge)}
                    </p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#e0f2fe', borderRadius: '0.5rem' }}>
                      💰 <strong>Total Amount Needed:</strong> ₹{formatCurrency(result.totalCost)}<br/>
                      (Property + Stamp Duty + Registration)
                    </p>
                    {formData.ownershipType === 'female' && selectedState?.male > selectedState?.female && (
                      <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#dcfce7', borderRadius: '0.5rem', color: '#047857' }}>
                        ✅ <strong>Female Concession:</strong> Save {selectedState.male - selectedState.female}% on stamp duty!
                      </p>
                    )}
                  </div>
                </Card>

                <Card title="State-wise Comparison">
                  <div style={{ fontSize: '0.875rem' }}>
                    <p style={{ marginBottom: '0.5rem' }}>For ₹{formatCurrency(result.propertyValue)} property:</p>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                      <table style={{ width: '100%', fontSize: '0.875rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>State</th>
                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>Male</th>
                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>Female</th>
                          </tr>
                        </thead>
                        <tbody>
                          {STATES.slice(0, 5).map(state => {
                            const maleCharges = (result.propertyValue * state.male / 100) + (result.propertyValue * 0.01);
                            const femaleCharges = (result.propertyValue * state.female / 100) + (result.propertyValue * 0.01);
                            return (
                              <tr key={state.value} style={{ 
                                background: state.value === formData.state ? '#f0fdf4' : 'transparent' 
                              }}>
                                <td style={{ padding: '0.25rem' }}>{state.label}</td>
                                <td style={{ padding: '0.25rem', textAlign: 'right' }}>₹{formatCurrency(maleCharges)}</td>
                                <td style={{ padding: '0.25rem', textAlign: 'right', color: '#059669' }}>₹{formatCurrency(femaleCharges)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>🏠</div>
                  <p>Enter property details to calculate stamp duty</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>Understanding Stamp Duty</h2>
          <p>
            Stamp duty is a tax levied by state governments on property transactions. 
            It validates the legal ownership transfer. Registration charges are separate (typically 1% of property value).
          </p>

          <h3>What is Stamp Duty?</h3>
          <ul>
            <li><strong>Purpose:</strong> Legal proof of property ownership transfer</li>
            <li><strong>Levied by:</strong> State Government (varies by state)</li>
            <li><strong>Paid by:</strong> Buyer (unless otherwise agreed)</li>
            <li><strong>When:</strong> At the time of property registration</li>
            <li><strong>Calculation Base:</strong> Market value OR Circle rate (whichever higher)</li>
          </ul>

          <h3>State-wise Stamp Duty Rates</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>State</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Male</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Female</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Joint</th>
                </tr>
              </thead>
              <tbody>
                {STATES.map(state => (
                  <tr key={state.value}>
                    <td style={{ padding: '0.25rem' }}>{state.label}</td>
                    <td style={{ padding: '0.25rem', textAlign: 'right' }}>{state.male}%</td>
                    <td style={{ padding: '0.25rem', textAlign: 'right', color: state.male > state.female ? '#059669' : 'inherit' }}>
                      {state.female}% {state.male > state.female && '✓'}
                    </td>
                    <td style={{ padding: '0.25rem', textAlign: 'right' }}>{state.male}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>Female Concession</h3>
          <ul>
            <li><strong>Benefit:</strong> Lower stamp duty rate for female sole owners</li>
            <li><strong>Savings:</strong> 1-2% of property value</li>
            <li><strong>Example:</strong> Maharashtra — Male: 6%, Female: 5% (save 1%)</li>
            <li><strong>Delhi:</strong> Best concession — Male: 6%, Female: 4% (save 2%!)</li>
            <li><strong>Eligibility:</strong> Property in female's sole name</li>
          </ul>

          <h3>Registration Charges</h3>
          <ul>
            <li><strong>Rate:</strong> Typically 1% of property value (varies by state)</li>
            <li><strong>Purpose:</strong> Recording the deed in government records</li>
            <li><strong>Mandatory:</strong> Must be done within 4 months of agreement</li>
            <li><strong>Late Fee:</strong> Penalty for delayed registration</li>
          </ul>

          <h3>Circle Rate vs Market Rate</h3>
          <ul>
            <li><strong>Circle Rate:</strong> Minimum value set by government (area-wise)</li>
            <li><strong>Market Rate:</strong> Actual transaction price</li>
            <li><strong>Stamp Duty Base:</strong> Higher of the two</li>
            <li><strong>Example:</strong> Bought @ ₹50L, Circle Rate ₹60L → Stamp duty on ₹60L</li>
          </ul>

          <h3>Stamp Duty Calculation Examples</h3>
          
          <h4>Example 1: Male Owner (Maharashtra)</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Property Value: ₹50,00,000</li>
              <li>Stamp Duty (6%): ₹3,00,000</li>
              <li>Registration (1%): ₹50,000</li>
              <li><strong>Total Charges: ₹3,50,000</strong></li>
              <li><strong>Total Cost: ₹53,50,000</strong></li>
            </ul>
          </div>

          <h4>Example 2: Female Owner (Maharashtra)</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Property Value: ₹50,00,000</li>
              <li>Stamp Duty (5%): ₹2,50,000</li>
              <li>Registration (1%): ₹50,000</li>
              <li><strong>Total Charges: ₹3,00,000</strong></li>
              <li><strong>Savings vs Male: ₹50,000!</strong></li>
            </ul>
          </div>

          <h3>Joint Ownership</h3>
          <ul>
            <li><strong>Rate:</strong> Usually same as male rate</li>
            <li><strong>Exception:</strong> Some states give concession if wife is co-owner</li>
            <li><strong>Benefit:</strong> Better than sole male ownership in some states</li>
            <li><strong>Example:</strong> Delhi — Joint ≈ 5% (vs Male 6%)</li>
          </ul>

          <h3>Additional Charges</h3>
          <ul>
            <li><strong>Legal Fees:</strong> Lawyer charges (₹10K-₹50K)</li>
            <li><strong>Notary Charges:</strong> ₹1K-₹5K</li>
            <li><strong>Society Transfer Fee:</strong> ₹5K-₹50K (if applicable)</li>
            <li><strong>Miscellaneous:</strong> Affidavit, photocopies, etc.</li>
          </ul>

          <h3>Stamp Duty Payment Methods</h3>
          <ul>
            <li><strong>Online Payment:</strong> State government portals (recommended)</li>
            <li><strong>Stamp Vendor:</strong> Authorized shops</li>
            <li><strong>E-Stamping:</strong> Digital stamp paper</li>
            <li><strong>Franking:</strong> At authorized banks</li>
          </ul>

          <h3>Stamp Duty Exemptions / Rebates</h3>
          <ul>
            <li><strong>First-time Buyer:</strong> Some states offer concessions</li>
            <li><strong>Affordable Housing:</strong> Reduced rates for {'<'} ₹45L properties</li>
            <li><strong>Transfer to Immediate Relative:</strong> Lower rates (1-2% only)</li>
            <li><strong>Government Schemes:</strong> PMAY, etc. may have benefits</li>
          </ul>

          <h3>Important Documents</h3>
          <ul>
            <li>Sale deed (agreement to sell)</li>
            <li>Property papers (title deed, encumbrance certificate)</li>
            <li>PAN card, Aadhaar (buyer & seller)</li>
            <li>Stamp duty & registration receipts</li>
            <li>NOC from builder/society</li>
          </ul>

          <h3>Timeline</h3>
          <ul>
            <li><strong>Pay Stamp Duty:</strong> Before or at time of registration</li>
            <li><strong>Register Property:</strong> Within 4 months of agreement</li>
            <li><strong>Late Registration:</strong> Penalty + interest (10% pa)</li>
            <li><strong>Grace Period:</strong> Varies by state</li>
          </ul>

          <h3>Common Mistakes</h3>
          <ul>
            <li>❌ Not considering circle rate (under-declaration)</li>
            <li>❌ Missing female concession benefit</li>
            <li>❌ Delayed registration (penalty applies)</li>
            <li>❌ Not verifying encumbrance certificate</li>
            <li>❌ Paying to wrong government portal</li>
          </ul>

          <h3>Pro Tips</h3>
          <ul>
            <li>✅ Register property in female's name (if eligible) — save 1-2%</li>
            <li>✅ Check circle rate before finalizing deal</li>
            <li>✅ Pay online (faster, transparent, get receipt)</li>
            <li>✅ Complete registration within 4 months (avoid penalty)</li>
            <li>✅ Keep all receipts (stamp duty deductible under 80C in first year)</li>
            <li>✅ Verify property encumbrance certificate before purchase</li>
          </ul>

          <h3>Stamp Duty Deduction (Section 80C)</h3>
          <ul>
            <li>Stamp duty & registration charges are eligible for 80C deduction</li>
            <li>Only in the year of purchase</li>
            <li>Combined 80C limit: ₹1.5 lakh</li>
            <li>Can claim even if loan is not taken</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}