import React, { useState } from 'react';
import { MapPin, Truck, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export default function DeliveryPromise({ product }) {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkDelivery = async () => {
    if (!/^\d{6}$/.test(pincode)) return;

    setLoading(true);

    try {
      const data = await api.checkDelivery(pincode);
      setResult(data);
    } catch {
      setResult({
        deliverable: false,
        error: 'Delivery information unavailable'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="w-4 h-4 text-blue-700" />

        <div>
          <p className="text-xs font-black text-slate-900">
            Check Delivery
          </p>

          <p className="text-[10px] text-slate-500">
            Enter your pincode for an accurate estimate
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

          <input
            value={pincode}
            maxLength={6}
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, ''))
            }
            placeholder="Enter 6-digit pincode"
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold outline-none focus:border-blue-600"
          />
        </div>

        <button
          onClick={checkDelivery}
          disabled={loading || pincode.length !== 6}
          className="px-4 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-black transition"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Check'
          )}
        </button>
      </div>

      {result && (
        <div className="mt-3">
          {result.deliverable ? (
            <div className="flex items-start gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />

              <div>
                <p className="text-xs font-black">
                  Delivery available
                </p>

                <p className="text-[10px] text-slate-500 mt-0.5">
                  Expected in {result.estimatedDays} business days
                  {result.courierPartner
                    ? ` • ${result.courierPartner}`
                    : ''}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs font-bold text-red-600">
              {result.error || 'Delivery is unavailable for this pincode.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}