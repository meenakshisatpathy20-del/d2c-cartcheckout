import React from 'react';
import {
  ShoppingCart,
  IndianRupee,
  PackageCheck,
  Truck,
  Users,
  RotateCcw,
  AlertTriangle,
  Clock3
} from 'lucide-react';

const stats = [
  {
    label: 'Orders Today',
    value: '128',
    change: '+18.4%',
    icon: ShoppingCart,
    tone: 'blue'
  },
  {
    label: 'Revenue Today',
    value: '₹2,48,920',
    change: '+12.8%',
    icon: IndianRupee,
    tone: 'green'
  },
  {
    label: 'Awaiting Fulfillment',
    value: '18',
    change: 'Needs attention',
    icon: Clock3,
    tone: 'orange'
  },
  {
    label: 'Shipments In Transit',
    value: '41',
    change: 'Across India',
    icon: Truck,
    tone: 'blue'
  },
  {
    label: 'Delivered',
    value: '35',
    change: '+9 today',
    icon: PackageCheck,
    tone: 'green'
  },
  {
    label: 'Customers',
    value: '3,842',
    change: '+126 this month',
    icon: Users,
    tone: 'yellow'
  },
  {
    label: 'Returns',
    value: '8',
    change: '3 pending review',
    icon: RotateCcw,
    tone: 'orange'
  },
  {
    label: 'Low Stock SKUs',
    value: '12',
    change: 'Warehouse alert',
    icon: AlertTriangle,
    tone: 'red'
  }
];

const toneMap = {
  blue: {
    icon: 'bg-blue-50 text-blue-700',
    value: 'text-blue-900'
  },
  green: {
    icon: 'bg-emerald-50 text-emerald-700',
    value: 'text-emerald-900'
  },
  orange: {
    icon: 'bg-orange-50 text-orange-700',
    value: 'text-orange-900'
  },
  yellow: {
    icon: 'bg-yellow-50 text-yellow-700',
    value: 'text-yellow-900'
  },
  red: {
    icon: 'bg-red-50 text-red-700',
    value: 'text-red-900'
  }
};

export default function AdminDashboard({ admin, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black">
              D2
            </div>

            <div>
              <p className="font-black tracking-tight">
                D2C MALL
              </p>

              <p className="text-[9px] text-slate-400 uppercase tracking-[0.18em]">
                Operations Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold">
                {admin?.name || 'Operations Admin'}
              </p>

              <p className="text-[10px] text-slate-400">
                {admin?.role || 'WAREHOUSE_ADMIN'}
              </p>
            </div>

            <button
              onClick={onLogout}
              className="text-xs font-black px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-5 lg:px-8 py-7">
        <div className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
            Warehouse & Logistics
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-1">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-950">
                Operations Dashboard
              </h1>

              <p className="text-xs text-slate-500 mt-1">
                Monitor orders, customers, inventory and shipments across India.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-500 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operations system online
            </div>
          </div>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const tone = toneMap[stat.tone];

            return (
              <div
                key={stat.label}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      {stat.label}
                    </p>

                    <p className={`text-xl font-black mt-2 ${tone.value}`}>
                      {stat.value}
                    </p>

                    <p className="text-[10px] font-bold text-slate-400 mt-1">
                      {stat.change}
                    </p>
                  </div>

                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tone.icon}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid lg:grid-cols-3 gap-5 mt-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-950">
                  Order Operations
                </h2>

                <p className="text-[10px] text-slate-500 mt-1">
                  Orders requiring warehouse attention
                </p>
              </div>

              <button className="text-[10px] font-black text-blue-700 hover:text-blue-900">
                View all orders →
              </button>
            </div>

            <div className="p-5 grid sm:grid-cols-2 gap-3">
              {[
                ['New Orders', '18', 'bg-blue-50 text-blue-700'],
                ['Packing Queue', '12', 'bg-yellow-50 text-yellow-700'],
                ['Ready to Dispatch', '8', 'bg-orange-50 text-orange-700'],
                ['Delivery Exceptions', '3', 'bg-red-50 text-red-700']
              ].map(([label, value, style]) => (
                <div
                  key={label}
                  className="border border-slate-100 rounded-xl p-4 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-600">
                    {label}
                  </span>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${style}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 text-white rounded-2xl shadow-sm p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-400">
              Warehouse Network
            </p>

            <h2 className="text-sm font-black mt-1">
              Pan-India Fulfillment
            </h2>

            <div className="mt-5 space-y-4">
              {[
                ['Mumbai Bhiwandi', '42 orders', 'Online'],
                ['Delhi NCR', '31 orders', 'Online'],
                ['Bengaluru Whitefield', '27 orders', 'Online'],
                ['Jaipur Depot', '18 orders', 'Online']
              ].map(([warehouse, orders, status]) => (
                <div
                  key={warehouse}
                  className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-xs font-bold">
                      {warehouse}
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1">
                      {orders}
                    </p>
                  </div>

                  <span className="text-[9px] font-black uppercase text-emerald-400">
                    ● {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}