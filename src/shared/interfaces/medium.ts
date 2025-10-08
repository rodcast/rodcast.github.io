export interface IMedium {
  guid: string;
  title: string;
  link: string;
  pubDate: number;
  content: string;
}

export interface IMediumApi {
  [x: string]: any;
  data?: {
    status: string;
    feed: Feed;
    items: Item[];
  };
}

interface Feed {
  url: string;
  title: string;
  link: string;
  author: string;
  description: string;
  image: string;
}

interface Item {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: Enclosure;
  categories: string[];
}

interface Enclosure { }
