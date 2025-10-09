import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ShoppingBagIcon, ArrowLeftIcon } from 'lucide-react';
export const NotFound: React.FC = () => {
  return <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 mb-8">
          <span className="text-4xl font-bold text-amber-500">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          We're sorry, the page you requested could not be found. Please check
          the URL or navigate using the links below.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
            <HomeIcon size={20} className="mr-2" /> Back to Home
          </Link>
          <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
            <ShoppingBagIcon size={20} className="mr-2" /> Continue Shopping
          </Link>
        </div>
        <button onClick={() => window.history.back()} className="mt-8 inline-flex items-center text-amber-500 font-medium hover:text-amber-600 transition-colors duration-200">
          <ArrowLeftIcon size={16} className="mr-1" /> Go Back
        </button>
      </div>
    </div>;
};