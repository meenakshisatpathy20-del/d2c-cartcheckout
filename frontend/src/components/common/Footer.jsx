import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Building2,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <button
              onClick={scrollTop}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black">
                D2C
              </div>
              <div className="text-left">
                <div className="text-xl font-black">
                  <span className="text-blue-500">D2C</span>
                  <span className="text-orange-500">MALL</span>
                </div>
                <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                  One Stop Lifestyle Shop
                </p>
              </div>
            </button>

            <p className="text-xs text-slate-500 leading-relaxed mt-5 max-w-sm">
              A multi-brand direct-to-consumer marketplace connecting customers
              with lifestyle, beauty, electronics, fashion and jewellery brands
              across India.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              <span className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Genuine Products
              </span>

              <span className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] font-bold">
                <Truck className="w-3 h-3 text-blue-500" />
                Pan-India Delivery
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white uppercase tracking-wider font-black text-[11px] mb-4">
              Shop
            </h4>

            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={scrollTop}
                  className="hover:text-white transition text-xs flex items-center gap-1 cursor-pointer"
                >
                  All Products
                  <ChevronRight className="w-3 h-3" />
                </button>
              </li>

              <li>
                <button
                  onClick={scrollTop}
                  className="hover:text-white transition text-xs flex items-center gap-1 cursor-pointer"
                >
                  New Arrivals
                  <ChevronRight className="w-3 h-3" />
                </button>
              </li>

              <li>
                <button
                  onClick={scrollTop}
                  className="hover:text-white transition text-xs flex items-center gap-1 cursor-pointer"
                >
                  Trending
                  <ChevronRight className="w-3 h-3" />
                </button>
              </li>

              <li>
                <button
                  onClick={scrollTop}
                  className="hover:text-white transition text-xs flex items-center gap-1 cursor-pointer"
                >
                  Best Deals
                  <ChevronRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase tracking-wider font-black text-[11px] mb-4">
              Customer Care
            </h4>

            <ul className="space-y-2.5">
              <li className="text-xs hover:text-white transition cursor-pointer">
                My Orders
              </li>

              <li className="text-xs hover:text-white transition cursor-pointer">
                Shipping & Delivery
              </li>

              <li className="text-xs hover:text-white transition cursor-pointer">
                Returns & Exchanges
              </li>

              <li className="text-xs hover:text-white transition cursor-pointer">
                Payments & Security
              </li>
            </ul>

            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2 text-[10px]">
                <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
                Easy Returns
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Secure Payments
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white uppercase tracking-wider font-black text-[11px] mb-4">
              Partner With Us
            </h4>

            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-xs">
                <Building2 className="w-3.5 h-3.5 text-orange-500" />
                Franchise FOFO
              </li>

              <li className="flex items-center gap-2 text-xs">
                <Building2 className="w-3.5 h-3.5 text-orange-500" />
                Franchise FOCO
              </li>

              <li className="text-xs hover:text-white transition cursor-pointer">
                Become a Brand Partner
              </li>

              <li className="text-xs hover:text-white transition cursor-pointer">
                Corporate Enquiries
              </li>
            </ul>

            <div className="mt-5 space-y-2 text-[10px]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                1800-D2C-MALL
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                support@d2cmall.com
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-wider mb-3">
              Hub Headquarters
            </h4>

            <div className="flex items-start gap-2 text-[10px] leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />

              <span>
                D2C Mall Logistics & E-Commerce Technologies,
                <br />
                Mesra Express Complex, Outer Ring Hub,
                <br />
                Ranchi, Jharkhand, India - 835215
              </span>
            </div>
          </div>

          <div className="md:text-right">
            <h4 className="text-white font-black text-[11px] uppercase tracking-wider mb-3">
              Payment Partners
            </h4>

            <p className="text-[10px] text-slate-500">
              Razorpay • UPI • Visa • Mastercard • RuPay
            </p>

            <p className="text-[10px] text-slate-600 mt-2">
              Secure online payments and protected checkout.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-600">
          <span>
            © 2007-2026 D2C MALL Private Limited. All rights reserved.
          </span>

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">
              Privacy
            </span>
            <span className="hover:text-slate-400 cursor-pointer">
              Terms
            </span>
            <span className="hover:text-slate-400 cursor-pointer">
              Refund Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}