import React from 'react';
import { Article } from '../../types/Article';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formattedDate = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
      <div className="h-48 overflow-hidden">
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {article.source.name}
          </span>
          {article.category && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {article.category}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3" dangerouslySetInnerHTML={{ __html: article.description }}></p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{article.author}</span>
          <span>{formattedDate}</span>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-blue-600 hover:underline text-sm font-medium"
        >
          Read full article →
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;