'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import styles from './Header.module.css';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const close = () => setMobileOpen(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : styles.transparent}`}>
      <div className={styles.container}>

        <Link href="/" className={styles.logo} onClick={close}>
          <Image src="/logoMM.png" alt="MonexMint" width={110} height={32} style={{ height: "32px", width: "auto" }} priority />
          <span className={styles.logoText}>MONEX MINT</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/"            className={styles.navLink}>Home</Link>
          <Link href="/calculators" className={styles.navLink}>Calculators</Link>
          <Link href="/about"       className={styles.navLink}>About Us</Link>
          <button type="button" className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>

        <button
          type="button"
          className={styles.mobileMenuBtn}
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/"            onClick={close}>Home</Link>
          <Link href="/calculators" onClick={close}>Calculators</Link>
          <Link href="/about"       onClick={close}>About Us</Link>
          <button type="button" className={styles.mobileThemeBtn} onClick={() => { toggleTheme(); close(); }}>
            {theme === 'dark' ? '☀️  Light Mode' : '🌙  Dark Mode'}
          </button>
        </div>
      )}
    </header>
  );
}