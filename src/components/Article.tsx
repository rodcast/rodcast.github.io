import styles from '@/styles/article.module.css';

import GitHub from './GitHub';
import Medium from './Medium';

export default function Article({ dataGitHub, dataMedium }) {
  return (
    <main className={styles.content}>
      <GitHub data={dataGitHub} />
      <Medium data={dataMedium} />
    </main>
  );
}
