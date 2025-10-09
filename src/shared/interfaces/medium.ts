export interface IMedium {
  guid: string;
  title: string;
  link: string;
  pubDate: number;
  content: string;
}

export interface IMediumApi {
  status?: string;
  feed?: Feed;
  items?: Item[];
  [x: string]: unknown;
}

interface Feed {
  url: string;
  title: string;
  link: string;
  author: string;
  description: string;
  image: string;
}

export interface Item {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: unknown;
  categories: string[];
}
