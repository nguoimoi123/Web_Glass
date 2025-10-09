import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, ArrowLeftIcon, TrashIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';

export const Cart: React.FC = () => {
  const {
    cartItems,
    clearCart,
    getCartTotal,
    getCartCount
  } = useCart();

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      clearCart();
    }
  };

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
          <ShoppingBagIcon size={32} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link 
          to="/shop" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="lg:flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Your Items ({getCartCount()})
                  </h2>
                  <button 
                    onClick={handleClearCart} 
                    className="inline-flex items-center text-sm text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <TrashIcon size={16} className="mr-1" /> Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              <div className="p-6 bg-gray-50">
                <Link 
                  to="/shop" 
                  className="inline-flex items-center text-amber-500 font-medium hover:text-amber-600 transition-colors duration-200"
                >
                  <ArrowLeftIcon size={16} className="mr-1" /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-20">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-amber-500">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <Link 
                  to="/checkout" 
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};