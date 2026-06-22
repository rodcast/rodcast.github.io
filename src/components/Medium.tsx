import { IMedium } from '@/interfaces/index';

const titleClass =
  'mb-2 border-b border-dotted border-[var(--secondary-color)] pb-2 text-2xl font-semibold [transition:all_0.2s]';
const descriptionClass = 'block text-sm leading-[150%] [transition:all_0.2s]';
const timeClass =
  'mb-2 block text-sm text-[var(--contrast-color)] [transition:all_0.2s]';
const urlClass =
  'text-[var(--secondary-color)] shadow-[0_1px_var(--secondary-color)] [transition:all_0.2s] hover:shadow-none focus:shadow-none';
const viewAllLinkClass =
  'inline-block text-[var(--secondary-color)] no-underline [transition:all_0.2s_ease] hover:bg-[var(--secondary-color)] hover:text-[var(--primary-color)]';

interface MediumProps {
  data?: IMedium[];
}

/** Medium articles */
export default function Medium({ data }: MediumProps) {
  const articles: IMedium[] = data ?? [];

  const isError = !data;
  const isEmpty = articles.length === 0;

  let message: string | null = null;
  if (isError) {
    message = 'There is an error in Medium API.';
  } else if (isEmpty) {
    message = 'No articles available at the moment.';
  }

  return (
    <article className="relative mb-16 [grid-area:article] last:mb-0">
      <h2 className={titleClass}>My articles on Medium</h2>

      {message && <span className={descriptionClass}>{message}</span>}

      {Array.isArray(articles) && (
        <ol>
          {articles.map(({ guid, title, link, pubDate, content }) => {
            const publishedDate = new Date(pubDate);
            const isValidPublishedDate = !Number.isNaN(publishedDate.getTime());

            const dateLabel = isValidPublishedDate
              ? new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'long',
                }).format(publishedDate)
              : 'Date unavailable';

            return (
              <li key={guid} className="mb-8 last:mb-0">
                <span className="block text-base font-semibold [transition:all_0.2s]">
                  <a
                    href={link}
                    title={title}
                    className={urlClass}
                    rel="external"
                  >
                    {title}
                  </a>
                </span>
                {isValidPublishedDate ? (
                  <time
                    className={timeClass}
                    dateTime={publishedDate.toISOString()}
                  >
                    {dateLabel}
                  </time>
                ) : (
                  <span className={timeClass}>{dateLabel}</span>
                )}
                <span className={descriptionClass}>{content}</span>
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-8 text-center">
        <a
          href="https://medium.com/@rodcast"
          className={viewAllLinkClass}
          rel="external"
          title="Read all articles on Medium"
        >
          Read all articles →
        </a>
      </p>
    </article>
  );
}
