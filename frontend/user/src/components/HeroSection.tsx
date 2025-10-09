import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
export const HeroSection: React.FC = () => {
  return <div className="relative bg-gray-900 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1577744168855-0391d2ed2b3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Stylish eyeglasses" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
      </div>
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 md:py-40">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            See the World in <span className="text-amber-500">Style</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Discover our premium collection of designer eyewear that combines
            fashion with functionality. Find your perfect pair today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
              Shop Now <ArrowRightIcon size={20} className="ml-2" />
            </Link>
            <Link to="/about" className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition-colors duration-200">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>;
};