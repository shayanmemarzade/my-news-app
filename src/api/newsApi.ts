import axios from 'axios';
import { Article } from '../types/Article';

const NEWS_API_KEY = import.meta.env.VITE_NEWSAPI_ORG_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2';

interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

const mapNewsApiToArticle = (item: NewsApiArticle): Article => ({
  id: item.url,
  title: item.title,
  description: item.description || '',
  content: item.content || '',
  author: item.author || item.source.name,
  publishedAt: item.publishedAt,
  url: item.url,
  urlToImage: item.urlToImage || '/placeholder-news.jpg' as string || undefined,
  source: {
    id: item.source.id || 'unknown',
    name: item.source.name,
  },
});

export const newsApi = {
  searchArticles: async (
    query: string = '',
    filters: {
      from?: string;
      to?: string;
      category?: string;
      source?: string;
    } = {}
  ): Promise<Article[]> => {
    try {
      const params: Record<string, string> = {
        apiKey: NEWS_API_KEY,
      };

      if (query) {
        params.q = query;
      } else {
        params.country = 'us';
      }

      if (filters.from) {
        params.from = filters.from;
      }

      if (filters.to) {
        params.to = filters.to;
      }

      if (filters.category) {
        params.category = filters.category;
      }

      const endpoint = query ? 'everything' : 'top-headlines';
      const response = await axios.get<NewsApiResponse>(`${NEWS_API_URL}/${endpoint}`, { params });

      return response.data.articles.map(mapNewsApiToArticle);
    } catch (error) {
      console.error('Error fetching articles from NewsAPI:', error);
      return [];
    }
  },
};