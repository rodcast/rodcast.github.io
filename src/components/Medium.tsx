import { IMedium, IMediumApi } from '@/interfaces/index';
import styles from '@/styles/article.module.css';
import { normalizeMedium } from '@/utils/index';
import { Fragment } from 'react';

interface MediumProps {
  data?: IMediumApi;
}

/**
 * Component that displays Medium articles from API
 * @param data - Medium API response containing article information
 */
export default function Medium({ data }: MediumProps) {
  const articles: IMedium[] = normalizeMedium(data?.items);

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
      <header className={styles.title}>My articles on Medium</header>

      {message && <span className={styles.description}>{message}</span>}

      {Array.isArray(articles) && (
        <ol className={styles.list}>
          {articles.map(({ guid, title, link, pubDate, content }) => {
            const dateTime = new Intl.DateTimeFormat('en-US', {
              dateStyle: 'long',
            }).format(new Date(pubDate));

            return (
              <Fragment key={guid}>
                <li className={styles.item}>
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
                  <time className={styles.time}>{dateTime}</time>
                  <span className={styles.description}>{content}</span>
                </li>
              </Fragment>
            );
          })}
        </ol>
      )}
    </article>
  );
}
