import styles from '@/styles/cookieConsent.module.css';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie-consent';

type ConsentChoice = 'granted' | 'denied';

const CONSENT_STATE: Record<ConsentChoice, Record<string, ConsentChoice>> = {
  granted: {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  },
  denied: {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  },
};

/** Pushes a Google Consent Mode v2 update for the user's choice. */
const updateConsent = (choice: ConsentChoice) => {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.('consent', 'update', CONSENT_STATE[choice]);
};

/**
 * Minimal cookie consent banner backed by Google Consent Mode v2.
 * Defaults are denied (set in `_document`); this banner records the user's
 * choice in localStorage and updates consent accordingly.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (e.g. privacy mode); show the banner anyway.
      setVisible(true);
    }
  }, []);

  const choose = useCallback((choice: ConsentChoice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Ignore storage failures; consent still applies for this session.
    }
    updateConsent(choice);
    setVisible(false);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={styles.banner}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <p className={styles.text}>
        This site uses Google Analytics to measure traffic. Analytics cookies
        stay off until you accept.
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.reject}`}
          onClick={() => choose('denied')}
        >
          Reject
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.accept}`}
          onClick={() => choose('granted')}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
