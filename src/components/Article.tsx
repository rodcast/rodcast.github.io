import dynamic from 'next/dynamic';
import styles from '@/styles/article.module.css';

const GitHub = dynamic(() => import('./GitHub'));

const Medium = dynamic(() => import('./Medium'));

export default function Article({ dataGitHub, dataMedium }) {
  return (
    <main className={styles.content}>
      <GitHub data={dataGitHub} />
      <Medium data={dataMedium} />
    </main>
  );
}
