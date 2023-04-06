import { IMediumApi, IMedium } from '@/interfaces/index';

export const normalizeMedium = (data: IMediumApi): Array<IMedium> => {
  return data?.map((article: IMedium) => {
    const { guid, title, link, pubDate, content } = article;

    const html = new DOMParser().parseFromString(content, "text/html");
    const textContent = html.querySelector('h4')?.textContent;

    return {
      guid,
      title,
      link,
      pubDate,
      content: textContent
    };
  });
};
