import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function PincodeChecker({ pincode, setPincode }) {
  const { deliveryInfo, setDeliveryInfo, setCartError } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (pincode.length !== 6) {
      setCartError('Please enter a 6-digit pin code.');
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
    <div className="pt-2">
      <label className="text-xs font-semibold text-slate-600">Shiprocket Delivery Verification</label>
      <div className="flex space-x-2 mt-1">
        <input
          type="text"
          maxLength="6"
          placeholder="e.g. 835215"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs flex-1 focus:outline-blue-700"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-slate-700"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>
      {deliveryInfo && (
        <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center">
          <Truck className="w-3.5 h-3.5 mr-1" /> {deliveryInfo.courierPartner} (Est. {deliveryInfo.estimatedDays} days)
        </p>
      )}
    </div>
  );
}