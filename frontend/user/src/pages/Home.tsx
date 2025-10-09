import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckCircleIcon } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';
import { getProducts } from '../services/productService';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts().then((data) => {
      setFeaturedProducts(data.slice(0, 4)); // lấy 4 sản phẩm đầu
    });
  }, []);

  return (
    <div className="bg-white">
      <HeroSection />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Eyewear</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium eyeglasses, designed for style and comfort.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center text-amber-500 font-medium hover:text-amber-600"
            >
              View All Collections <ArrowRightIcon size={20} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
     <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Crafted With Excellence
              </h2>
              <p className="text-gray-600 mb-8">
                At VisionLuxe, we believe that eyewear is more than just a
                visual aid—it's a statement of style and personality. Our
                curated collection features premium materials, innovative
                designs, and superior craftsmanship.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircleIcon size={24} className="text-amber-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Premium materials for durability and comfort
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon size={24} className="text-amber-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Stylish designs for every face shape
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon size={24} className="text-amber-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Expert craftsmanship and attention to detail
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon size={24} className="text-amber-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    30-day satisfaction guarantee
                  </span>
                </li>
              </ul>
              <Link to="/about" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
                About Our Craft
              </Link>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1582142407894-ec8a32dcb9fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Crafting premium eyeglasses" className="rounded-lg shadow-lg w-full h-auto object-cover" />
              <div className="absolute -bottom-6 -right-6 bg-amber-500 text-white p-6 rounded-lg shadow-lg hidden md:block">
                <p className="text-xl font-bold">25+ Years</p>
                <p className="text-sm">of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Find Your Perfect Pair Today
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Browse our extensive collection of premium eyewear and discover the
            perfect match for your style and needs.
          </p>
          <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 transition-colors duration-200">
            Explore All Styles
          </Link>
        </div>
      </section>
    </div>
  );
};
