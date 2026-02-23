import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>

          <div className={styles.brand}>
            <span className={styles.brandName}>MONEX MINT</span>
            <p className={styles.brandDesc}>
              India's modern financial calculator platform. Free, accurate tools
              for loans, investments, tax planning, and wealth growth.
            </p>
            <div className={styles.social}>
              <a href="mailto:contact@monexmint.com" className={styles.socialLink} aria-label="Email">✉</a>
              <a href="https://twitter.com/monexmint" className={styles.socialLink} aria-label="Twitter">𝕏</a>
              <a href="https://www.linkedin.com/company/monexmintofficial" className={styles.socialLink} aria-label="LinkedIn">in</a>
            </div>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colHead}>Loans</h4>
            <ul className={styles.list}>
              <li><Link href="/loans/emi">EMI Calculator</Link></li>
              <li><Link href="/loans/home-loan">Home Loan</Link></li>
              <li><Link href="/loans/personal-loan">Personal Loan</Link></li>
              <li><Link href="/loans/eligibility">Loan Eligibility</Link></li>
              <li><Link href="/loans/prepayment">Prepayment</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colHead}>Investments</h4>
            <ul className={styles.list}>
              <li><Link href="/investments/sip">SIP Calculator</Link></li>
              <li><Link href="/investments/lumpsum">Lumpsum</Link></li>
              <li><Link href="/investments/cagr">CAGR</Link></li>
              <li><Link href="/investments/xirr">XIRR</Link></li>
              <li><Link href="/investments/goal-planning">Goal Planning</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colHead}>Tax & Banking</h4>
            <ul className={styles.list}>
              <li><Link href="/salary-tax/income-tax">Income Tax</Link></li>
              <li><Link href="/banking/fd">FD Calculator</Link></li>
              <li><Link href="/banking/rd">RD Calculator</Link></li>
              <li><Link href="/business-tax/gst">GST Calculator</Link></li>
              <li><Link href="/salary-tax/hra">HRA Calculator</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colHead}>Company</h4>
            <ul className={styles.list}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-of-use">Terms of Use</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© {new Date().getFullYear()} MONEX MINT. All rights reserved.</p>
          <p className={styles.disclaimer}>For informational purposes only. Consult a certified financial advisor.</p>
        </div>
      </div>
    </footer>
  );
}