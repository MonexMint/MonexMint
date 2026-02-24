'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateCapitalGains } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

const ASSET_TYPES = [
  { value: 'equity', label: 'Equity Shares / Equity MF', holding: 12 },
  { value: 'property', label: 'Property / Real Estate', holding: 24 },
  { value: 'debtMF', label: 'Debt Mutual Funds', holding: 36 },
  { value: 'gold', label: 'Gold / Bonds', holding: 36 },
];

export default function CapitalGainsCalculator() {

  const [formData, setFormData] = useState({
    buyPrice:         '1000',
    sellPrice:        '1500',
    quantity:         '100',
    holdingMonths:    '18',
    assetType:        'equity',
    annualIncome:     '800000',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const buy      = parseFloat(formData.buyPrice);
    const sell     = parseFloat(formData.sellPrice);
    const qty      = parseFloat(formData.quantity);
    const holding  = parseFloat(formData.holdingMonths);
    const income   = parseFloat(formData.annualIncome);

    if (!buy || buy <= 0 || !sell || sell <= 0 || !qty || qty <= 0 || !holding || holding < 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateCapitalGains(
      buy, sell, qty, holding, 
      formData.assetType, income, null
    );
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const selectedAsset = ASSET_TYPES.find(a => a.value === formData.assetType);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <Breadcrumb items={BREADCRUMBS.capitalGains} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Capital Gains Calculator</h1>
          <p className={styles.description}>
            Calculate capital gains tax on equity, property, mutual funds, and gold. 
            LTCG 10% (equity {'>'}12m), STCG 15% (equity {'<'}12m).
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Capital Gains Details">
              <div className={styles.form}>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    Asset Type
                  </label>
                  <select
                    name="assetType"
                    value={formData.assetType}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                  >
                    {ASSET_TYPES.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} (LT: {'>'}{opt.holding}m)
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Long-term threshold: {selectedAsset?.holding} months
                  </p>
                </div>

                <Input
                  label="Buy Price"
                  type="number"
                  name="buyPrice"
                  value={formData.buyPrice}
                  onChange={handleChange}
                  prefix="₹"
                  min="0.01"
                  step="0.01"
                  helpText="Purchase price per unit"
                />

                <Input
                  label="Sell Price"
                  type="number"
                  name="sellPrice"
                  value={formData.sellPrice}
                  onChange={handleChange}
                  prefix="₹"
                  min="0.01"
                  step="0.01"
                  helpText="Sale price per unit"
                />

                <Input
                  label="Quantity / Units"
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  suffix="units"
                  min="1"
                  step="1"
                  helpText="Number of shares/units/sq.ft"
                />

                <Input
                  label="Holding Period"
                  type="number"
                  name="holdingMonths"
                  value={formData.holdingMonths}
                  onChange={handleChange}
                  suffix="months"
                  min="0"
                  max="600"
                  helpText="How long you held the asset"
                />

                <Input
                  label="Annual Income (for STCG slab)"
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  prefix="₹"
                  min="0"
                  step="10000"
                  helpText="Needed for slab-rate STCG calculation"
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
                    <div className={styles.emiLabel}>Net Gain (After Tax)</div>
                    <div className={styles.emiValue}>{formatCurrency(result.netGain)}</div>
                  </div>
                </Card>

                <Card title="Capital Gains Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Invested Amount</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.investedAmount)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Sale Amount</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.saleAmount)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Absolute Gain</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981', fontSize: '1.5rem' }}>
                        {formatCurrency(result.absoluteGain)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Gain Type</div>
                      <div className={styles.summaryValue} style={{ 
                        color: result.isLongTerm ? '#059669' : '#ea580c' 
                      }}>
                        {result.isLongTerm ? 'LTCG' : 'STCG'}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Holding Period</div>
                      <div className={styles.summaryValue}>
                        {result.holdingMonths} months
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tax Type</div>
                      <div className={styles.summaryValue}>{result.taxType}</div>
                    </div>

                  </div>
                </Card>

                <Card title="Tax Calculation" variant="warning">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Tax Rate</div>
                      <div className={styles.summaryValue}>
                        {result.taxRate ? `${result.taxRate}%` : 'Slab Rate'}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Capital Gains Tax</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.taxAmount)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Surcharge</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.surcharge)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Cess (4%)</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.cess)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Tax</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                        {formatCurrency(result.totalTax)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Effective Tax Rate</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {result.effectiveTaxRate}%
                      </div>
                    </div>

                  </div>
                </Card>

                <Card variant="success">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#059669' }}>💰 Net Profit Summary</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#047857' }}>
                    <p>
                      <strong>Investment:</strong> ₹{formatCurrency(result.investedAmount)} 
                      ({formData.quantity} units @ ₹{formData.buyPrice})
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Sale Value:</strong> ₹{formatCurrency(result.saleAmount)} 
                      ({formData.quantity} units @ ₹{formData.sellPrice})
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Gross Gain:</strong> ₹{formatCurrency(result.absoluteGain)} 
                      ({((result.absoluteGain / result.investedAmount) * 100).toFixed(1)}% return)
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Tax ({result.taxType}):</strong> ₹{formatCurrency(result.totalTax)} 
                      ({result.effectiveTaxRate}% of gain)
                    </p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                      💡 <strong>Net Profit:</strong> ₹{formatCurrency(result.netGain)} in hand after all taxes!
                    </p>
                  </div>
                </Card>

                <InvestmentBarChart 
                  invested={result.investedAmount} 
                  returns={result.absoluteGain}
                  labels={{ invested: 'Invested', returns: 'Gross Gain' }}
                />
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>📈</div>
                  <p>Enter investment details to calculate capital gains</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>Understanding Capital Gains Tax</h2>
          <p>
            Capital gains arise when you sell an asset (stocks, property, gold, MF) at a profit. 
            Tax depends on asset type and holding period (Long-term vs Short-term).
          </p>

          <h3>Capital Gains Tax Rates (FY 2024-25)</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Asset</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>Holding</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>STCG</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>LTCG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.25rem' }}>Equity Shares / Equity MF</td>
                  <td style={{ padding: '0.25rem', textAlign: 'center' }}>12 months</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>15%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>10% ({'>'}₹1L exempt)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.25rem' }}>Debt MF / Bonds</td>
                  <td style={{ padding: '0.25rem', textAlign: 'center' }}>36 months</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>Slab</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>Slab (no benefit)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.25rem' }}>Property / Real Estate</td>
                  <td style={{ padding: '0.25rem', textAlign: 'center' }}>24 months</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>Slab</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>20% (with indexation)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.25rem' }}>Gold / Jewelry</td>
                  <td style={{ padding: '0.25rem', textAlign: 'center' }}>36 months</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>Slab</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>Slab</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Equity / Equity Mutual Funds</h3>
          <ul>
            <li><strong>STCG ({'<'}12 months):</strong> 15% flat (plus 4% cess)</li>
            <li><strong>LTCG (≥12 months):</strong> 10% on gains {'>'}₹1 lakh (₹1L exemption per year)</li>
            <li><strong>STT Required:</strong> Must be STT-paid transactions</li>
            <li><strong>Grandfathering:</strong> Cost basis as of Jan 31, 2018 for old holdings</li>
          </ul>

          <h3>Property / Real Estate</h3>
          <ul>
            <li><strong>STCG ({'<'}24 months):</strong> Taxed as per income tax slab (up to 30%)</li>
            <li><strong>LTCG (≥24 months):</strong> 20% with indexation benefit</li>
            <li><strong>Indexation:</strong> Adjusts purchase cost for inflation (CII index)</li>
            <li><strong>Exemptions:</strong> Sections 54, 54EC (reinvest in property/bonds)</li>
          </ul>

          <h3>Debt Mutual Funds (Post Apr 2023)</h3>
          <ul>
            <li><strong>No LTCG Benefit:</strong> All gains taxed as per slab rate</li>
            <li><strong>Treatment:</strong> Added to income, taxed at marginal rate</li>
            <li><strong>Impact:</strong> Debt MF lost tax advantage (was 20% with indexation)</li>
          </ul>

          <h3>Example Calculations</h3>
          
          <h4>Example 1: Equity LTCG</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Buy: 100 shares @ ₹1,000 = ₹1,00,000</li>
              <li>Sell: After 18 months @ ₹1,500 = ₹1,50,000</li>
              <li>Gain: ₹50,000</li>
              <li>Exempt: ₹50,000 (below ₹1L threshold)</li>
              <li><strong>Tax: ₹0</strong></li>
            </ul>
          </div>

          <h4>Example 2: Equity STCG</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Buy: 100 shares @ ₹1,000 = ₹1,00,000</li>
              <li>Sell: After 8 months @ ₹1,500 = ₹1,50,000</li>
              <li>Gain: ₹50,000</li>
              <li>Tax: 15% of ₹50,000 = ₹7,500</li>
              <li>Cess: 4% of ₹7,500 = ₹300</li>
              <li><strong>Total Tax: ₹7,800</strong></li>
              <li><strong>Net Gain: ₹42,200</strong></li>
            </ul>
          </div>

          <h4>Example 3: Property LTCG with Indexation</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Buy: ₹50L in 2018 (CII: 280)</li>
              <li>Sell: ₹80L in 2024 (CII: 348)</li>
              <li>Indexed Cost: ₹50L × (348/280) = ₹62.14L</li>
              <li>Indexed Gain: ₹80L - ₹62.14L = ₹17.86L</li>
              <li>Tax: 20% of ₹17.86L = ₹3.57L</li>
              <li><strong>Net Gain: ₹26.43L</strong> (vs ₹30L absolute gain)</li>
            </ul>
          </div>

          <h3>₹1 Lakh LTCG Exemption (Equity)</h3>
          <ul>
            <li>Available per financial year (Apr-Mar)</li>
            <li>Across all equity/equity MF transactions combined</li>
            <li>Example: ₹80K gain on stocks + ₹40K on equity MF = ₹1.2L total → Tax on ₹20K only</li>
            <li>Cannot be carried forward</li>
          </ul>

          <h3>Indexation Benefit</h3>
          <ul>
            <li><strong>Applies to:</strong> Property, gold, debt MF (pre-Apr 2023)</li>
            <li><strong>Formula:</strong> Indexed Cost = Purchase Cost × (Sale Year CII / Purchase Year CII)</li>
            <li><strong>Benefit:</strong> Reduces taxable gain by adjusting for inflation</li>
            <li><strong>CII:</strong> Cost Inflation Index published annually by govt</li>
          </ul>

          <h3>Capital Gains Exemptions</h3>
          <ul>
            <li><strong>Section 54:</strong> Residential property → Reinvest in another house (2 years)</li>
            <li><strong>Section 54EC:</strong> Property → Invest in REC/NHAI bonds (₹50L max)</li>
            <li><strong>Section 54F:</strong> Any asset → Buy residential property</li>
            <li><strong>Section 112A:</strong> ₹1L equity LTCG exemption</li>
          </ul>

          <h3>Grandfathering (Equity)</h3>
          <ul>
            <li>Shares bought before Jan 31, 2018 → Cost = Higher of (Purchase Price, Jan 31 2018 Price)</li>
            <li>Protects pre-2018 gains from LTCG tax</li>
            <li>Example: Bought @ ₹100 in 2015, Price on Jan 31 2018 = ₹200 → Cost basis = ₹200</li>
          </ul>

          <h3>Set-Off and Carry Forward</h3>
          <ul>
            <li><strong>STCG Loss:</strong> Can offset against STCG or LTCG</li>
            <li><strong>LTCG Loss:</strong> Can offset only against LTCG</li>
            <li><strong>Carry Forward:</strong> Up to 8 years (must file ITR on time)</li>
            <li><strong>Example:</strong> ₹50K STCG + (₹30K) LTCG loss = Tax on ₹50K only</li>
          </ul>

          <h3>Common Mistakes</h3>
          <ul>
            <li>❌ Not using ₹1L LTCG exemption (equity)</li>
            <li>❌ Selling equity just before 12 months (pays 15% vs 10%)</li>
            <li>❌ Not claiming indexation on property</li>
            <li>❌ Not filing ITR to carry forward losses</li>
            <li>❌ Ignoring Section 54 exemption (property reinvestment)</li>
          </ul>

          <h3>Pro Tips</h3>
          <ul>
            <li>Hold equity for 12+ months to get LTCG benefit (10% vs 15%)</li>
            <li>Use ₹1L LTCG exemption every year (don't accumulate)</li>
            <li>For property, always claim indexation (saves 20-40% tax)</li>
            <li>Offset gains with losses (harvest losses in March)</li>
            <li>Reinvest property gains in Section 54 bonds to save tax</li>
            <li>File ITR even if income below threshold (to carry forward losses)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}