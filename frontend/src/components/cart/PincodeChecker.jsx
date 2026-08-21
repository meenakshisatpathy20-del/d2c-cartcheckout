import React, { useState } from 'react';
import { Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function PincodeChecker({ pincode, setPincode }) {
  const { deliveryInfo, setDeliveryInfo, setCartError } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (pincode.length !== 6) {
      setCartError('Please enter a 6-digit destination pin code.');
      return;
    }
    setLoading(true);
    setCartError('');
    try {
      const data = await api.checkPincode(pincode);
      setDeliveryInfo(data);
    } catch (err) {
      setCartError(err.message);
      setDeliveryInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-300 flex items-center">
        <Truck className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
        Shiprocket Pin Code Verification
      </label>
      <div className="flex space-x-2">
        <input
          type="text"
          maxLength="6"
          placeholder="e.g. 835215"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs flex-1 text-white placeholder-slate-600 outline-none focus:border-blue-500 font-mono"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition-colors"
        >
          {loading ? '...' : 'Verify'}
        </button>
      </div>
      {deliveryInfo && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-[11px] text-emerald-300 flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{deliveryInfo.courierPartner}</p>
            <p className="text-[10px] text-emerald-400/80">Est. Delivery in {deliveryInfo.estimatedDays} business days</p>
          </div>
        </div>
      )}
    </div>
  );
}