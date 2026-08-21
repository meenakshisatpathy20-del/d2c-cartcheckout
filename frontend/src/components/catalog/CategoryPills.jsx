import React from 'react';
import { Search } from 'lucide-react';

export default function CategoryPills({ categories, selectedCategory, onSelectCategory, searchQuery, onSearchChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-all flex-shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm font-black'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Channels' : cat}
          </button>
        ))}
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search items, brands, hubs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 transition"
        />
      </div>
    </div>
  );
}