import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function CouponInput() {
  const { subtotal, appliedCoupon, setAppliedCoupon, setCartError } = useCart();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setCartError('');
    try {
      const data = await api.validateCoupon(code, subtotal);
      setAppliedCoupon({ code: code.toUpperCase(), discountAmount: data.discountAmount });
      setCode('');
    } catch (err) {
      setCartError(err.message);
      setAppliedCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-300 flex items-center">
        <Tag className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
        Apply Promo Code
      </label>
      {appliedCoupon ? (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-2.5 flex justify-between items-center text-xs">
          <div>
            <span className="font-mono font-black text-orange-400">{appliedCoupon.code}</span>
            <span className="text-orange-300 text-[11px] ml-2 font-bold">Saved ₹{appliedCoupon.discountAmount}</span>
          </div>
          <button onClick={() => setAppliedCoupon(null)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="D2C100, FESTIVE20"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs flex-1 uppercase text-white placeholder-slate-600 outline-none focus:border-orange-500 font-mono"
          />
          <button
            onClick={handleApply}
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs px-4 py-2 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all"
          >
            {loading ? '...' : 'Apply'}
          </button>
        </div>
      )}
    </div>
  );
}