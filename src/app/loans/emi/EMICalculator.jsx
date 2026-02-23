
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoanPieChart from '@/components/charts/LoanPieChart';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { calculateEMI } from '@/lib/calculators';
import { formatCurrency, formatTenure } from '@/lib/constants';

import styles from './emi-page.module.css';

const DEBOUNCE_MS = 300;

export default function EMICalculator() {
  const [formData, setFormData] = useState({
    loanAmount:     '1000000',
    rateOfInterest: '8.5',
    tenureMonths:   '240',
  });

  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [amortView, setAmortView] = useState('yearly');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const principal    = parseFloat(formData.loanAmount);
    const annualRate   = parseFloat(formData.rateOfInterest);
    const tenureMonths = parseInt(formData.tenureMonths, 10);

    if (!principal || principal < 1000 || !annualRate || annualRate <= 0 || !tenureMonths || tenureMonths < 1) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateEMI(principal, annualRate, tenureMonths);
    setResult(data);
    setLoading(false);
  }, [formData.loanAmount, formData.rateOfInterest, formData.tenureMonths]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const getYearlySchedule = (schedule) => {
    if (!schedule || schedule.length === 0) return [];
    const years = [];
    let yearData = { year: 1, emiPaid: 0, principalPaid: 0, interestPaid: 0, balance: 0 };

    schedule.forEach((month, idx) => {
      yearData.emiPaid       += month.emi;
      yearData.principalPaid += month.principal;
      yearData.interestPaid  += month.interest;
      yearData.balance        = month.balance;

      if ((idx + 1) % 12 === 0 || idx === schedule.length - 1) {
        years.push({ ...yearData });
        yearData = { year: yearData.year + 1, emiPaid: 0, principalPaid: 0, interestPaid: 0, balance: 0 };
      }
    });
    return years;
  };

  const tenureYears     = Math.floor(Number(formData.tenureMonths) / 12);
  const tenureMonthsRem = Number(formData.tenureMonths) % 12;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── BREADCRUMB ──────────────────────────────────── */}
        <Breadcrumb items={[
          { label: 'Calculators', href: '/calculators' },
          { label: 'EMI Calculator' },
        ]} />

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>EMI Calculator</h1>
          <p className={styles.description}>
            Calculate your Equated Monthly Installment (EMI) for any loan.
            Results update instantly as you type.
          </p>
        </div>

        <div className={styles.content}>

          {/* ── LEFT FORM ──────────────────────────────────── */}
          <div className={styles.formSection}>
            <Card title="Loan Details">
              <div className={styles.form}>
                <Input
                  label="Loan Amount"
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  prefix="₹"
                  min="1000"
                  step="1000"
                  helpText="Principal loan amount"
                />
                <Input
                  label="Interest Rate (per annum)"
                  type="number"
                  name="rateOfInterest"
                  value={formData.rateOfInterest}
                  onChange={handleChange}
                  suffix="%"
                  min="0.1"
                  max="50"
                  step="0.1"
                  helpText="Annual interest rate"
                />
                <Input
                  label="Loan Tenure (months)"
                  type="number"
                  name="tenureMonths"
                  value={formData.tenureMonths}
                  onChange={handleChange}
                  suffix="months"
                  min="1"
                  max="360"
                  step="1"
                  helpText={
                    tenureYears > 0
                      ? `= ${tenureYears} year${tenureYears !== 1 ? 's' : ''} ${tenureMonthsRem > 0 ? `${tenureMonthsRem} month${tenureMonthsRem !== 1 ? 's' : ''}` : ''}`
                      : ''
                  }
                />
                {loading && <div className={styles.loading}>Calculating…</div>}
              </div>
            </Card>
          </div>

          {/* ── RIGHT RESULTS ──────────────────────────────── */}
          <div className={styles.resultsSection}>
            {result ? (
              <>
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Monthly EMI</div>
                    <div className={styles.emiValue}>{formatCurrency(result.emi)}</div>
                  </div>
                </Card>

                <Card title="Loan Summary">
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Principal Amount</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.principal)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Interest</div>
                      <div className={`${styles.summaryValue} ${styles.colorWarning}`}>{formatCurrency(result.totalInterest)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Payable</div>
                      <div className={`${styles.summaryValue} ${styles.colorPurple}`}>{formatCurrency(result.totalPayable)}</div>
                    </div>
                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Loan Tenure</div>
                      <div className={styles.summaryValue}>{formatTenure(result.tenureMonths)}</div>
                    </div>
                  </div>

                  <LoanPieChart principal={result.principal} interest={result.totalInterest} />
                </Card>
              </>
            ) : (
              !loading && (
                <Card>
                  <div className={styles.placeholder}>
                    <div className={styles.placeholderIcon}>📊</div>
                    <p className={styles.placeholderText}>Enter loan details to see your EMI</p>
                  </div>
                </Card>
              )
            )}
          </div>
        </div>

        {/* ── AMORTIZATION TABLE ─────────────────────────── */}
        {result && result.schedule && result.schedule.length > 0 && (
          <Card title="Amortization Schedule" className={styles.amortCard}>
            <div className={styles.toggleGroup}>
              <Button variant={amortView === 'yearly'  ? 'primary' : 'secondary'} size="sm" onClick={() => setAmortView('yearly')}>Yearly</Button>
              <Button variant={amortView === 'monthly' ? 'primary' : 'secondary'} size="sm" onClick={() => setAmortView('monthly')}>Monthly</Button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.amortTable}>
                <thead>
                  <tr>
                    <th>{amortView === 'yearly' ? 'Year' : 'Month'}</th>
                    <th>EMI Paid</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortView === 'yearly'
                    ? getYearlySchedule(result.schedule).map(row => (
                        <tr key={row.year}>
                          <td>{row.year}</td>
                          <td>{formatCurrency(row.emiPaid)}</td>
                          <td>{formatCurrency(row.principalPaid)}</td>
                          <td>{formatCurrency(row.interestPaid)}</td>
                          <td>{formatCurrency(row.balance)}</td>
                        </tr>
                      ))
                    : result.schedule.map(row => (
                        <tr key={row.month}>
                          <td>{row.month}</td>
                          <td>{formatCurrency(row.emi)}</td>
                          <td>{formatCurrency(row.principal)}</td>
                          <td>{formatCurrency(row.interest)}</td>
                          <td>{formatCurrency(row.balance)}</td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ── INFO CARD ──────────────────────────────────── */}
        <Card className={styles.infoCard}>
          <h2>About EMI Calculator</h2>
          <p>
            An EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower
            to a lender each month. EMIs pay off both interest and principal so that after a
            set number of years, the loan is fully repaid.
          </p>
          <h3>EMI Formula</h3>
          <p><strong>EMI = [P × R × (1+R)^N] / [(1+R)^N − 1]</strong></p>
          <ul>
            <li><strong>P</strong> — Principal loan amount</li>
            <li><strong>R</strong> — Monthly interest rate (Annual ÷ 12 ÷ 100)</li>
            <li><strong>N</strong> — Loan tenure in months</li>
          </ul>
          <h3>How to Use</h3>
          <ul>
            <li>Enter loan amount, interest rate, and tenure.</li>
            <li>Results update instantly as you type.</li>
            <li>Toggle between yearly and monthly amortization view.</li>
          </ul>
          <h3>Tips to Reduce EMI</h3>
          <ul>
            <li>Negotiate a lower interest rate or do a balance transfer.</li>
            <li>Increase your down payment.</li>
            <li>Make prepayments to reduce principal.</li>
            <li>Extend tenure (lowers EMI but increases total interest).</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}