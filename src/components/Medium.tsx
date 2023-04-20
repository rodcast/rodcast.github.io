"use client";
import { Fragment } from 'react';
import useSWR from 'swr';
import { MEDIUM_API } from '@/constants/paths';
import { IMedium, IMediumApi } from '@/interfaces/index';
import { normalizeMedium } from '@/utils/index';
import { fetchData } from '@/utils/fetch';
import MediumSkeleton from './MediumSkeleton';
import styles from '@/styles/article.module.css';
import stylesMedium from '@/styles/medium.module.css';

export async function getStaticProps() {
  const response = await fetch(MEDIUM_API);
  const data = await response.json();

  return {
    props: {
      data,
    },
  };
}

export default function Medium({ data }: IMediumApi) {
  const { data: dataSWR, error, isLoading } = useSWR(MEDIUM_API,
    (api: string) => fetchData(api),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      fallbackData: data
    });

  if (isLoading) {
    return <MediumSkeleton />;
  }

  const response: Array<IMedium> = normalizeMedium(dataSWR?.items);

  return (
    <article className={styles.content}>
      <header className={styles.title}>My articles on Medium</header>

      {error && (
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
