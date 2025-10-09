import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebar } from '../../contexts/SidebarContext';
const Layout: React.FC = () => {
  const {
    isOpen
  } = useSidebar();
  return <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>;
};
export default Layout;