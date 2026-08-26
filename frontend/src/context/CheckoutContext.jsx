import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import { api } from '../services/api';
import { useCart } from './CartContext';

const CheckoutContext =
  createContext(null);

export function CheckoutProvider({
  children
}) {
  const {
    cart,
    discountAmount,
    shippingFee,
    appliedCoupon,
    clearCart
  } = useCart();

  const [
    reservationId,
    setReservationId
  ] = useState(null);

  const [
    timeLeft,
    setTimeLeft
  ] = useState(0);

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    checkoutError,
    setCheckoutError
  ] = useState('');

  const [
    confirmedOrder,
    setConfirmedOrder
  ] = useState(null);

  useEffect(() => {
    if (!timeLeft) {
      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft((previous) => {
          if (previous <= 1) {
            clearInterval(timer);

            setReservationId(null);

            setCheckoutError(
              'Checkout reservation expired. Please start checkout again.'
            );

            return 0;
          }

          return previous - 1;
        });
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [timeLeft]);

  const finishCheckout = (
    orderData,
    onSuccess
  ) => {
    setConfirmedOrder(orderData);

    setTimeLeft(0);

    setReservationId(null);

    clearCart();

    if (onSuccess) {
      onSuccess(orderData);
    }
  };

  const startRazorpayCheckout =
    async (
      customerDetails,
      onSuccess
    ) => {
      if (!cart.length) {
        setCheckoutError(
          'Your cart is empty.'
        );

        return;
      }

      setLoading(true);
      setCheckoutError('');

      try {
        const initData =
          await api.initiatePayment({
            items: cart.map(
              (item) => ({
                skuId: item.id,
                qty: item.qty
              })
            ),

            customer:
              customerDetails,

            discountAmount,

            shippingFee,

            coupon:
              appliedCoupon || null
          });

        setReservationId(
          initData.reservationId
        );

        setTimeLeft(
          initData.expiresInSeconds ||
            600
        );

        const handleSuccessfulPayment =
          async (
            response
          ) => {
            try {
              setLoading(true);

              const verifiedOrder =
                await api.verifyPayment({
                  reservationId:
                    initData.reservationId,

                  razorpay_order_id:
                    response
                      ?.razorpay_order_id ||
                    initData.razorpayOrderId,

                  razorpay_payment_id:
                    response
                      ?.razorpay_payment_id ||
                    `pay_sim_${Date.now()}`,

                  razorpay_signature:
                    response
                      ?.razorpay_signature ||
                    'simulated'
                });

              finishCheckout(
                verifiedOrder,
                onSuccess
              );
            } catch (error) {
              setCheckoutError(
                error?.message ||
                  'Payment verification failed.'
              );
            } finally {
              setLoading(false);
            }
          };

        const handlePaymentFailure =
          (response) => {
            setCheckoutError(
              response?.error
                ?.description ||
                'Payment could not be completed. Please try again.'
            );

            setLoading(false);
          };

        if (
          typeof window !==
            'undefined' &&
          window.Razorpay
        ) {
          const options = {
            key:
              initData.keyId,

            amount:
              initData.amount,

            currency:
              initData.currency ||
              'INR',

            name: 'D2C MALL',

            description:
              'Pan-India Multi-Brand Ecommerce',

            order_id:
              initData.razorpayOrderId,

            prefill: {
              name:
                customerDetails.name,

              email:
                customerDetails.email ||
                '',

              contact:
                customerDetails.phone
            },

            notes: {
              customer_city:
                customerDetails.city,

              customer_pincode:
                customerDetails.pincode
            },

            theme: {
              color: '#2563eb'
            },

            handler:
              handleSuccessfulPayment,

            modal: {
              ondismiss: () => {
                setLoading(false);

                setCheckoutError(
                  'Payment window closed. Your checkout reservation is still active.'
                );
              }
            }
          };

          const razorpay =
            new window.Razorpay(
              options
            );

          razorpay.on(
            'payment.failed',
            handlePaymentFailure
          );

          razorpay.open();

          return;
        }

        await handleSuccessfulPayment(
          {
            razorpay_order_id:
              initData.razorpayOrderId,

            razorpay_payment_id:
              `pay_sim_${Date.now()}`,

            razorpay_signature:
              'simulated'
          }
        );
      } catch (error) {
        setCheckoutError(
          error?.message ||
            'Unable to start checkout.'
        );

        setReservationId(null);
        setTimeLeft(0);
      } finally {
        setLoading(false);
      }
    };

  const placeCodOrder =
    async (
      customerDetails,
      onSuccess
    ) => {
      if (!cart.length) {
        setCheckoutError(
          'Your cart is empty.'
        );

        return;
      }

      setLoading(true);
      setCheckoutError('');

      try {
        const order =
          await api.placeCodOrder({
            cart,

            customer:
              customerDetails,

            discountAmount,

            shippingFee,

            coupon:
              appliedCoupon || null
          });

        finishCheckout(
          order,
          onSuccess
        );
      } catch (error) {
        setCheckoutError(
          error?.message ||
            'Unable to place COD order.'
        );
      } finally {
        setLoading(false);
      }
    };

  const cancelCheckout =
    () => {
      setReservationId(null);

      setTimeLeft(0);

      setCheckoutError('');

      setLoading(false);
    };

  const value = {
    reservationId,
    timeLeft,

    loading,

    checkoutError,
    setCheckoutError,

    confirmedOrder,
    setConfirmedOrder,

    startRazorpayCheckout,
    placeCodOrder,

    cancelCheckout
  };

  return (
    <CheckoutContext.Provider
      value={value}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context =
    useContext(
      CheckoutContext
    );

  if (!context) {
    throw new Error(
      'useCheckout must be used within a CheckoutProvider'
    );
  }

  return context;
}