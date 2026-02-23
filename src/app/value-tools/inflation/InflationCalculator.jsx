'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateInflation } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function InflationCalculator() {

  const [formData, setFormData] = useState({
    presentValue:         '100000',
    annualInflationRate:  '6',
    tenureYears:          '10',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const present   = parseFloat(formData.presentValue);
    const inflation = parseFloat(formData.annualInflationRate);
    const years     = parseFloat(formData.tenureYears);

    if (!present || present <= 0 || !years || years <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateInflation(present, inflation, years);
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
          <h1 className={styles.title}>Inflation Calculator</h1>
          <p className={styles.description}>
            Calculate how inflation impacts the future cost of goods and erodes purchasing power. 
            See year-by-year inflation growth.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Inflation Details">
              <div className={styles.form}>

                <Input
                  label="Present Value / Current Cost"
                  type="number"
                  name="presentValue"
                  value={formData.presentValue}
                  onChange={handleChange}
                  prefix="₹"
                  min="100"
                  step="1000"
                  helpText="Today's cost of the item/expense"
                />

                <Input
                  label="Annual Inflation Rate"
                  type="number"
                  name="annualInflationRate"
                  value={formData.annualInflationRate}
                  onChange={handleChange}
                  suffix="%"
                  step="0.1"
                  helpText="India average: 5-7%"
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
                  helpText="How far in the future"
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
                    <div className={styles.emiLabel}>Future Cost</div>
                    <div className={styles.emiValue}>{formatCurrency(result.futureEquivalent)}</div>
                  </div>
                </Card>

                <Card title="Inflation Impact">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Present Value</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.presentValue)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Future Equivalent</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626', fontSize: '1.5rem' }}>
                        {formatCurrency(result.futureEquivalent)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Inflation Rate</div>
                      <div className={styles.summaryValue}>{result.annualInflationRate}% p.a.</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Time Period</div>
                      <div className={styles.summaryValue}>{result.tenureYears} years</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Inflation</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {result.totalInflationPercent}%
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Purchasing Power Lost</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.purchasingPowerDecline)}
                      </div>
                    </div>

                  </div>
                </Card>

                <Card variant="warning">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#92400e' }}>📉 Purchasing Power Impact</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#92400e' }}>
                    <p>
                      What costs <strong>₹{formatCurrency(result.presentValue)}</strong> today will cost 
                      <strong> ₹{formatCurrency(result.futureEquivalent)}</strong> in {result.tenureYears} years.
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                      <strong>Inflation Impact:</strong> You'll need {result.totalInflationPercent}% more money 
                      to buy the same thing!
                    </p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                      💡 <strong>Lesson:</strong> Keep money in savings @ 3% while inflation is @ {result.annualInflationRate}% 
                      = Losing {(result.annualInflationRate - 3).toFixed(1)}% purchasing power every year!
                    </p>
                  </div>
                </Card>

                <Card title="Year-by-Year Inflation Growth">
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className={styles.amortTable}>
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th style={{ textAlign: 'right' }}>Equivalent Cost</th>
                          <th style={{ textAlign: 'right' }}>Increase</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearlyBreakdown.map((row) => (
                          <tr key={row.year}>
                            <td>{row.year}</td>
                            <td style={{ textAlign: 'right' }}>{formatCurrency(row.equivalentAmount)}</td>
                            <td style={{ textAlign: 'right', color: '#dc2626' }}>
                              +{formatCurrency(row.equivalentAmount - result.presentValue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <InvestmentBarChart 
                  invested={result.presentValue} 
                  returns={result.futureEquivalent - result.presentValue}
                  labels={{ invested: 'Today', returns: 'Inflation Increase' }}
                />
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>📈</div>
                  <p>Enter details to calculate inflation impact</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>Understanding Inflation</h2>
          <p>
            Inflation is the rate at which prices of goods and services increase over time. 
            It erodes the purchasing power of money — ₹100 today buys less tomorrow.
          </p>

          <h3>What is Inflation?</h3>
          <ul>
            <li><strong>Definition:</strong> Rise in general price levels over time</li>
            <li><strong>Impact:</strong> Same money buys fewer goods</li>
            <li><strong>Measurement:</strong> Consumer Price Index (CPI) in India</li>
            <li><strong>India Average:</strong> 5-7% per year (2015-2024)</li>
          </ul>

          <h3>Inflation Formula</h3>
          <p><strong>Future Value = Present Value × (1 + Inflation Rate)^Years</strong></p>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem' }}>Example: ₹1,00,000 @ 6% inflation for 10 years</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', fontFamily: 'monospace' }}>
              = ₹1,00,000 × (1.06)^10<br/>
              = ₹1,00,000 × 1.7908<br/>
              = ₹1,79,085
            </p>
          </div>

          <h3>Historical Inflation Rates (India)</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Period</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Avg Inflation</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>2020-2024</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>5.5%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>2015-2019</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>4.5%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>2010-2014</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>9.0%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>2005-2009</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>6.5%</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>2000-2004</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>4.0%</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Impact of Different Inflation Rates</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>₹1,00,000 today → Future value after 20 years:</p>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>@ 4% inflation:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹2,19,112</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>@ 6% inflation:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹3,20,714</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>@ 8% inflation:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹4,66,096</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>@ 10% inflation:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹6,72,750</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Category-wise Inflation (India)</h3>
          <ul>
            <li><strong>Food & Beverages:</strong> 5-8% (high volatility)</li>
            <li><strong>Housing:</strong> 4-6%</li>
            <li><strong>Healthcare:</strong> 6-9% (fastest growing)</li>
            <li><strong>Education:</strong> 8-12% (very high)</li>
            <li><strong>Transportation:</strong> 3-5%</li>
            <li><strong>Clothing:</strong> 3-4%</li>
            <li><strong>Electronics:</strong> Negative (deflation due to tech)</li>
          </ul>

          <h3>Real-Life Examples</h3>
          
          <h4>Example 1: Healthcare</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Hospital room: ₹5,000/day today</li>
              <li>@ 8% medical inflation for 15 years</li>
              <li>Future cost: ₹15,862/day</li>
              <li><strong>Impact:</strong> Need 3.17x more money!</li>
            </ul>
          </div>

          <h4>Example 2: Education</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>College fees: ₹5 lakh/year today</li>
              <li>@ 10% education inflation for 18 years (child's college)</li>
              <li>Future cost: ₹27.8 lakh/year</li>
              <li><strong>Impact:</strong> Start SIP now to beat inflation!</li>
            </ul>
          </div>

          <h4>Example 3: Retirement</h4>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>Monthly expenses: ₹50,000 today</li>
              <li>@ 6% inflation for 30 years (retirement)</li>
              <li>Future need: ₹2,87,175/month</li>
              <li><strong>Impact:</strong> Need ₹3.4 crore corpus @ 8% returns!</li>
            </ul>
          </div>

          <h3>How to Beat Inflation</h3>
          <ul>
            <li>✅ <strong>Equity/Mutual Funds:</strong> 12-15% returns (beats 6% inflation)</li>
            <li>✅ <strong>Real Estate:</strong> 8-10% appreciation + rental yield</li>
            <li>✅ <strong>Gold:</strong> 8-10% long-term (inflation hedge)</li>
            <li>✅ <strong>PPF/NPS:</strong> 7-8% (marginally beats inflation)</li>
            <li>❌ <strong>Savings Account:</strong> 3-4% (loses to inflation!)</li>
            <li>❌ <strong>FD:</strong> 6-7% (barely matches inflation)</li>
          </ul>

          <h3>Inflation-Adjusted Investing</h3>
          <ul>
            <li><strong>Goal Planning:</strong> Always factor 6-7% inflation in goals</li>
            <li><strong>Retirement Corpus:</strong> Use inflated expense × 25 (4% rule)</li>
            <li><strong>SIP Amount:</strong> Increase 10% yearly (step-up SIP)</li>
            <li><strong>Real Return:</strong> Nominal Return - Inflation = Real Gain</li>
          </ul>

          <h3>Purchasing Power Decline</h3>
          <ul>
            <li>@ 6% inflation: ₹1 lakh → ₹55K purchasing power in 10 years</li>
            <li>₹1 lakh loses 45% value in 10 years!</li>
            <li>Rule of 72: Money halves in 72÷6 = 12 years @ 6% inflation</li>
            <li>Your salary needs to double every 12 years to maintain same lifestyle</li>
          </ul>

          <h3>Government Inflation Control</h3>
          <ul>
            <li><strong>RBI Target:</strong> 4% (+/- 2%) inflation band</li>
            <li><strong>Tool:</strong> Repo rate adjustments</li>
            <li><strong>High Inflation:</strong> RBI increases rates → borrowing costly</li>
            <li><strong>Low Inflation:</strong> RBI cuts rates → boosts growth</li>
          </ul>

          <h3>Pro Tips</h3>
          <ul>
            <li>Never keep all money in savings (loses 3% real value yearly)</li>
            <li>Use 7% inflation for long-term financial planning</li>
            <li>Healthcare & Education: Use 10% inflation (faster than CPI)</li>
            <li>Real return matters: 12% MF - 6% inflation = 6% real gain</li>
            <li>Start investing early — time beats inflation</li>
            <li>Increase SIP by 10% yearly (matches salary + inflation)</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}