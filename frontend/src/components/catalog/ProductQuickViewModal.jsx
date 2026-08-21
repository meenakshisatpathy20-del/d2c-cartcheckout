import React from 'react';
import { X, Star, ShieldCheck, Truck, RotateCcw, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductQuickViewModal({ product, isOpen, onClose, onInstantCheckout }) {
  const { addToCart } = useCart();
  if (!isOpen || !product) return null;

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
          <div className="w-full sm:w-1/2 h-60 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          </div>

          <div className="w-full sm:flex-1 space-y-3">
            <span
              className="text-[10px] font-black uppercase tracking-wider text-white px-2.5 py-0.5 rounded shadow-sm"
              style={{ backgroundColor: product.brandColor }}
            >
              {product.brand}
            </span>
            <h2 className="text-lg font-black text-slate-900 leading-tight">{product.name}</h2>
            <div className="flex items-center space-x-2 text-xs text-amber-500 font-bold">
              <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 mr-1" /> {product.rating}
              </div>
              <span className="text-slate-400 font-normal">({product.warehouseCity})</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">{product.description}</p>

            <div className="flex items-baseline space-x-2 pt-1 border-t border-slate-100">
              <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
              <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
              </span>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition"
              >
                Add to Basket
              </button>
              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                  if (onInstantCheckout) onInstantCheckout();
                }}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md shadow-orange-500/20"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}