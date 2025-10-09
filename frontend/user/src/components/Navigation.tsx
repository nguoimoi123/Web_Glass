import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, MenuIcon, XIcon, SearchIcon, HeartIcon, UserIcon, LogOutIcon, UserCircleIcon, ShoppingBagIcon, LogInIcon, UserPlusIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useUser } from '../context/UserContext';
import { SearchModal } from './SearchModal';
export const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const {
    getCartCount
  } = useCart();
  const {
    getWishlistCount
  } = useWishlist();
  const {
    currentUser,
    isAuthenticated,
    logout
  } = useUser();
  return <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-black">VISION</span>
              <span className="text-2xl font-light text-amber-500">LUXE</span>
            </Link>
          </div>
          {/* Desktop navigation links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-amber-500 transition-colors duration-200">
              Home
            </Link>
            <Link to="/shop" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-amber-500 transition-colors duration-200">
              Shop
            </Link>
            <Link to="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-amber-500 transition-colors duration-200">
              About Us
            </Link>
            <Link to="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-amber-500 transition-colors duration-200">
              Contact
            </Link>
          </div>
          {/* Right side icons */}
          <div className="hidden sm:flex items-center">
            <button onClick={() => setSearchModalOpen(true)} className="p-2 rounded-full text-gray-500 hover:text-amber-500 transition-colors duration-200">
              <SearchIcon size={20} />
            </button>
            <Link to="/wishlist" className="ml-4 p-2 rounded-full text-gray-500 hover:text-amber-500 transition-colors duration-200 relative">
              <HeartIcon size={20} />
              {getWishlistCount() > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-amber-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {getWishlistCount()}
                </span>}
            </Link>
            <Link to="/cart" className="ml-4 p-2 rounded-full text-gray-500 hover:text-amber-500 transition-colors duration-200 relative">
              <ShoppingCartIcon size={20} />
              {getCartCount() > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-amber-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {getCartCount()}
                </span>}
            </Link>
            {/* User menu */}
            <div className="ml-4 relative">
              <div>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="p-2 rounded-full text-gray-500 hover:text-amber-500 transition-colors duration-200 flex items-center">
                  <UserIcon size={20} />
                  {isAuthenticated && <span className="ml-2 text-sm font-medium">
                      {currentUser?.firstName}
                    </span>}
                </button>
              </div>
              {/* User dropdown menu */}
              {userMenuOpen && <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {isAuthenticated ? <>
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          <p className="font-medium">
                            {currentUser?.firstName} {currentUser?.lastName}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {currentUser?.email}
                          </p>
                        </div>
                        <Link to="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                          <UserCircleIcon size={16} className="mr-2" /> My
                          Account
                        </Link>
                        <Link to="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                          <ShoppingBagIcon size={16} className="mr-2" /> My
                          Orders
                        </Link>
                        <button onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <LogOutIcon size={16} className="mr-2" /> Sign out
                        </button>
                      </> : <>
                        <Link to="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                          <LogInIcon size={16} className="mr-2" /> Sign in
                        </Link>
                        <Link to="/register" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                          <UserPlusIcon size={16} className="mr-2" /> Create
                          account
                        </Link>
                      </>}
                  </div>
                </div>}
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button onClick={() => setSearchModalOpen(true)} className="p-2 rounded-full text-gray-500 hover:text-amber-500 transition-colors duration-200 mr-2">
              <SearchIcon size={20} />
            </button>
            <Link to="/wishlist" className="p-2 rounded-full text-gray-500 hover:text-amber-500 transition-colors duration-200 relative mr-2">
              <HeartIcon size={20} />
              {getWishlistCount() > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-amber-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {getWishlistCount()}
                </span>}
            </Link>
            <Link to="/cart" className="p-2 rounded-full text-gray-500 hover:text-amber-500 transition-colors duration-200 relative mr-2">
              <ShoppingCartIcon size={20} />
              {getCartCount() > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-amber-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {getCartCount()}
                </span>}
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-500 hover:text-amber-500 transition-colors duration-200">
              {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-500" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/shop" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-500" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
            <Link to="/about" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-500" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </Link>
            <Link to="/contact" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-500" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            <Link to="/wishlist" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-500" onClick={() => setMobileMenuOpen(false)}>
              Wishlist
            </Link>
            {isAuthenticated ? <>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="pl-3 pr-4 py-2">
                    <p className="text-base font-medium text-gray-700">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {currentUser?.email}
                    </p>
                  </div>
                  <Link to="/account" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-500" onClick={() => setMobileMenuOpen(false)}>
                    My Account
                  </Link>
                  <Link to="/account" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-500" onClick={() => setMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                  <button onClick={() => {
              logout();
              setMobileMenuOpen(false);
            }} className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-500">
                    Sign out
                  </button>
                </div>
              </> : <div className="border-t border-gray-200 pt-2 mt-2">
                <Link to="/login" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-500" onClick={() => setMobileMenuOpen(false)}>
                  Sign in
                </Link>
                <Link to="/register" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-500" onClick={() => setMobileMenuOpen(false)}>
                  Create account
                </Link>
              </div>}
          </div>
        </div>}
      {/* Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </nav>;
};