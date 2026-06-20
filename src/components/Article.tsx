import { IGitHub } from '@/interfaces/github';
import { IMedium } from '@/interfaces/medium';
import styles from '@/styles/article.module.css';

import ApiErrorFallback from './ApiErrorFallback';
import ErrorBoundary from './ErrorBoundary';
import GitHub from './GitHub';
import Medium from './Medium';

interface ArticleProps {
  dataGitHub: IGitHub[];
  dataMedium: IMedium[];
}

/** Main article component */
export default function Article({ dataGitHub, dataMedium }: ArticleProps) {
  return (
    <main className={styles.content}>
      <section id="github-projects">
        <ErrorBoundary
          fallback={<ApiErrorFallback title="My repositories on GitHub" />}
        >
          <GitHub data={dataGitHub} />
        </ErrorBoundary>
      </section>
      <section id="medium-articles" className={styles.medium_articles}>
        <ErrorBoundary
          fallback={<ApiErrorFallback title="My articles on Medium" />}
        >
          <Medium data={dataMedium} />
        </ErrorBoundary>
      </section>
    </main>
  );
}
