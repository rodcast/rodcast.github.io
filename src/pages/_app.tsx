import type { WebMCPTool } from '@/types/webmcp';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

import '@/styles/globals.css';

const title = 'Rodrigo Castilho (RODCAST)';

/** Returns the normalised text content of a DOM node, collapsing whitespace. */
const getText = (element: Node | null | undefined) =>
  (element?.textContent ?? '').trim().replace(/\s+/g, ' ');

/** Reads the profile summary and social links from the about section DOM. */
const getProfileSummary = () => {
  const about = document.getElementById('about');
  const links = Array.from(about?.querySelectorAll('a[href]') ?? []).map(
    (anchor) => ({
      label: getText(anchor),
      url: anchor.getAttribute('href') ?? '',
    })
  );

  return {
    name: getText(about?.querySelector('h2')),
    description: getText(about?.querySelector('h3')),
    section: 'about',
    links,
  };
};

/** Returns up to `limit` GitHub project entries from the rendered project list. */
const listGitHubProjects = (limit: number) => {
  const items = Array.from(
    document.querySelectorAll('#github-projects ol li')
  ).map((item) => {
    const link = item.querySelector('a[href]');

    return {
      name: getText(link),
      url: link?.getAttribute('href') ?? '',
      description: getText(item.querySelector('span:last-child')),
    };
  });

  return items.slice(0, limit);
};

/** Returns up to `limit` Medium article entries from the rendered articles list. */
const listMediumArticles = (limit: number) => {
  const items = Array.from(
    document.querySelectorAll('#medium-articles ol li')
  ).map((item) => {
    const link = item.querySelector('a[href]');
    const time = item.querySelector('time');
    const description = item.querySelector('span:last-child');

    return {
      title: getText(link),
      url: link?.getAttribute('href') ?? '',
      publishedAt: time?.getAttribute('datetime') ?? getText(time),
      summary: getText(description),
    };
  });

  return items.slice(0, limit);
};

/** Builds the WebMCP tool definitions backed by the current DOM state. */
const buildWebMCPTools = (): WebMCPTool[] => [
  {
    name: 'get-profile-summary',
    title: 'Get profile summary',
    description:
      'Returns the visible profile summary and social links from the about section.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
    },
    execute: () => Promise.resolve(getProfileSummary()),
  },
  {
    name: 'navigate-to-section',
    title: 'Navigate to section',
    description:
      'Scrolls the page to a known section: about, github-projects, or medium-articles.',
    inputSchema: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          enum: ['about', 'github-projects', 'medium-articles'],
          description: 'The section id to navigate to.',
        },
      },
      required: ['section'],
      additionalProperties: false,
    },
    execute: (input) => {
      const section = typeof input?.section === 'string' ? input.section : '';
      const target = document.getElementById(section);

      if (!target) {
        return Promise.resolve({
          ok: false,
          error: 'unknown_section',
        });
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${section}`);

      return Promise.resolve({
        ok: true,
        section,
        title: getText(target.querySelector('header, h1, h2, h3')) || section,
      });
    },
  },
  {
    name: 'list-github-projects',
    title: 'List GitHub projects',
    description:
      'Returns the GitHub repositories currently rendered in the projects section.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          minimum: 1,
          maximum: 20,
          default: 6,
          description: 'Maximum number of repositories to return.',
        },
      },
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
    },
    execute: (input) => {
      const limit =
        typeof input?.limit === 'number' && input.limit > 0
          ? Math.min(input.limit, 20)
          : 6;

      return Promise.resolve(listGitHubProjects(limit));
    },
  },
  {
    name: 'list-medium-articles',
    title: 'List Medium articles',
    description:
      'Returns the Medium articles currently rendered in the articles section.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          minimum: 1,
          maximum: 10,
          default: 5,
          description: 'Maximum number of articles to return.',
        },
      },
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
    },
    execute: (input) => {
      const limit =
        typeof input?.limit === 'number' && input.limit > 0
          ? Math.min(input.limit, 10)
          : 5;

      return Promise.resolve(listMediumArticles(limit));
    },
  },
];

/** Keeps only the canonical WebMCP registerTool properties for stricter runtimes. */
const toRegisterToolPayload = ({
  name,
  description,
  inputSchema,
  execute,
}: WebMCPTool): WebMCPTool => ({
  name,
  description,
  inputSchema,
  execute,
});

/** Main app component */
function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => undefined;
    }

    const tools = buildWebMCPTools();
    const abortController = new AbortController();

    /** Registers WebMCP tools with all available APIs; returns true when any path succeeds. */
    const registerTools = async () => {
      const signal = abortController.signal;
      const navCtx = navigator.modelContext;
      const docCtx = document.modelContext;
      const canonicalTools = tools.map(toRegisterToolPayload);
      let didRegister = false;

      if (navCtx?.registerTool) {
        for (const tool of canonicalTools) {
          try {
            await navCtx.registerTool(tool, { signal });
            didRegister = true;
          } catch {
            // Some implementations reject individual tools; keep trying others.
          }
        }
      }

      if (navCtx?.provideContext) {
        try {
          await navCtx.provideContext({ tools });
          didRegister = true;
        } catch {
          // Ignore unsupported provideContext implementations.
        }
      }

      if (docCtx?.registerTool) {
        for (const tool of canonicalTools) {
          try {
            await docCtx.registerTool(tool, { signal });
            didRegister = true;
          } catch {
            // Ignore individual failures and continue with the remaining tools.
          }
        }
      }

      return didRegister;
    };

    const maxAttempts = 20;
    let attempts = 0;

    /** Tries tool registration repeatedly for a short window while APIs initialize. */
    const tryRegister = async () => {
      if (abortController.signal.aborted) {
        return;
      }

      attempts += 1;
      const success = await registerTools().catch(() => false);

      if (!success && attempts < maxAttempts) {
        window.setTimeout(tryRegister, 250);
      }
    };

    tryRegister().catch(() => undefined);

    return () => {
      abortController.abort();
    };
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
      </main>
    </>
  );
}

export default App;
