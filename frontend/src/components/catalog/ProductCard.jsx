import React from 'react';
import { Star, Eye, ShoppingBag, MapPin, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-blue-950/50 relative overflow-hidden">
      <div className="space-y-4">
        <div
          onClick={() => onSelectProduct(product)}
          className="h-52 bg-slate-950 rounded-2xl overflow-hidden relative cursor-pointer border border-slate-800/80"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-white/90 text-slate-950 text-xs font-black px-4 py-2 rounded-xl shadow-xl flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Inspect Details</span>
            </span>
          </div>

          <span
            className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider text-white px-3 py-1 rounded-xl shadow-lg backdrop-blur-md"
            style={{ backgroundColor: product.brandColor }}
          >
            {product.brand}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-md font-black">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>4.9</span>
            </div>
            <span className="text-slate-400 flex items-center">
              <MapPin className="w-3 h-3 mr-1 text-slate-500" /> {product.warehouseCity}
            </span>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="font-bold text-sm text-slate-100 line-clamp-1 hover:text-blue-400 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="font-black text-lg text-white">₹{product.price}</span>
            <span className="text-xs text-slate-500 line-through">₹{product.mrp}</span>
          </div>
          <p className={`text-[11px] font-bold mt-0.5 ${product.stock <= 2 ? 'text-orange-400' : 'text-emerald-400'}`}>
            {product.stock > 0 ? `${product.stock} units in hub` : 'Sold out'}
          </p>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center space-x-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{product.stock > 0 ? 'Add +' : 'Sold'}</span>
        </button>
      </div>
    </div>
  );
}