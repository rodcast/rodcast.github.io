import icon from '@/styles/icon.module.css';
import styles from '@/styles/toggle.module.css';
import localFont from 'next/font/local';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

const fontello = localFont({
  src: '../fonts/fontello.woff2',
  variable: '--font-fontello',
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

  const toggleTheme = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      if (event.target.checked) {
        localStorage.setItem('data-theme', 'dark');
      } else {
        localStorage.setItem('data-theme', 'light');
      }

      checkTheme();
    },
    [checkTheme]
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
        Toggle between light and dark theme. Currently in {checked ? 'dark' : 'light'} mode.
      </span>
    </label>
  );
}
