import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
      
      const totalResponse = await cartAPI.getTotal();
      setCartTotal(totalResponse.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (menuItemId, quantity, customizations) => {
    try {
      const response = await cartAPI.addItem({
        menuItemId,
        quantity,
        customizations,
      });
      setCart(response.data);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add item to cart' 
      };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const response = await cartAPI.updateQuantity(cartItemId, quantity);
      setCart(response.data);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update quantity' 
      };
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await cartAPI.removeItem(cartItemId);
      setCart(response.data);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove item' 
      };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [] });
      setCartTotal(0);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear cart' 
      };
    }
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    cartTotal,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
