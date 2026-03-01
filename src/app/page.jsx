'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const stats = [
  { value: '50+',   label: 'Financial Tools' },
  { value: '100%',  label: 'Free Forever' },
  { value: '0',     label: 'Sign-ups Needed' },
  { value: '99.9%', label: 'Accuracy Rate' },
];

const quickCalcs = [
  { icon: '🏠', name: 'EMI Calculator',  desc: 'Home, car & personal loans',   path: '/loans/emi' },
  { icon: '📈', name: 'SIP Calculator',  desc: 'Mutual fund wealth planning',  path: '/investments/sip' },
  { icon: '💰', name: 'Income Tax',      desc: 'Old vs New regime comparison', path: '/salary-tax/income-tax' },
  { icon: '🏦', name: 'FD Calculator',   desc: 'Fixed deposit maturity',       path: '/banking/fd' },
  { icon: '🧾', name: 'GST Calculator',  desc: 'Add or remove GST instantly',  path: '/business-tax/gst' },
  { icon: '🎯', name: 'Goal Planning',   desc: 'SIP required to hit target',   path: '/investments/goal-planning' },
];

const categories = [
  { icon: '🏦', name: 'Loan Calculators',             count: 9,  path: '/loans/emi' },
  { icon: '📈', name: 'Investment & Wealth',           count: 11, path: '/investments/sip' },
  { icon: '🏛️', name: 'Government Savings & Pension',  count: 9,  path: '/government/ppf' },
  { icon: '💳', name: 'Banking & Deposits',            count: 5,  path: '/banking/fd' },
  { icon: '👔', name: 'Salary & Tax',                  count: 7,  path: '/salary-tax/income-tax' },
  { icon: '🧾', name: 'Tax & Business',                count: 5,  path: '/business-tax/gst' },
  { icon: '📉', name: 'Inflation & Value',              count: 3,  path: '/value-tools/inflation' },
];

const features = [
  { icon: '⚡', title: 'Instant Results',   desc: 'Real-time calculations as you type. Zero delay.' },
  { icon: '🔒', title: '100% Private',      desc: 'All math runs in your browser. We see nothing.' },
  { icon: '📱', title: 'Works Everywhere',  desc: 'Pixel-perfect on mobile, tablet, and desktop.' },
  { icon: '🇮🇳', title: 'Built for India',  desc: 'Indian tax laws, GST slabs & schemes covered.' },
];

export default function Home() {
  return (
    <div className={styles.page}>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>🇮🇳 Made for India · 100% Free · No Signup</span>
          <h1 className={styles.heroTitle}>
            Smart Financial<br />
            <span className={styles.heroGradient}>Decisions, Simplified</span>
          </h1>
          <p className={styles.heroSub}>
            50+ accurate calculators for EMI, SIP, income tax, FD, GST and everything in between.
          </p>
          <div className={styles.heroCta}>
            <Link href="/calculators" className={styles.btnPrimary}>Explore All Calculators →</Link>
            <Link href="/loans/emi"   className={styles.btnGhost}>Try EMI Calculator</Link>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────── */}
      <div className={styles.statsStrip}>
        {stats.map(s => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statVal}>{s.value}</span>
            <span className={styles.statLbl}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── QUICK CALCULATORS ─────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.sH}>Most Used Calculators</h2>
          <p  className={styles.sP}>Jump straight to the tools people use every day</p>
          <div className={styles.quickGrid}>
            {quickCalcs.map(c => (
              <Link key={c.path} href={c.path} className={styles.quickCard}>
                <span className={styles.qIcon}>{c.icon}</span>
                <span className={styles.qBody}>
                  <span className={styles.qName}>{c.name}</span>
                  <span className={styles.qDesc}>{c.desc}</span>
                </span>
                <span className={styles.qArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.inner}>
          <h2 className={styles.sHLight}>Browse by Category</h2>
          <p  className={styles.sPLight}>All 50+ calculators organised by topic</p>
          <div className={styles.catGrid}>
            {categories.map(c => (
              <Link key={c.path} href={c.path} className={styles.catCard}>
                <span className={styles.catIcon}>{c.icon}</span>
                <span className={styles.catBody}>
                  <span className={styles.catName}>{c.name}</span>
                  <span className={styles.catCount}>{c.count} calculators</span>
                </span>
                <span className={styles.catArrow}>→</span>
              </Link>
            ))}
            <Link href="/calculators" className={styles.catAll}>View All 50+ Calculators →</Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.sH}>Why Use MONEX MINT?</h2>
          <div className={styles.featGrid}>
            {features.map(f => (
              <div key={f.title} className={styles.featCard}>
                <span className={styles.featIcon}>{f.icon}</span>
                <h3 className={styles.featTitle}>{f.title}</h3>
                <p  className={styles.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.dark}`}>
        <div className={`${styles.inner} ${styles.ctaInner}`}>
          <h2 className={styles.ctaTitle}>Ready to take control of your finances?</h2>
          <p  className={styles.ctaSub}>Free forever. No account required.</p>
          <Link href="/calculators" className={styles.btnPrimary}>Start Calculating →</Link>
        </div>
      </section>

    </div>
  );
}