import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, CheckCircle2, AlertCircle, ShoppingBag, Zap, RotateCcw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

export default function ProductDetailModal({ product, isOpen, onClose, onBuyNow }) {
  const { addToCart } = useCart();
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [loadingPin, setLoadingPin] = useState(false);
  const [pinError, setPinError] = useState('');

  if (!isOpen || !product) return null;

  const handleCheckDelivery = async () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setPinError('Please enter a valid 6-digit pin code.');
      return;
    }
    setLoadingPin(true);
    setPinError('');
    try {
      const res = await api.checkDelivery(pincode);
      setDeliveryResult(res);
    } catch (err) {
      setPinError(err.message || 'Delivery check failed.');
    } finally {
      setLoadingPin(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl p-6 relative shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-1/2 h-64 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          </div>

          <div className="w-full sm:flex-1 space-y-3">
            <span
              className="text-[10px] font-black uppercase text-white px-2.5 py-0.5 rounded shadow-xs"
              style={{ backgroundColor: product.brandColor }}
            >
              {product.brand}
            </span>
            <h2 className="text-lg font-black text-slate-900 leading-tight">{product.name}</h2>

            <div className="flex items-center space-x-2 text-xs text-amber-500 font-bold">
              <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 mr-1" /> {product.rating}
              </div>
              <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">{product.description}</p>

            <div className="flex items-baseline space-x-2 pt-1 border-t border-slate-100">
              <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
              <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
              </span>
            </div>

            {/* Delivery Availability Checker */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-slate-700 flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1 text-blue-600" /> Delivery Options
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter Delivery Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs flex-1 text-slate-900 outline-none focus:border-blue-600"
                />
                <button
                  onClick={handleCheckDelivery}
                  disabled={loadingPin}
                  className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl font-bold hover:bg-slate-800 transition"
                >
                  {loadingPin ? '...' : 'Check'}
                </button>
              </div>

              {pinError && <p className="text-[11px] text-rose-600 font-semibold">{pinError}</p>}
              {deliveryResult && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-[11px] text-emerald-800 font-medium">
                  Available in <strong>{deliveryResult.estimatedDays} days</strong> ({deliveryResult.courierPartner})
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                  if (onBuyNow) onBuyNow();
                }}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Instant Buy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}