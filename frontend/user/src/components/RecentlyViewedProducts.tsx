import React from 'react';
import { useRecentlyViewed, Product } from '../context/RecentlyViewedContext';
import { ProductCard } from './ProductCard';
import { XCircleIcon } from 'lucide-react';

interface RecentlyViewedProductsProps {
  currentProductId?: string;
}

export const RecentlyViewedProducts: React.FC<RecentlyViewedProductsProps> = ({ currentProductId }) => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  // Loại bỏ sản phẩm hiện tại khi hiển thị
  const filtered = currentProductId
    ? recentlyViewed.filter(p => p._id !== currentProductId)
    : recentlyViewed;

  if (filtered.length === 0) return null;

  return (
    <section className="mt-16 border-t border-gray-200 pt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
        <button onClick={clearRecentlyViewed} className="text-sm text-gray-500 hover:text-amber-500 flex items-center">
          <XCircleIcon size={16} className="mr-1" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};
