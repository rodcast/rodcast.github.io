import GitHub from './GitHub';
import Medium from './Medium';
import styles from '@/styles/article.module.css';

export default function Article() {
  return (
    <main className={styles.content}>
      <GitHub />
      <Medium />
    </main>
  );
}
