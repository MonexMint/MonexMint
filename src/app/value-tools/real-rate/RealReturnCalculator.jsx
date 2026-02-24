'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateRealRateOfReturn } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

export default function RealReturnCalculator() {

  const [formData, setFormData] = useState({
    nominalReturnRate: '12',
    inflationRate:     '6',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const nominal   = parseFloat(formData.nominalReturnRate);
    const inflation = parseFloat(formData.inflationRate);

    if (nominal === undefined || inflation === undefined) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateRealRateOfReturn(nominal, inflation);
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

        <Breadcrumb items={BREADCRUMBS.realRate} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Real Return Calculator</h1>
          <p className={styles.description}>
            Calculate real rate of return adjusted for inflation using Fisher Equation. 
            See your actual purchasing power gains from investments.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Return Details">
              <div className={styles.form}>

                <Input
                  label="Nominal Return Rate"
                  type="number"
                  name="nominalReturnRate"
                  value={formData.nominalReturnRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Stated/advertised return rate"
                />

                <Input
                  label="Inflation Rate"
                  type="number"
                  name="inflationRate"
                  value={formData.inflationRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Expected annual inflation (India: 6%)"
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
                    <div className={styles.emiLabel}>Real Rate of Return</div>
                    <div className={styles.emiValue} style={{ color: result.isPositive ? '#10b981' : '#dc2626' }}>
                      {result.realRate > 0 ? '+' : ''}{result.realRate}%
                    </div>
                  </div>
                </Card>

                <Card title="Nominal vs Real Return">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Nominal Return</div>
                      <div className={styles.summaryValue}>{result.nominalReturnRate}%</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Inflation Rate</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        -{result.inflationRate}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Real Return (Fisher)</div>
                      <div className={styles.summaryValue} style={{ 
                        color: result.isPositive ? '#10b981' : '#dc2626',
                        fontSize: '1.5rem' 
                      }}>
                        {result.realRate}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Simple Approximation</div>
                      <div className={styles.summaryValue}>
                        {result.simpleApproximation}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Status</div>
                      <div className={styles.summaryValue} style={{ 
                        color: result.isPositive ? '#059669' : '#dc2626' 
                      }}>
                        {result.isPositive ? '✅ Beating Inflation' : '❌ Losing to Inflation'}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Formula Used</div>
                      <div className={styles.summaryValue} style={{ fontSize: '0.75rem' }}>
                        Fisher Equation
                      </div>
                    </div>

                  </div>
                </Card>

                <Card variant={result.isPositive ? 'success' : 'danger'}>
                  <h3 style={{ margin: '0 0 1rem 0', color: result.isPositive ? '#059669' : '#b91c1c' }}>
                    {result.isPositive ? '✅ Your Investment is Growing' : '⚠️ Warning: Losing Purchasing Power'}
                  </h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: result.isPositive ? '#047857' : '#991b1b' }}>
                    <p>
                      <strong>Nominal Return:</strong> {result.nominalReturnRate}% (what you see on paper)
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Inflation:</strong> {result.inflationRate}% (erodes purchasing power)
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Real Return:</strong> {result.realRate}% (actual wealth gain)
                    </p>
                    {result.isPositive ? (
                      <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                        💡 Your investment is beating inflation by {result.realRate}%. 
                        Your purchasing power is actually growing!
                      </p>
                    ) : (
                      <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '0.5rem' }}>
                        ⚠️ {result.note || 'Your returns are not keeping pace with inflation. Consider higher-return investments.'}
                      </p>
                    )}
                  </div>
                </Card>

                <Card title="Real Return Formula">
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#64748b' }}>
                    <p><strong>Fisher Equation:</strong></p>
                    <p style={{ marginTop: '0.5rem', fontFamily: 'monospace', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
                      Real Rate = [(1 + Nominal Rate) / (1 + Inflation Rate)] - 1
                    </p>
                    <p style={{ marginTop: '1rem' }}><strong>Your Calculation:</strong></p>
                    <p style={{ marginTop: '0.5rem', fontFamily: 'monospace', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
                      = [(1 + {(result.nominalReturnRate / 100).toFixed(2)}) / (1 + {(result.inflationRate / 100).toFixed(2)})] - 1<br/>
                      = [{(1 + result.nominalReturnRate / 100).toFixed(4)} / {(1 + result.inflationRate / 100).toFixed(4)}] - 1<br/>
                      = {((1 + result.nominalReturnRate / 100) / (1 + result.inflationRate / 100)).toFixed(4)} - 1<br/>
                      = <strong>{(result.realRate / 100).toFixed(4)} or {result.realRate}%</strong>
                    </p>
                    <p style={{ marginTop: '1rem', fontSize: '0.75rem' }}>
                      <strong>Note:</strong> Simple approximation (Nominal - Inflation = {result.simpleApproximation}%) 
                      is close but Fisher equation is more accurate.
                    </p>
                  </div>
                </Card>

                <InvestmentBarChart 
                  invested={result.nominalReturnRate} 
                  returns={Math.abs(result.realRate)}
                  labels={{ 
                    invested: 'Nominal Return', 
                    returns: result.isPositive ? 'Real Return' : 'Purchasing Power Loss' 
                  }}
                />
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>📊</div>
                  <p>Enter returns to calculate real rate</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>Understanding Real Rate of Return</h2>
          <p>
            Real rate of return is the actual gain in purchasing power after adjusting for inflation. 
            It shows whether your investment is truly growing your wealth or just keeping pace with rising prices.
          </p>

          <h3>Why Real Return Matters</h3>
          <ul>
            <li><strong>True Wealth:</strong> Shows actual increase in purchasing power</li>
            <li><strong>Inflation Impact:</strong> Accounts for erosion due to rising prices</li>
            <li><strong>Better Comparison:</strong> Compare investments across time periods</li>
            <li><strong>Goal Planning:</strong> Essential for retirement and long-term goals</li>
          </ul>

          <h3>Fisher Equation</h3>
          <p><strong>Real Rate = [(1 + Nominal Rate) / (1 + Inflation Rate)] - 1</strong></p>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem' }}><strong>Example:</strong></p>
            <ul style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <li>Nominal Return: 12%</li>
              <li>Inflation: 6%</li>
              <li>Real Rate = [(1.12) / (1.06)] - 1 = 1.0566 - 1 = 0.0566 = <strong>5.66%</strong></li>
            </ul>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Simple approximation: 12% - 6% = 6% (close, but less accurate)
            </p>
          </div>

          <h3>Real Returns of Common Investments (India)</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Investment</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Nominal</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Real (@ 6% inflation)</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.25rem' }}>Equity MF</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>12%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right', color: '#059669' }}>+5.66%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'center' }}>✅</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.25rem' }}>Real Estate</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>8%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right', color: '#059669' }}>+1.89%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'center' }}>✅</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.25rem' }}>PPF</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>7.1%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right', color: '#059669' }}>+1.04%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'center' }}>✅</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.25rem' }}>FD</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>6.5%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right', color: '#059669' }}>+0.47%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'center' }}>⚠️</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.25rem' }}>Savings Account</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>3%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right', color: '#dc2626' }}>-2.83%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'center' }}>❌</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.25rem' }}>Gold</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>9%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right', color: '#059669' }}>+2.83%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'center' }}>✅</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Example Scenarios</h3>
          
          <h4>Scenario 1: Winning (Equity MF)</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Investment: ₹10 lakh</li>
              <li>Nominal Return: 12% → ₹11.2 lakh</li>
              <li>Inflation: 6%</li>
              <li>Real Return: 5.66%</li>
              <li><strong>Result:</strong> Purchasing power increased by ₹56,600!</li>
            </ul>
          </div>

          <h4>Scenario 2: Barely Winning (FD)</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Investment: ₹10 lakh</li>
              <li>Nominal Return: 6.5% → ₹10.65 lakh</li>
              <li>Inflation: 6%</li>
              <li>Real Return: 0.47%</li>
              <li><strong>Result:</strong> Barely beating inflation. Only ₹4,700 real gain!</li>
            </ul>
          </div>

          <h4>Scenario 3: Losing (Savings)</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Investment: ₹10 lakh</li>
              <li>Nominal Return: 3% → ₹10.3 lakh</li>
              <li>Inflation: 6%</li>
              <li>Real Return: -2.83%</li>
              <li><strong>Result:</strong> Lost ₹28,300 in purchasing power despite "gaining" ₹30K!</li>
            </ul>
          </div>

          <h3>Impact Over Time</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>₹10 lakh invested for 20 years:</p>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Investment</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Nominal Value</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Real Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.25rem' }}>Equity @ 12%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>₹96.5L</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right', color: '#059669' }}>₹30.1L</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.25rem' }}>FD @ 6.5%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>₹35.2L</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right', color: '#ea580c' }}>₹11.0L</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.25rem' }}>Savings @ 3%</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right' }}>₹18.1L</td>
                  <td style={{ padding: '0.25rem', textAlign: 'right', color: '#dc2626' }}>₹5.6L</td>
                </tr>
              </tbody>
            </table>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#64748b' }}>
              *Real value = Nominal value adjusted for 6% inflation
            </p>
          </div>

          <h3>Negative Real Returns</h3>
          <ul>
            <li><strong>Meaning:</strong> Investment is losing purchasing power</li>
            <li><strong>Example:</strong> 3% savings vs 6% inflation = -2.83% real loss</li>
            <li><strong>Impact:</strong> Your money "grows" but buys less</li>
            <li><strong>Solution:</strong> Move to higher-return investments</li>
          </ul>

          <h3>Applications of Real Return</h3>
          <ul>
            <li><strong>Retirement Planning:</strong> Need 8%+ real return to grow corpus</li>
            <li><strong>Goal Setting:</strong> Always use real return, not nominal</li>
            <li><strong>Investment Comparison:</strong> Compare real returns, not nominal</li>
            <li><strong>Wealth Building:</strong> Target 5-7% real return minimum</li>
          </ul>

          <h3>Historical Real Returns (20 Year Average)</h3>
          <ul>
            <li><strong>Equity:</strong> 5-7% real return</li>
            <li><strong>Real Estate:</strong> 2-3% real return</li>
            <li><strong>Gold:</strong> 2-4% real return</li>
            <li><strong>PPF:</strong> 1-2% real return</li>
            <li><strong>FD:</strong> 0-1% real return</li>
            <li><strong>Savings:</strong> Negative real return</li>
          </ul>

          <h3>Common Mistakes</h3>
          <ul>
            <li>❌ Ignoring inflation while planning goals</li>
            <li>❌ Comparing nominal returns across different time periods</li>
            <li>❌ Keeping too much in savings (negative real return)</li>
            <li>❌ Using simple subtraction (12% - 6% = 6%) instead of Fisher equation</li>
            <li>❌ Celebrating nominal gains without checking real gains</li>
          </ul>

          <h3>Pro Tips</h3>
          <ul>
            <li>Target minimum 5% real return for long-term wealth building</li>
            <li>Equity is the only asset class with consistent 5-7% real returns</li>
            <li>Use 6-7% inflation for planning (India average)</li>
            <li>Real return matters more than nominal return</li>
            <li>If real return is negative, switch investment</li>
            <li>For retirement, aim for 8% nominal (≈2% real after inflation)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}