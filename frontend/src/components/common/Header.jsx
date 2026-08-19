import React from 'react';
import { ShoppingBag, Store, LayoutDashboard, Truck, Clock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../context/CheckoutContext';

export default function Header({ viewMode, setViewMode }) {
  const { totalItemCount } = useCart();
  const { timeLeft } = useCheckout();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-tight text-orange-500">D2C</span>
          <span className="text-2xl font-black tracking-tight text-blue-700">MALL</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold ml-2 border border-emerald-300">
            MULTI-BRAND
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-100 p-1 rounded-lg flex space-x-1 text-xs font-semibold">
            <button
              onClick={() => setViewMode('store')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'store' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
            <button
              onClick={() => setViewMode('track')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'track' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'admin' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Warehouse Hub</span>
            </button>
          </div>

          {viewMode === 'store' && (
            <>
              {timeLeft > 0 && (
                <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
              <div className="relative p-2 text-slate-600">
                <ShoppingBag className="w-6 h-6" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
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