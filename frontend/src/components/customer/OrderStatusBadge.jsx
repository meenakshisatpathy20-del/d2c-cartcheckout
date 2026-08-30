import React from 'react';

const styles = {
  CONFIRMED:
    'bg-blue-50 text-blue-700 border-blue-100',

  PROCESSING:
    'bg-yellow-50 text-yellow-700 border-yellow-100',

  PACKED:
    'bg-orange-50 text-orange-700 border-orange-100',

  READY_TO_DISPATCH:
    'bg-orange-50 text-orange-700 border-orange-100',

  SHIPPED:
    'bg-indigo-50 text-indigo-700 border-indigo-100',

  IN_TRANSIT:
    'bg-blue-50 text-blue-700 border-blue-100',

  OUT_FOR_DELIVERY:
    'bg-purple-50 text-purple-700 border-purple-100',

  DELIVERED:
    'bg-emerald-50 text-emerald-700 border-emerald-100',

  CANCELLED:
    'bg-red-50 text-red-700 border-red-100',

  RETURNED:
    'bg-slate-100 text-slate-700 border-slate-200'
};

export default function OrderStatusBadge({ status }) {
  const normalized = String(
    status || 'UNKNOWN'
  ).toUpperCase();

  const label = normalized.replaceAll('_', ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-lg px-2.5 py-1 text-[9px] font-black uppercase whitespace-nowrap ${
        styles[normalized] ||
        'bg-slate-50 text-slate-600 border-slate-200'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}