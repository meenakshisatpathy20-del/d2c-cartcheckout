import React, { useState } from 'react';
import { X } from 'lucide-react';
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
    <div className="pt-2">
      <label className="text-xs font-semibold text-slate-600">Promo Code</label>
      {appliedCoupon ? (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 flex justify-between items-center text-xs mt-1">
          <div>
            <span className="font-bold text-orange-600">{appliedCoupon.code}</span>
            <span className="text-orange-700 ml-2">Saved ₹{appliedCoupon.discountAmount}</span>
          </div>
          <button onClick={() => setAppliedCoupon(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex space-x-2 mt-1">
          <input
            type="text"
            placeholder="D2C100, FESTIVE20"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs flex-1 uppercase focus:outline-orange-500"
          />
          <button
            onClick={handleApply}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold"
          >
            {loading ? '...' : 'Apply'}
          </button>
        </div>
      )}
    </div>
  );
}