import styles from '@/styles/cookieConsent.module.css';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie-consent';

type ConsentChoice = 'granted' | 'denied';

const CONSENT_STATE: Record<ConsentChoice, Record<string, ConsentChoice>> = {
  granted: {
    ad_storage: 'denied',
    analytics_storage: 'granted',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
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
  const globalScope = window as unknown as {
    gtag?: (...args: unknown[]) => void;
  };
  globalScope.gtag?.('consent', 'update', CONSENT_STATE[choice]);
};

/**
 * Cookie consent banner using basic Google Consent Mode v2. Consent defaults
 * are denied before Google Analytics loads; this banner only updates
 * analytics consent when the visitor makes a choice.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      } else if (stored === 'granted') {
        // Returning visitor who already consented: restore analytics consent.
        updateConsent('granted');
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

  return (
    <>
      {visible && (
        <div
          className={styles.banner}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
        >
          <p className={styles.text}>
            This site uses Google Analytics to measure traffic. Analytics
            cookies stay off until you accept.
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
      )}
    </>
  );
}
