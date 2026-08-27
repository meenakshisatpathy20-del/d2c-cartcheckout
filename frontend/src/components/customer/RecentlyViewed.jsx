import React from 'react';
import { Clock3, ArrowRight } from 'lucide-react';

export default function RecentlyViewed({ products = [], onSelectProduct }) {
  if (!products.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock3 className="w-4 h-4 text-orange-500" />

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">
              Pick up where you left off
            </p>
          </div>

          <h2 className="text-xl font-black text-slate-950 mt-1">
            Recently Viewed
          </h2>
        </div>

        <button className="hidden sm:flex items-center gap-1 text-xs font-black text-blue-700">
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.slice(0, 4).map((product) => (
          <button
            key={product.id}
            onClick={() => onSelectProduct?.(product)}
            className="text-left bg-white border border-slate-200 rounded-2xl p-3 hover:border-orange-200 hover:shadow-lg transition-all"
          >
            <div className="h-32 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-3"
              />
            </div>

            <p className="text-[9px] font-black uppercase text-blue-600 mt-3">
              {product.brand}
            </p>

            <h3 className="text-xs font-black text-slate-900 line-clamp-2 mt-1">
              {product.name}
            </h3>

            <p className="text-sm font-black text-slate-950 mt-2">
              ₹{Number(product.price || 0).toLocaleString('en-IN')}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}