
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchResult } from '@/lib/search';
import { Shield, BookOpen, Users, Package, Layout, ExternalLink } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  onResultClick?: () => void;
}

// Helper function to get icon by result type
const getIconByType = (type: SearchResult['type']) => {
  switch (type) {
    case 'challenge':
      return <Shield className="w-4 h-4" />;
    case 'article':
      return <BookOpen className="w-4 h-4" />;
    case 'community':
      return <Users className="w-4 h-4" />;
    case 'product':
      return <Package className="w-4 h-4" />;
    case 'page':
      return <Layout className="w-4 h-4" />;
    default:
      return null;
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading = false,
  onResultClick
}) => {
  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-400">
        Поиск...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-400">
        Ничего не найдено
      </div>
    );
  }

  return (
    <div className="py-2">
      {results.map((result) => {
        const isExternal = result.url.startsWith('http');
        
        const ResultComponent = isExternal ? (
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start p-3 hover:bg-cyberdark-800 transition-colors rounded-md"
            onClick={onResultClick}
          >
            <div className="mr-3 mt-0.5 text-gray-400">
              {getIconByType(result.type)}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium group-hover:text-primary">
                {result.title}
                {isExternal && <ExternalLink className="inline-block ml-1 w-3 h-3" />}
              </p>
              <p className="text-sm text-gray-400 mt-1">{result.description}</p>
            </div>
          </a>
        ) : (
          <Link
            to={result.url}
            className="flex items-start p-3 hover:bg-cyberdark-800 transition-colors rounded-md"
            onClick={onResultClick}
          >
            <div className="mr-3 mt-0.5 text-gray-400">
              {getIconByType(result.type)}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium group-hover:text-primary">
                {result.title}
              </p>
              <p className="text-sm text-gray-400 mt-1">{result.description}</p>
            </div>
          </Link>
        );
        
        return (
          <div key={result.id} className="group">
            {ResultComponent}
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;
