import React from 'react';
import { ShoppingBag, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer({ onProceedCheckout }) {
  const { cart, updateQty, subtotal, shippingFee, discountAmount, grandTotal, appliedCoupon, setAppliedCoupon } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-slate-900">Your basket is empty</h3>
        <p className="text-xs text-slate-500">Explore products from our brand showcase to begin shopping.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <h2 className="text-lg font-black text-slate-900">Shopping Cart ({cart.length} items)</h2>
        <span className="text-xs text-slate-500">Express Delivery Eligible</span>
      </div>

      <div className="space-y-3 divide-y divide-slate-100">
        {cart.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
            <div className="flex items-center space-x-3">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1" />
              <div>
                <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                <p className="text-slate-500">{item.brand}</p>
                <span className="font-black text-slate-900">₹{item.price * item.qty}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => updateQty(item.id, -1, item.stock)}
                className="w-6 h-6 flex items-center justify-center font-bold text-slate-700 hover:bg-white rounded"
              >
                -
              </button>
              <span className="font-bold px-1.5">{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, 1, item.stock)}
                className="w-6 h-6 flex items-center justify-center font-bold text-slate-700 hover:bg-white rounded"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Calculation */}
      <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs border border-slate-200/80">
        <div className="flex justify-between text-slate-600">
          <span>Items Total:</span>
          <span className="font-bold text-slate-900">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Standard Delivery:</span>
          <span className="font-bold text-slate-900">₹{shippingFee}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-emerald-700 font-bold">
            <span>Coupon ({appliedCoupon.code}):</span>
            <span>-₹{discountAmount}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
          <span>Grand Total:</span>
          <span className="text-blue-600">₹{grandTotal}</span>
        </div>
      </div>

      <button
        onClick={onProceedCheckout}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md transition"
      >
        <span>Proceed to Address & Payment</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}