import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, TwitterIcon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';
import { NewsletterSignup } from './NewsletterSignup';
export const Footer: React.FC = () => {
  return <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">VISION</span>
              <span className="text-2xl font-light text-amber-500">LUXE</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Premium eyewear for the modern individual. Quality craftsmanship,
              stylish designs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                <TwitterIcon size={20} />
              </a>
            </div>
          </div>
          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon size={20} className="text-amber-500 mr-2 flex-shrink-0 mt-1" />
                <span className="text-gray-400">
                  123 Eyewear Ave, Fashion District, NY 10001
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon size={20} className="text-amber-500 mr-2 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <MailIcon size={20} className="text-amber-500 mr-2 flex-shrink-0" />
                <span className="text-gray-400">info@visionluxe.com</span>
              </li>
            </ul>
          </div>
          {/* Newsletter signup */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to receive updates on new collections and special
              offers.
            </p>
            <NewsletterSignup />
          </div>
        </div>
        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-12 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} VisionLuxe. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-amber-500 text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-amber-500 text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-gray-400 hover:text-amber-500 text-sm transition-colors duration-200">
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};