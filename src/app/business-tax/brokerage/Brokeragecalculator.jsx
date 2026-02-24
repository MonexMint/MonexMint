'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import AdSlot from '@/components/ads/AdSlot';
import { calculateBrokerage } from '@/lib/calculators';
import { formatCurrency } from '@/lib/constants';
import styles from './page.module.css';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BREADCRUMBS } from '@/lib/breadcrumbs';

const DEBOUNCE_MS = 300;

export default function BrokerageCalculator() {

  const [formData, setFormData] = useState({
    buyPrice:  '1000',
    sellPrice: '1050',
    quantity:  '100',
    segment:   'equity',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compute = useCallback(() => {
    const buy  = parseFloat(formData.buyPrice);
    const sell = parseFloat(formData.sellPrice);
    const qty  = parseFloat(formData.quantity);

    if (!buy || buy <= 0 || !sell || sell <= 0 || !qty || qty <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    const data = calculateBrokerage(buy, sell, qty, formData.segment);
    setResult(data);
    setLoading(false);

  }, [formData]);

  useEffect(() => {
    const t = setTimeout(compute, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [compute]);

  const isProfitable = result && result.netPnL > 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        <Breadcrumb items={BREADCRUMBS.brokerage} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>Brokerage Calculator</h1>
          <p className={styles.description}>
            Calculate total trading charges including brokerage, STT, exchange charges, GST, and stamp duty. 
            Get net P&L and breakeven price for equity, intraday, F&O trades.
          </p>
        </div>

        <div className={styles.content}>

          <div className={styles.formSection}>
            <Card title="Trade Details">
              <div className={styles.form}>

                <Input
                  label="Buy Price"
                  type="number"
                  name="buyPrice"
                  value={formData.buyPrice}
                  onChange={handleChange}
                  prefix="₹"
                  min="0.01"
                  step="0.01"
                  helpText="Price per share at buying"
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
                  helpText="Price per share at selling"
                />

                <Input
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  suffix="shares"
                  min="1"
                  step="1"
                  helpText="Number of shares traded"
                />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    Segment
                  </label>
                  <select
                    name="segment"
                    value={formData.segment}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                  >
                    <option value="equity">Equity Delivery (₹0 brokerage)</option>
                    <option value="intraday">Equity Intraday (0.03% or ₹20)</option>
                    <option value="futures">Futures (₹20 flat)</option>
                    <option value="options">Options (₹20 flat)</option>
                  </select>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Select trading segment
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
                <Card variant={isProfitable ? 'success' : 'danger'} className={styles.emiCard}>
                  <div className={styles.emiResult}>
                    <div className={styles.emiLabel}>Net P&L</div>
                    <div className={styles.emiValue} style={{ color: isProfitable ? '#059669' : '#dc2626' }}>
                      {isProfitable ? '+' : ''}{formatCurrency(result.netPnL)}
                    </div>
                  </div>
                </Card>

                <Card title="Trade Summary">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Buy Turnover</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.buyTurnover)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Sell Turnover</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.sellTurnover)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Gross P&L</div>
                      <div className={styles.summaryValue} style={{ color: result.profitLoss > 0 ? '#10b981' : '#dc2626' }}>
                        {result.profitLoss > 0 ? '+' : ''}{formatCurrency(result.profitLoss)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Total Charges</div>
                      <div className={styles.summaryValue} style={{ color: '#dc2626' }}>
                        {formatCurrency(result.totalCharges)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Net P&L</div>
                      <div className={styles.summaryValue} style={{ 
                        color: result.netPnL > 0 ? '#059669' : '#dc2626', 
                        fontSize: '1.5rem' 
                      }}>
                        {result.netPnL > 0 ? '+' : ''}{formatCurrency(result.netPnL)}
                      </div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Breakeven Price</div>
                      <div className={styles.summaryValue} style={{ color: '#6366f1' }}>
                        ₹{result.breakeven}
                      </div>
                    </div>

                  </div>
                </Card>

                <Card title="Charges Breakdown">
                  <div className={styles.summaryGrid}>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Brokerage</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.brokerage)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>STT</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.stt)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Exchange Charges</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.exchangeCharge)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>SEBI Charges</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.sebiCharge)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>Stamp Duty</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.stampDuty)}</div>
                    </div>

                    <div className={styles.summaryItem}>
                      <div className={styles.summaryLabel}>GST (18%)</div>
                      <div className={styles.summaryValue}>{formatCurrency(result.gst)}</div>
                    </div>

                  </div>
                </Card>

                <Card variant={isProfitable ? 'success' : 'warning'}>
                  <h3 style={{ margin: '0 0 1rem 0', color: isProfitable ? '#059669' : '#92400e' }}>
                    {isProfitable ? '✅ Profitable Trade' : '⚠️ Loss Trade'}
                  </h3>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.7', color: isProfitable ? '#047857' : '#92400e' }}>
                    <p>
                      <strong>Trade:</strong> Buy {formData.quantity} shares @ ₹{formData.buyPrice} → 
                      Sell @ ₹{formData.sellPrice}
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                      <strong>Gross {result.profitLoss > 0 ? 'Profit' : 'Loss'}:</strong> ₹{formatCurrency(Math.abs(result.profitLoss))}
                    </p>
                    <p>
                      <strong>Total Charges:</strong> ₹{formatCurrency(result.totalCharges)} ({((result.totalCharges / result.buyTurnover) * 100).toFixed(2)}% of turnover)
                    </p>
                    <p style={{ marginTop: '1rem', padding: '0.75rem', background: isProfitable ? '#f0fdf4' : '#fef3c7', borderRadius: '0.5rem' }}>
                      💡 <strong>Breakeven Price:</strong> ₹{result.breakeven}/share<br/>
                      Sell above ₹{result.breakeven} to make profit!
                    </p>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon}>📊</div>
                  <p>Enter trade details to calculate charges</p>
                </div>
              </Card>
            )}

          </div>

        </div>

        <Card className={styles.infoCard}>
          <h2>Understanding Stock Trading Charges</h2>
          <p>
            Every stock trade involves multiple charges: brokerage, STT, exchange charges, SEBI fee, GST, and stamp duty. 
            These reduce your net profit. Understanding them helps you trade smarter.
          </p>

          <h3>Components of Trading Charges</h3>
          
          <h4>1. Brokerage</h4>
          <ul>
            <li><strong>Discount Brokers (Zerodha, Upstox):</strong> ₹0 for equity delivery, ₹20 or 0.03% for intraday/F&O</li>
            <li><strong>Full-Service Brokers:</strong> 0.1% - 0.5% of turnover</li>
            <li><strong>Charged on:</strong> Both buy and sell sides</li>
          </ul>

          <h4>2. STT (Securities Transaction Tax)</h4>
          <ul>
            <li><strong>Equity Delivery:</strong> 0.1% on buy & sell (total 0.2%)</li>
            <li><strong>Equity Intraday:</strong> 0.025% on sell side only</li>
            <li><strong>Futures:</strong> 0.01% on sell side</li>
            <li><strong>Options:</strong> 0.0625% on sell side (on premium)</li>
            <li><strong>Paid to:</strong> Government (non-refundable)</li>
          </ul>

          <h4>3. Exchange Transaction Charges</h4>
          <ul>
            <li><strong>NSE:</strong> 0.00345% for equity</li>
            <li><strong>BSE:</strong> 0.00375% for equity</li>
            <li><strong>Applied on:</strong> Total turnover (buy + sell)</li>
          </ul>

          <h4>4. SEBI Charges</h4>
          <ul>
            <li><strong>Rate:</strong> ₹10 per crore of turnover (0.0001%)</li>
            <li><strong>Purpose:</strong> Regulator fee</li>
          </ul>

          <h4>5. Stamp Duty</h4>
          <ul>
            <li><strong>Rate:</strong> 0.015% on buy side (delivery), 0.003% (intraday)</li>
            <li><strong>Paid to:</strong> State government</li>
          </ul>

          <h4>6. GST (18%)</h4>
          <ul>
            <li><strong>Applied on:</strong> Brokerage + Exchange charges + SEBI charges</li>
            <li><strong>NOT on:</strong> STT and Stamp duty</li>
          </ul>

          <h3>Charges by Segment</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Segment</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Brokerage</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>STT</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Equity Delivery</td><td style={{ padding: '0.25rem' }}>₹0</td><td style={{ padding: '0.25rem' }}>0.1% buy+sell</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Equity Intraday</td><td style={{ padding: '0.25rem' }}>0.03% or ₹20</td><td style={{ padding: '0.25rem' }}>0.025% sell</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Futures</td><td style={{ padding: '0.25rem' }}>₹20 flat</td><td style={{ padding: '0.25rem' }}>0.01% sell</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Options</td><td style={{ padding: '0.25rem' }}>₹20 flat</td><td style={{ padding: '0.25rem' }}>0.0625% sell</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Example: Equity Delivery Trade</h3>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
            <p><strong>Trade:</strong> Buy 100 shares @ ₹1,000 → Sell @ ₹1,050</p>
            <table style={{ width: '100%', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <tbody>
                <tr><td style={{ padding: '0.25rem' }}>Buy Value:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹1,00,000</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Sell Value:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹1,05,000</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Gross Profit:</td><td style={{ padding: '0.25rem', textAlign: 'right', color: '#10b981' }}>₹5,000</td></tr>
                <tr style={{ borderTop: '1px solid #e2e8f0' }}><td style={{ padding: '0.25rem' }}><strong>Charges:</strong></td><td style={{ padding: '0.25rem' }}></td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Brokerage:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹0</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>STT (0.2%):</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹205</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Exchange (0.00345%):</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹7</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>SEBI:</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹0.21</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>Stamp Duty (0.015%):</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹15</td></tr>
                <tr><td style={{ padding: '0.25rem' }}>GST (18% on ₹7):</td><td style={{ padding: '0.25rem', textAlign: 'right' }}>₹1.26</td></tr>
                <tr style={{ borderTop: '2px solid #e2e8f0' }}><td style={{ padding: '0.25rem' }}><strong>Total Charges:</strong></td><td style={{ padding: '0.25rem', textAlign: 'right', color: '#dc2626' }}><strong>₹228</strong></td></tr>
                <tr><td style={{ padding: '0.25rem' }}><strong>Net Profit:</strong></td><td style={{ padding: '0.25rem', textAlign: 'right', color: '#059669' }}><strong>₹4,772</strong></td></tr>
              </tbody>
            </table>
          </div>

          <h3>Breakeven Price</h3>
          <p>
            Breakeven is the minimum sell price needed to recover all costs. 
            Formula: <strong>Breakeven = Buy Price + (Total Charges ÷ Quantity)</strong>
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            In above example: Breakeven = ₹1,000 + (₹228 ÷ 100) = <strong>₹1,002.28</strong>
          </p>

          <h3>Impact on Returns</h3>
          <ul>
            <li><strong>Small Trades:</strong> Charges can eat 2-5% of profit</li>
            <li><strong>Frequent Trading:</strong> Charges compound quickly</li>
            <li><strong>Intraday:</strong> Both-side brokerage + higher risk</li>
            <li><strong>Long-term Delivery:</strong> Lowest charges (₹0 brokerage)</li>
          </ul>

          <h3>How to Minimize Charges</h3>
          <ul>
            <li>✅ Use discount brokers (₹0 delivery brokerage)</li>
            <li>✅ Trade larger quantities (fixed ₹20 spread over more shares)</li>
            <li>✅ Prefer delivery over intraday (lower STT)</li>
            <li>✅ Avoid over-trading (each trade = charges)</li>
            <li>✅ Compare brokers (full-service 10x costlier)</li>
          </ul>

          <h3>Tax on Trading</h3>
          <ul>
            <li><strong>Equity Delivery ({'>'}12 months):</strong> LTCG 10% ({'>'}₹1L exempt)</li>
            <li><strong>Equity Delivery ({'<'}12 months):</strong> STCG 15%</li>
            <li><strong>Intraday/F&O:</strong> Income as per slab (30% for high earners)</li>
            <li><strong>STT:</strong> Non-refundable, cannot claim</li>
          </ul>

          <h3>Common Mistakes</h3>
          <ul>
            <li>❌ Not factoring charges in profit calculation</li>
            <li>❌ Over-trading (death by thousand charges)</li>
            <li>❌ Using full-service brokers for delivery</li>
            <li>❌ Ignoring STT impact (biggest charge!)</li>
            <li>❌ Not tracking breakeven price</li>
          </ul>

          <h3>Pro Tips</h3>
          <ul>
            <li>Calculate breakeven before entering trade</li>
            <li>For long-term investing, discount brokers save ₹1000s</li>
            <li>STT is 0.2% in delivery — biggest charge after brokerage</li>
            <li>Intraday has lower STT but both-side brokerage</li>
            <li>Track all charges in trading journal</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}