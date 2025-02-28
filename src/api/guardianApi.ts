import axios from 'axios';
import { Article } from '../types/Article';

const GUARDIAN_API_KEY = import.meta.env.VITE_THEGUARDIAN_API_KEY;
const GUARDIAN_API_URL = 'https://content.guardianapis.com';

interface GuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: {
    headline?: string;
    trailText?: string;
    byline?: string;
    thumbnail?: string;
    body?: string;
  };
}

interface GuardianResponse {
  response: {
    status: string;
    userTier: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    results: GuardianArticle[];
  };
}

const mapGuardianToArticle = (item: GuardianArticle): Article => ({
  id: item.id,
  title: item.webTitle,
  description: item.fields?.trailText || '',
  content: item.fields?.body || '',
  author: item.fields?.byline || 'The Guardian',
  publishedAt: item.webPublicationDate,
  url: item.webUrl,
  urlToImage: item.fields?.thumbnail,
  source: {
    id: 'the-guardian',
    name: 'The Guardian',
  },
  category: item.sectionName,
});

export const guardianApi = {
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
        'api-key': GUARDIAN_API_KEY,
        'show-fields': 'headline,trailText,byline,thumbnail,body',
      };

      if (query) {
        params.q = query;
      }

      if (filters.from) {
        params['from-date'] = filters.from;
      }
      if (filters.to) {
        params['to-date'] = filters.to;
      }

      if (filters.category) {
        params.section = filters.category;
      }

      const response = await axios.get<GuardianResponse>(`${GUARDIAN_API_URL}/search`, { params });
      
      return response.data.response.results.map(mapGuardianToArticle);
    } catch (error) {
      console.error('Error fetching articles from The Guardian:', error);
      return [];
    }
  }
};