import React from 'react';
import { ShoppingBag, Store, LayoutDashboard, Truck, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../context/CheckoutContext';

export default function Header({ viewMode, setViewMode }) {
  const { totalItemCount } = useCart();
  const { timeLeft } = useCheckout();

  return (
    <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setViewMode('store')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 leading-none">
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">D2C</span>
              <span className="text-2xl font-black tracking-tight text-blue-400">MALL</span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Unified Multi-Brand Store</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 flex space-x-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('store')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                viewMode === 'store'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Storefront</span>
            </button>
            <button
              onClick={() => setViewMode('track')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                viewMode === 'track'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Track Orders</span>
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                viewMode === 'admin'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Warehouse Operations</span>
            </button>
          </div>

          {viewMode === 'store' && (
            <>
              {timeLeft > 0 && (
                <div className="hidden sm:flex items-center space-x-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-black animate-pulse">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Reserved: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
              <div className="relative p-2.5 bg-slate-800/80 rounded-2xl border border-slate-700 text-slate-200">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 animate-bounce">
                    {totalItemCount}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}