import { IGitHub } from '@/interfaces/index';
import styles from '@/styles/article.module.css';

interface GitHubProps {
  githubData: IGitHub[];
}

/** GitHub repositories */
export default function GitHub({ githubData }: GitHubProps) {
  const message =
    githubData.length === 0 ? 'No repositories available at the moment.' : null;

  return (
    <article className={styles.content}>
      <h2 className={styles.title}>My repositories on GitHub</h2>

      {message && <span className={styles.description}>{message}</span>}

      <ol className={styles.list}>
        {githubData.map(({ node_id, name, html_url, description }) => (
          <li key={node_id} className={styles.item}>
            <span className={styles.subtitle}>
              <a
                href={html_url}
                title={name}
                className={styles.url}
                rel="external noopener"
              >
                {name}
              </a>
            </span>
            <span className={styles.description}>{description}</span>
          </li>
        ))}
      </ol>

      <p className={styles.viewAll}>
        <a
          href="https://github.com/rodcast"
          className={styles.viewAllLink}
          rel="external noopener"
          title="View all repositories on GitHub"
        >
          View all repositories →
        </a>
      </p>
    </article>
  );
}
