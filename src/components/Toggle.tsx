import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import styles from '@/styles/toggle.module.css';

interface ToggleEvent extends ChangeEvent<HTMLInputElement> { }

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

  const toggleTheme = useCallback((event: ToggleEvent): void => {
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
    <label className={styles.switch}>
      <input type="checkbox" checked={checked} onChange={toggleTheme} />
      <span className={styles.slider}></span>
    </label>
  );
}
