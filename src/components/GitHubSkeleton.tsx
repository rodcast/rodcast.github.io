import styles from '@/styles/article.module.css';
import Skeleton from './Skeleton';

export default function GitHubSkeleton() {
  return (
    <article className={styles.content}>
      <header className={styles.title}>My repositories on GitHub</header>
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={`github-repo-skeleton-${index + 1}`} width="100%" height="50px" marginBottom="var(--space-x-2)" />
      ))}
    </article>
  );
}
