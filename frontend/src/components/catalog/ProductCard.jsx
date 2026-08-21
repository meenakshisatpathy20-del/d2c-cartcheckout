import React from 'react';
import { Star, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition group">
      <div>
        <div
          onClick={() => onSelectProduct(product)}
          className="h-48 bg-slate-50 rounded-2xl overflow-hidden cursor-pointer border border-slate-100 p-3 flex items-center justify-center relative"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span
            className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded shadow-xs"
            style={{ backgroundColor: product.brandColor }}
          >
            {product.brand}
          </span>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded font-bold border border-amber-200">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
            <span className="text-emerald-700 font-bold text-[11px]">In Stock</span>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="font-bold text-sm text-slate-900 line-clamp-1 hover:text-blue-600 cursor-pointer mt-1"
          >
            {product.name}
          </h3>

          <p className="text-[11px] text-slate-500 flex items-center">
            <Truck className="w-3 h-3 mr-1 text-slate-400" /> Delivery by {product.estimatedDays ? `${product.estimatedDays} business days` : 'Tuesday'}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-black text-base text-slate-900">₹{product.price}</span>
            <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">
            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
          </span>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs active:scale-95 flex items-center space-x-1"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}