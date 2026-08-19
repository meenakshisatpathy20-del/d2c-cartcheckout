import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCart } from './CartContext';

const CheckoutContext = createContext(null);

export function CheckoutProvider({ children }) {
  const { cart, discountAmount, shippingFee, clearCart } = useCart();
  const [reservationId, setReservationId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (!timeLeft) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setReservationId(null);
          setCheckoutError('Reservation expired. Stock has been returned to catalog.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const startRazorpayCheckout = async (customerDetails, onSuccess) => {
    setLoading(true);
    setCheckoutError('');

    try {
      const initData = await api.initiatePayment({
        items: cart.map((i) => ({ skuId: i.id, qty: i.qty })),
        customer: customerDetails,
        discountAmount,
        shippingFee
      });

      setReservationId(initData.reservationId);
      setTimeLeft(initData.expiresInSeconds || 600);

      const options = {
        key: initData.keyId,
        amount: initData.amount,
        currency: initData.currency,
        name: 'D2C MALL',
        description: 'Multi-Brand Direct Checkout',
        order_id: initData.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifiedOrder = await api.verifyPayment({
              reservationId: initData.reservationId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            setConfirmedOrder(verifiedOrder);
            clearCart();
            setTimeLeft(0);
            setReservationId(null);
            if (onSuccess) onSuccess(verifiedOrder);
          } catch (verErr) {
            setCheckoutError(verErr.message);
          }
        },
        prefill: {
          name: customerDetails.name,
          email: `${customerDetails.name.toLowerCase()}@d2csale.com`,
          contact: '9876543210'
        },
        theme: { color: '#0038A8' },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const verifiedOrder = await api.verifyPayment({
          reservationId: initData.reservationId,
          razorpay_order_id: initData.razorpayOrderId,
          razorpay_payment_id: `pay_sim_${Date.now()}`
        });
        setConfirmedOrder(verifiedOrder);
        clearCart();
        setTimeLeft(0);
        setReservationId(null);
        if (onSuccess) onSuccess(verifiedOrder);
      }
    } catch (err) {
      setCheckoutError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    reservationId,
    timeLeft,
    loading,
    checkoutError,
    setCheckoutError,
    confirmedOrder,
    setConfirmedOrder,
    startRazorpayCheckout
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error('useCheckout must be used within a CheckoutProvider');
  return context;
}