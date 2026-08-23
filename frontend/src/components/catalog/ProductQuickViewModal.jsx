import React, { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], onSelectProduct, searchQuery = '' }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  const categories = ['ALL', ...new Set(products.map((p) => p.category || 'general'))];

  const filtered = products.filter((p) => {
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = !q || 
      (p.name && p.name.toLowerCase().includes(q)) || 
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm font-black'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat === 'ALL' ? 'All Channels' : cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-xs">
          No items found matching "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      )}
    </div>
  );
}