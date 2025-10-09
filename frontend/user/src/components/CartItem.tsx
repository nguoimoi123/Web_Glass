import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2Icon, MinusIcon, PlusIcon } from 'lucide-react';
import { CartItem as CartItemType, useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center py-6 border-b border-gray-200">
      {/* Product image */}
      <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 flex-shrink-0">
        <Link to={`/product/${item.id}`}>
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover object-center rounded-md hover:opacity-90 transition-opacity duration-200" 
          />
        </Link>
      </div>
      
      {/* Product info */}
      <div className="flex-1 sm:ml-6 text-center sm:text-left">
        <Link 
          to={`/product/${item.id}`} 
          className="text-lg font-medium text-gray-900 hover:text-amber-500 transition-colors duration-200 line-clamp-2"
        >
          {item.name}
        </Link>
        {item.description && (
          <p className="text-gray-600 mt-1 text-sm line-clamp-2">
            {item.description}
          </p>
        )}
        <p className="text-gray-900 font-medium mt-1 sm:hidden">
          ${item.price.toFixed(2)} each
        </p>
      </div>
      
      {/* Quantity controls */}
      <div className="flex items-center mt-4 sm:mt-0">
        <button 
          onClick={handleDecrease}
          className="p-2 rounded-full border border-gray-300 text-gray-600 hover:text-amber-500 hover:border-amber-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
          disabled={item.quantity <= 1}
        >
          <MinusIcon size={16} />
        </button>
        <span className="mx-3 w-8 text-center font-medium">{item.quantity}</span>
        <button 
          onClick={handleIncrease}
          className="p-2 rounded-full border border-gray-300 text-gray-600 hover:text-amber-500 hover:border-amber-500 transition-colors duration-200"
          aria-label="Increase quantity"
        >
          <PlusIcon size={16} />
        </button>
      </div>
      
      {/* Price - Hidden on mobile */}
      <div className="text-gray-900 font-medium w-24 text-center mt-4 sm:mt-0 sm:ml-6 hidden sm:block">
        ${item.price.toFixed(2)}
      </div>
      
      {/* Total price */}
      <div className="text-amber-500 font-semibold w-24 text-center mt-4 sm:mt-0 sm:ml-6">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      
      {/* Remove button */}
      <div className="mt-4 sm:mt-0 sm:ml-6">
        <button 
          onClick={handleRemove}
          className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2Icon size={20} />
        </button>
      </div>
    </div>
  );
};