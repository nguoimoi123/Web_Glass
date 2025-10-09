import React, { useState, createContext, useContext } from 'react';
interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}
const SidebarContext = createContext<SidebarContextType | null>(null);
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
export const SidebarProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const close = () => {
    setIsOpen(false);
  };
  return <SidebarContext.Provider value={{
    isOpen,
    toggle,
    close
  }}>
      {children}
    </SidebarContext.Provider>;
};