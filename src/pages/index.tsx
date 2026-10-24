import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import Article from '@/components/Article';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Toggle from '@/components/Toggle';
import { GITHUB_API, MEDIUM_API } from '@/constants/paths';
import { IGitHub } from '@/interfaces/github';
import { IMedium } from '@/interfaces/medium';
import { fetchData } from '@/utils/fetch';
import {
  normalizeGitHub,
  normalizeMedium,
  normalizeMediumFeed,
} from '@/utils/index';

import styles from '@/styles/page.module.css';

/** Fetch data at build time */
export async function getStaticProps() {
  // Fetch sources independently so one failure cannot blank the other.
  const [githubResult, mediumResult] = await Promise.allSettled([
    fetchData(GITHUB_API),
    fetchData(MEDIUM_API),
  ]);

  if (githubResult.status === 'rejected') {
    // eslint-disable-next-line no-console
    console.error(
      'Error fetching GitHub data at build time:',
      githubResult.reason
    );
  }
  if (mediumResult.status === 'rejected') {
    // eslint-disable-next-line no-console
    console.error(
      'Error fetching Medium data at build time:',
      mediumResult.reason
    );
  }

  const githubApiData =
    githubResult.status === 'fulfilled'
      ? normalizeGitHub(githubResult.value)
      : [];
  let githubData = githubApiData;

  if (githubData.length === 0) {
    const githubFallback = await readFile(
      join(process.cwd(), 'public', 'github-repos.json'),
      'utf8'
    );
    githubData = normalizeGitHub(JSON.parse(githubFallback));
  }

  if (githubApiData.length === 0 && githubData.length === 0) {
    // eslint-disable-next-line no-console
    console.error(
      'No GitHub repositories found in the API response or bundled snapshot.'
    );
  } else if (githubApiData.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(
      githubResult.status === 'fulfilled'
        ? 'GitHub API returned no repositories; using the bundled snapshot.'
        : 'GitHub API unavailable; using the bundled snapshot.'
    );
  }

  let mediumData =
    mediumResult.status === 'fulfilled'
      ? normalizeMedium(mediumResult.value?.items)
      : [];

  if (mediumData.length === 0) {
    const mediumFallback = await readFile(
      join(process.cwd(), 'public', 'feed.xml'),
      'utf8'
    );
    mediumData = normalizeMediumFeed(mediumFallback);

    if (mediumData.length === 0) {
      // eslint-disable-next-line no-console
      console.error('No Medium articles found in the bundled RSS feed.');
    } else if (mediumResult.status === 'fulfilled') {
      // eslint-disable-next-line no-console
      console.warn(
        'Medium API returned no articles; using the bundled RSS feed.'
      );
    }
  }

  return {
    props: {
      githubData,
      mediumData,
    },
  };
}

interface PageProps {
  githubData: IGitHub[];
  mediumData: IMedium[];
}

/** Main page */
export default function Page({ githubData, mediumData }: PageProps) {
  return (
    <div className={styles.container}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <Header />
      <Toggle />

      <div className={styles.main}>
        <Sidebar />
        <Article githubData={githubData} mediumData={mediumData} />
      </div>

      <Footer />
    </div>
  );
}
