import Skeleton from './Skeleton';
import styles from '@/styles/article.module.css';

export default function GitHubSkeleton() {
  return (
    <article className={styles.content}>
      <header className={styles.title}>My repositories on GitHub</header>
      <Skeleton width="100%" height="50px" marginBottom="var(--space-x-2)" />
      <Skeleton width="100%" height="50px" marginBottom="var(--space-x-2)" />
      <Skeleton width="100%" height="50px" marginBottom="var(--space-x-2)" />
    </article>
  );
}
