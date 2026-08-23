import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

export default function CartDrawer({ onProceedCheckout }) {
  const { 
    cart, updateQty, removeFromCart, subtotal, shippingFee, 
    discountAmount, grandTotal, appliedCoupon, setAppliedCoupon 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCustomCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      const res = await api.validateCoupon(couponInput, subtotal);
      setAppliedCoupon({ code: couponInput.toUpperCase(), discountAmount: res.discountAmount });
      setCouponMsg(`Coupon ${couponInput.toUpperCase()} applied!`);
    } catch (err) {
      setCouponMsg('Invalid coupon code');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900">Your basket is empty</h3>
        <p className="text-xs text-slate-500">Items you add will remain saved automatically for when you return.</p>
      </div>
    );
  }

  const freeShippingThreshold = 499;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex justify-between items-center font-bold text-blue-900">
            <span>{subtotal >= freeShippingThreshold ? '🎉 You have unlocked Free Shipping!' : `Add ₹${freeShippingThreshold - subtotal} more for Free Shipping`}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 flex justify-between items-center">
            <span>Items in Basket</span>
            <span className="text-xs font-semibold text-slate-500">{cart.length} unique SKUs</span>
          </h2>

          <div className="space-y-4 divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-contain bg-slate-50 border border-slate-200 p-1" />
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                      {item.brand}
                    </span>
                    <h4 className="font-black text-slate-900 text-sm mt-1">{item.name}</h4>
                    <p className="text-slate-500 text-[11px]">₹{item.price} each</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl">
                    <button
                      onClick={() => updateQty(item.id, -1, item.stock)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-slate-700 hover:bg-white rounded cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold px-1.5 text-slate-900">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1, item.stock)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-slate-700 hover:bg-white rounded cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="font-black text-sm text-slate-900 block">₹{item.price * item.qty}</span>
                    <button
                      onClick={() => removeFromCart ? removeFromCart(item.id) : updateQty(item.id, -item.qty, item.stock)}
                      className="text-rose-500 hover:text-rose-700 text-[11px] font-semibold mt-0.5 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Price Details ({cart.reduce((a, b) => a + b.qty, 0)} Items)
          </h3>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Total MRP:</span>
              <span className="font-bold text-slate-900">₹{subtotal + discountAmount}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Discount on MRP:</span>
              <span>-₹{discountAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className={shippingFee === 0 ? 'text-emerald-700 font-bold' : 'font-bold text-slate-900'}>
                {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Amount:</span>
              <span className="text-blue-600">₹{grandTotal}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="text-[11px] font-bold text-slate-700 flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1 text-orange-500" /> Have a Promo Code?
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. D2C100"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs flex-1 uppercase font-mono outline-none focus:border-blue-600"
              />
              <button
                onClick={handleApplyCustomCoupon}
                className="bg-slate-900 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Apply
              </button>
            </div>
            {couponMsg && <p className="text-[10px] text-emerald-700 font-bold">{couponMsg}</p>}
          </div>

          <button
            onClick={onProceedCheckout}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-600/20 active:scale-98 transition cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-[11px] text-slate-500 space-y-1.5">
          <div className="flex items-center space-x-2 text-slate-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Safe and Secure Payments</span>
          </div>
          <p>Easy returns. 100% Authentic products directly sourced from verified brand warehouses.</p>
        </div>
      </div>
    </div>
  );
}