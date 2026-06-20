import { IMedium } from '@/interfaces/index';
import styles from '@/styles/article.module.css';

interface MediumProps {
  data?: IMedium[];
}

/** Medium articles */
export default function Medium({ data }: MediumProps) {
  const articles: IMedium[] = data ?? [];

  const isError = !data;
  const isEmpty = articles.length === 0;

  let message: string | null = null;
  if (isError) {
    message = 'There is an error in Medium API.';
  } else if (isEmpty) {
    message = 'No articles available at the moment.';
  }

  return (
    <article className={styles.content}>
      <h2 className={styles.title}>My articles on Medium</h2>

      {message && <span className={styles.description}>{message}</span>}

      {Array.isArray(articles) && (
        <ol className={styles.list}>
          {articles.map(({ guid, title, link, pubDate, content }) => {
            const publishedDate = new Date(pubDate);
            const isValidPublishedDate = !Number.isNaN(publishedDate.getTime());

            const dateLabel = isValidPublishedDate
              ? new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'long',
                }).format(publishedDate)
              : 'Date unavailable';

            return (
              <li key={guid} className={styles.item}>
                <span className={styles.subtitle}>
                  <a
                    href={link}
                    title={title}
                    className={styles.url}
                    rel="external"
                  >
                    {title}
                  </a>
                </span>
                {isValidPublishedDate ? (
                  <time
                    className={styles.time}
                    dateTime={publishedDate.toISOString()}
                  >
                    {dateLabel}
                  </time>
                ) : (
                  <span className={styles.time}>{dateLabel}</span>
                )}
                <span className={styles.description}>{content}</span>
              </li>
            );
          })}
        </ol>
      )}

      <p className={styles.viewAll}>
        <a
          href="https://medium.com/@rodcast"
          className={styles.viewAllLink}
          rel="external"
          title="Read all articles on Medium"
        >
          Read all articles →
        </a>
      </p>
    </article>
  );
}
