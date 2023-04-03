"use client";
import { Fragment } from 'react';
import useSWR from 'swr';
import styles from '@/styles/github.module.css';
import { GITHUB_API } from '@/constants/paths';
import { IGitHubApi, IGitHub } from '@/interfaces/index';
import { normalizeGitHub } from '@/utils/index';
import Skeleton from './Skeleton';

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
    (...args) => fetch(...args).then((res) => res.json()), { fallbackData: data });

  if (dataSWR == null) {
    return <SkeletonGitHub />;
  };

  const response: Array<IGitHub> = normalizeGitHub(dataSWR);

  return (
    <article className={styles.content}>
      <header className={styles.title}>My repositories on GitHub</header>

      {isLoading && (<h2>Loading...</h2>)}

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
                <time className={styles.time} dateTime={dateTime}>{dateTime}</time>
                <span className={styles.subtitle}>
                  <a href={html_url} title={name} className={styles.url} rel="external">{name}</a>
                </span>
                <span className={styles.description}>{description}</span>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </article>
  );
}
