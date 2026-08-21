import React from 'react';
import { ShoppingBag, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../context/CheckoutContext';
import PincodeChecker from './PincodeChecker';
import CouponInput from './CouponInput';

export default function CartDrawer({ pincode, setPincode, onSuccess }) {
  const { cart, updateQty, subtotal, shippingFee, discountAmount, grandTotal, deliveryInfo, appliedCoupon } = useCart();
  const { loading, startRazorpayCheckout } = useCheckout();

  const handlePay = () => {
    startRazorpayCheckout(
      { name: 'Meenakshi', pincode: pincode || '835215', city: 'Ranchi' },
      () => {
        if (onSuccess) onSuccess();
      }
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col h-fit sticky top-28 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <h3 className="font-black text-lg text-white flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-blue-400" />
          <span>Your Basket</span>
        </h3>
        <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
          {cart.reduce((a, b) => a + b.qty, 0)} Items
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xs space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
            <ShoppingBag className="w-8 h-8 opacity-40" />
          </div>
          <p>Your basket is currently empty.<br />Add products from our brand channels.</p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-slate-200 truncate">{item.name}</p>
                  <span className="text-[10px] font-bold text-emerald-400">{item.brand}</span>
                  <p className="font-black text-white mt-1">₹{item.price * item.qty}</p>
                </div>
                <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                  <button
                    onClick={() => updateQty(item.id, -1, item.stock)}
                    className="w-6 h-6 flex items-center justify-center font-black text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xs font-black px-1.5 text-white">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1, item.stock)}
                    className="w-6 h-6 flex items-center justify-center font-black text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <PincodeChecker pincode={pincode} setPincode={setPincode} />
          <CouponInput />

          <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Channel Subtotal:</span>
              <span className="font-bold text-slate-200">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Freight (Shiprocket):</span>
              <span className="font-bold text-slate-200">₹{shippingFee}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Coupon ({appliedCoupon.code}):</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
              <span>Grand Payable:</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                ₹{grandTotal}
              </span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={loading || (cart.length > 0 && !deliveryInfo?.deliverable)}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-emerald-600/25 active:scale-98 transition-all"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Pay via Razorpay</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted & RBI Gateway Compliant</span>
          </div>
        </div>
      )}
    </div>
  );
}