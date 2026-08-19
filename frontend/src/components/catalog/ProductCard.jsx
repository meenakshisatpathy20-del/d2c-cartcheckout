import React from 'react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
      <div>
        <div className="h-36 bg-slate-100 rounded-lg mb-3 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <span
          className="text-xs font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded"
          style={{ backgroundColor: product.brandColor }}
        >
          {product.brand}
        </span>
        <h3 className="font-semibold text-sm mt-2 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5">Warehouse: {product.warehouseCity}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="font-bold text-slate-900">₹{product.price}</span>
          <span className="text-xs text-slate-400 line-through ml-1.5">₹{product.mrp}</span>
          <p className={`text-xs mt-0.5 ${product.stock <= 2 ? 'text-amber-600 font-medium' : 'text-slate-500'}`}>
            {product.stock} units left
          </p>
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
        >
          {product.stock > 0 ? 'Add +' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}