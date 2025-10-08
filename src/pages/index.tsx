import { GITHUB_API, MEDIUM_API } from '@/constants/paths';
import { fetchData } from '@/utils/fetch';
import dynamic from 'next/dynamic';

import styles from '@/styles/page.module.css';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Toggle from '@/components/Toggle';

const Article = dynamic(() => import('@/components/Article'));

export async function getStaticProps() {
  let dataGitHub = [];
  let dataMedium = [];

  try {
    [dataGitHub, dataMedium] = await Promise.all([
      fetchData(GITHUB_API),
      fetchData(MEDIUM_API),
    ]);
  } catch {
    return {
      props: { dataGitHub: [], dataMedium: [] },
    };
  }

  return {
    props: { dataGitHub, dataMedium },
  };
}

interface PageProps {
  dataGitHub: any[];
  dataMedium: any[];
}

export default function Page({ dataGitHub, dataMedium }: PageProps) {
  return (
    <div className={styles.container}>
      <Header />
      <Toggle />

      <div className={styles.main}>
        <Sidebar />
        <Article dataGitHub={dataGitHub} dataMedium={dataMedium} />
      </div>
    </div>
  );
}
