import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Users,
  Package,
  Warehouse,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Circle
} from 'lucide-react';

const navigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingBag
  },
  {
    id: 'shipments',
    label: 'Shipments',
    icon: Truck
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package
  },
  {
    id: 'warehouses',
    label: 'Warehouses',
    icon: Warehouse
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3
  }
];

export default function AdminLayout({
  activeSection = 'dashboard',
  onNavigate,
  onLogout,
  children,
  admin
}) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const current =
    navigation.find(
      item => item.id === activeSection
    ) || navigation[0];

  const handleNavigation = id => {
    if (onNavigate) {
      onNavigate(id);
    }

    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 bg-slate-950 text-white
          transform transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="h-20 px-5 flex items-center justify-between border-b border-white/10">
            <button
              type="button"
              onClick={() =>
                handleNavigation('dashboard')
              }
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-slate-950" />
              </div>

              <div className="text-left">
                <p className="text-sm font-black tracking-tight">
                  D2C MALL
                </p>

                <p className="text-[9px] uppercase tracking-[0.18em] text-orange-400 font-black">
                  Operations
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setMobileOpen(false)
              }
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 pt-5">
            <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.18em] font-black text-slate-500">
              Operations
            </p>

            <nav className="space-y-1">
              {navigation.map(item => {
                const Icon = item.icon;
                const active =
                  activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleNavigation(item.id)
                    }
                    className={`
                      w-full flex items-center gap-3
                      px-3 py-3 rounded-xl
                      text-left transition
                      ${
                        active
                          ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 shrink-0" />

                    <span className="text-xs font-black flex-1">
                      {item.label}
                    </span>

                    {active && (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4 space-y-3">
            <div className="rounded-2xl bg-blue-950/60 border border-blue-800/30 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />

                <span className="text-[10px] font-black text-slate-200">
                  SYSTEM STATUS
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Circle className="w-2 h-2 fill-green-400 text-green-400" />

                <span className="text-[10px] text-slate-400">
                  Operations online
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/10 transition"
            >
              <LogOut className="w-4 h-4" />

              <span className="text-xs font-black">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      )}

      <div className="lg:pl-64 min-h-screen">
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setMobileOpen(true)
                }
                className="lg:hidden p-2 rounded-xl hover:bg-slate-100"
                aria-label="Open navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-[0.16em] font-black text-slate-400">
                    Operations
                  </span>

                  <ChevronRight className="w-3 h-3 text-slate-300" />

                  <span className="text-[9px] uppercase tracking-[0.16em] font-black text-orange-600">
                    {current.label}
                  </span>
                </div>

                <h2 className="text-sm font-black text-slate-950 mt-0.5">
                  {current.label}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 border border-green-100">
                <Circle className="w-2 h-2 fill-green-500 text-green-500" />

                <span className="text-[10px] font-black text-green-700">
                  LIVE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center">
                  <span className="text-[10px] font-black">
                    {(admin?.username ||
                      'AD')
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>

                <div className="hidden md:block">
                  <p className="text-[10px] font-black text-slate-900">
                    {admin?.username ||
                      'Administrator'}
                  </p>

                  <p className="text-[9px] text-slate-400">
                    Warehouse Admin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}