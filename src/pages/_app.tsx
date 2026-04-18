import { GoogleAnalytics } from '@next/third-parties/google';
// import { SpeedInsights } from '@vercel/speed-insights/next';
import type { WebMCPTool } from '@/types/webmcp';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

import '@/styles/globals.css';

const title = 'Rodrigo Castilho (RODCAST)';

/** Main app component */
function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.modelContext) {
      return;
    }

    const tools: WebMCPTool[] = [
      {
        name: 'getProfileSummary',
        description:
          'Returns the owner profile summary and canonical profile links.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        execute: () =>
          Promise.resolve({
            name: 'Rodrigo Castilho (RODCAST)',
            title: 'Staff Frontend Engineer',
            website: 'https://rodrigocastilho.com/',
            social: {
              github: 'https://github.com/rodcast',
              medium: 'https://medium.com/@rodcast',
              linkedin: 'https://www.linkedin.com/in/rodrigocastilho',
            },
          }),
      },
      {
        name: 'listLatestGitHubRepos',
        description:
          'Returns the latest public repositories for @rodcast from the homepage API source.',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              minimum: 1,
              maximum: 20,
              default: 6,
            },
          },
          additionalProperties: false,
        },
        execute: async (input) => {
          const limit =
            typeof input?.limit === 'number' && input.limit > 0
              ? Math.min(input.limit, 20)
              : 6;
          const response = await fetch(
            'https://api.github.com/users/rodcast/repos'
          );
          const repos = (await response.json()) as Array<{
            name: string;
            html_url: string;
            description: string | null;
            stargazers_count: number;
            language: string | null;
            updated_at: string;
          }>;

          return repos.slice(0, limit).map((repo) => ({
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language,
            updatedAt: repo.updated_at,
          }));
        },
      },
      {
        name: 'listLatestArticles',
        description: 'Returns latest Medium articles by @rodcast.',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              minimum: 1,
              maximum: 10,
              default: 5,
            },
          },
          additionalProperties: false,
        },
        execute: async (input) => {
          const limit =
            typeof input?.limit === 'number' && input.limit > 0
              ? Math.min(input.limit, 10)
              : 5;
          const response = await fetch(
            'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@rodcast'
          );
          const payload = (await response.json()) as {
            items?: Array<{
              title: string;
              link: string;
              pubDate: string;
              thumbnail?: string;
              categories?: string[];
            }>;
          };
          const items = Array.isArray(payload.items) ? payload.items : [];

          return items.slice(0, limit).map((item) => ({
            title: item.title,
            url: item.link,
            publishedAt: item.pubDate,
            thumbnail: item.thumbnail ?? null,
            categories: item.categories ?? [],
          }));
        },
      },
    ];

    navigator.modelContext.provideContext({ tools }).catch(() => undefined);
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_TRACKING_ID} />
      )}
      <main>
        <Component {...pageProps} />
        {/* <SpeedInsights /> */}
      </main>
    </>
  );
}

export default App;
