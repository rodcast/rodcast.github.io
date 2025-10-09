import { IMedium, Item } from '@/interfaces/index';

/** Normalize Medium API data */
export const normalizeMedium = (items?: Item[]): IMedium[] => {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return items
    .map((article): IMedium | null => {
      const { guid, title, link, pubDate, content } = article;

      if (!guid || !title || !link) return null;

      const h4Tag = content?.match(/<h4>(.*?)<\/h4>/);
      const descriptionContent = h4Tag ? h4Tag[1] : '';

      return {
        guid,
        title,
        link,
        pubDate: new Date(pubDate).getTime(),
        content: descriptionContent,
      };
    })
    .filter((article): article is IMedium => article !== null);
};
