import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cartError, setCartError] = useState('');

  const addToCart = (product) => {
    setCartError('');
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          setCartError(`Only ${product.stock} units available for ${product.name}`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta, maxStock) => {
    setCartError('');
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + delta;
            if (nextQty > maxStock) {
              setCartError(`Stock limit reached (${maxStock} units).`);
              return item;
            }
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDeliveryInfo(null);
    setCartError('');
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingFee = deliveryInfo?.shippingFee ?? (subtotal > 0 ? 50 : 0);
  const discountAmount = appliedCoupon ? Math.min(appliedCoupon.discountAmount, subtotal) : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);
  const totalItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const value = {
    cart,
    addToCart,
    updateQty,
    clearCart,
    deliveryInfo,
    setDeliveryInfo,
    appliedCoupon,
    setAppliedCoupon,
    cartError,
    setCartError,
    subtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    totalItemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}