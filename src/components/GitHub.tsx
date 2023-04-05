"use client";
import { Fragment } from 'react';
import useSWR from 'swr';
import { GITHUB_API } from '@/constants/paths';
import { IGitHubApi, IGitHub } from '@/interfaces/index';
import { normalizeGitHub } from '@/utils/index';
import Skeleton from './Skeleton';
import { fetchData } from '@/utils/fetch';
import styles from '@/styles/article.module.css';
import stylesGithub from '@/styles/github.module.css';

export async function getStaticProps() {
  const response = await fetch(GITHUB_API);
  const data = await response.json();

  return {
    props: {
      data,
    },
  };
}

function SkeletonGitHub() {
  return (
    <article className={styles.content}>
      <header className={styles.title}>My repositories on GitHub</header>
      <Skeleton width="100%" height="50px" marginBottom="1em" />
      <Skeleton width="100%" height="50px" marginBottom="1em" />
      <Skeleton width="100%" height="50px" marginBottom="1em" />
    </article>
  );
}

export default function GitHub({ data }: IGitHubApi) {
  const { data: dataSWR, error, isLoading } = useSWR(GITHUB_API,
    (api) => fetchData(api, 'There is an error in Github API.'),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      fallbackData: data
    });

  if (isLoading) {
    return <SkeletonGitHub />;
  };

  const response: Array<IGitHub> = normalizeGitHub(dataSWR);
  console.log(response);

  return (
    <article className={styles.content}>
      <header className={styles.title}>My repositories on GitHub</header>

      {error && (
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
              <Fragment key={id}>
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
