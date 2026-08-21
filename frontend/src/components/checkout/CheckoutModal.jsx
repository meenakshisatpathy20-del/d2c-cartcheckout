import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, User, MapPin, Phone, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../context/CheckoutContext';

export default function CheckoutModal({ isOpen, onClose, onSuccess }) {
  const { cart, subtotal, shippingFee, discountAmount, grandTotal, appliedCoupon } = useCart();
  const { loading, startRazorpayCheckout, checkoutError } = useCheckout();

  const [paymentOption, setPaymentOption] = useState('RAZORPAY'); // 'RAZORPAY' | 'COD'

  const [customer, setCustomer] = useState({
    name: 'Meenakshi',
    phone: '9876543210',
    email: 'meenakshi@d2csale.com',
    address: 'BIT Mesra Campus, Technology Block',
    city: 'Ranchi',
    pincode: '835215'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    startRazorpayCheckout(customer, (orderData) => {
      onClose();
      if (onSuccess) onSuccess(orderData);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl p-6 sm:p-8 relative shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Fast Express Checkout</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Enter shipping details and choose payment method</p>
        </div>

        {checkoutError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {checkoutError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Shipping Address Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Number (for SMS Tracking)</label>
              <input
                type="text"
                required
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Complete Delivery Address</label>
            <input
              type="text"
              required
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                required
                value={customer.city}
                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Pincode</label>
              <input
                type="text"
                required
                maxLength={6}
                value={customer.pincode}
                onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Payment Methods (UPI / Cards / NetBanking) */}
          <div className="space-y-2 pt-2">
            <label className="font-bold text-slate-700 block">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setPaymentOption('RAZORPAY')}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  paymentOption === 'RAZORPAY' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <p className="font-bold text-slate-900">UPI / Cards / NetBanking</p>
                  <p className="text-[10px] text-slate-500">Instant Online Payment</p>
                </div>
                {paymentOption === 'RAZORPAY' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>

              <div
                onClick={() => setPaymentOption('COD')}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  paymentOption === 'COD' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <p className="font-bold text-slate-900">Cash on Delivery</p>
                  <p className="text-[10px] text-slate-500">Pay at Doorstep</p>
                </div>
                {paymentOption === 'COD' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
            </div>
          </div>

          {/* Price Preview */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
            <div className="flex justify-between text-slate-500">
              <span>Items Total ({cart.length} SKUs):</span>
              <span className="font-bold text-slate-800">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery Fee:</span>
              <span className="font-bold text-slate-800">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Voucher ({appliedCoupon.code}):</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Payable:</span>
              <span className="text-blue-700">₹{grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Confirm Order & Pay ₹{grandTotal}</span>}
          </button>
        </form>
      </div>
    </div>
  );
}