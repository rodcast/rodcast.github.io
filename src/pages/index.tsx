import { NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import { fetchData } from '@/utils/fetch';
import { GITHUB_API, MEDIUM_API } from '@/constants/paths';

import styles from '@/styles/page.module.css';

const Header = dynamic(() => import('@/components/Header'));

const Toggle = dynamic(() => import('@/components/Toggle'));

const Sidebar = dynamic(() => import('@/components/Sidebar'));

const Article = dynamic(() => import('@/components/Article'));

Page.getInitialProps = async (ctx: NextPageContext) => {
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
