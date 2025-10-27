import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { UserProvider } from './context/UserContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Account } from './pages/Account';
import { Checkout } from './pages/Checkout';
import { NotFound } from './pages/NotFound';
import  ChatBot from './components/Chatbot';
import MessageWidget from './components/MessageWidget';
export function App() {
  return <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
             <WebSocketProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products/:productId" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
                  <ChatBot />
                  <MessageWidget />
                </div>
              </div>
            </Router>
            </WebSocketProvider>
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </UserProvider>;
}