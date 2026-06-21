import icon from '@/styles/icon.module.css';
import styles from '@/styles/toggle.module.css';
import localFont from 'next/font/local';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'data-theme';

const fontello = localFont({
  src: '../fonts/fontello.woff2',
  variable: '--font-fontello',
});

/** Theme toggle */
export default function Toggle() {
  const [checked, setChecked] = useState<boolean>(false);

  const applyTheme = useCallback((theme: Theme): void => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    setChecked(theme === 'dark');
  }, []);

  const checkTheme = useCallback((): void => {
    // Source of truth: the stored preference, else whatever the pre-paint
    // script in _document already applied (which honors prefers-color-scheme).
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const theme =
      stored === 'dark' || stored === 'light'
        ? stored
        : ((document.documentElement.dataset.theme as Theme | undefined) ??
          'light');

    applyTheme(theme);
  }, [applyTheme]);

  const toggleTheme = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const nextTheme: Theme = event.target.checked ? 'dark' : 'light';

      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
    },
    [applyTheme]
  );

  useEffect(() => {
    checkTheme();
  }, [checkTheme]);

  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={checked}
        onChange={toggleTheme}
        aria-label={`Switch to ${checked ? 'light' : 'dark'} mode`}
        aria-describedby="theme-description"
      />
      <span className={styles.slider} />
      <i
        className={`${fontello.variable} ${icon.sun} ${styles.icon__sun}`}
        aria-hidden="true"
      />
      <i
        className={`${fontello.variable} ${icon.moon} ${styles.icon__moon}`}
        aria-hidden="true"
      />
      <span id="theme-description" className="sr-only">
        Toggle between light and dark theme. Currently in{' '}
        {checked ? 'dark' : 'light'} mode.
      </span>
    </label>
  );
}
