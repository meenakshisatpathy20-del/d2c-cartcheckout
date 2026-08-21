import React from 'react';
import { ShoppingBag, Package, UserCheck, ShieldCheck, Search, Sparkles, Store, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Header({ currentTab, setCurrentTab, searchQuery, setSearchQuery }) {
  const { cart } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Value Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-emerald-400 font-bold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% Brand Certified Direct
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-300">Free Express Delivery on Orders Over ₹499</span>
          </div>
          <button
            onClick={() => setCurrentTab('admin')}
            className="text-slate-400 hover:text-white flex items-center text-[10px] font-bold uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded transition"
          >
            <Lock className="w-3 h-3 mr-1 text-orange-400" /> Admin Console
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('store')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1 leading-none">
              <span className="text-2xl font-black tracking-tight text-blue-600">D2C</span>
              <span className="text-2xl font-black tracking-tight text-orange-500">MALL</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Direct-to-Consumer Store</p>
          </div>
        </div>

        {/* Global Search */}
        {currentTab === 'store' && (
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search beauty, fashion, lifestyle products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 transition"
              />
            </div>
          </div>
        )}

        {/* Customer Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setCurrentTab('store')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              currentTab === 'store' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Shop</span>
          </button>

          <button
            onClick={() => setCurrentTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              currentTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders & Returns</span>
          </button>

          <button
            onClick={() => setCurrentTab('cart')}
            className="relative p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl border border-slate-200 text-slate-800 transition cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-slate-800" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}