'use client';

import styles from './Breadcrumb.module.css';

export default function Breadcrumb({ items = [] }) {
  // Home is always first, then spread items
  // items should be: [{ label, href? }, ...]
  // Last item has no href and renders as <span>
  const crumbs = [{ label: 'Home', href: '/' }, ...items];

  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {crumbs.map((crumb, i) => (
          <li key={crumb.label} className={styles.item}>
            {crumb.href ? (
              <>
                <a href={crumb.href} className={styles.link}>{crumb.label}</a>
                <span className={styles.sep} aria-hidden="true">›</span>
              </>
            ) : (
              <span className={styles.current} aria-current="page">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}