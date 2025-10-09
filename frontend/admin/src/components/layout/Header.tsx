import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { useLocation } from 'react-router-dom';
const Header: React.FC = () => {
  const {
    toggle,
    isOpen
  } = useSidebar();
  const location = useLocation();
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/products')) return 'Products';
    if (path.includes('/categories')) return 'Categories';
    if (path.includes('/orders')) return 'Orders';
    if (path.includes('/users')) return 'Users';
    if (path.includes('/reviews')) return 'Reviews';
    if (path.includes('/size-guides')) return 'Size Guides';
    if (path.includes('/settings')) return 'Settings';
    return 'EyeAdmin';
  };
  return <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={toggle} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 md:hidden">
              <Menu size={20} />
            </button>
            <h1 className="ml-2 md:ml-0 text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center">
            <div className="relative mx-4 hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search..." />
            </div>
            <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;