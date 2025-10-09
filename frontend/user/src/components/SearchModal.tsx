import React, { useEffect, useState, useRef } from 'react';
import { SearchIcon, ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../context/CartContext';
import { searchProducts } from '../services/productService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handle = setTimeout(() => {
      const doSearch = async () => {
        try {
          if (!searchQuery) {
            setSearchResults([]);
            return;
          }
          setLoading(true);
          const data = await searchProducts(searchQuery, { limit: 10 });
          // Depending on backend response structure, adapt:
          // If backend returns { products, total } or an array directly
          const results = Array.isArray(data) ? data : (data.products ?? data.items ?? []);
          setSearchResults(results);
        } catch (err) {
          console.error('Search error', err);
        } finally {
          setLoading(false);
        }
      };
      doSearch();
    }, 350);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  const handleSelect = (q: string) => {
    setRecentSearches(prev => [q, ...prev.filter(x => x !== q)].slice(0, 5));
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-start justify-center pt-20">
      <div className="bg-white w-full max-w-3xl rounded-md p-6">
        <div className="flex items-center gap-3">
          <SearchIcon />
          <input ref={searchInputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="flex-1 border rounded-md p-2" />
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>

        <div className="mt-4">
          {loading ? <div>Searching...</div> : (
            searchResults.length ? (
              <ul className="space-y-2">
                {searchResults.map((p: any) => (
                  <li key={p._id ?? p.id} className="flex items-center justify-between">
                    <Link to={`/product/${p._id ?? p.id}`} onClick={() => handleSelect(p.name)} className="flex items-center gap-3">
                      <img src={p.image ?? p.images?.[0]} alt={p.name} className="w-10 h-10 object-cover rounded" />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-gray-500">${(p.price || 0).toFixed(2)}</div>
                      </div>
                    </Link>
                    <ArrowRightIcon />
                  </li>
                ))}
              </ul>
            ) : <div className="text-gray-500">No results</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
