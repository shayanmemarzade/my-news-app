import React, { useState, useRef, useEffect } from 'react';
import { formatISO } from 'date-fns';

interface FilterPanelProps {
  onApplyFilters: (filters: {
    from?: string;
    to?: string;
    category?: string;
    source?: string;
  }) => void;
  categories: {
    id: string
    name: string
  }[];
  sources: {
    id: string
    name: string
  }[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onApplyFilters,
  categories,
  sources,
}) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleApplyFilters = () => {
    onApplyFilters({
      from: dateFrom || undefined,
      to: dateTo || undefined,
      category: category || undefined,
      source: source || undefined,
    });
    setIsExpanded(false);
  };

  const handleReset = () => {
    setDateFrom('');
    setDateTo('');
    setCategory('');
    setSource('');
    onApplyFilters({});
  };

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div className="relative" ref={panelRef}>
      <div className="bg-white shadow-md rounded-lg p-3 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-700">Filter Articles</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-sm hover:underline focus:outline-none cursor-pointer"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white shadow-lg rounded-lg p-4 mt-1">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1" htmlFor="date-filter-from">
                Published From
              </label>
              <input
                id="date-filter-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                max={formatISO(new Date(), { representation: 'date' })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1" htmlFor="date-filter-to">
                Published To
              </label>
              <input
                id="date-filter-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                max={formatISO(new Date(), { representation: 'date' })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1" htmlFor="category-filter">
                Category
              </label>
              <select
                id="category-filter"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1" htmlFor="source-filter">
                Source
              </label>
              <select
                id="source-filter"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Sources</option>
                {sources.map((src) => (
                  <option key={src.id} value={src.id}>
                    {src.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleApplyFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;