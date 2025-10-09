import { IGitHubApi } from '@/interfaces/github';
import { IMediumApi } from '@/interfaces/medium';
import styles from '@/styles/article.module.css';
import { Suspense } from 'react';

import ApiErrorFallback from './ApiErrorFallback';
import ErrorBoundary from './ErrorBoundary';
import GitHub from './GitHub';
import GitHubSkeleton from './GitHubSkeleton';
import Medium from './Medium';
import MediumSkeleton from './MediumSkeleton';

interface ArticleProps {
  dataGitHub: IGitHubApi;
  dataMedium: IMediumApi;
  isLoading?: boolean;
}

/**
 * Main article component that displays GitHub repositories and Medium articles
 * @param dataGitHub - GitHub API response data
 * @param dataMedium - Medium API response data  
 * @param isLoading - Loading state indicator
 */
export default function Article({ dataGitHub, dataMedium, isLoading = false }: ArticleProps) {
  return (
    <main className={styles.content}>
      <section id="github-projects">
        <ErrorBoundary 
          fallback={<ApiErrorFallback title="My repositories on GitHub" />}
        >
          {isLoading ? (
            <GitHubSkeleton />
          ) : (
            <Suspense fallback={<GitHubSkeleton />}>
              <GitHub data={dataGitHub} />
            </Suspense>
          )}
        </ErrorBoundary>
      </section>
      <section id="medium-articles" className={styles.medium_articles}>
        <ErrorBoundary 
          fallback={<ApiErrorFallback title="My articles on Medium" />}
        >
          {isLoading ? (
            <MediumSkeleton />
          ) : (
            <Suspense fallback={<MediumSkeleton />}>
              <Medium data={dataMedium} />
            </Suspense>
          )}
        </ErrorBoundary>
      </section>
    </main>
  );
}
