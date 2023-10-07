import { Fragment } from 'react';
import { IGitHub } from '@/interfaces/index';
import { normalizeGitHub } from '@/utils/index';
import styles from '@/styles/article.module.css';
import stylesGithub from '@/styles/github.module.css';

export default function GitHub({ data }: any) {
  const response: Array<IGitHub> = normalizeGitHub(data);

  return (
    <article className={styles.content}>
      <header className={styles.title}>My repositories on GitHub</header>

      {!Array.isArray(response) && (
        <span className={styles.description}>
          There is an error in GitHub API.
        </span>
      )}

      {Array.isArray(response) && (
        <ol className={styles.list}>
          {response.map((repo: IGitHub) => {
            const { id, name, html_url, description, updated_at } = repo;

            const dateTime = new Intl.DateTimeFormat("en-US", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(updated_at));

            return (
              <Fragment key={String(id)}>
                <li className={styles.item}>
                  <time className={stylesGithub.time} dateTime={dateTime}>{dateTime}</time>
                  <span className={styles.subtitle}>
                    <a href={html_url} title={name} className={styles.url} rel="external">{name}</a>
                  </span>
                  <span className={styles.description}>{description}</span>
                </li>
              </Fragment>
            );
          })}
        </ol>
      )}
    </article>
  );
}
