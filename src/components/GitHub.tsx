import { IGitHub } from '@/interfaces/index';

const titleClass =
  'mb-2 border-b border-dotted border-[var(--secondary-color)] pb-2 text-2xl font-semibold [transition:all_0.2s]';
const descriptionClass = 'block text-sm leading-[150%] [transition:all_0.2s]';
const urlClass =
  'text-[var(--secondary-color)] shadow-[0_1px_var(--secondary-color)] [transition:all_0.2s] hover:shadow-none focus:shadow-none';
const viewAllLinkClass =
  'inline-block text-[var(--secondary-color)] no-underline [transition:all_0.2s_ease] hover:bg-[var(--secondary-color)] hover:text-[var(--primary-color)]';

interface GitHubProps {
  data?: IGitHub[];
}

/** GitHub repositories */
export default function GitHub({ data }: GitHubProps) {
  const repos: IGitHub[] = data ?? [];

  const isError = !data;
  const isEmpty = repos?.length === 0;

  let message: string | null = null;
  if (isError) {
    message = 'There is an error in GitHub API.';
  } else if (isEmpty) {
    message = 'No repositories available at the moment.';
  }

  return (
    <article className="relative mb-16 [grid-area:article] last:mb-0">
      <h2 className={titleClass}>My repositories on GitHub</h2>

      {message && <span className={descriptionClass}>{message}</span>}

      {Array.isArray(repos) && (
        <ol>
          {repos.map(({ node_id, name, html_url, description }) => (
            <li key={node_id} className="mb-8 last:mb-0">
              <span className="block text-base font-semibold [transition:all_0.2s]">
                <a
                  href={html_url}
                  title={name}
                  className={urlClass}
                  rel="external"
                >
                  {name}
                </a>
              </span>
              <span className={descriptionClass}>{description}</span>
            </li>
          ))}
        </ol>
      )}

      <p className="mt-8 text-center">
        <a
          href="https://github.com/rodcast"
          className={viewAllLinkClass}
          rel="external"
          title="View all repositories on GitHub"
        >
          View all repositories →
        </a>
      </p>
    </article>
  );
}
