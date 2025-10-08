import { IMedium, IMediumApi } from '@/interfaces/index';

export const normalizeMedium = (apiResponse: IMediumApi): IMedium[] => {
  if (!apiResponse || !Array.isArray(apiResponse)) {
    return [];
  }

  return apiResponse
    .map((article): IMedium | null => {
      const { guid, title, link, pubDate, content } = article;

      if (!guid || !title || !link) return null;

      const h4Tag = content?.match(/<h4>(.*?)<\/h4>/);
      const descriptionContent = h4Tag ? h4Tag[1] : '';

      return {
        guid,
        title,
        link,
        pubDate,
        content: descriptionContent,
      };
    })
    .filter((article): article is IMedium => article !== null);
};
