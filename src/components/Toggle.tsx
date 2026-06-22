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
    <label className="absolute top-[50px] right-8 z-0 inline-block h-[34px] w-[68px] max-md:top-7 max-md:right-4">
      <input
        type="checkbox"
        className="peer h-0 w-0 opacity-0"
        checked={checked}
        onChange={toggleTheme}
        aria-label={`Switch to ${checked ? 'light' : 'dark'} mode`}
        aria-describedby="theme-description"
      />
      <span className="absolute inset-0 cursor-pointer rounded-[34px] bg-[var(--contrast-color)] [transition:all_0.2s] before:absolute before:bottom-1 before:left-1 before:z-[1] before:h-[26px] before:w-[26px] before:rounded-full before:bg-[var(--primary-color)] before:content-[''] before:[transition:all_0.2s] peer-checked:bg-[var(--secondary-color)] peer-checked:before:translate-x-[34px]" />
      <i
        className={`${fontello.variable} icon-sun absolute top-1 left-1 z-0`}
        aria-hidden="true"
      />
      <i
        className={`${fontello.variable} icon-moon absolute top-1 right-1 z-0`}
        aria-hidden="true"
      />
      <span id="theme-description" className="sr-only">
        Toggle between light and dark theme. Currently in{' '}
        {checked ? 'dark' : 'light'} mode.
      </span>
    </label>
  );
}
