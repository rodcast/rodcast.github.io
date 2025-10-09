import styles from '@/styles/article.module.css';
import Skeleton from './Skeleton';

export default function MediumSkeleton() {
  return (
    <article className={styles.content}>
      <header className={styles.title}>My articles on Medium</header>
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={`medium-article-skeleton-${index + 1}`} width="100%" height="50px" marginBottom="var(--space-x-2)" />
      ))}
    </article>
  );
}
