import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, ArrowLeftIcon, TrashIcon } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
export const Wishlist: React.FC = () => {
  const {
    wishlistItems,
    removeFromWishlist,
    getWishlistCount
  } = useWishlist();
  const {
    addToCart
  } = useCart();
  // If wishlist is empty
  if (wishlistItems.length === 0) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
          <HeartIcon size={32} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-600 mb-8">
          Browse our collection and add your favorite items to your wishlist.
        </p>
        <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
          Start Shopping
        </Link>
      </div>;
  }
  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => {
      addToCart(item);
    });
  };
  const handleClearWishlist = () => {
    wishlistItems.forEach(item => {
      removeFromWishlist(item.id);
    });
  };
  return <div className="bg-white min-h-screen">
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">My Wishlist</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Your saved items for future reference.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-medium text-gray-900">
            {getWishlistCount()} {getWishlistCount() === 1 ? 'Item' : 'Items'}
          </h2>
          <div className="flex space-x-4">
            <button onClick={handleAddAllToCart} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
              <ShoppingCartIcon size={16} className="mr-2" /> Add All to Cart
            </button>
            <button onClick={handleClearWishlist} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
              <TrashIcon size={16} className="mr-2" /> Clear Wishlist
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
        <div className="mt-8">
          <Link to="/shop" className="inline-flex items-center text-amber-500 font-medium hover:text-amber-600 transition-colors duration-200">
            <ArrowLeftIcon size={16} className="mr-2" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>;
};