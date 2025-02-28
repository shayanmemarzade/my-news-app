import axios from 'axios';
import { guardianApi } from './guardianApi';
import { nytimesApi } from './nytimesApi';
import { newsApi } from './newsApi';
import { Article } from '../types/Article';

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAllArticles = async (
  query: string = '',
  filters: {
    date?: string;
    category?: string | string[];
    source?: string;
  } = {}
): Promise<Article[]> => {
  try {
    const userPreferences = JSON.parse(localStorage.getItem('newsPreferences') || '{}');
    const selectedSources = filters.source ? filters.source.split(',') : userPreferences.sources || [];

    const categories = Array.isArray(filters.category)
      ? filters.category
      : filters.category?.split(',').map(cat => cat.trim()).filter(Boolean) || [];

    let allArticles: Article[] = [];

    const fetchArticlesForCategory = async (category?: string) => {
      const categoryFilters = { ...filters, category };
      const fetchPromises = [];
      const articles: Article[] = [];

      if (selectedSources.includes('the-guardian') || selectedSources.length === 0) {
        fetchPromises.push(
          guardianApi.searchArticles(query, categoryFilters)
            .then(data => articles.push(...data))
            .catch(err => {
              console.error('Guardian API error:', err);
              return [];
            })
        );
      }

      if (selectedSources.includes('news-api') || selectedSources.length === 0) {
        fetchPromises.push(
          newsApi.searchArticles(query, categoryFilters)
            .then(data => articles.push(...data))
            .catch(err => {
              console.error('News API error:', err);
              return [];
            })
        );
      }

      if (selectedSources.includes('new-york-times') || selectedSources.length === 0) {
        fetchPromises.push(
          nytimesApi.searchArticles(query, categoryFilters)
            .then(data => articles.push(...data))
            .catch(err => {
              console.error('NYTimes API error:', err);
              return [];
            })
        );
      }

      await Promise.all(fetchPromises);
      return articles;
    };

    if (categories.length > 1) {
      const categoryPromises = categories.map(category => fetchArticlesForCategory(category));
      const categoryResults = await Promise.all(categoryPromises);

      const articleMap = new Map();
      categoryResults.flat().forEach(article => {
        articleMap.set(article.url, article);
      });

      allArticles = Array.from(articleMap.values());
    } else {
      allArticles = await fetchArticlesForCategory(filters.category as string);
    }

    return allArticles.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching articles from all sources:', error);
    return [];
  }
};

export { guardianApi, nytimesApi, newsApi };
export default api;