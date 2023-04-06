import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import localFont from 'next/font/local';
import icon from '@/styles/icon.module.css';
import styles from '@/styles/toggle.module.css';

const fontello = localFont({
  src: '../fonts/fontello.woff2',
  variable: '--font-fontello'
});

export default function Toggle() {
  const [checked, setChecked] = useState<boolean>(false);

  const checkTheme = useCallback((): void => {
    const theme = localStorage.getItem('data-theme');

    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setChecked(true);
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      setChecked(false);
    }
  }, []);

  const toggleTheme = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      localStorage.setItem('data-theme', 'dark');
    } else {
      localStorage.setItem('data-theme', 'light');
    }

    checkTheme();
  }, [checkTheme]);

  useEffect(() => {
    checkTheme();
  }, [checkTheme]);

  return (
    <label className={styles.switch} title="Toggle between Light and Dark mode">
      <input type="checkbox" checked={checked} onChange={toggleTheme} />
      <span className={styles.slider} />
      <i className={`${fontello.variable} ${icon.sun} ${styles.icon__sun}`} />
      <i className={`${fontello.variable} ${icon.moon} ${styles.icon__moon}`} />
    </label>
  );
}
