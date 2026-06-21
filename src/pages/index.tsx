import { GITHUB_API, MEDIUM_API } from '@/constants/paths';
import { IGitHub } from '@/interfaces/github';
import { IMedium } from '@/interfaces/medium';
import { fetchData } from '@/utils/fetch';
import { normalizeGitHub, normalizeMedium } from '@/utils/index';
import dynamic from 'next/dynamic';

import styles from '@/styles/page.module.css';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Toggle from '@/components/Toggle';

const Article = dynamic(() => import('@/components/Article'));

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

  return {
    props: {
      dataGitHub:
        githubResult.status === 'fulfilled'
          ? normalizeGitHub(githubResult.value)
          : [],
      dataMedium:
        mediumResult.status === 'fulfilled'
          ? normalizeMedium(mediumResult.value?.items)
          : [],
    },
  };
}

interface PageProps {
  dataGitHub: IGitHub[];
  dataMedium: IMedium[];
}

/** Main page */
export default function Page({ dataGitHub, dataMedium }: PageProps) {
  return (
    <div className={styles.container}>
      <Header />
      <Toggle />

      <div className={styles.main}>
        <Sidebar />
        <Article dataGitHub={dataGitHub} dataMedium={dataMedium} />
      </div>

      <Footer />
    </div>
  );
}
