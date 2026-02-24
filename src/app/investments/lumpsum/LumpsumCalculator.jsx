'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateLumpsum } from '@/lib/calculators';
import { formatCurrency, formatShortCurrency } from '@/lib/constants';
import styles from './page.module.css';


// ── Inline Pie Chart (no external dependency beyond recharts) ──────────────
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;



function InvestmentPieChart({ invested, returns }) {
  const data = [
    { name: 'Invested Amount', value: invested, color: '#3b82f6' },
    { name: 'Est. Returns',    value: returns,   color: '#10b981' },
  ];
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltipBox}>
          <p className={styles.tooltipLabel}>{payload[0].name}</p>
          <p className={styles.tooltipValue}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(1)}%`
            }
            outerRadius={95}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-lumpsum-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Inline Bar Chart for Year-wise Growth ────────────────────────────────
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer as RC2,
} from 'recharts';

function GrowthBarChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltipBox}>
          <p className={styles.tooltipYear}>Year {label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, margin: '0.2rem 0', fontWeight: 700 }}>
              {p.name}: {formatCurrency(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <div className={styles.chartContainer}>
      <RC2 width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => formatShortCurrency(v)}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <RechartsLegend />
          <Bar dataKey="investedAmount" name="Invested" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="totalValue"     name="Total Value" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </RC2>
    </div>
  );
}

export default function LumpsumCalculator() {
  const [formData, setFormData] = useState({
    principal:        '100000',
    annualReturnRate: '12',
    tenureYears:      '10',
  });

  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [chartView, setChartView] = useState('pie'); // 'pie' | 'bar'
  const [tableView, setTableView] = useState('yearly');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const principal        = parseFloat(formData.principal);
    const annualReturnRate = parseFloat(formData.annualReturnRate);
    const tenureYears      = parseInt(formData.tenureYears, 10);

    if (
      !principal        || principal        <= 0 ||
      !annualReturnRate || annualReturnRate <= 0  ||
      !tenureYears      || tenureYears      < 1
    ) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateLumpsum(principal, annualReturnRate, tenureYears);

    // Build year-wise growth table
    const yearWise = [];
    for (let y = 1; y <= tenureYears; y++) {
      const totalValue = principal * Math.pow(1 + annualReturnRate / 100, y);
      yearWise.push({
        year: y,
        investedAmount: principal,
        totalValue: Math.round(totalValue),
        returns: Math.round(totalValue - principal),
        growthPercent: Math.round(((totalValue - principal) / principal) * 100 * 100) / 100,
      });
    }

    setResult({ ...data, yearWise });
    setLoading(false);
  }, [formData.principal, formData.annualReturnRate, formData.tenureYears]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  // Quick tenure presets
  const TENURE_PRESETS = [1, 3, 5, 7, 10, 15, 20, 25, 30];

  // Quick return rate presets
  const RETURN_PRESETS = [
    { label: 'FD (7%)',      value: '7' },
    { label: 'Debt MF (9%)', value: '9' },
    { label: 'Index (12%)',  value: '12' },
    { label: 'Equity (15%)', value: '15' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <Breadcrumb items={BREADCRUMBS.lumpsum} />

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Lumpsum Calculator</h1>
          <p className={styles.description}>
            Calculate the future value of a one-time investment. See how your
            money grows over time with the power of compounding.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Investment Details">
              <div className={styles.form}>

                <Input
                  label="Investment Amount"
                  type="number"
                  name="principal"
                  value={formData.principal}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                  helpText="One-time lump sum investment"
                />

                <div className={styles.fieldGroup}>
                  <Input
                    label="Expected Annual Return"
                    type="number"
                    name="annualReturnRate"
                    value={formData.annualReturnRate}
                    onChange={handleChange}
                    suffix="%"
                    min="0.1"
                    max="100"
                    step="0.5"
                    helpText="Expected rate of return per year"
                  />
                  <div className={styles.presetRow}>
                    {RETURN_PRESETS.map((p) => (
                      <button
                        key={p.value}
                        className={`${styles.presetBtn} ${formData.annualReturnRate === p.value ? styles.presetBtnActive : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, annualReturnRate: p.value }))}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <Input
                    label="Investment Period"
                    type="number"
                    name="tenureYears"
                    value={formData.tenureYears}
                    onChange={handleChange}
                    suffix="years"
                    min="1"
                    max="50"
                    step="1"
                    helpText="How long you will stay invested"
                  />
                  <div className={styles.presetRow}>
                    {TENURE_PRESETS.map((yr) => (
                      <button
                        key={yr}
                        className={`${styles.presetBtn} ${Number(formData.tenureYears) === yr ? styles.presetBtnActive : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, tenureYears: String(yr) }))}
                      >
                        {yr}Y
                      </button>
                    ))}
                  </div>
                </div>

                {loading && (
                  <div className={styles.loading}>Calculating…</div>
                )}

              </div>
            </Card>

            {/* Rule of 72 Widget */}
            {formData.annualReturnRate && parseFloat(formData.annualReturnRate) > 0 && (
              <Card className={styles.ruleCard}>
                <div className={styles.ruleOf72}>
                  <div className={styles.ruleIcon}>⚡</div>
                  <div>
                    <div className={styles.ruleTitle}>Rule of 72</div>
                    <div className={styles.ruleValue}>
                      Your money doubles every{' '}
                      <strong>
                        {(72 / parseFloat(formData.annualReturnRate)).toFixed(1)} years
                      </strong>{' '}
                      at {formData.annualReturnRate}% return
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* ── RIGHT RESULTS ──────────────────────────────── */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {/* Maturity Value Hero */}
                <Card variant="gradient" className={styles.maturityCard}>
                  <div className={styles.maturityHero}>
                    <div className={styles.maturityLabel}>Maturity Value</div>
                    <div className={styles.maturityValue}>
                      {formatCurrency(result.maturityValue)}
                    </div>
                    <div className={styles.maturityMeta}>
                      {formatShortCurrency(result.maturityValue)} after {formData.tenureYears} years
                    </div>
                  </div>
                </Card>

                {/* Summary Stats */}
                <Card title="Investment Summary">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Invested Amount</div>
                      <div className={styles.summaryValue} style={{ color: '#3b82f6' }}>
                        {formatCurrency(result.totalInvested)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Est. Returns</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.totalReturns)}
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Absolute Return</div>
                      <div className={styles.summaryValue} style={{ color: '#8b5cf6' }}>
                        {result.absoluteReturn}%
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Wealth Ratio</div>
                      <div className={styles.summaryValue} style={{ color: '#f59e0b' }}>
                        {result.wealthRatio}×
                      </div>
                    </div>
                  </div>

                  {/* Chart Toggle */}
                  <div className={styles.chartToggle}>
                    <button
                      className={`${styles.toggleBtn} ${chartView === 'pie' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setChartView('pie')}
                    >
                      Pie Chart
                    </button>
                    <button
                      className={`${styles.toggleBtn} ${chartView === 'bar' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setChartView('bar')}
                    >
                      Growth Chart
                    </button>
                  </div>

                  {chartView === 'pie' ? (
                    <InvestmentPieChart
                      invested={result.totalInvested}
                      returns={result.totalReturns}
                    />
                  ) : (
                    <GrowthBarChart
                      data={result.yearWise.filter((_, i) => {
                        const total = result.yearWise.length;
                        if (total <= 10) return true;
                        if (total <= 20) return i % 2 === 0;
                        return i % 5 === 4 || i === 0;
                      })}
                    />
                  )}
                </Card>

                {/* Inflation-adjusted insight */}
                {(() => {
                  const inflationRate = 6; // avg Indian inflation
                  const realValue = result.maturityValue / Math.pow(1 + inflationRate / 100, Number(formData.tenureYears));
                  return (
                    <Card className={styles.inflationCard}>
                      <div className={styles.inflationContent}>
                        <div className={styles.inflationIcon}>📉</div>
                        <div>
                          <div className={styles.inflationTitle}>
                            Inflation-Adjusted Value (at 6% avg inflation)
                          </div>
                          <div className={styles.inflationValue}>
                            {formatCurrency(Math.round(realValue))}
                          </div>
                          <div className={styles.inflationNote}>
                            In today's purchasing power, your maturity value is worth approximately {formatCurrency(Math.round(realValue))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })()}

                {/* Year-wise Growth Table */}
                <Card title="Year-wise Growth Breakdown">
                  <div className={styles.tableWrapper}>
                    <table className={styles.growthTable}>
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th>Invested</th>
                          <th>Total Value</th>
                          <th>Returns</th>
                          <th>Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearWise.map((row) => (
                          <tr key={row.year} className={Number(formData.tenureYears) === row.year ? styles.lastRow : ''}>
                            <td>{row.year}</td>
                            <td>{formatCurrency(row.investedAmount)}</td>
                            <td className={styles.valueCell}>{formatCurrency(row.totalValue)}</td>
                            <td className={styles.returnsCell}>{formatCurrency(row.returns)}</td>
                            <td className={styles.growthCell}>{row.growthPercent}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>📈</div>
                    <p className={styles.placeholderText}>
                      Enter investment details to see your wealth growth
                    </p>
                  </div>
                </Card>
              )
            )}

          </div>
        </div>

        {/* ── INFO SECTION ───────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About Lumpsum Calculator</h2>
          <p>
            A lumpsum investment is a one-time investment of a large amount of money, as opposed to
            periodic investments like SIPs. This calculator shows you how your single investment
            grows over time through the power of compounding.
          </p>

          <h3>Lumpsum Formula</h3>
          <p>
            <strong>FV = P × (1 + r)^n</strong>
          </p>
          <ul>
            <li><strong>FV</strong> — Future Value (maturity amount)</li>
            <li><strong>P</strong> — Principal (your one-time investment)</li>
            <li><strong>r</strong> — Annual rate of return (as a decimal)</li>
            <li><strong>n</strong> — Number of years invested</li>
          </ul>

          <h3>Lumpsum vs SIP — When to Choose What?</h3>
          <ul>
            <li><strong>Lumpsum:</strong> Ideal when you have a large amount ready (bonus, inheritance, maturity proceeds) and markets are at a reasonable level.</li>
            <li><strong>SIP:</strong> Better for monthly surplus income; averages out market volatility via rupee cost averaging.</li>
            <li><strong>Hybrid:</strong> Lumpsum for an immediate corpus + SIP for ongoing monthly surplus — often the best strategy.</li>
          </ul>

          <h3>Power of Compounding</h3>
          <ul>
            <li>At 12% returns, ₹1 lakh becomes ₹3.1 lakh in 10 years and ₹9.6 lakh in 20 years.</li>
            <li>The longer you stay invested, the more dramatic the compounding effect.</li>
            <li>Use the Rule of 72: divide 72 by the return rate to find the doubling period.</li>
          </ul>

          <h3>Things to Keep in Mind</h3>
          <ul>
            <li>Past mutual fund returns are not guaranteed for the future.</li>
            <li>Equity investments carry market risk; consider your risk tolerance.</li>
            <li>Factor in inflation — a 12% nominal return may be 6% in real terms.</li>
            <li>Keep aside an emergency fund before making lumpsum investments.</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}