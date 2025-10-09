import React, { useEffect, useState, createContext, useContext } from 'react';
import { Product } from './CartContext';
interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  getWishlistCount: () => number;
}
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
export const WishlistProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);
  // Add item to wishlist
  const addToWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      // Check if the product is already in the wishlist
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // If it exists, don't add it again
        return prevItems;
      } else {
        // If it doesn't exist, add it
        return [...prevItems, product];
      }
    });
  };
  // Remove item from wishlist
  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  // Check if item is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };
  // Toggle item in wishlist (add if not present, remove if present)
  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  // Get wishlist count
  const getWishlistCount = () => {
    return wishlistItems.length;
  };
  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    getWishlistCount
  };
  return <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>;
};