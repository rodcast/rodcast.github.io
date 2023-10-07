import { Fragment } from 'react';
import { IMedium } from '@/interfaces/index';
import { normalizeMedium } from '@/utils/index';
import styles from '@/styles/article.module.css';
import stylesMedium from '@/styles/medium.module.css';

export default function Medium({ data }: any) {
  const response: Array<IMedium> = normalizeMedium(data.items);

  return (
    <article className={styles.content}>
      <header className={styles.title}>My articles on Medium</header>

      {!Array.isArray(response) && (
        <span className={styles.description}>
          There is an error in Medium API.
        </span>
      )}

      {Array.isArray(response) && (
        <ol className={styles.list}>
          {response.map((article: IMedium) => {
            const { guid, title, link, pubDate, content } = article;

            const dateTime = new Intl.DateTimeFormat("en-US", {
              dateStyle: "long",
            }).format(new Date(pubDate));

            return (
              <Fragment key={guid}>
                <li className={styles.item}>
                  <span className={styles.subtitle}>
                    <a href={link} title={title} className={styles.url} rel="external">{title}</a>
                  </span>
                  <time className={stylesMedium.time} dateTime={dateTime}>{dateTime}</time>
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
