import styles from '@/styles/article.module.css';
import GitHub from './GitHub';
import Medium from './Medium';

export default function Article() {
  return (
    <div className={styles.content}>
      <GitHub />
      <Medium />
    </div>
  );
}
