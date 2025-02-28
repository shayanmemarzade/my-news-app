import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} News Aggregator</p>
          <p className="mt-1">
            Powered by The Guardian, New York Times, and NewsAPI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;