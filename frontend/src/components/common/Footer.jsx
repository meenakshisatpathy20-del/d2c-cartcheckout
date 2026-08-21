import React from 'react';
import { Store, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">About D2C Mall</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Direct Brand Partners</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
            <li><a href="#" className="hover:text-white transition">Corporate Information</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">Help & Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Payments & Razorpay</a></li>
            <li><a href="#" className="hover:text-white transition">Shipping & Pincodes</a></li>
            <li><a href="#" className="hover:text-white transition">Cancellation & Returns</a></li>
            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">Consumer Policy</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Return Policy (7 Days)</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Use</a></li>
            <li><a href="#" className="hover:text-white transition">Security & PCI Compliance</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy Notice</a></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-2 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8 space-y-3">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Mail Us / Hub Headquarters</h4>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            D2C Mall Logistics & E-Commerce Technologies,<br />
            Mesra Express Complex, Outer Ring Hub,<br />
            Ranchi, Jharkhand, India - 835215
          </p>
          <div className="flex items-center space-x-2 text-slate-300 font-semibold pt-1">
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span>Support: 1800-D2C-MALL (Toll Free)</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 py-4 border-t border-slate-800 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2007-2026 D2C MALL Private Limited. All rights reserved.</span>
          <span className="flex items-center space-x-2">
            <span className="text-slate-400">Payment Partners:</span>
            <span className="font-bold text-slate-300">Razorpay • UPI • Visa • Mastercard • RuPay</span>
          </span>
        </div>
      </div>
    </footer>
  );
}