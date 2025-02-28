import React from 'react';
import { Article } from '../../types/Article';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, loading, error }) => {
  const filteredArticles = () => {
    const savedPreferences = localStorage.getItem('newsPreferences') || '{}';
    if (JSON.parse(savedPreferences)?.authors && JSON.parse(savedPreferences)?.authors.length > 0) {
        const authors = JSON.parse(savedPreferences).authors;
        return articles.filter(article => authors.includes(article.author));
    } else {
        return articles;
    }
  }
  const articlesToDisplay = filteredArticles();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (articlesToDisplay.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No articles found. Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articlesToDisplay.map((article: Article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;