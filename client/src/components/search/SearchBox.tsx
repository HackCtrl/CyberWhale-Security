
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchContent, SearchResult } from '@/lib/search';
import SearchResults from './SearchResults';
import { useNavigate } from 'react-router-dom';

interface SearchBoxProps {
  className?: string;
  placeholder?: string;
  onClose?: () => void;
  isExpanded?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  className = '',
  placeholder = 'Поиск по сайту...',
  onClose,
  isExpanded = false
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const searchResults = searchContent(searchQuery);
      setResults(searchResults);
      setIsLoading(false);
    }, 300);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    // Close search dropdown
    setQuery('');
    setResults([]);
    setIsFocused(false);
    onClose?.();
  };

  useEffect(() => {
    // Focus input when expanded
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className="pl-10 pr-10 bg-cyberdark-800 border-cyberdark-700 text-sm"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {query && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {(isFocused && (query || isLoading)) && (
        <div 
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-cyberdark-900 border border-cyberdark-700 rounded-md shadow-lg overflow-hidden"
        >
          <SearchResults 
            results={results} 
            isLoading={isLoading} 
            onResultClick={handleResultClick} 
          />
        </div>
      )}
    </div>
  );
};

export default SearchBox;
