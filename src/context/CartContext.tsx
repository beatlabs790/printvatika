'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FulfillmentType } from '../types';

interface CheckoutDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
  notes: string;
}

interface CartContextType {
  cart: CartItem[];
  checkoutDetails: CheckoutDetails;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  updateCheckoutDetails: (details: Partial<CheckoutDetails>) => void;
  cartSubtotal: number;
  deliveryCharge: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialCheckout: CheckoutDetails = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  fulfillmentType: 'pickup',
  deliveryAddress: '',
  deliveryCity: '',
  deliveryState: '',
  deliveryPincode: '',
  notes: ''
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>(initialCheckout);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('vatika_cart');
      const storedCheckout = localStorage.getItem('vatika_checkout');
      
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (e) {
          console.error('Error parsing stored cart', e);
        }
      }
      if (storedCheckout) {
        try {
          setCheckoutDetails(JSON.parse(storedCheckout));
        } catch (e) {
          console.error('Error parsing stored checkout details', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('vatika_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('vatika_checkout', JSON.stringify(checkoutDetails));
    }
  }, [checkoutDetails, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const id = `cart-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setCart(prev => [...prev, { ...newItem, id } as CartItem]);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, qty);
          // Recalculate total price
          const unit = item.unit_price;
          return {
            ...item,
            quantity: newQty,
            total_price: Math.round(unit * newQty * 100) / 100
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('vatika_cart');
  };

  const updateCheckoutDetails = (details: Partial<CheckoutDetails>) => {
    setCheckoutDetails(prev => ({ ...prev, ...details }));
  };

  // Pricing calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
  const deliveryCharge = checkoutDetails.fulfillmentType === 'delivery' && cart.length > 0 ? 50.00 : 0.00;
  const cartTotal = cartSubtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cart,
        checkoutDetails,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        updateCheckoutDetails,
        cartSubtotal,
        deliveryCharge,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
