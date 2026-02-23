'use client';

import AdSlot from '@/components/ads/AdSlot';
import CalculatorSEO from '@/components/seo/CalculatorSEO';
import styles from './CalculatorLayout.module.css';  // ← own CSS, not EMI's

export default function CalculatorLayout({
  title,
  description,
  schema,
  children,
  resultSection,
  infoSection,
}) {
  return (
    <div className={styles.page}>
      <CalculatorSEO title={title} description={description} schema={schema} />

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.content}>
          {/* Left — form */}
          {children}

          {/* Right — results */}
          <div className={styles.resultsSection}>
            <AdSlot format="rectangle" />
            {resultSection}
          </div>
        </div>

        {infoSection}
      </div>
    </div>
  );
}