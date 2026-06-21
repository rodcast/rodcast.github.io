import styles from '@/styles/cookieConsent.module.css';
import { GoogleAnalytics } from '@next/third-parties/google';
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
  const globalScope = window as unknown as {
    gtag?: (...args: unknown[]) => void;
  };
  globalScope.gtag?.('consent', 'update', CONSENT_STATE[choice]);
};

interface CookieConsentProps {
  gaId: string;
}

/**
 * Cookie consent banner using basic Google Consent Mode v2: consent defaults
 * are denied (set in `_document`) and the Google tag is not loaded until the
 * user grants consent. On accept, consent is updated and the tag is loaded.
 */
export default function CookieConsent({ gaId }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      } else if (stored === 'granted') {
        // Returning visitor who already consented: update and load the tag.
        updateConsent('granted');
        setAnalyticsEnabled(true);
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
    if (choice === 'granted') {
      setAnalyticsEnabled(true);
    }
    setVisible(false);
  }, []);

  return (
    <>
      {analyticsEnabled && <GoogleAnalytics gaId={gaId} />}
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
