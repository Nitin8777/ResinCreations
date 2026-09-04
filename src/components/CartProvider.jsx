'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, X, ArrowRight } from 'lucide-react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [notification, setNotification] = useState(null); // { name, price, image, quantity, customText }

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('khushi_resin_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('khushi_resin_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // Auto-dismiss notification after 4.5 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification]);

  const addToCart = (product, quantity = 1, customizations = {}) => {
    const id = product._id || product.productId;
    const name = product.name;
    const price = product.discountPrice || product.price;
    const image = (typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url) || product.image || '/images/placeholder.svg';
    const slug = product.slug || id;
    const customText = product.customText || customizations?.customText || '';
    const itemQty = product.quantity || quantity;

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => 
        (item.productId === id || item._id === id) && (item.customText === customText)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += itemQty;
        return newCart;
      }

      return [...prev, {
        productId: id,
        _id: id,
        slug,
        name,
        price,
        image,
        quantity: itemQty,
        customText,
        customizations: { customText, ...customizations }
      }];
    });

    // Trigger Popup Notification
    setNotification({
      name,
      price,
      image,
      quantity: itemQty,
      customText
    });
  };

  const removeFromCart = (productId, customText) => {
    setCartItems(prev => prev.filter(item => 
      !((item.productId === productId || item._id === productId) && (customText === undefined || item.customText === customText))
    ));
  };

  const updateQuantity = (productId, customText, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(item => {
      if ((item.productId === productId || item._id === productId) && (customText === undefined || item.customText === customText)) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isLoaded
    }}>
      {children}

      {/* Global "Added to Cart" Toast Notification Popup */}
      {notification && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-sm w-full">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-violet-100 p-4 relative overflow-hidden backdrop-blur-md">
            {/* Animated top progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-violet-100">
              <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 animate-pulse"></div>
            </div>

            <div className="flex items-start gap-3.5">
              {/* Product thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-violet-50 overflow-hidden flex-shrink-0 border border-violet-100/80">
                <img
                  src={notification.image}
                  alt={notification.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Information */}
              <div className="flex-1 min-w-0 pr-5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Item Added to Cart!</span>
                </div>
                <p className="text-sm font-bold text-gray-900 truncate">{notification.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                  Qty: <span className="text-violet-700 font-bold">{notification.quantity}</span> • Total: <span className="text-violet-700 font-bold">₹{notification.price * notification.quantity}</span>
                </p>
                {notification.customText && (
                  <p className="text-[11px] text-violet-600 bg-violet-50 px-2 py-0.5 rounded mt-1 truncate inline-block">
                    "{notification.customText}"
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    href="/cart"
                    onClick={() => setNotification(null)}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>View Cart</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setNotification(null)}
                    className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                  >
                    Keep Shopping
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
