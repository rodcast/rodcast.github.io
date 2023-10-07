import dynamic from 'next/dynamic';
import styles from '@/styles/article.module.css';
import GitHubSkeleton from './GitHubSkeleton';
import MediumSkeleton from './MediumSkeleton';

const GitHub = dynamic(() => import('./GitHub'), {
  loading: () => <GitHubSkeleton />,
});

const Medium = dynamic(() => import('./Medium'), {
  loading: () => <MediumSkeleton />,
});

export default function Article({ dataGitHub, dataMedium }) {
  return (
    <main className={styles.content}>
      <GitHub data={dataGitHub} />
      <Medium data={dataMedium} />
    </main>
  );
}
