import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, Search } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onSelectProduct }) {
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const brands = ['ALL', ...new Set(products.map((p) => p.brand))];

  const filteredProducts = products.filter((p) => {
    const matchesBrand = selectedBrand === 'ALL' || p.brand === selectedBrand;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
            <span>Verified Brand Showcases</span>
            <span className="ml-3 text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              Live Stock Guard
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Dispatched directly from respective brand hubs</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKUs or Brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBrand(b)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              selectedBrand === b
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {b === 'ALL' ? 'All Channels' : b}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No products found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      )}
    </div>
  );
}