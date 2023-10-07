import { IMediumApi, IMedium } from '@/interfaces/index';

export const normalizeMedium = (data: IMediumApi): Array<IMedium> => {
  return data?.map((article: IMedium) => {
    const { guid, title, link, pubDate, content } = article;

    const h4Tag = content?.match(/<h4>(.*?)<\/h4>/) ?? [];
    const descriptionContent = h4Tag[1] ?? '';

    return {
      guid,
      title,
      link,
      pubDate,
      content: descriptionContent
    };
  }).filter(Boolean);
};
