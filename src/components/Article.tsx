import styles from '@/styles/article.module.css';
import GitHub from './GitHub';
import Medium from './Medium';

export default function Article() {
  return (
    <main className={styles.content}>
      <GitHub />
      <Medium />
    </main>
  );
}
