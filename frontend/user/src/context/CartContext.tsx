import React, { useEffect, useState, createContext, useContext } from 'react';

// Define the product type - SỬA ID THÀNH string
export interface Product {
  id: string; // Đổi từ number thành string
  name: string;
  price: number;
  image: string;
  images: string[];
  description?: string;
  category?: string;
}

// Define the cart item type (product + quantity)
export interface CartItem extends Product {
  quantity: number;
}

// Define the context type - SỬA CÁC PHƯƠNG THỨC LIÊN QUAN ĐẾN ID
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void; // Đổi thành string
  updateQuantity: (productId: string, quantity: number) => void; // Đổi thành string
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Provider component
export const CartProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => item.id === product.id ? {
          ...item,
          quantity: item.quantity + 1
        } : item);
      } else {
        return [...prevItems, {
          ...product,
          quantity: 1
        }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => { // Đổi thành string
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => { // Đổi thành string
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems => prevItems.map(item => item.id === productId ? {
      ...item,
      quantity
    } : item));
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate the total price of items in the cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Calculate the total number of items in the cart
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};