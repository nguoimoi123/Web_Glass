import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/products/Products';
import ProductDetails from './pages/products/ProductDetails';
// import Products from './pages/products_test/Products';
// import ProductDetails from './pages/products_test/productDetails_test/ProductDetails';
import Categories from './pages/categories/Categories';
import Orders from './pages/orders/Orders';
import Users from './pages/users/Users';
import Reviews from './pages/reviews/Reviews';
import SizeGuides from './pages/size-guides/SizeGuides';
import Settings from './pages/settings/Settings';
import Messages from './pages/messages/Messages';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from 'sonner';
export function App() {
  return <AuthProvider>
      <SidebarProvider>
        <WebSocketProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute>
                  <Layout />
                </ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="categories" element={<Categories />} />
              <Route path="orders" element={<Orders />} />
              <Route path="users" element={<Users />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="size-guides" element={<SizeGuides />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </Router>
        </WebSocketProvider>
      </SidebarProvider>
    </AuthProvider>;
}