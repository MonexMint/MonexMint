'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateFutureValue } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

export default function FutureValueCalculator() {

  const [formData, setFormData] = useState({
    presentValue:         '100000',
    annualReturnRate:     '12',
    tenureYears:          '10',
    annualInflationRate:  '6',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const present   = parseFloat(formData.presentValue);
    const returns   = parseFloat(formData.annualReturnRate);
    const years     = parseFloat(formData.tenureYears);
    const inflation = parseFloat(formData.annualInflationRate);

    if (!present || present <= 0 || !years || years <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateFutureValue(present, returns, years, inflation);
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

        <Breadcrumb items={BREADCRUMBS.futureValue} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Future Value Calculator</h1>
          <p className={styles.description}>
            Calculate future value of money with compound interest. See nominal and real (inflation-adjusted) growth.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Investment Details">
              <div className={styles.form}>

                <Input
                  label="Present Value"
                  type="number"
                  name="presentValue"
                  value={formData.presentValue}
                  onChange={handleChange}
                  prefix="₹"
                  min="100"
                  step="1000"
                  helpText="Amount you have today"
                />

                <Input
                  label="Annual Return Rate"
                  type="number"
                  name="annualReturnRate"
                  value={formData.annualReturnRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Expected growth rate"
                />

                <Input
                  label="Time Period"
                  type="number"
                  name="tenureYears"
                  value={formData.tenureYears}
                  onChange={handleChange}
                  suffix="years"
                  min="1"
                  max="50"
                  helpText="Investment duration"
                />

                <Input
                  label="Annual Inflation Rate"
                  type="number"
                  name="annualInflationRate"
                  value={formData.annualInflationRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="Expected inflation (for real value)"
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
                    <div className={styles.emiLabel}>Future Value (Nominal)</div>
                    <div className={styles.emiValue}>{formatCurrency(result.nominalFutureValue)}</div>
                  </div>
                </Card>

                <Card title="Growth Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Present Value</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.presentValue)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Future Value (Nominal)</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981', fontSize: '1.5rem' }}>
                        {formatCurrency(result.nominalFutureValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Nominal Gain</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.totalGainNominal)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Return Rate</div>
                      <div className={styles.summaryValue}>{result.annualReturnRate}% p.a.</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Time Period</div>
                      <div className={styles.summaryValue}>{result.tenureYears} years</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Growth Multiple</div>
                      <div className={styles.summaryValue}>
                        {(result.nominalFutureValue / result.presentValue).toFixed(2)}x
                      </div>
                    </div>

                  </div>
                </Card>

                <Card title="Real Value (Inflation-Adjusted)" variant="warning">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Inflation Rate</div>
                      <div className={styles.summaryValue}>{result.annualInflationRate}% p.a.</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Real Future Value</div>
                      <div className={styles.summaryValue} style={{ color: '#ea580c', fontSize: '1.5rem' }}>
                        {formatCurrency(result.realFutureValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Real Gain</div>
                      <div className={styles.summaryValue} style={{ color: '#ea580c' }}>
                        {formatCurrency(result.totalGainReal)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Purchasing Power</div>
                      <div className={styles.summaryValue}>
                        {((result.realFutureValue / result.presentValue) * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Inflation Loss</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.nominalFutureValue - result.realFutureValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Real Growth Multiple</div>
                      <div className={styles.summaryValue}>
                        {(result.realFutureValue / result.presentValue).toFixed(2)}x
                      </div>
                    </div>

                  </div>
                </Card>

                <Card variant="success">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#059669' }}>💰 Investment Growth Analysis</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#047857' }}>
                    <p>
                      <strong>Today:</strong> You have ₹{formatCurrency(result.presentValue)}
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>After {result.tenureYears} years @ {result.annualReturnRate}%:</strong> ₹{formatCurrency(result.nominalFutureValue)} 
                      (grew {((result.nominalFutureValue / result.presentValue) - 1) * 100 | 0}%)
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Real Value (after {result.annualInflationRate}% inflation):</strong> ₹{formatCurrency(result.realFutureValue)}
                    </p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
                      💡 You gained ₹{formatCurrency(result.totalGainNominal)} on paper, but 
                      ₹{formatCurrency(result.totalGainReal)} in actual purchasing power 
                      (inflation ate ₹{formatCurrency(result.nominalFutureValue - result.realFutureValue)})!
                    </p>
                  </div>
                </Card>

                <Card title="Year-by-Year Growth">
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className={styles.amortTable}>
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th style={{ textAlign: 'right' }}>Nominal Value</th>
                          <th style={{ textAlign: 'right' }}>Real Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearlyGrowth.slice(0, 30).map((row) => (
                          <tr key={row.year}>
                            <td>{row.year}</td>
                            <td style={{ textAlign: 'right', color: '#10b981' }}>
                              {formatCurrency(row.nominalValue)}
                            </td>
                            <td style={{ textAlign: 'right', color: '#ea580c' }}>
                              {formatCurrency(row.realValue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <InvestmentBarChart 
                  invested={result.presentValue} 
                  returns={result.nominalFutureValue}
                  labels={{ invested: 'Present Value', returns: 'Future Value' }}
                />
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>💹</div>
                  <p>Enter investment details to calculate future value</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>Understanding Future Value</h2>
          <p>
            Future Value (FV) is what an investment will be worth in the future, accounting for compound interest. 
            It helps plan goals and understand the power of compounding.
          </p>

          <h3>Future Value Formula</h3>
          <p><strong>FV = PV × (1 + r)^n</strong></p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Where: PV = Present Value, r = Annual return rate, n = Number of years
          </p>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem' }}><strong>Example:</strong></p>
            <ul style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <li>PV = ₹1,00,000</li>
              <li>Return = 12% per year</li>
              <li>Time = 10 years</li>
              <li>FV = ₹1,00,000 × (1.12)^10 = ₹1,00,000 × 3.1058 = <strong>₹3,10,585</strong></li>
            </ul>
          </div>

          <h3>Nominal vs Real Future Value</h3>
          <ul>
            <li><strong>Nominal FV:</strong> Growth without inflation adjustment</li>
            <li><strong>Real FV:</strong> Growth adjusted for inflation (purchasing power)</li>
            <li><strong>Formula:</strong> Real FV = Nominal FV / (1 + inflation)^n</li>
            <li><strong>Example:</strong> ₹3.1L nominal → ₹1.73L real (@ 6% inflation, 10 years)</li>
          </ul>

          <h3>Power of Compounding</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>₹1 lakh invested @ 12% return:</p>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>5 years:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹1.76L (1.76x)</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>10 years:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹3.11L (3.11x)</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>15 years:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹5.47L (5.47x)</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>20 years:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹9.65L (9.65x)</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>30 years:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹29.96L (29.96x)</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Rule of 72</h3>
          <ul>
            <li><strong>Formula:</strong> Years to double = 72 ÷ Return Rate</li>
            <li><strong>Example:</strong> @ 12% return → 72÷12 = 6 years to double</li>
            <li><strong>Applications:</strong>
              <ul style={{ marginTop: '0.5rem' }}>
                <li>8% return → Doubles in 9 years</li>
                <li>10% return → Doubles in 7.2 years</li>
                <li>15% return → Doubles in 4.8 years</li>
              </ul>
            </li>
          </ul>

          <h3>Different Return Rates</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>₹10 lakh → 20 years growth:</p>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>@ 6% (FD):</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹32.1L</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>@ 8% (PPF):</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹46.6L</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>@ 10% (Balanced MF):</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹67.3L</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>@ 12% (Equity MF):</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹96.5L</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>@ 15% (High-risk):</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹163.7L</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Application: Goal Planning</h3>
          
          <h4>Example 1: Child's Education</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Goal: ₹50 lakh in 15 years</li>
              <li>Current savings: ₹10 lakh</li>
              <li>@ 12% equity MF: ₹10L grows to ₹54.7L ✓</li>
              <li><strong>Result:</strong> Goal achieved without additional SIP!</li>
            </ul>
          </div>

          <h4>Example 2: Retirement Corpus</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Goal: ₹2 crore in 30 years</li>
              <li>Current savings: ₹10 lakh</li>
              <li>@ 12% equity: ₹10L grows to ₹3 crore ✓</li>
              <li>@ 8% balanced: ₹10L grows to ₹1 crore ❌ (need more SIP)</li>
            </ul>
          </div>

          <h3>Present Value (Reverse Calculation)</h3>
          <p><strong>PV = FV / (1 + r)^n</strong></p>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem' }}><strong>Question:</strong> Need ₹50L in 10 years, how much to invest today?</p>
            <ul style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <li>@ 12% return: PV = ₹50L / (1.12)^10 = <strong>₹16.1L</strong></li>
              <li>@ 8% return: PV = ₹50L / (1.08)^10 = <strong>₹23.2L</strong></li>
            </ul>
          </div>

          <h3>Inflation Impact on Future Value</h3>
          <ul>
            <li>Nominal FV shows money value</li>
            <li>Real FV shows purchasing power</li>
            <li>Always plan with real FV for accuracy</li>
            <li>Example: ₹1 crore in 30 years = ₹17L purchasing power today (@ 6% inflation)</li>
          </ul>

          <h3>Time vs Return Rate</h3>
          <ul>
            <li><strong>Time matters more:</strong> 30 years @ 10% beats 10 years @ 20%</li>
            <li><strong>Start early:</strong> 5 years extra = 1.5x more wealth</li>
            <li><strong>Consistency:</strong> 12% for 30 years {'>'} 20% for 5 years</li>
          </ul>

          <h3>Common Mistakes</h3>
          <ul>
            <li>❌ Not adjusting for inflation in goals</li>
            <li>❌ Overestimating returns (be conservative)</li>
            <li>❌ Delaying investments (time is powerful)</li>
            <li>❌ Ignoring real FV (only looking at nominal)</li>
            <li>❌ Not accounting for taxes on returns</li>
          </ul>

          <h3>Pro Tips</h3>
          <ul>
            <li>Start investing early — time is your biggest ally</li>
            <li>Use conservative return estimates (10-12% for equity)</li>
            <li>Always check real FV (inflation-adjusted)</li>
            <li>Diversify across assets for stable returns</li>
            <li>Review and rebalance every year</li>
            <li>For 20+ year goals, equity gives best FV</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}