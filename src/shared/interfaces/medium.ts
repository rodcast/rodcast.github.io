export interface IMedium {
  guid: string;
  title: string;
  link: string;
  pubDate: number;
  content: string;
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
