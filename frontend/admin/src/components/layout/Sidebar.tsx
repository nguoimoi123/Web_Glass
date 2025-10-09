import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ListOrdered, Users, MessageSquare, Ruler, Settings, LogOut, ChevronLeft, ChevronRight, Glasses, Tag } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
const Sidebar: React.FC = () => {
  const {
    isOpen,
    toggle
  } = useSidebar();
  const {
    logout,
    user
  } = useAuth();
  const location = useLocation();
  const navigationItems = [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard size={20} />
  }, {
    name: 'Products',
    path: '/products',
    icon: <ShoppingBag size={20} />
  }, {
    name: 'Categories',
    path: '/categories',
    icon: <Tag size={20} />
  }, {
    name: 'Orders',
    path: '/orders',
    icon: <ListOrdered size={20} />
  }, {
    name: 'Users',
    path: '/users',
    icon: <Users size={20} />
  }, {
    name: 'Reviews',
    path: '/reviews',
    icon: <MessageSquare size={20} />
  }, {
    name: 'Size Guides',
    path: '/size-guides',
    icon: <Ruler size={20} />
  }, {
    name: 'Settings',
    path: '/settings',
    icon: <Settings size={20} />
  }];
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <aside className={`bg-white fixed inset-y-0 left-0 z-10 w-64 border-r border-gray-200 shadow-sm transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
      <div className="flex flex-col h-full">
        <div className={`flex items-center justify-between h-16 px-4 border-b border-gray-200 ${!isOpen && 'md:justify-center'}`}>
          <Link to="/dashboard" className="flex items-center gap-2">
            <Glasses className="h-8 w-8 text-blue-600" />
            {isOpen && <span className="text-xl font-bold text-gray-900">EyeAdmin</span>}
          </Link>
          <button onClick={toggle} className="p-1 rounded-md text-gray-500 hover:bg-gray-100 md:flex hidden">
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigationItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center ${!isOpen ? 'md:justify-center' : 'justify-start'} px-3 py-2 rounded-md text-sm font-medium ${isActive(item.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                <div className="flex items-center">
                  {item.icon}
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </div>
              </Link>)}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          {isOpen ? <div className="flex items-center">
              <img src={'./../../../public/1758769407257.jpg'} alt="User" className="h-8 w-8 rounded-full object-cover" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Quân Đẹp Zai'}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  {user?.email || 'quanadmin@email.com'}
                </p>
              </div>
            </div> : <div className="flex justify-center">
              <img src={user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="User" className="h-8 w-8 rounded-full object-cover" />
            </div>}
          <button onClick={logout} className={`mt-4 flex items-center ${!isOpen ? 'md:justify-center' : 'justify-start'} w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50`}>
            <LogOut size={20} />
            {isOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </aside>;
};
export default Sidebar;