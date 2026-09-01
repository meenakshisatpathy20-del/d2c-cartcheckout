import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Gift,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  Zap,
} from "lucide-react";

const FALLBACK_CART = [
  {
    id: "P1",
    name: "Essence Mascara Lash Princess",
    brand: "Essence",
    price: 829,
    mrp: 1299,
    quantity: 1,
    size: "",
    color: "Black",
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    delivery: "Tomorrow",
  },
  {
    id: "P2",
    name: "Eyeshadow Palette with Mirror",
    brand: "Glamour",
    price: 1659,
    mrp: 2499,
    quantity: 1,
    size: "",
    color: "",
    image:
      "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
    delivery: "2–3 days",
  },
];

const COUPONS = [
  {
    code: "WELCOME10",
    title: "10% OFF",
    description: "Extra 10% off on your first order",
    minAmount: 999,
    type: "percent",
    value: 10,
  },
  {
    code: "D2C200",
    title: "₹200 OFF",
    description: "Flat ₹200 off on orders above ₹1,999",
    minAmount: 1999,
    type: "flat",
    value: 200,
  },
];

export default function CartView({
  cart: initialCart,
  api,
  onBack,
  onCheckout,
  onProductClick,
  onRemove,
  onUpdateQuantity,
  onMoveToWishlist,
}) {
  const [cart, setCart] = useState(
    initialCart?.length
      ? initialCart
      : FALLBACK_CART
  );

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] =
    useState(null);

  const [couponMessage, setCouponMessage] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  const [pincode, setPincode] =
    useState("");

  const [deliveryMessage, setDeliveryMessage] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const updateLocalCart = (
    productId,
    nextQuantity
  ) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity:
                  nextQuantity,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  const changeQuantity = async (
    item,
    direction
  ) => {
    const nextQuantity =
      direction === "plus"
        ? item.quantity + 1
        : item.quantity - 1;

    if (nextQuantity < 1) {
      removeItem(item);
      return;
    }

    if (
      item.stock &&
      nextQuantity > item.stock
    ) {
      return;
    }

    updateLocalCart(
      item.id,
      nextQuantity
    );

    try {
      setUpdatingId(item.id);

      await onUpdateQuantity?.(
        item,
        nextQuantity
      );

      if (
        api?.updateCartQuantity
      ) {
        await api.updateCartQuantity(
          item.id,
          nextQuantity
        );
      }
    } catch {
      // UI remains usable if API is not connected yet.
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (
    item
  ) => {
    setCart((current) =>
      current.filter(
        (product) =>
          product.id !== item.id
      )
    );

    try {
      await onRemove?.(item);

      if (api?.removeFromCart) {
        await api.removeFromCart(
          item.id
        );
      }
    } catch {
      // Final API integration comes later.
    }
  };

  const moveToWishlist = async (
    item
  ) => {
    await onMoveToWishlist?.(
      item
    );

    removeItem(item);
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(
            item.quantity || 1
          ),
      0
    );

    const mrpTotal = cart.reduce(
      (sum, item) =>
        sum +
        Number(item.mrp || item.price || 0) *
          Number(
            item.quantity || 1
          ),
      0
    );

    const productDiscount =
      Math.max(
        mrpTotal - subtotal,
        0
      );

    let couponDiscount = 0;

    if (appliedCoupon) {
      if (
        appliedCoupon.type ===
        "percent"
      ) {
        couponDiscount = Math.round(
          (subtotal *
            appliedCoupon.value) /
            100
        );
      } else {
        couponDiscount =
          appliedCoupon.value;
      }
    }

    couponDiscount = Math.min(
      couponDiscount,
      subtotal
    );

    const shipping =
      subtotal >= 999 ||
      subtotal === 0
        ? 0
        : 79;

    const total =
      subtotal -
      couponDiscount +
      shipping;

    return {
      subtotal,
      mrpTotal,
      productDiscount,
      couponDiscount,
      shipping,
      total,
      totalSavings:
        productDiscount +
        couponDiscount,
    };
  }, [cart, appliedCoupon]);

  const applyCoupon = () => {
    setCouponMessage("");

    const code = coupon
      .trim()
      .toUpperCase();

    if (!code) {
      setCouponMessage(
        "Enter a coupon code."
      );
      return;
    }

    const found = COUPONS.find(
      (item) =>
        item.code === code
    );

    if (!found) {
      setCouponMessage(
        "That coupon isn't available."
      );
      setAppliedCoupon(null);
      return;
    }

    if (
      totals.subtotal <
      found.minAmount
    ) {
      setCouponMessage(
        `Add ${formatCurrency(
          found.minAmount -
            totals.subtotal
        )} more to use this coupon.`
      );
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(found);
    setCoupon(found.code);
    setCouponMessage(
      `${found.code} applied successfully.`
    );
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
    setCouponMessage("");
  };

  const checkDelivery = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryMessage(
        "Enter a valid 6-digit pincode."
      );
      return;
    }

    try {
      if (api?.checkDelivery) {
        const response =
          await api.checkDelivery(
            pincode
          );

        setDeliveryMessage(
          response?.message ||
            "Delivery is available."
        );

        return;
      }

      setDeliveryMessage(
        "Delivery is available to this pincode."
      );
    } catch (error) {
      setDeliveryMessage(
        error?.message ||
          "Unable to check delivery."
      );
    }
  };

  const handleCheckout = async () => {
    setSaving(true);

    try {
      await onCheckout?.({
        items: cart,
        totals,
        coupon: appliedCoupon,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!cart.length) {
    return (
      <EmptyCart
        onBack={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] text-slate-950">
      {/* HEADER */}

      <header className="bg-white border-b border-slate-100">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-[9px] font-black"
            >
              <ArrowLeft className="w-4 h-4" />
              CONTINUE SHOPPING
            </button>

            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-500" />

              <span className="text-[10px] font-black">
                YOUR BAG
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[8px] text-slate-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              100% SECURE
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1250px] mx-auto px-4 sm:px-6 py-6">
        {/* PROGRESS */}

        <div className="hidden sm:flex items-center justify-center mb-8">
          <CheckoutStep
            number="01"
            label="Bag"
            active
          />

          <ProgressLine active />

          <CheckoutStep
            number="02"
            label="Address"
          />

          <ProgressLine />

          <CheckoutStep
            number="03"
            label="Payment"
          />
        </div>

        {/* TOP SALE BANNER */}

        <div className="rounded-2xl bg-blue-950 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            </div>

            <div>
              <p className="text-[9px] font-black">
                YOU'RE CLOSE TO FREE SHIPPING
              </p>

              <p className="text-[7px] text-white/50 mt-1">
                Add products worth{" "}
                {formatCurrency(
                  Math.max(
                    999 -
                      totals.subtotal,
                    0
                  )
                )}{" "}
                more.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-52">
            <div className="flex justify-between text-[6px] text-white/50 mb-1">
              <span>
                ₹0
              </span>
              <span>
                ₹999
              </span>
            </div>

            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    (totals.subtotal /
                      999) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-5">
          {/* LEFT */}

          <section className="space-y-4">
            {/* CART CARD */}

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black">
                    My Bag
                  </h1>

                  <p className="text-[8px] text-slate-400 mt-1">
                    {cart.length}{" "}
                    {cart.length === 1
                      ? "item"
                      : "items"}{" "}
                    · Ready to ship
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[8px] font-black text-green-600">
                  <Check className="w-3.5 h-3.5" />
                  SAFE & SECURE
                </div>
              </div>

              <div>
                {cart.map(
                  (item, index) => (
                    <CartItem
                      key={
                        item.id
                      }
                      item={item}
                      index={
                        index
                      }
                      updating={
                        updatingId ===
                        item.id
                      }
                      onProductClick={() =>
                        onProductClick?.(
                          item
                        )
                      }
                      onIncrease={() =>
                        changeQuantity(
                          item,
                          "plus"
                        )
                      }
                      onDecrease={() =>
                        changeQuantity(
                          item,
                          "minus"
                        )
                      }
                      onRemove={() =>
                        removeItem(
                          item
                        )
                      }
                      onWishlist={() =>
                        moveToWishlist(
                          item
                        )
                      }
                    />
                  )
                )}
              </div>
            </div>

            {/* DELIVERY */}

            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />

                <h2 className="text-xs font-black">
                  Delivery
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4 max-w-lg">
                <input
                  value={pincode}
                  onChange={(event) =>
                    setPincode(
                      event.target.value
                    )
                  }
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="Enter your pincode"
                  className="flex-1 h-11 rounded-xl bg-slate-50 px-4 text-xs outline-none border border-transparent focus:border-orange-500"
                />

                <button
                  type="button"
                  onClick={
                    checkDelivery
                  }
                  className="h-11 px-5 rounded-xl bg-blue-950 text-white text-[9px] font-black"
                >
                  CHECK
                </button>
              </div>

              {deliveryMessage && (
                <p className="text-[8px] font-bold text-green-600 mt-3">
                  {deliveryMessage}
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                <DeliveryFeature
                  icon={Truck}
                  title="Fast shipping"
                  text="Across India"
                />

                <DeliveryFeature
                  icon={Clock3}
                  title="Trackable"
                  text="Live updates"
                />

                <DeliveryFeature
                  icon={ShieldCheck}
                  title="Protected"
                  text="Secure delivery"
                />
              </div>
            </div>

            {/* COUPON */}

            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-500" />

                <h2 className="text-xs font-black">
                  Offers & Coupons
                </h2>
              </div>

              {appliedCoupon ? (
                <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-100 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>

                    <div>
                      <p className="text-[9px] font-black text-green-700">
                        {appliedCoupon.code}{" "}
                        APPLIED
                      </p>

                      <p className="text-[8px] text-green-600 mt-1">
                        You saved{" "}
                        {formatCurrency(
                          totals.couponDiscount
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      removeCoupon
                    }
                    className="text-[8px] font-black text-red-500"
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mt-4">
                    <div className="relative flex-1">
                      <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

                      <input
                        value={
                          coupon
                        }
                        onChange={(
                          event
                        ) =>
                          setCoupon(
                            event.target.value
                          )
                        }
                        placeholder="Enter coupon code"
                        className="w-full h-11 rounded-xl bg-slate-50 pl-10 pr-3 text-xs font-bold uppercase outline-none border border-transparent focus:border-orange-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={
                        applyCoupon
                      }
                      className="px-5 h-11 rounded-xl bg-orange-500 text-white text-[9px] font-black"
                    >
                      APPLY
                    </button>
                  </div>

                  {couponMessage && (
                    <p className="text-[8px] font-bold mt-3 text-orange-600">
                      {couponMessage}
                    </p>
                  )}

                  <div className="mt-4 space-y-2">
                    {COUPONS.map(
                      (
                        item
                      ) => (
                        <button
                          type="button"
                          key={
                            item.code
                          }
                          onClick={() => {
                            setCoupon(
                              item.code
                            );
                          }}
                          className="w-full text-left p-3 rounded-xl border border-dashed border-slate-200 hover:border-orange-300 transition flex items-center justify-between"
                        >
                          <div>
                            <p className="text-[9px] font-black">
                              {item.code}
                            </p>

                            <p className="text-[7px] text-slate-400 mt-1">
                              {
                                item.description
                              }
                            </p>
                          </div>

                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        </button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>

            {/* GIFT */}

            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center flex-shrink-0">
                <Gift className="w-4 h-4" />
              </div>

              <div>
                <p className="text-[9px] font-black text-orange-800">
                  MAKE IT A GIFT
                </p>

                <p className="text-[8px] text-orange-700/60 mt-1">
                  Add a personalised message during checkout.
                </p>
              </div>

              <button
                type="button"
                className="ml-auto text-[8px] font-black text-orange-700"
              >
                ADD
              </button>
            </div>
          </section>

          {/* RIGHT SUMMARY */}

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-sm font-black">
                  Order Summary
                </h2>
              </div>

              <div className="p-5 space-y-3">
                <PriceRow
                  label={`MRP (${cart.length} items)`}
                  value={totals.mrpTotal}
                />

                <PriceRow
                  label="Product discount"
                  value={
                    -totals.productDiscount
                  }
                  positive
                />

                {totals.couponDiscount >
                  0 && (
                  <PriceRow
                    label="Coupon discount"
                    value={
                      -totals.couponDiscount
                    }
                    positive
                  />
                )}

                <PriceRow
                  label="Delivery"
                  value={
                    totals.shipping
                  }
                  free={
                    totals.shipping ===
                    0
                  }
                />

                <div className="border-t border-dashed border-slate-200 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">
                      Total Amount
                    </span>

                    <span className="text-xl font-black">
                      {formatCurrency(
                        totals.total
                      )}
                    </span>
                  </div>

                  {totals.totalSavings >
                    0 && (
                    <div className="mt-3 p-3 rounded-xl bg-green-50 text-green-700 text-[8px] font-black flex items-center gap-2">
                      <Check className="w-3 h-3" />
                      You are saving{" "}
                      {formatCurrency(
                        totals.totalSavings
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={
                    handleCheckout
                  }
                  className="w-full h-12 rounded-xl bg-orange-500 text-white text-[10px] font-black flex items-center justify-center gap-2 hover:bg-orange-600 disabled:opacity-50 transition mt-5"
                >
                  {saving
                    ? "CONTINUING..."
                    : "PROCEED TO CHECKOUT"}

                  {!saving && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[7px] text-slate-400 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  Safe & secure checkout
                </div>
              </div>
            </div>

            {/* PAYMENT METHODS */}

            <div className="mt-3 bg-white rounded-2xl border border-slate-100 p-4">
              <p className="text-[8px] font-black">
                WE ACCEPT
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  "UPI",
                  "Cards",
                  "Net Banking",
                  "Wallets",
                  "COD",
                ].map(
                  (method) => (
                    <span
                      key={
                        method
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-[7px] font-bold text-slate-500"
                    >
                      {method}
                    </span>
                  )
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* RECOMMENDATION STRIP */}

        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.18em] font-black text-orange-500">
                COMPLETE THE LOOK
              </p>

              <h2 className="text-xl font-black mt-1">
                You may also like
              </h2>
            </div>

            <button
              type="button"
              className="text-[8px] font-black"
            >
              VIEW ALL
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FALLBACK_CART.concat(
              FALLBACK_CART
            )
              .slice(0, 4)
              .map(
                (
                  product,
                  index
                ) => (
                  <RecommendationCard
                    key={`${product.id}-${index}`}
                    product={
                      product
                    }
                    onClick={() =>
                      onProductClick?.(
                        product
                      )
                    }
                  />
                )
              )}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ============================================================
   CART ITEM
============================================================ */

function CartItem({
  item,
  index,
  updating,
  onProductClick,
  onIncrease,
  onDecrease,
  onRemove,
  onWishlist,
}) {
  const discount =
    Number(item.mrp || 0) > 0
      ? Math.round(
          (1 -
            Number(
              item.price || 0
            ) /
              Number(
                item.mrp
              )) *
            100
        )
      : 0;

  return (
    <div
      className={`p-5 ${
        index > 0
          ? "border-t border-slate-100"
          : ""
      }`}
    >
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onProductClick}
          className="w-28 h-32 sm:w-32 sm:h-36 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0"
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              🛍️
            </div>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[8px] uppercase tracking-[0.12em] text-orange-500 font-black">
                {item.brand}
              </p>

              <button
                type="button"
                onClick={onProductClick}
                className="text-xs sm:text-sm font-black text-left mt-1 hover:text-orange-500"
              >
                {item.name}
              </button>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {item.size && (
              <span className="px-2 py-1 rounded-md bg-slate-50 text-[7px] font-bold text-slate-500">
                Size:{" "}
                {item.size}
              </span>
            )}

            {item.color && (
              <span className="px-2 py-1 rounded-md bg-slate-50 text-[7px] font-bold text-slate-500">
                {item.color}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-base font-black">
              {formatCurrency(
                item.price
              )}
            </span>

            {item.mrp && (
              <span className="text-[8px] text-slate-400 line-through">
                {formatCurrency(
                  item.mrp
                )}
              </span>
            )}

            {discount > 0 && (
              <span className="text-[8px] font-black text-green-600">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  disabled={updating}
                  onClick={
                    onDecrease
                  }
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                >
                  <Minus className="w-3 h-3" />
                </button>

                <span className="w-8 text-center text-[9px] font-black">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  disabled={updating}
                  onClick={
                    onIncrease
                  }
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={
                  onWishlist
                }
                className="inline-flex items-center gap-1 text-[7px] font-black text-slate-500 hover:text-orange-500"
              >
                <Heart className="w-3 h-3" />
                MOVE TO WISHLIST
              </button>
            </div>

            <div className="flex items-center gap-1 text-[7px] font-black text-green-600">
              <Truck className="w-3 h-3" />
              Delivery{" "}
              {item.delivery ||
                "soon"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY CART
============================================================ */

function EmptyCart({
  onBack,
}) {
  return (
    <div className="min-h-screen bg-[#fffaf7] flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-5xl">
          🛍️
        </div>

        <h1 className="text-3xl font-black mt-6">
          Your bag is waiting.
        </h1>

        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
          Looks like you haven't added anything yet. Go find something worth obsessing over.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-7 px-7 py-3.5 rounded-xl bg-orange-500 text-white text-[9px] font-black inline-flex items-center gap-2"
        >
          START SHOPPING
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SUMMARY COMPONENTS
============================================================ */

function PriceRow({
  label,
  value,
  positive,
  free,
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[9px] text-slate-500">
        {label}
      </span>

      {free ? (
        <span className="text-[9px] font-black text-green-600">
          FREE
        </span>
      ) : (
        <span
          className={`text-[9px] font-black ${
            positive
              ? "text-green-600"
              : ""
          }`}
        >
          {value < 0
            ? "-"
            : ""}
          {formatCurrency(
            Math.abs(value)
          )}
        </span>
      )}
    </div>
  );
}

function CheckoutStep({
  number,
  label,
  active,
}) {
  return (
    <div
      className={`flex items-center gap-2 ${
        active
          ? "text-blue-950"
          : "text-slate-300"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-black ${
          active
            ? "bg-orange-500 text-white"
            : "bg-slate-100"
        }`}
      >
        {number}
      </div>

      <span className="text-[8px] font-black uppercase">
        {label}
      </span>
    </div>
  );
}

function ProgressLine({
  active,
}) {
  return (
    <div
      className={`w-20 h-px mx-4 ${
        active
          ? "bg-orange-500"
          : "bg-slate-200"
      }`}
    />
  );
}

function DeliveryFeature({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-orange-500" />
      </div>

      <div>
        <p className="text-[7px] font-black">
          {title}
        </p>

        <p className="text-[6px] text-slate-400 mt-0.5">
          {text}
        </p>
      </div>
    </div>
  );
}

function RecommendationCard({
  product,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white rounded-xl border border-slate-100 overflow-hidden group"
    >
      <div className="aspect-square bg-slate-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🛍️
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-[7px] text-slate-400 font-black">
          {product.brand}
        </p>

        <p className="text-[9px] font-black mt-1 truncate">
          {product.name}
        </p>

        <p className="text-xs font-black mt-2">
          {formatCurrency(
            product.price
          )}
        </p>
      </div>
    </button>
  );
}

function formatCurrency(
  value
) {
  return `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN"
  )}`;
}