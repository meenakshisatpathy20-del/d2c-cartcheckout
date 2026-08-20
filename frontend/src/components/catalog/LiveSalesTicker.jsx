import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';

const RECENT_PURCHASES = [
  { customer: 'Rohan M.', city: 'Ranchi', item: 'Vitamin C Face Serum', brand: 'Luxura Sciences', time: '2m ago' },
  { customer: 'Ananya S.', city: 'Bengaluru', item: 'Dry-Fit Track Pant', brand: 'Shiv-Naresh', time: '4m ago' },
  { customer: 'Pooja K.', city: 'Delhi', item: 'Handcrafted Dinner Set', brand: 'Swarg Homes', time: '6m ago' }
];

export default function LiveSalesTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_PURCHASES.length);
        setVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const purchase = RECENT_PURCHASES[currentIndex];

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl rounded-2xl p-3.5 max-w-xs flex items-center space-x-3 transition-all animate-in slide-in-from-bottom-5">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-orange-500/20">
        <ShoppingBag className="w-5 h-5" />
      </div>
      <div className="text-xs space-y-0.5 flex-1 min-w-0">
        <div className="flex items-center space-x-1">
          <span className="font-bold text-slate-900 truncate">{purchase.customer}</span>
          <span className="text-[10px] text-slate-400">from {purchase.city}</span>
          <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0 ml-auto" />
        </div>
        <p className="text-slate-600 truncate font-medium">{purchase.item}</p>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-blue-700 font-semibold">{purchase.brand}</span>
          <span className="text-slate-400">{purchase.time}</span>
        </div>
      </div>
    </div>
  );
}