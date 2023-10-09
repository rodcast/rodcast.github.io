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
        <div className={styles.hide}>
          <>
            {Array(10000).fill(0).forEach((_, i) => (
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac enim vel orci finibus posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean tempus, purus quis sodales tristique, mi lorem tempus turpis, quis aliquet ante massa at tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus auctor accumsan aliquam. Maecenas ac lorem at ligula consectetur facilisis vel at enim. Nam eu porta tellus, ut congue ex. Donec auctor ligula velit, a malesuada dui mattis vel. Suspendisse potenti. Maecenas a tortor felis. Aenean at dui nec turpis placerat malesuada id sit amet odio. Vivamus convallis lacus vitae erat bibendum fermentum. Aenean ac nulla eleifend, venenatis nunc eu, lacinia risus.</p>
            ))}
          </>
        </div>
      </div>
    </div>
  );
}
