import React, { useMemo, useState } from 'react';
import {
  X,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Truck,
  Lock,
  Tag,
  Package,
  ChevronLeft,
  Wallet,
  Banknote,
  User,
  Phone,
  Mail,
  Home,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../context/CheckoutContext';

export default function CheckoutModal({
  isOpen,
  onClose,
  onSuccess
}) {
  const {
    cart,
    subtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    appliedCoupon
  } = useCart();

  const {
    loading,
    startRazorpayCheckout,
    placeCodOrder,
    checkoutError,
    setCheckoutError
  } = useCheckout();

  const [step, setStep] = useState(1);
  const [paymentOption, setPaymentOption] =
    useState('RAZORPAY');

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});

  const totalItems = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + Number(item.qty || 0),
        0
      ),
    [cart]
  );

  const updateCustomer = (field, value) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: ''
    }));

    if (checkoutError) {
      setCheckoutError('');
    }
  };

  const validateCustomer = () => {
    const nextErrors = {};

    if (!customer.name.trim()) {
      nextErrors.name =
        'Please enter your full name.';
    }

    if (!/^\d{10}$/.test(customer.phone)) {
      nextErrors.phone =
        'Enter a valid 10-digit mobile number.';
    }

    if (
      customer.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        customer.email
      )
    ) {
      nextErrors.email =
        'Enter a valid email address.';
    }

    if (!customer.address.trim()) {
      nextErrors.address =
        'Please enter your delivery address.';
    }

    if (!customer.city.trim()) {
      nextErrors.city =
        'Please enter your city.';
    }

    if (!customer.state.trim()) {
      nextErrors.state =
        'Please enter your state.';
    }

    if (!/^\d{6}$/.test(customer.pincode)) {
      nextErrors.pincode =
        'Enter a valid 6-digit pincode.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!validateCustomer()) {
      return;
    }

    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!validateCustomer()) {
      setStep(1);
      return;
    }

    if (!cart.length) {
      setCheckoutError(
        'Your cart is empty.'
      );
      return;
    }

    if (paymentOption === 'COD') {
      await placeCodOrder(
        customer,
        (orderData) => {
          onClose();

          if (onSuccess) {
            onSuccess(orderData);
          }
        }
      );

      return;
    }

    await startRazorpayCheckout(
      customer,
      (orderData) => {
        onClose();

        if (onSuccess) {
          onSuccess(orderData);
        }
      }
    );
  };

  const inputClass = (field) =>
    `w-full bg-white border ${
      errors[field]
        ? 'border-rose-400 focus:border-rose-500'
        : 'border-slate-200 focus:border-blue-500'
    } rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400`;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-5xl max-h-[94vh] overflow-hidden rounded-3xl shadow-2xl border border-slate-200 flex flex-col">

        <div className="px-5 sm:px-7 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Secure Checkout
              </h2>

              <p className="text-[11px] text-slate-500">
                Complete your D2C Mall order
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 sm:px-7 py-3 border-b border-slate-100 bg-slate-50">
          <div className="max-w-md mx-auto flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black ${
                  step >= 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                1
              </div>

              <span
                className={`text-[11px] font-bold ${
                  step >= 1
                    ? 'text-slate-900'
                    : 'text-slate-400'
                }`}
              >
                Delivery
              </span>
            </div>

            <div
              className={`h-px flex-1 mx-3 ${
                step >= 2
                  ? 'bg-blue-500'
                  : 'bg-slate-200'
              }`}
            />

            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black ${
                  step >= 2
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </div>

              <span
                className={`text-[11px] font-bold ${
                  step >= 2
                    ? 'text-slate-900'
                    : 'text-slate-400'
                }`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        {checkoutError && (
          <div className="mx-5 sm:mx-7 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />

            <p className="text-[11px] font-semibold text-rose-700">
              {checkoutError}
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-6">

            <div>
              {step === 1 && (
                <form
                  onSubmit={handleContinue}
                  className="space-y-5"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-blue-600" />

                      <h3 className="font-black text-sm text-slate-900">
                        Delivery Address
                      </h3>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Where should we deliver your order?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        Full Name
                      </label>

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <input
                          value={customer.name}
                          onChange={(e) =>
                            updateCustomer(
                              'name',
                              e.target.value
                            )
                          }
                          placeholder="Enter your full name"
                          className={`${inputClass(
                            'name'
                          )} pl-9`}
                        />
                      </div>

                      {errors.name && (
                        <p className="text-[10px] text-rose-600 mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        Mobile Number
                      </label>

                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <input
                          value={customer.phone}
                          onChange={(e) =>
                            updateCustomer(
                              'phone',
                              e.target.value.replace(
                                /\D/g,
                                ''
                              ).slice(0, 10)
                            )
                          }
                          placeholder="10-digit mobile number"
                          inputMode="numeric"
                          className={`${inputClass(
                            'phone'
                          )} pl-9`}
                        />
                      </div>

                      {errors.phone && (
                        <p className="text-[10px] text-rose-600 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        Email Address
                        <span className="font-normal text-slate-400">
                          {' '}
                          (optional)
                        </span>
                      </label>

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <input
                          type="email"
                          value={customer.email}
                          onChange={(e) =>
                            updateCustomer(
                              'email',
                              e.target.value
                            )
                          }
                          placeholder="you@example.com"
                          className={`${inputClass(
                            'email'
                          )} pl-9`}
                        />
                      </div>

                      {errors.email && (
                        <p className="text-[10px] text-rose-600 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        Complete Address
                      </label>

                      <div className="relative">
                        <Home className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                        <textarea
                          rows={3}
                          value={customer.address}
                          onChange={(e) =>
                            updateCustomer(
                              'address',
                              e.target.value
                            )
                          }
                          placeholder="House / Flat / Building, Street, Area"
                          className={`${inputClass(
                            'address'
                          )} pl-9 resize-none`}
                        />
                      </div>

                      {errors.address && (
                        <p className="text-[10px] text-rose-600 mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        Landmark
                        <span className="font-normal text-slate-400">
                          {' '}
                          (optional)
                        </span>
                      </label>

                      <input
                        value={customer.landmark}
                        onChange={(e) =>
                          updateCustomer(
                            'landmark',
                            e.target.value
                          )
                        }
                        placeholder="Nearby landmark"
                        className={inputClass(
                          'landmark'
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        City
                      </label>

                      <input
                        value={customer.city}
                        onChange={(e) =>
                          updateCustomer(
                            'city',
                            e.target.value
                          )
                        }
                        placeholder="City"
                        className={inputClass(
                          'city'
                        )}
                      />

                      {errors.city && (
                        <p className="text-[10px] text-rose-600 mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        State
                      </label>

                      <input
                        value={customer.state}
                        onChange={(e) =>
                          updateCustomer(
                            'state',
                            e.target.value
                          )
                        }
                        placeholder="State"
                        className={inputClass(
                          'state'
                        )}
                      />

                      {errors.state && (
                        <p className="text-[10px] text-rose-600 mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        Pincode
                      </label>

                      <input
                        value={customer.pincode}
                        onChange={(e) =>
                          updateCustomer(
                            'pincode',
                            e.target.value
                              .replace(
                                /\D/g,
                                ''
                              )
                              .slice(0, 6)
                          )
                        }
                        placeholder="6-digit pincode"
                        inputMode="numeric"
                        className={`${inputClass(
                          'pincode'
                        )} font-mono`}
                      />

                      {errors.pincode && (
                        <p className="text-[10px] text-rose-600 mt-1">
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="flex gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />

                      <div>
                        <p className="text-[10px] font-black text-slate-900">
                          Genuine Products
                        </p>

                        <p className="text-[9px] text-slate-500 mt-0.5">
                          Sourced from verified brands
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <Truck className="w-4 h-4 text-blue-600 shrink-0" />

                      <div>
                        <p className="text-[10px] font-black text-slate-900">
                          Pan-India Delivery
                        </p>

                        <p className="text-[9px] text-slate-500 mt-0.5">
                          Multi-carrier logistics
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 p-3 rounded-xl bg-orange-50 border border-orange-100">
                      <RefreshCw className="w-4 h-4 text-orange-600 shrink-0" />

                      <div>
                        <p className="text-[10px] font-black text-slate-900">
                          Easy Returns
                        </p>

                        <p className="text-[9px] text-slate-500 mt-0.5">
                          Simple return process
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/15"
                  >
                    Continue to Payment
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />

                        <h3 className="font-black text-sm text-slate-900">
                          Choose Payment Method
                        </h3>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1">
                        Select how you want to pay
                      </p>
                    </div>

                    <button
                      onClick={() => setStep(1)}
                      disabled={loading}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Edit Address
                    </button>
                  </div>

                  <div className="space-y-3">

                    <button
                      type="button"
                      onClick={() =>
                        setPaymentOption(
                          'RAZORPAY'
                        )
                      }
                      className={`w-full text-left p-4 rounded-2xl border-2 transition ${
                        paymentOption ===
                        'RAZORPAY'
                          ? 'border-blue-600 bg-blue-50/60'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                            <Wallet className="w-5 h-5" />
                          </div>

                          <div>
                            <p className="font-black text-sm text-slate-900">
                              UPI / Cards / Net Banking
                            </p>

                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Secure payment powered by Razorpay
                            </p>
                          </div>
                        </div>

                        {paymentOption ===
                          'RAZORPAY' && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPaymentOption('COD')
                      }
                      className={`w-full text-left p-4 rounded-2xl border-2 transition ${
                        paymentOption === 'COD'
                          ? 'border-blue-600 bg-blue-50/60'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                            <Banknote className="w-5 h-5" />
                          </div>

                          <div>
                            <p className="font-black text-sm text-slate-900">
                              Cash on Delivery
                            </p>

                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Pay securely when your order arrives
                            </p>
                          </div>
                        </div>

                        {paymentOption ===
                          'COD' && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <Lock className="w-4 h-4 text-emerald-600 mt-0.5" />

                      <div>
                        <p className="text-xs font-black text-slate-900">
                          Your payment is secure
                        </p>

                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          D2C Mall does not store your card
                          information. Online payments are processed
                          through a secure payment gateway.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/15 transition"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        {paymentOption === 'COD'
                          ? 'Place COD Order'
                          : 'Pay Securely'}
                        <span>
                          ₹
                          {Number(
                            grandTotal || 0
                          ).toLocaleString(
                            'en-IN'
                          )}
                        </span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[9px] text-slate-400">
                    By placing your order, you agree to D2C
                    Mall's terms, privacy and return policies.
                  </p>
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-0 h-fit space-y-4">

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon />

                    <span className="font-black text-xs text-slate-900">
                      Order Summary
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-bold">
                    {totalItems} items
                  </span>
                </div>

                <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3"
                    >
                      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 shrink-0 p-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black text-blue-600 uppercase">
                          {item.brand}
                        </p>

                        <p className="text-[11px] font-bold text-slate-900 line-clamp-2 mt-0.5">
                          {item.name}
                        </p>

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-slate-400">
                            Qty: {item.qty}
                          </span>

                          <span className="text-[11px] font-black text-slate-900">
                            ₹
                            {(
                              Number(
                                item.price
                              ) *
                              Number(
                                item.qty
                              )
                            ).toLocaleString(
                              'en-IN'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">

                <h4 className="font-black text-xs text-slate-900 pb-2 border-b border-slate-200">
                  Price Details
                </h4>

                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>
                    Items Total
                  </span>

                  <span className="font-bold text-slate-900">
                    ₹
                    {Number(
                      subtotal || 0
                    ).toLocaleString(
                      'en-IN'
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>
                    Delivery
                  </span>

                  <span
                    className={
                      shippingFee === 0
                        ? 'font-black text-emerald-600'
                        : 'font-bold text-slate-900'
                    }
                  >
                    {shippingFee === 0
                      ? 'FREE'
                      : `₹${Number(
                          shippingFee
                        ).toLocaleString(
                          'en-IN'
                        )}`}
                  </span>
                </div>

                {appliedCoupon &&
                  discountAmount > 0 && (
                    <div className="flex justify-between text-[11px] text-emerald-700">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {appliedCoupon.code}
                      </span>

                      <span className="font-black">
                        -₹
                        {Number(
                          discountAmount
                        ).toLocaleString(
                          'en-IN'
                        )}
                      </span>
                    </div>
                  )}

                <div className="pt-3 mt-1 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-black text-sm text-slate-900">
                    Total Payable
                  </span>

                  <span className="font-black text-lg text-blue-600">
                    ₹
                    {Number(
                      grandTotal || 0
                    ).toLocaleString(
                      'en-IN'
                    )}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5">
                <div className="flex gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />

                  <div>
                    <p className="text-[10px] font-black text-slate-900">
                      D2C Mall Buyer Protection
                    </p>

                    <p className="text-[9px] text-slate-600 leading-relaxed mt-1">
                      Verified products, secure checkout and
                      doorstep delivery with eligible returns.
                    </p>
                  </div>
                </div>
              </div>

              {step === 2 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />

                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-slate-900">
                        Delivering to
                      </p>

                      <p className="text-[10px] text-slate-500 mt-1 break-words">
                        {customer.name}
                        <br />
                        {customer.address}
                        {customer.landmark
                          ? `, ${customer.landmark}`
                          : ''}
                        <br />
                        {customer.city},{' '}
                        {customer.state} -{' '}
                        {customer.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        <div className="px-5 sm:px-7 py-3 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-[9px] text-slate-400">
            <Lock className="w-3 h-3" />
            Secure checkout
            <span>•</span>
            Pan-India delivery
            <span>•</span>
            Easy returns
          </div>

          <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
            <span>Powered by</span>
            <span className="font-black text-slate-600">
              D2C MALL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingBagIcon() {
  return (
    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
      <Package className="w-3.5 h-3.5" />
    </div>
  );
}