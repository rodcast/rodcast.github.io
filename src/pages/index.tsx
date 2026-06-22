import { GITHUB_API, MEDIUM_API } from '@/constants/paths';
import { IGitHub } from '@/interfaces/github';
import { IMedium } from '@/interfaces/medium';
import { fetchData } from '@/utils/fetch';
import { normalizeGitHub, normalizeMedium } from '@/utils/index';
import dynamic from 'next/dynamic';

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
    <div className="relative mx-auto max-w-[var(--max-width)] p-8 max-md:p-4">
      <Header />
      <Toggle />

      <div className="mt-8 grid grid-cols-[280px_auto] gap-8 [grid-template-areas:'sidebar_article'] max-md:grid-cols-1 max-md:gap-16 max-md:[grid-template-areas:'sidebar'_'article']">
        <Sidebar />
        <Article dataGitHub={dataGitHub} dataMedium={dataMedium} />
      </div>

      <Footer />
    </div>
  );
}
