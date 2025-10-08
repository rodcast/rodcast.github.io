import { Fragment } from "react";
import { IGitHub } from "@/interfaces/index";
import { normalizeGitHub } from "@/utils/index";
import styles from "@/styles/article.module.css";

interface GitHubProps {
  data?: any;
}

export default function GitHub({ data }: GitHubProps) {
  const repos: IGitHub[] = normalizeGitHub(data);

  const isError = !data;
  const isEmpty = repos?.length === 0;

  let message: string | null = null;
  if (isError) {
    message = "There is an error in GitHub API.";
  } else if (isEmpty) {
    message = "No repositories available at the moment.";
  }

  return (
    <article className={styles.content}>
      <header className={styles.title}>My repositories on GitHub</header>

      {message && (
        <span className={styles.description}>
          {message}
        </span>
      )}

      {Array.isArray(repos) && (
        <ol className={styles.list}>
          {repos.map(({ node_id, name, html_url, description }) => (
            <Fragment key={node_id}>
              <li className={styles.item}>
                <span className={styles.subtitle}>
                  <a
                    href={html_url}
                    title={name}
                    className={styles.url}
                    rel="external"
                  >
                    {name}
                  </a>
                </span>
                <span className={styles.description}>{description}</span>
              </li>
            </Fragment>
          ))}
        </ol>
      )}
    </article>
  );
}
