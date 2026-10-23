import { IMedium, Item } from '@/interfaces/index';

type MediumSourceItem = Pick<Item, 'guid' | 'title' | 'link' | 'pubDate'> &
  Partial<Pick<Item, 'content' | 'description'>>;

const decodeXmlEntities = (value: string): string =>
  value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity) => {
    if (entity[1] === '#') {
      const isHex = entity[2]?.toLowerCase() === 'x';
      const codePoint = Number.parseInt(
        entity.slice(isHex ? 3 : 2),
        isHex ? 16 : 10
      );

      return codePoint >= 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : entity;
    }

    const namedEntities: Record<string, string> = {
      amp: '&',
      apos: "'",
      gt: '>',
      lt: '<',
      quot: '"',
    };

    return namedEntities[entity.slice(1, -1).toLowerCase()] ?? entity;
  });

const readXmlTag = (item: string, tag: string): string => {
  const match = item.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i')
  );

  return decodeXmlEntities(match?.[1]?.trim() ?? '');
};

/** Normalize Medium API data */
export const normalizeMedium = (items?: MediumSourceItem[]): IMedium[] => {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return items
    .map((article): IMedium | null => {
      const { guid, title, link, pubDate, content } = article;

      if (!guid || !title || !link) return null;

      const h4Tag = content?.match(/<h4>(.*?)<\/h4>/);
      const descriptionContent =
        h4Tag?.[1] ?? article.description ?? content ?? '';

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

/** Normalize articles from the bundled RSS feed */
export const normalizeMediumFeed = (feed: string): IMedium[] => {
  const items = Array.from(
    feed.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi),
    ([, item]) => {
      const description = readXmlTag(item, 'description');

      return {
        guid: readXmlTag(item, 'guid') || readXmlTag(item, 'link'),
        title: readXmlTag(item, 'title'),
        link: readXmlTag(item, 'link'),
        pubDate: readXmlTag(item, 'pubDate'),
        content: description,
        description,
      };
    }
  );

  return normalizeMedium(items);
};
