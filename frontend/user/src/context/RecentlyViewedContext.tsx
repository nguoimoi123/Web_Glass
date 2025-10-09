import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
  description?: string;
}

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  return context;
};

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Load từ localStorage khi mount
  useEffect(() => {
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) setRecentlyViewed(JSON.parse(saved));
  }, []);

  // Lưu lại khi recentlyViewed thay đổi
  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p._id !== product._id);
      const updated = [product, ...filtered];
      return updated.slice(0, 8); // giữ tối đa 8 sản phẩm gần nhất
    });
  };

  const clearRecentlyViewed = () => setRecentlyViewed([]);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};
