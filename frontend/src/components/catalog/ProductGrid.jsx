import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <h2 className="text-xl font-bold text-slate-900 flex items-center">
        <span>Brand Channels Catalog</span>
        <span className="ml-3 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-200">
          Live Stock Guard
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}