import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'd2c_mall_cart';
const COUPON_STORAGE_KEY = 'd2c_mall_coupon';
const DELIVERY_STORAGE_KEY = 'd2c_mall_delivery';

function loadStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() =>
    loadStorage(CART_STORAGE_KEY, [])
  );

  const [deliveryInfo, setDeliveryInfo] = useState(() =>
    loadStorage(DELIVERY_STORAGE_KEY, null)
  );

  const [appliedCoupon, setAppliedCoupon] = useState(() =>
    loadStorage(COUPON_STORAGE_KEY, null)
  );

  const [cartError, setCartError] = useState('');

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  }, [cart]);

  useEffect(() => {
    if (deliveryInfo) {
      localStorage.setItem(
        DELIVERY_STORAGE_KEY,
        JSON.stringify(deliveryInfo)
      );
    } else {
      localStorage.removeItem(
        DELIVERY_STORAGE_KEY
      );
    }
  }, [deliveryInfo]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(
        COUPON_STORAGE_KEY,
        JSON.stringify(appliedCoupon)
      );
    } else {
      localStorage.removeItem(
        COUPON_STORAGE_KEY
      );
    }
  }, [appliedCoupon]);

  const addToCart = (product) => {
    setCartError('');

    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.id === product.id
      );

      const stock = Number(product.stock || 0);

      if (existing) {
        if (existing.qty >= stock) {
          setCartError(
            `Only ${stock} units available for ${product.name}`
          );

          return prevCart;
        }

        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1
              }
            : item
        );
      }

      if (stock <= 0) {
        setCartError(
          `${product.name} is currently out of stock.`
        );

        return prevCart;
      }

      return [
        ...prevCart,
        {
          ...product,
          qty: 1
        }
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartError('');

    setCart((prevCart) =>
      prevCart.filter(
        (item) => item.id !== id
      )
    );
  };

  const updateQty = (
    id,
    delta,
    maxStock
  ) => {
    setCartError('');

    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          const stock = Number(
            maxStock ??
              item.stock ??
              0
          );

          const nextQty =
            item.qty + delta;

          if (nextQty > stock) {
            setCartError(
              `Stock limit reached (${stock} units).`
            );

            return item;
          }

          if (nextQty <= 0) {
            return null;
          }

          return {
            ...item,
            qty: nextQty
          };
        })
        .filter(Boolean)
    );
  };

  const setQuantity = (
    id,
    quantity
  ) => {
    setCartError('');

    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          const stock = Number(
            item.stock || 0
          );

          const nextQty = Math.max(
            0,
            Math.min(
              Number(quantity) || 0,
              stock
            )
          );

          if (
            Number(quantity) >
            stock
          ) {
            setCartError(
              `Only ${stock} units available.`
            );
          }

          if (nextQty === 0) {
            return null;
          }

          return {
            ...item,
            qty: nextQty
          };
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

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (acc, item) =>
          acc +
          Number(item.price || 0) *
            Number(item.qty || 0),
        0
      ),
    [cart]
  );

  const shippingFee = useMemo(() => {
    if (subtotal <= 0) {
      return 0;
    }

    if (
      deliveryInfo?.shippingFee !==
      undefined
    ) {
      return Number(
        deliveryInfo.shippingFee
      );
    }

    return subtotal >= 499 ? 0 : 50;
  }, [
    subtotal,
    deliveryInfo
  ]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) {
      return 0;
    }

    return Math.min(
      Number(
        appliedCoupon.discountAmount ||
          0
      ),
      subtotal
    );
  }, [
    appliedCoupon,
    subtotal
  ]);

  const grandTotal = useMemo(
    () =>
      Math.max(
        0,
        subtotal +
          shippingFee -
          discountAmount
      ),
    [
      subtotal,
      shippingFee,
      discountAmount
    ]
  );

  const totalItemCount = useMemo(
    () =>
      cart.reduce(
        (acc, item) =>
          acc +
          Number(item.qty || 0),
        0
      ),
    [cart]
  );

  const totalSavings = useMemo(
    () =>
      cart.reduce(
        (acc, item) => {
          const mrp =
            Number(item.mrp || 0);

          const price =
            Number(item.price || 0);

          const qty =
            Number(item.qty || 0);

          return (
            acc +
            Math.max(
              0,
              mrp - price
            ) *
              qty
          );
        },
        0
      ) + discountAmount,
    [cart, discountAmount]
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    setQuantity,
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
    totalItemCount,
    totalSavings
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider'
    );
  }

  return context;
}