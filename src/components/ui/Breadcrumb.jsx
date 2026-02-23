'use client';

import Link from 'next/link';
import styles from './Breadcrumb.module.css';

/**
 * Breadcrumb component
 * Usage: <Breadcrumb items={[{ label: 'Calculators', href: '/calculators' }, { label: 'EMI Calculator' }]} />
 */
export default function Breadcrumb({ items = [] }) {
  const crumbs = [{ label: 'Home', href: '/' }, ...items];

  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={i} className={styles.item}>
              {!isLast ? (
                <>
                  <Link href={crumb.href} className={styles.link}>{crumb.label}</Link>
                  <span className={styles.sep} aria-hidden>›</span>
                </>
              ) : (
                <span className={styles.current} aria-current="page">{crumb.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}