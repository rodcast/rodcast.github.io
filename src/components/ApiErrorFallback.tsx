import styles from '@/styles/apiErrorFallback.module.css';
import articleStyles from '@/styles/article.module.css';

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
    <article className={articleStyles.content}>
      <h2 className={articleStyles.title}>{title}</h2>
      <div className={styles.error_container}>
        <p className={articleStyles.description}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={styles.retry_button}
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
