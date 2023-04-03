"use client";
import { Fragment } from 'react';
import useSWR from 'swr';
import styles from '@/styles/medium.module.css';
import { MEDIUM_API } from '@/constants/paths';
import { IMedium, IMediumApi } from '@/interfaces/index';
import { normalizeMedium } from '@/utils/index';
import Skeleton from './Skeleton';

export async function getStaticProps() {
  const response = await fetch(MEDIUM_API);
  const data = await response.json();

  return {
    props: {
      data,
    },
  };
}

function SkeletonMedium() {
  return (
    <article className={styles.content}>
      <header className={styles.title}>My articles on Medium</header>
      <Skeleton width="100%" height="50px" marginBottom="1em" />
      <Skeleton width="100%" height="50px" marginBottom="1em" />
      <Skeleton width="100%" height="50px" marginBottom="1em" />
    </article>
  );
}

export default function Medium({ data }: IMediumApi) {
  const { data: dataSWR, error, isLoading } = useSWR(MEDIUM_API,
    (...args) => fetch(...args).then((res) => res.json()), { fallbackData: data });

  if (dataSWR == null) {
    return <SkeletonMedium />;
  }

  const response: Array<IMedium> = normalizeMedium(dataSWR.items);

  return (
    <article className={styles.content}>
      <header className={styles.title}>My articles on Medium</header>

      {isLoading && (<h2>Loading...</h2>)}
      {error && (<h2>Error!</h2>)}

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
                <time className={styles.time} dateTime={dateTime}>{dateTime}</time>
                <span className={styles.description}>{content}</span>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </article>
  );
}
