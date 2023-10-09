import dynamic from 'next/dynamic';
import { fetchData } from '@/utils/fetch';
import { GITHUB_API, MEDIUM_API } from '@/constants/paths';

import styles from '@/styles/page.module.css';

import Header from '@/components/Header';

import Toggle from '@/components/Toggle';

import Sidebar from '@/components/Sidebar';

const Article = dynamic(() => import('@/components/Article'));

Page.getInitialProps = async () => {
  const dataGitHub = await fetchData(GITHUB_API);
  const dataMedium = await fetchData(MEDIUM_API);

  return {
    dataGitHub,
    dataMedium,
  };
};

export default function Page({ dataGitHub, dataMedium }) {
  return (
    <div className={styles.container}>
      <Header />
      <Toggle />

      <div className={styles.main}>
        <Sidebar />

        <Article
          dataGitHub={dataGitHub}
          dataMedium={dataMedium}
        />
      </div>
    </div>
  );
}
