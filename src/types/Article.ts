export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  url: string;
  urlToImage?: string;
  source: {
    id: string;
    name: string;
  };
  category?: string;
}