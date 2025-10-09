import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { SearchIcon } from 'lucide-react';
import { PriceRangeFilter } from '../components/PriceRangeFilter';
import { getProducts } from '../services/productService';
import Pagination from '../components/Pagination'; // 👈 import component phân trang

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      if (data.length > 0) {
        const prices = data.map((p: any) => p.price);
        const lowest = Math.floor(Math.min(...prices));
        const highest = Math.ceil(Math.max(...prices));
        setMinPrice(lowest);
        setMaxPrice(highest);
        setPriceRange({ min: lowest, max: highest });
      }
    });
  }, []);

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    setCurrentPage(1); // reset trang khi đổi giá
  };

  const categories = Array.from(new Set(products.map((p) => p.category?.name)));

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || p.category?.name === selectedCategory;
    const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 py-16 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Shop Our Collection</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Discover our premium selection of eyeglasses, designed for style and comfort.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <div className="md:w-64">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="all-categories"
                  type="radio"
                  checked={selectedCategory === ''}
                  onChange={() => setSelectedCategory('')}
                  className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300"
                />
                <label htmlFor="all-categories" className="ml-3 text-sm text-gray-700">
                  All Categories
                </label>
              </div>
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    id={`cat-${category}`}
                    type="radio"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300"
                  />
                  <label htmlFor={`cat-${category}`} className="ml-3 text-sm text-gray-700">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <PriceRangeFilter minPrice={minPrice} maxPrice={maxPrice} onPriceChange={handlePriceChange} />
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Search */}
          <div className="relative w-full mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search eyeglasses..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset page khi search
              }}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Count */}
          <p className="text-gray-600 mb-6">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{' '}
            {filteredProducts.length} products
          </p>

          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setPriceRange({ min: minPrice, max: maxPrice });
                }}
                className="text-amber-500 hover:text-amber-600 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
