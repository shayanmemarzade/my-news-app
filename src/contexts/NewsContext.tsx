import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Article } from '../types/Article';
import { fetchAllArticles } from '../api';
import { Filters } from '../types/Filters';

interface NewsContextProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  searchArticles: (query: string, filters: Filters) => Promise<void>;
  clearArticles: () => void;
}

const NewsContext = createContext<NewsContextProps | undefined>(undefined);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchArticles = async (
    query: string,
    filters: {
      date?: string;
      category?: string;
      source?: string;
    } = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArticles = await fetchAllArticles(query, filters);
      setArticles(fetchedArticles);
    } catch (err) {
      setError('Failed to fetch articles. Please try again later.');
      console.error('Error in searchArticles:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearArticles = () => {
    setArticles([]);
  };

  return (
    <NewsContext.Provider
      value={{
        articles,
        loading,
        error,
        searchArticles,
        clearArticles,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = (): NewsContextProps => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};