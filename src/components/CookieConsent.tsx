import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie-consent';

const buttonClass =
  'cursor-pointer rounded-md border border-[var(--secondary-color)] px-4 py-2 text-sm font-semibold [transition:all_0.2s] hover:opacity-[0.85]';

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

  return visible ? (
    <div
      className="fixed bottom-4 left-1/2 z-[1000] flex w-[calc(100%-var(--space-x-2))] max-w-[640px] -translate-x-1/2 items-center justify-between gap-4 rounded-md border border-[var(--secondary-color)] bg-[var(--tertiary-color)] p-4 text-[var(--secondary-color)] shadow-[0_4px_16px_rgb(0_0_0_/_15%)] max-sm:flex-col max-sm:items-stretch"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <p className="m-0 text-sm leading-[1.4]">
        This site uses Google Analytics to measure traffic. Analytics cookies
        stay off until you accept.
      </p>
      <div className="flex shrink-0 gap-2 max-sm:justify-end">
        <button
          type="button"
          className={`${buttonClass} bg-transparent text-[var(--secondary-color)]`}
          onClick={() => choose('denied')}
        >
          Reject
        </button>
        <button
          type="button"
          className={`${buttonClass} bg-[var(--secondary-color)] text-[var(--primary-color)]`}
          onClick={() => choose('granted')}
        >
          Accept
        </button>
      </div>
    </div>
  ) : null;
}
