import axios from 'axios';
import { Article } from '../types/Article';

const NYT_API_KEY = import.meta.env.VITE_NYTIMES_API_KEY;
const NYT_API_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

interface NytArticle {
  _id: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  abstract: string;
  source: string;
  headline: {
    main: string;
    kicker: string;
    content_kicker: string;
    print_headline: string;
    name: string;
    seo: string;
    sub: string;
  };
  multimedia: Array<{
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    credit: string;
  }>;
  byline: {
    original: string;
    person: Array<{
      firstname: string;
      middlename: string;
      lastname: string;
      qualifier: string;
      title: string;
      role: string;
      organization: string;
      rank: number;
    }>;
    organization: string;
  };
  pub_date: string;
  section_name: string;
}

interface NytResponse {
  status: string;
  copyright: string;
  response: {
    docs: NytArticle[];
    meta: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}

const mapNytToArticle = (item: NytArticle): Article => {
  const imageUrl = item.multimedia.length > 0
    ? `https://www.nytimes.com/${item.multimedia[0].url}`
    : undefined;

  return {
    id: item._id,
    title: item.headline.main,
    description: item.snippet || item.abstract || '',
    content: item.lead_paragraph || '',
    author: item.byline?.original || 'The New York Times',
    publishedAt: item.pub_date,
    url: item.web_url,
    urlToImage: imageUrl,
    source: {
      id: 'new-york-times',
      name: 'The New York Times',
    },
    category: item.section_name,
  };
};

export const nytimesApi = {
  searchArticles: async (
    query: string = '',
    filters: {
      from?: string;
      category?: string;
      source?: string;
    } = {}
  ): Promise<Article[]> => {
    try {
      const params: Record<string, string> = {
        'api-key': NYT_API_KEY,
      };

      if (query) {
        params.q = query;
      }

      if (filters.from) {
        params.begin_date = filters.from.replace(/-/g, '');
      }

      if (filters.category) {
        params.fq = `section_name:${filters.category}`;
      }

      const response = await axios.get<NytResponse>(NYT_API_URL, { params });

      return response.data.response.docs.map(mapNytToArticle);
    } catch (error) {
      console.error('Error fetching articles from NYTimes:', error);
      return [];
    }
  }
};