import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../contexts/PreferencesContext';
import { useNews } from '../contexts/NewsContext';
import Layout from '../components/layout/Layout';
import { categories, sources } from '../constants';
import { Article } from '../types/Article';

const PreferencesPage: React.FC = () => {
  const { preferences, updatePreferences, resetPreferences } = usePreferences();
  const { articles, loading, searchArticles } = useNews();

  const navigate = useNavigate();

  const [selectedSources, setSelectedSources] = useState<string[]>(preferences.sources);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(preferences.categories);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(preferences.authors);
  const [uniqueAuthors, setUniqueAuthors] = useState<string[]>([]);

  useEffect(() => {
    const fetchInitialArticles = async () => {
      await searchArticles('', { source: 'the-guardian,new-york-times,news-api' });
    };
    fetchInitialArticles();
  }, []);

  useEffect(() => {
    if (articles && articles.length > 0) {
      setUniqueAuthors(getUniqueAuthors(articles) as string[]);
    }
  }, [articles]);

  function getUniqueAuthors(articles: Article[]) {
    const authors = new Set();

    articles.forEach(article => {
      if (article) {
        authors.add(article.author);
      }
    });
    return Array.from(authors);
  }

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleAuthor = (authorId: string) => {
    setSelectedAuthors(prev =>
      prev.includes(authorId)
        ? prev.filter(id => id !== authorId)
        : [...prev, authorId]
    );
  };

  const handleSave = () => {
    if (selectedSources.length === 0) {
      alert('Please select at least one news source.');
      return;
    }
    updatePreferences({
      sources: selectedSources,
      categories: selectedCategories,
      authors: selectedAuthors,
    });
    navigate('/');
  };

  const handleReset = () => {
    resetPreferences();
    setSelectedSources(preferences.sources);
    setSelectedCategories(preferences.categories);
    setSelectedAuthors(preferences.authors);
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Customize Your News Feed</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select News Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sources.map(source => (
              <div key={source.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`source-${source.id}`}
                  checked={selectedSources.includes(source.id)}
                  onChange={() => toggleSource(source.id)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
                />
                <label htmlFor={`source-${source.id}`} className="ml-2 text-gray-700 cursor-pointer">
                  {source.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
                />
                <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700 cursor-pointer">
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Favorite Authors</h2>
          {loading &&
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {!loading && uniqueAuthors.map((author, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`author-${index}`}
                  checked={selectedAuthors.includes(author)}
                  onChange={() => toggleAuthor(author)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded flex-shrink-0"
                />
                <label htmlFor={`author-${index}`} className="ml-2 text-gray-700 cursor-pointer line-clamp-1">
                  {author}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mb-8">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PreferencesPage;