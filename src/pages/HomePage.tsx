import React, { useEffect, useState } from 'react';
import SearchBar from '../components/news/SearchBar';
import FilterPanel from '../components/news/FilterPanel';
import ArticleList from '../components/news/ArticleList';
import { useNews } from '../contexts/NewsContext';
import { usePreferences } from '../contexts/PreferencesContext';
import Layout from '../components/layout/Layout';
import { categories, sources } from '../constants';
import { Filters } from '../types/Filters';

const HomePage: React.FC = () => {
  const { articles, loading, error, searchArticles } = useNews();
  const { preferences } = usePreferences();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [isSearchResult, setIsSearchResult] = useState(false);

  useEffect(() => {
    const fetchInitialArticles = async () => {
      const preferenceFilters: Filters = {};
      if (preferences.sources.length > 0) {
        preferenceFilters.source = preferences.sources.join(',');
      }

      if (preferences.categories.length > 0) {
        preferenceFilters.category = preferences.categories.join(',');
      }

      await searchArticles('', preferenceFilters);
    };

    fetchInitialArticles();
  }, [preferences]);

  const handleSearch = (query: string) => {
    setIsSearchResult(query ? true : false);
    setSearchQuery(query);
    searchArticles(query, filters);
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    if (!newFilters.source) {
      newFilters.source = sources.map(src => src.id).join(',')
    }
    searchArticles(searchQuery, newFilters);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap md:flex-nowrap gap-5">
          <div className="w-full md:w-3/4">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="w-full md:w-1/4">
            <FilterPanel
              onApplyFilters={handleApplyFilters}
              categories={categories}
              sources={sources}
            />
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{isSearchResult ? 'Search result' : 'Top News'}</h1>
          <p className="text-gray-600">
            Your personalized news feed from multiple trustworthy sources
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <ArticleList articles={articles} loading={loading} error={error} />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;