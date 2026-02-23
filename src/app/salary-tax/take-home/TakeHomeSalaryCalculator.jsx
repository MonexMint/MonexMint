'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateSalary } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DEBOUNCE_MS = 400;

const COLORS = ['#14b8a6', '#f59e0b', '#6366f1', '#ef4444'];

export default function TakeHomeSalaryCalculator() {
  const [formData, setFormData] = useState({
    ctc: '1200000',
    bonusPercent: '10',
    pfOptOut: false,
    taxRegime: 'new',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ─── Input handler ─────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ─── Pure frontend calculation ──────────────────────────────
  const compute = useCallback(() => {
    const ctc = parseFloat(formData.ctc);
    const bonusPercent = parseFloat(formData.bonusPercent) || 0;

    if (!ctc || ctc <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateSalary(ctc, bonusPercent, formData.pfOptOut, formData.taxRegime);
    setResult(data);
    setLoading(false);
  }, [formData]);

  // ─── Debounce ──────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  // ─── Chart data ────────────────────────────────────────────
  const chartData = result
    ? [
        { name: 'Take Home', value: result.annualInHand },
        { name: 'Income Tax', value: result.incomeTax },
        { name: 'EPF (Employee)', value: result.epfEmployee },
        { name: 'Gratuity', value: result.gratuity },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── HEADER ──────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Take-Home Salary Calculator</h1>
          <p className={styles.description}>
            Calculate your monthly in-hand salary from CTC with all deductions.
            Results update instantly as you type.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ───────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Salary Details">
              <div className={styles.form}>

                <Input
                  label="Annual CTC"
                  type="number"
                  name="ctc"
                  value={formData.ctc}
                  onChange={handleChange}
                  prefix="₹"
                  min="100000"
                  step="10000"
                  helpText="Your total cost to company per year"
                />

                <Input
                  label="Bonus Percentage"
                  type="number"
                  name="bonusPercent"
                  value={formData.bonusPercent}
                  onChange={handleChange}
                  suffix="%"
                  min="0"
                  max="100"
                  step="1"
                  helpText="% of CTC included as variable/bonus"
                />

                {/* Tax Regime */}
                <div className={styles.selectGroup}>
                  <label className={styles.selectLabel}>Tax Regime</label>
                  <select
                    name="taxRegime"
                    value={formData.taxRegime}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="new">New Regime (FY 2024-25)</option>
                    <option value="old">Old Regime</option>
                  </select>
                </div>

                {/* PF Opt Out */}
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="pfOptOut"
                      checked={formData.pfOptOut}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    Opt out of EPF (if eligible)
                  </label>
                </div>

                {loading && (
                  <div className={styles.loading}>Calculating…</div>
                )}
              </div>
            </Card>
          </div>

          {/* ── RIGHT RESULTS ───────────────────────────────── */}
          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result ? (
              <>
                {/* Monthly Take-Home Card */}
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Monthly Take-Home</div>
                    <div className={styles.emiValue}>
                      {formatCurrency(result.monthlyInHand)}
                    </div>
                  </div>
                </Card>

                {/* Summary Grid */}
                <Card title="Salary Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Annual CTC</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.ctc)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Monthly CTC</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.monthlyCTC)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Basic Salary</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.basicSalary / 12)}
                        <span className={styles.perMonth}>/mo</span>
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>HRA</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.hra / 12)}
                        <span className={styles.perMonth}>/mo</span>
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>EPF (Employee)</div>
                      <div className={styles.summaryValue} style={{ color: '#f59e0b' }}>
                        {formatCurrency(result.epfEmployee / 12)}
                        <span className={styles.perMonth}>/mo</span>
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Income Tax</div>
                      <div className={styles.summaryValue} style={{ color: '#ef4444' }}>
                        {formatCurrency(result.incomeTax / 12)}
                        <span className={styles.perMonth}>/mo</span>
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Deductions</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.totalDeductions / 12)}
                        <span className={styles.perMonth}>/mo</span>
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Take Home %</div>
                      <div className={styles.summaryValue} style={{ color: '#14b8a6' }}>
                        {result.takeHomePercent}%
                      </div>
                    </div>

                  </div>

                  {/* Pie Chart */}
                  <div className={styles.chartWrapper}>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={90}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Detailed Deductions */}
                <Card title="Annual Deductions Detail">
                  <div className={styles.deductionList}>

                    <div className={styles.deductionRow}>
                      <span className={styles.deductionLabel}>EPF (Employee 12%)</span>
                      <span className={styles.deductionValue}>
                        − {formatCurrency(result.epfEmployee)}
                      </span>
                    </div>

                    <div className={styles.deductionRow}>
                      <span className={styles.deductionLabel}>Professional Tax</span>
                      <span className={styles.deductionValue}>
                        − {formatCurrency(result.professionalTax)}
                      </span>
                    </div>

                    <div className={styles.deductionRow}>
                      <span className={styles.deductionLabel}>
                        Income Tax ({result.taxRegime === 'new' ? 'New' : 'Old'} Regime)
                      </span>
                      <span className={styles.deductionValue} style={{ color: '#ef4444' }}>
                        − {formatCurrency(result.incomeTax)}
                      </span>
                    </div>

                    <div className={`${styles.deductionRow} ${styles.deductionTotal}`}>
                      <span className={styles.deductionLabel}>Total Annual Deductions</span>
                      <span className={styles.deductionValue}>
                        − {formatCurrency(result.totalDeductions)}
                      </span>
                    </div>

                    <div className={`${styles.deductionRow} ${styles.deductionInHand}`}>
                      <span className={styles.deductionLabel}>Annual In-Hand Salary</span>
                      <span className={styles.deductionValue} style={{ color: '#14b8a6' }}>
                        {formatCurrency(result.annualInHand)}
                      </span>
                    </div>

                  </div>
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>💰</div>
                    <p className={styles.placeholderText}>
                      Enter your CTC to calculate take-home salary
                    </p>
                  </div>
                </Card>
              )
            )}
          </div>
        </div>

        {/* ── INFO SECTION ────────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About Take-Home Salary Calculator</h2>
          <p>
            Take-home salary (also called in-hand salary) is the net amount credited
            to your bank account after all deductions like PF, professional tax, and
            income tax are subtracted from your gross salary.
          </p>

          <h3>CTC vs Take-Home</h3>
          <p>
            CTC (Cost to Company) includes all expenses borne by the employer — basic
            salary, HRA, allowances, EPF employer contribution, and gratuity. Take-home
            salary is significantly lower due to deductions from both employee and employer side.
          </p>

          <h3>Major Deductions</h3>
          <ul>
            <li><strong>EPF:</strong> 12% of basic salary (employee contribution)</li>
            <li><strong>Professional Tax:</strong> Up to ₹2,400/year (state-wise)</li>
            <li><strong>Income Tax / TDS:</strong> As per applicable slab rate</li>
            <li><strong>Gratuity:</strong> 4.81% of basic (employer contribution, part of CTC)</li>
          </ul>

          <h3>How to Increase Take-Home</h3>
          <ul>
            <li>Choose the tax regime (new/old) that results in lower tax.</li>
            <li>Claim HRA exemption if you pay rent.</li>
            <li>Invest in 80C instruments (PPF, ELSS) under old regime.</li>
            <li>Opt out of EPF if salary is above threshold (check eligibility).</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}