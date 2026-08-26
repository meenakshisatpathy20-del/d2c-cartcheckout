import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
  Lock,
  Sparkles,
  ChevronRight,
  BadgeCheck,
  Heart,
  Zap,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

export default function CartDrawer({ onProceedCheckout }) {
  const {
    cart,
    updateQty,
    removeFromCart,
    subtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    appliedCoupon,
    setAppliedCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.qty || 0),
    0
  );

  const freeShippingThreshold = 499;

  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );

  const progressPercent = Math.min(
    100,
    Math.round(
      (subtotal / freeShippingThreshold) * 100
    )
  );

  const totalMRP = cart.reduce(
    (total, item) =>
      total +
      Number(item.mrp || item.price || 0) *
        Number(item.qty || 1),
    0
  );

  const productSavings = Math.max(
    0,
    totalMRP - subtotal
  );

  const totalSavings =
    productSavings + Number(discountAmount || 0);

  const handleApplyCustomCoupon = async () => {
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponMsg('Enter a promo code.');
      return;
    }

    setCouponLoading(true);
    setCouponMsg('');

    try {
      const res = await api.validateCoupon(
        code,
        subtotal
      );

      setAppliedCoupon({
        code,
        discountAmount:
          Number(res.discountAmount) || 0
      });

      setCouponMsg(
        `Coupon ${code} applied successfully.`
      );
    } catch (err) {
      setCouponMsg(
        err?.message || 'Invalid or expired coupon code.'
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponMsg('');
  };

  const handleRemoveItem = (id) => {
    setRemovingId(id);

    setTimeout(() => {
      if (removeFromCart) {
        removeFromCart(id);
      }

      setRemovingId(null);
    }, 150);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 px-6 py-10 text-white text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-white" />
            </div>

            <h2 className="text-2xl font-black mt-5">
              Your basket is waiting
            </h2>

            <p className="text-sm text-white/65 mt-2 max-w-md mx-auto leading-relaxed">
              Discover beauty, electronics, fashion accessories and more from D2C Mall's growing brand collection.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <EmptyTrust
                icon={ShieldCheck}
                title="Genuine Products"
                text="Verified brands"
              />

              <EmptyTrust
                icon={Truck}
                title="Pan-India Delivery"
                text="Wide pincode coverage"
              />

              <EmptyTrust
                icon={RotateCcw}
                title="Easy Returns"
                text="On eligible products"
              />
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />

              <div>
                <p className="text-xs font-black text-blue-950">
                  Your basket stays saved
                </p>

                <p className="text-[11px] text-blue-700 mt-1 leading-relaxed">
                  Add products now and come back later without losing your selection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />

            <h1 className="text-xl sm:text-2xl font-black text-slate-950">
              Your Basket
            </h1>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            {totalItems} item{totalItems !== 1 ? 's' : ''} from{' '}
            {cart.length} brand
            {cart.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          Secure checkout
        </div>
      </div>

      <div
        className={`rounded-2xl border p-4 ${
          remainingForFreeShipping === 0
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-blue-50 border-blue-200'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                remainingForFreeShipping === 0
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {remainingForFreeShipping === 0 ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Truck className="w-5 h-5" />
              )}
            </div>

            <div>
              <p
                className={`text-xs font-black ${
                  remainingForFreeShipping === 0
                    ? 'text-emerald-900'
                    : 'text-blue-950'
                }`}
              >
                {remainingForFreeShipping === 0
                  ? 'Free delivery unlocked'
                  : `Add ₹${remainingForFreeShipping.toLocaleString(
                      'en-IN'
                    )} more for FREE delivery`}
              </p>

              <p className="text-[10px] text-slate-500 mt-0.5">
                {remainingForFreeShipping === 0
                  ? 'Your order qualifies for free shipping.'
                  : `Free shipping on orders above ₹${freeShippingThreshold}`}
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-black ${
              remainingForFreeShipping === 0
                ? 'text-emerald-700'
                : 'text-blue-700'
            }`}
          >
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-white/80 h-2 rounded-full overflow-hidden mt-3 border border-black/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              remainingForFreeShipping === 0
                ? 'bg-emerald-500'
                : 'bg-blue-600'
            }`}
            style={{
              width: `${progressPercent}%`
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-950">
                  Items in Basket
                </h2>

                <p className="text-[10px] text-slate-400 mt-1">
                  Review quantity, price and availability
                </p>
              </div>

              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-black">
                {cart.length} SKU
                {cart.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {cart.map((item) => {
                const itemPrice =
                  Number(item.price || 0);

                const itemMrp =
                  Number(item.mrp || item.price || 0);

                const itemQty =
                  Number(item.qty || 1);

                const itemTotal =
                  itemPrice * itemQty;

                const itemSaving =
                  Math.max(
                    0,
                    itemMrp - itemPrice
                  ) * itemQty;

                const stock =
                  Number(item.stock ?? 0);

                const lowStock =
                  stock > 0 && stock <= 5;

                const outOfStock =
                  stock === 0;

                return (
                  <div
                    key={item.id}
                    className={`p-5 sm:p-6 transition-all ${
                      removingId === item.id
                        ? 'opacity-40 scale-[0.99]'
                        : ''
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />

                        {item.brand && (
                          <span className="absolute -bottom-2 left-2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-lg max-w-[85%] truncate">
                            {item.brand}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                                {item.brand || 'D2C Mall'}
                              </span>

                              <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                                <BadgeCheck className="w-3 h-3" />
                                Verified
                              </span>
                            </div>

                            <h3 className="font-black text-sm sm:text-base text-slate-950 mt-2 leading-snug">
                              {item.name}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                              <span className="text-xs font-black text-slate-900">
                                ₹
                                {itemPrice.toLocaleString(
                                  'en-IN'
                                )}
                              </span>

                              {itemMrp > itemPrice && (
                                <span className="text-[11px] text-slate-400 line-through">
                                  ₹
                                  {itemMrp.toLocaleString(
                                    'en-IN'
                                  )}
                                </span>
                              )}

                              {itemSaving > 0 && (
                                <span className="text-[9px] font-black text-emerald-600">
                                  Save ₹
                                  {itemSaving.toLocaleString(
                                    'en-IN'
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-base font-black text-slate-950">
                              ₹
                              {itemTotal.toLocaleString(
                                'en-IN'
                              )}
                            </p>

                            <p className="text-[9px] text-slate-400 mt-0.5">
                              Item total
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                              <button
                                onClick={() =>
                                  updateQty(
                                    item.id,
                                    -1,
                                    item.stock
                                  )
                                }
                                disabled={
                                  itemQty <= 1
                                }
                                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center transition"
                              >
                                <Minus className="w-3.5 h-3.5 text-slate-700" />
                              </button>

                              <span className="w-9 text-center text-xs font-black text-slate-900">
                                {itemQty}
                              </span>

                              <button
                                onClick={() =>
                                  updateQty(
                                    item.id,
                                    1,
                                    item.stock
                                  )
                                }
                                disabled={
                                  stock > 0 &&
                                  itemQty >= stock
                                }
                                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center transition"
                              >
                                <Plus className="w-3.5 h-3.5 text-slate-700" />
                              </button>
                            </div>

                            <button
                              onClick={() =>
                                handleRemoveItem(
                                  item.id
                                )
                              }
                              className="h-10 px-3 rounded-xl text-[10px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {outOfStock ? (
                              <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Currently unavailable
                              </span>
                            ) : lowStock ? (
                              <span className="flex items-center gap-1.5 text-[10px] font-black text-orange-600">
                                <Zap className="w-3.5 h-3.5" />
                                Only {stock} left
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                In stock
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-[9px] font-bold text-slate-400">
                          <span className="flex items-center gap-1">
                            <Truck className="w-3 h-3 text-blue-500" />
                            Pan-India delivery
                          </span>

                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            Brand certified
                          </span>

                          <span className="flex items-center gap-1">
                            <RotateCcw className="w-3 h-3 text-orange-500" />
                            Easy returns
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CartBenefit
              icon={ShieldCheck}
              title="Genuine Products"
              text="Sourced from verified brand channels"
            />

            <CartBenefit
              icon={Truck}
              title="Reliable Delivery"
              text="Trackable pan-India shipments"
            />

            <CartBenefit
              icon={RotateCcw}
              title="Easy Returns"
              text="Simple return process on eligible items"
            />
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-black text-blue-600">
                    Summary
                  </p>

                  <h3 className="text-base font-black text-slate-950 mt-1">
                    Price Details
                  </h3>
                </div>

                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-5 space-y-3 text-xs">
                <PriceRow
                  label={`Total MRP (${totalItems} items)`}
                  value={`₹${totalMRP.toLocaleString(
                    'en-IN'
                  )}`}
                />

                <PriceRow
                  label="Product Discount"
                  value={`-₹${productSavings.toLocaleString(
                    'en-IN'
                  )}`}
                  valueClass="text-emerald-600"
                />

                {Number(discountAmount || 0) >
                  0 && (
                  <PriceRow
                    label="Coupon Discount"
                    value={`-₹${Number(
                      discountAmount
                    ).toLocaleString(
                      'en-IN'
                    )}`}
                    valueClass="text-emerald-600"
                  />
                )}

                <PriceRow
                  label="Delivery Fee"
                  value={
                    Number(
                      shippingFee || 0
                    ) === 0
                      ? 'FREE'
                      : `₹${Number(
                          shippingFee
                        ).toLocaleString(
                          'en-IN'
                        )}`
                  }
                  valueClass={
                    Number(
                      shippingFee || 0
                    ) === 0
                      ? 'text-emerald-600'
                      : ''
                  }
                />

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-end gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-950">
                        Total Amount
                      </p>

                      {totalSavings > 0 && (
                        <p className="text-[10px] text-emerald-600 font-black mt-1">
                          You save ₹
                          {totalSavings.toLocaleString(
                            'en-IN'
                          )}
                        </p>
                      )}
                    </div>

                    <span className="text-2xl font-black text-blue-600">
                      ₹
                      {Number(
                        grandTotal || 0
                      ).toLocaleString(
                        'en-IN'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100">
                <label className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-500" />
                  Apply Promo Code
                </label>

                {appliedCoupon ? (
                  <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                      <div className="min-w-0">
                        <p className="font-mono text-xs font-black text-emerald-800 truncate">
                          {appliedCoupon.code}
                        </p>

                        <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">
                          Coupon successfully applied
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={
                        handleRemoveCoupon
                      }
                      className="text-[10px] font-black text-rose-600 hover:text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key ===
                            'Enter'
                          ) {
                            e.preventDefault();
                            handleApplyCustomCoupon();
                          }
                        }}
                        className="h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs flex-1 uppercase font-mono outline-none focus:bg-white focus:border-blue-600 transition"
                      />

                      <button
                        onClick={
                          handleApplyCustomCoupon
                        }
                        disabled={
                          couponLoading
                        }
                        className="h-11 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl text-xs font-black transition"
                      >
                        {couponLoading
                          ? '...'
                          : 'Apply'}
                      </button>
                    </div>

                    {couponMsg && (
                      <p
                        className={`text-[10px] font-bold mt-2 ${
                          couponMsg.includes(
                            'successfully'
                          )
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {couponMsg}
                      </p>
                    )}
                  </>
                )}
              </div>

              <button
                onClick={onProceedCheckout}
                disabled={cart.length === 0}
                className="w-full mt-5 h-14 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition active:scale-[0.99]"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-slate-400 font-bold">
                <Lock className="w-3 h-3" />
                Secure payment & protected checkout
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[22px] p-5 text-white">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />

              <div>
                <p className="text-xs font-black">
                  Shop with confidence
                </p>

                <p className="text-[10px] text-white/55 leading-relaxed mt-1.5">
                  D2C Mall connects customers with verified brands across its growing pan-India retail and ecommerce network.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <DarkTrust text="Verified brands" />
              <DarkTrust text="Trackable orders" />
              <DarkTrust text="Pan-India delivery" />
              <DarkTrust text="Easy returns" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />

              <p className="text-[10px] font-black text-orange-900">
                More brands. One basket.
              </p>
            </div>

            <p className="text-[10px] text-orange-700 mt-1.5 leading-relaxed">
              Discover products across beauty, electronics, fashion accessories and more without visiting multiple stores.
            </p>

            <div className="flex items-center gap-1 mt-2 text-[9px] font-black text-orange-700">
              Explore D2C Mall
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  valueClass = ''
}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-500">
        {label}
      </span>

      <span
        className={`font-bold text-slate-800 ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function CartBenefit({
  icon: Icon,
  title,
  text
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="w-9 h-9 rounded-xl bg-slate-50 text-blue-600 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>

      <p className="text-xs font-black text-slate-900 mt-3">
        {title}
      </p>

      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function EmptyTrust({
  icon: Icon,
  title,
  text
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-4">
      <Icon className="w-5 h-5 text-blue-600" />

      <p className="text-xs font-black text-slate-900 mt-2">
        {title}
      </p>

      <p className="text-[10px] text-slate-500 mt-1">
        {text}
      </p>
    </div>
  );
}

function DarkTrust({ text }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[9px] font-bold text-white/70 flex items-center gap-1.5">
      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
      {text}
    </div>
  );
}