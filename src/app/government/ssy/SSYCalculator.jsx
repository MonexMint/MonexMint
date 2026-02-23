'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import InvestmentBarChart from '@/components/charts/InvestmentBarChart';
import AdSlot from '@/components/ads/AdSlot';
import { calculateSSY } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';

const DEBOUNCE_MS = 300;

export default function SSYCalculator() {

  const [formData, setFormData] = useState({
    yearlyDeposit:   '150000',
    girlCurrentAge:  '5',
    annualRate:      '8.2',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const yearly = parseFloat(formData.yearlyDeposit);
    const age    = parseInt(formData.girlCurrentAge);
    const rate   = parseFloat(formData.annualRate);

    if (!yearly || yearly < 250 || yearly > 150000) {
      setResult({ error: 'Deposit must be between ₹250 and ₹1,50,000 per year.' });
      return;
    }

    if (age > 10) {
      setResult({ error: 'Account can only be opened for girls below age 10.' });
      return;
    }

    setLoading(true);
    const data = calculateSSY(yearly, age, rate);
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
          <h1 className={styles.title}>SSY Calculator</h1>
          <p className={styles.description}>
            Calculate Sukanya Samriddhi Yojana maturity for girl child. 8.2% interest, 
            21-year maturity with EEE tax benefits. Best savings scheme for daughters.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="SSY Investment Details">
              <div className={styles.form}>

                <Input
                  label="Yearly Deposit"
                  type="number"
                  name="yearlyDeposit"
                  value={formData.yearlyDeposit}
                  onChange={handleChange}
                  prefix="₹"
                  min="250"
                  max="150000"
                  step="500"
                  helpText="Min: ₹250, Max: ₹1,50,000 per year"
                />

                <Input
                  label="Girl's Current Age"
                  type="number"
                  name="girlCurrentAge"
                  value={formData.girlCurrentAge}
                  onChange={handleChange}
                  suffix="years"
                  min="0"
                  max="10"
                  helpText="Account can be opened till age 10"
                />

                <Input
                  label="Interest Rate (p.a.)"
                  type="number"
                  name="annualRate"
                  value={formData.annualRate}
                  onChange={handleChange}
                  suffix="%"
                  min="1"
                  max="15"
                  step="0.1"
                  helpText="Current: 8.2% (FY 2024-25)"
                />

                {loading && <div className={styles.loading}>Calculating…</div>}

              </div>
            </Card>
          </div>

          <div className={styles.resultsSection}>

            <AdSlot format="rectangle" />

            {result && !result.error ? (
              <>
                <Card variant="gradient" className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Maturity Value (Age 21)</div>
                    <div className={styles.emiValue}>{formatCurrency(result.maturityValue)}</div>
                  </div>
                </Card>

                <Card title="SSY Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Deposited (15 yrs)</div>
                      <div className={styles.summaryValue}>
                        {formatCurrency(result.totalDeposited)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Interest</div>
                      <div className={styles.summaryValue} style={{ color: '#10b981' }}>
                        {formatCurrency(result.totalInterest)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Maturity Value</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        {formatCurrency(result.maturityValue)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Maturity Age</div>
                      <div className={styles.summaryValue}>{result.maturityAge} years</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Deposit Years</div>
                      <div className={styles.summaryValue}>{result.depositYears} years</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Wealth Multiplier</div>
                      <div className={styles.summaryValue}>
                        {(result.maturityValue / result.totalDeposited).toFixed(2)}x
                      </div>
                    </div>

                  </div>

                  <InvestmentBarChart invested={result.totalDeposited} returns={result.totalInterest} />
                </Card>

                <Card variant="success">
                  <h3 style={{ margin: '0 0 1rem 0', color: '#059669' }}>🎓 Plan for Your Daughter's Future</h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#047857' }}>
                    <p>At age {result.maturityAge}, your daughter gets <strong>₹{formatCurrency(result.maturityValue)}</strong> for:</p>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                      <li>Higher education (college, abroad)</li>
                      <li>Marriage expenses</li>
                      <li>Starting a business</li>
                      <li>Down payment for house</li>
                    </ul>
                  </div>
                </Card>
              </>
            ) : result && result.error ? (
              <Card variant="danger">
                <p style={{ color: '#dc2626', margin: 0 }}>{result.error}</p>
              </Card>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>👧</div>
                  <p>Enter SSY details for your daughter</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        {/* YEAR-BY-YEAR BREAKDOWN */}
        {result && result.yearlyBreakdown && (
          <Card title="Year-by-Year Growth (Till Age 21)" className={styles.amortCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.amortTable}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Girl's Age</th>
                    <th>Deposit</th>
                    <th>Interest</th>
                    <th>Closing Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyBreakdown.map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td>{row.girlAge}</td>
                      <td>{row.deposit > 0 ? formatCurrency(row.deposit) : '-'}</td>
                      <td style={{ color: '#10b981' }}>{formatCurrency(row.interest)}</td>
                      <td style={{ color: '#6366f1', fontWeight: 700 }}>{formatCurrency(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Card className={styles.infoCard}>
          <h2>About SSY (Sukanya Samriddhi Yojana)</h2>
          <p>
            SSY is a government savings scheme for girl child's education and marriage. Offers highest 
            interest among all government small savings schemes with complete tax exemption (EEE status).
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Eligibility:</strong> Girl child below 10 years</li>
            <li><strong>Interest Rate:</strong> 8.2% p.a. (FY 2024-25, revised quarterly)</li>
            <li><strong>Deposit Period:</strong> 15 years from account opening</li>
            <li><strong>Maturity:</strong> 21 years from account opening (or marriage after 18)</li>
            <li><strong>Min Deposit:</strong> ₹250/year | <strong>Max Deposit:</strong> ₹1,50,000/year</li>
            <li><strong>Accounts:</strong> Max 2 per family (for 2 daughters), 3rd allowed for twins</li>
            <li><strong>Tax Benefit:</strong> EEE status (deposits, interest, maturity all tax-free)</li>
          </ul>

          <h3>Deposit Rules</h3>
          <ul>
            <li>Deposits allowed for first 15 years only</li>
            <li>After 15 years, account continues to earn interest till maturity</li>
            <li>Can deposit in lump sum or installments (max 12 per year)</li>
            <li>Penalty ₹50 per year if min deposit (₹250) not made</li>
            <li>Account becomes inactive if default continues</li>
          </ul>

          <h3>Withdrawal Rules</h3>
          <ul>
            <li><strong>Partial Withdrawal:</strong> 50% of balance allowed after girl turns 18 (for education)</li>
            <li><strong>Premature Closure:</strong> After 5 years in case of girl's death or extreme hardship</li>
            <li><strong>Marriage:</strong> Account can be closed after girl turns 18 and gets married</li>
            <li><strong>Full Maturity:</strong> 21 years from opening or marriage after 18 (whichever is earlier)</li>
          </ul>

          <h3>Tax Benefits</h3>
          <ul>
            <li><strong>Section 80C:</strong> Deposits eligible for deduction up to ₹1.5L</li>
            <li><strong>Interest:</strong> Completely tax-free (unlike FD, RD)</li>
            <li><strong>Maturity Amount:</strong> Tax-free withdrawal</li>
            <li><strong>EEE Status:</strong> Exempt-Exempt-Exempt (best tax treatment)</li>
          </ul>

          <h3>Account Transfer</h3>
          <ul>
            <li>Transferable anywhere in India (post office/authorized banks)</li>
            <li>Girl can operate account after turning 18</li>
            <li>Guardian operates till girl turns 18</li>
          </ul>

          <h3>SSY vs PPF (for Girl Child)</h3>
          <ul>
            <li><strong>Interest:</strong> SSY 8.2% vs PPF 7.1% (SSY better)</li>
            <li><strong>Lock-in:</strong> SSY 21 years vs PPF 15 years</li>
            <li><strong>Deposit:</strong> Both ₹1.5L max/year</li>
            <li><strong>Tax:</strong> Both EEE status</li>
            <li><strong>Loan:</strong> PPF allows loan, SSY doesn't</li>
            <li><strong>Recommendation:</strong> SSY first (₹1.5L), then PPF for additional savings</li>
          </ul>

          <h3>Use Cases for Maturity Amount</h3>
          <ul>
            <li><strong>Higher Education:</strong> College fees, abroad studies</li>
            <li><strong>Marriage:</strong> Wedding expenses, trousseau</li>
            <li><strong>Business:</strong> Seed capital for startup</li>
            <li><strong>Home:</strong> Down payment for house</li>
            <li><strong>Continue Investing:</strong> Re-invest in mutual funds/stocks</li>
          </ul>

          <h3>Example Calculation</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Scenario:</strong></p>
            <ul>
              <li>Girl's age: 2 years</li>
              <li>Yearly deposit: ₹1,50,000 (max)</li>
              <li>Deposit period: 15 years (till age 17)</li>
              <li>Maturity: Age 23 (21 years from opening)</li>
            </ul>
            <p><strong>Result:</strong></p>
            <ul>
              <li>Total deposited: ₹22,50,000</li>
              <li>Maturity amount: ~₹69,00,000 @ 8.2%</li>
              <li>Interest earned: ₹46,50,000 (tax-free!)</li>
            </ul>
          </div>

          <h3>Important Points</h3>
          <ul>
            <li>Interest rate reset quarterly by government</li>
            <li>Nomination facility available</li>
            <li>PassBook issued (like savings account)</li>
            <li>Can open at post office or authorized banks (SBI, ICICI, HDFC, etc.)</li>
            <li>Documents needed: Birth certificate, parent's ID, address proof</li>
            <li>Joint account not allowed (only in girl's name)</li>
          </ul>

          <h3>Who Should Invest in SSY?</h3>
          <ul>
            <li>Every parent with daughter(s) below 10 years</li>
            <li>Highest guaranteed returns among government schemes</li>
            <li>Complete tax exemption (beats PPF, NSC, FD)</li>
            <li>Forced savings for daughter's future</li>
            <li>Government-backed safety</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}