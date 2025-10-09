import { GITHUB_API, MEDIUM_API } from '@/constants/paths';
import { IGitHubApi } from '@/interfaces/github';
import { IMediumApi } from '@/interfaces/medium';
import { fetchData } from '@/utils/fetch';
import dynamic from 'next/dynamic';

import styles from '@/styles/page.module.css';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Toggle from '@/components/Toggle';

const Article = dynamic(() => import('@/components/Article'));

/** Fetch data at build time */
export async function getStaticProps() {
  let dataGitHub = [];
  let dataMedium = [];

  try {
    [dataGitHub, dataMedium] = await Promise.all([
      fetchData(GITHUB_API),
      fetchData(MEDIUM_API),
    ]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching data at build time:', error);
    return {
      props: { dataGitHub: [], dataMedium: [] },
    };
  }

  return {
    props: { dataGitHub, dataMedium },
  };
}

interface PageProps {
  dataGitHub: IGitHubApi;
  dataMedium: IMediumApi;
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
