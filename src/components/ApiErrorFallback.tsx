interface ApiErrorFallbackProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}

/** API error fallback */
export default function ApiErrorFallback({
  title,
  message = 'There was an error loading this content. Please try again later.',
  onRetry,
}: ApiErrorFallbackProps) {
  return (
    <article className="relative mb-16 [grid-area:article] last:mb-0">
      <h2 className="mb-2 border-b border-dotted border-[var(--secondary-color)] pb-2 text-2xl font-semibold [transition:all_0.2s]">
        {title}
      </h2>
      <div className="p-8 text-center text-[var(--contrast-color)]">
        <p className="block text-sm leading-[150%] [transition:all_0.2s]">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 cursor-pointer rounded-[4px] border border-[var(--contrast-color)] bg-[var(--secondary-color)] px-4 py-2 font-[inherit] text-sm text-[var(--primary-color)] [transition:all_0.2s] hover:-translate-y-px hover:opacity-80 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--secondary-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--secondary-color)] active:translate-y-0"
            type="button"
            aria-label="Retry loading content"
          >
            Try Again
          </button>
        )}
      </div>
    </article>
  );
}
