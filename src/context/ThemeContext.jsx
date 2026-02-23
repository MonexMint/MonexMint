'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({ theme: 'light', setTheme: () => {}, mounted: false });

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Read saved preference on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('mm-theme');
      if (stored === 'dark' || stored === 'light') {
        setThemeState(stored);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setThemeState('dark');
      }
    } catch (_) {}
  }, []);

  // Apply theme to <html data-theme="..."> whenever it changes
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('mm-theme', theme); } catch (_) {}
  }, [theme, mounted]);

  const setTheme = (t) => setThemeState(t === 'dark' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext) || { theme: 'light', setTheme: () => {}, mounted: false };
}