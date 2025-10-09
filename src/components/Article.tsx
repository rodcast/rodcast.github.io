import styles from '@/styles/article.module.css';

import GitHub from './GitHub';
import Medium from './Medium';

export default function Article({ dataGitHub, dataMedium }) {
  return (
    <main className={styles.content}>
      <section id="github-projects">
        <GitHub data={dataGitHub} />
      </section>
      <section id="medium-articles" className={styles.medium_articles}>
        <Medium data={dataMedium} />
      </section>
    </main>
  );
}
