'use client';

/**
 * CalculatorShell — universal wrapper for ALL 50+ calculators.
 *
 * Usage in any calculator client component:
 *
 *   import CalculatorShell from '@/components/layout/CalculatorShell';
 *
 *   export default function SIPCalculator() {
 *     return (
 *       <CalculatorShell
 *         title="SIP Calculator"
 *         description="Calculate your SIP returns with step-up options."
 *         breadcrumb={[
 *           { label: 'Calculators',       href: '/calculators' },
 *           { label: 'Investment & Wealth', href: '/calculators' },
 *           { label: 'SIP Calculator' },
 *         ]}
 *       >
 *         ... your form + result JSX ...
 *       </CalculatorShell>
 *     );
 *   }
 *
 * Props:
 *   title        — Page H1
 *   description  — Subtitle text
 *   breadcrumb   — Array of { label, href? }. Home is prepended automatically.
 *   children     — The calculator UI
 */

import React from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import styles from './CalculatorShell.module.css';

export default function CalculatorShell({ title, description, breadcrumb = [], children }) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Breadcrumb — Home is always prepended inside <Breadcrumb> */}
        <Breadcrumb items={breadcrumb} />

        {/* Page heading */}
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        {/* Calculator content */}
        {children}

      </div>
    </div>
  );
}