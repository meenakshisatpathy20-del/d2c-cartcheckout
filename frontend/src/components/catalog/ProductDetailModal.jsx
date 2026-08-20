import React, { useState } from 'react';
import { 
  X, Star, ShieldCheck, Truck, Clock, PackageCheck, 
  MapPin, CheckCircle, AlertCircle, ShoppingBag, Zap, ArrowRight 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

export default function ProductDetailModal({ product, isOpen, onClose, onBuyNow }) {
  const { addToCart, cart } = useCart();
  const [selectedPincode, setSelectedPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [checkingPin, setCheckingPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!isOpen || !product) return null;

  const currentCartQty = cart.find((i) => i.id === product.id)?.qty || 0;
  const isOutOfStock = product.stock === 0;
  const isMaxStockAdded = currentCartQty >= product.stock;

  const handleCheckPincode = async () => {
    if (selectedPincode.length !== 6) {
      setPinError('Enter a valid 6-digit pin code.');
      return;
    }
    setCheckingPin(true);
    setPinError('');
    try {
      const res = await api.checkPincode(selectedPincode);
      setDeliveryResult(res);
    } catch (err) {
      setPinError(err.message || 'Logistics verification failed.');
      setDeliveryResult(null);
    } finally {
      setCheckingPin(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleInstantBuy = () => {
    addToCart(product);
    if (onBuyNow) onBuyNow();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        <div className="md:w-1/2 bg-slate-100/70 p-8 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-200">
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span
                className="text-xs font-black uppercase tracking-wider text-white px-3 py-1 rounded-full shadow-sm"
                style={{ backgroundColor: product.brandColor }}
              >
                {product.brand}
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% Brand Certified
              </span>
            </div>

            <div className="h-72 md:h-84 rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-inner flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-slate-500 bg-white/80 p-3 rounded-xl border border-slate-200/60">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-blue-700" />
              <span>Direct Dispatched from <strong className="text-slate-800">{product.warehouseCity}</strong></span>
            </div>
            <span className="font-semibold text-emerald-700">In-Stock</span>
          </div>
        </div>

        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{product.brand}</p>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">{product.name}</h1>
              </div>
              <button
                onClick={onClose}
                className="hidden md:flex p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded">
                <Star className="w-3 h-3 fill-slate-950 mr-1" /> 4.8
              </div>
              <span className="text-xs text-slate-500 font-medium">1,248 Verified Ratings & Reviews</span>
            </div>

            <div className="flex items-baseline space-x-3 pt-2 border-t border-slate-100">
              <span className="text-3xl font-black text-slate-900">₹{product.price}</span>
              <span className="text-sm text-slate-400 line-through">₹{product.mrp}</span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
              </span>
            </div>

            <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Warehouse Real-Time Inventory:</span>
                <span className={product.stock <= 2 ? 'text-orange-600 font-bold' : 'text-slate-900'}>
                  {product.stock} Units Remaining
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    product.stock <= 2 ? 'bg-orange-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, (product.stock / 5) * 100)}%` }}
                />
              </div>
              {currentCartQty > 0 && (
                <p className="text-[11px] text-blue-700 font-medium pt-1">
                  You already have {currentCartQty} unit(s) in your basket.
                </p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-800 flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
                Shiprocket Delivery & Availability Check
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  maxLength="6"
                  placeholder="Enter 6-digit Delivery Pincode"
                  value={selectedPincode}
                  onChange={(e) => setSelectedPincode(e.target.value)}
                  className="border border-slate-300 rounded-xl px-3.5 py-2 text-xs flex-1 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  onClick={handleCheckPincode}
                  disabled={checkingPin}
                  className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  {checkingPin ? 'Checking...' : 'Check'}
                </button>
              </div>

              {pinError && (
                <p className="text-xs text-red-600 flex items-center pt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> {pinError}
                </p>
              )}

              {deliveryResult && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1 mt-2">
                  <p className="font-bold flex items-center text-emerald-800">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    Express Delivery Available via {deliveryResult.courierPartner}
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Estimated Transit: <strong>{deliveryResult.estimatedDays} business days</strong> | COD Support: <strong>Yes</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isMaxStockAdded}
              className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 disabled:bg-slate-100 disabled:text-slate-400'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedAnimation ? 'Added to Cart!' : isMaxStockAdded ? 'Stock Limit in Cart' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleInstantBuy}
              disabled={isOutOfStock || isMaxStockAdded}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-slate-300 disabled:to-slate-300 text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-orange-500/20 active:scale-98"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Buy Now (Instant Checkout)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}