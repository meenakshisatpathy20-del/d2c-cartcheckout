import React from 'react';
import { Star, Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 relative">
      <div>
        <div 
          onClick={() => onSelectProduct(product)}
          className="h-44 bg-slate-100 rounded-xl mb-3.5 overflow-hidden relative cursor-pointer group-hover:opacity-95 transition-opacity"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1 backdrop-blur-sm">
              <Eye className="w-3.5 h-3.5 text-blue-700" />
              <span>Quick View</span>
            </span>
          </div>

          <span
            className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wider text-white px-2.5 py-0.5 rounded-md shadow-sm"
            style={{ backgroundColor: product.brandColor }}
          >
            {product.brand}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-[11px] text-amber-500 font-bold">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>4.8</span>
            <span className="text-slate-400 font-normal">({product.warehouseCity})</span>
          </div>

          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-bold text-sm text-slate-800 line-clamp-1 hover:text-blue-700 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-black text-base text-slate-900">₹{product.price}</span>
            <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
          </div>
          <p className={`text-[11px] font-medium mt-0.5 ${product.stock <= 2 ? 'text-orange-600 font-bold' : 'text-slate-500'}`}>
            {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
          </p>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95 flex items-center space-x-1"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{product.stock > 0 ? 'Add +' : 'Sold'}</span>
        </button>
      </div>
    </div>
  );
}