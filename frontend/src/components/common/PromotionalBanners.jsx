import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Copy, Check, Sparkles, Truck, ShieldCheck, RotateCcw, Clock } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function PromotionalBanners() {
  const { setAppliedCoupon, subtotal } = useCart();
  const [copiedCode, setCopiedCode] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      title: "Direct-to-Consumer Festival Deals",
      subtitle: "Shop genuine beauty, smartphones & fragrances directly from brand-certified depots.",
      badge: "MEGA FESTIVAL",
      code: "FESTIVE20",
      cta: "20% OFF (Min ₹1999)",
      discountAmount: Math.round(subtotal * 0.2) || 200,
      gradient: "from-blue-700 via-indigo-700 to-blue-900",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
    },
    {
      title: "Zero-Freight Express SLA",
      subtitle: "Guaranteed 24-48hr Air Delivery across 29,000+ serviceable Indian pin codes.",
      badge: "FREE DELIVERY",
      code: "FREESHIP",
      cta: "Free Shipping (Min ₹499)",
      discountAmount: 50,
      gradient: "from-orange-500 via-amber-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"
    },
    {
      title: "First-Time Shopper Voucher",
      subtitle: "Instant flat ₹100 deduction on combined multi-brand basket orders.",
      badge: "FLAT ₹100",
      code: "D2C100",
      cta: "Flat ₹100 Off (Min ₹999)",
      discountAmount: 100,
      gradient: "from-emerald-600 via-teal-600 to-emerald-700",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleApplyCoupon = (slide) => {
    navigator.clipboard.writeText(slide.code);
    setCopiedCode(slide.code);
    setAppliedCoupon({ code: slide.code, discountAmount: slide.discountAmount });
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const slide = heroSlides[activeSlide];

  return (
    <div className="space-y-6">
      {/* 1. Full-Width Carousel Hero Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${slide.gradient} p-8 text-white shadow-md transition-all duration-700 min-h-[220px] flex flex-col justify-between`}>
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            {slide.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black leading-tight">{slide.title}</h2>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">{slide.subtitle}</p>
        </div>

        <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold">
            <span>USE PROMO CODE:</span>
            <span className="bg-black/30 px-2.5 py-1 rounded-lg text-amber-200 border border-white/20">{slide.code}</span>
          </div>

          <button
            onClick={() => handleApplyCoupon(slide)}
            className="bg-white text-slate-900 font-black px-4 py-2 rounded-xl text-xs hover:bg-slate-100 transition shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            {copiedCode === slide.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode === slide.code ? 'Applied to Cart!' : `Apply ${slide.cta}`}</span>
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${activeSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* 2. Trust Bar (Myntra / Flipkart Standard) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Express Delivery</p>
            <p className="text-slate-500 text-[11px]">2-4 Days Pan-India</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">100% Genuine</p>
            <p className="text-slate-500 text-[11px]">Direct Brand Certification</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Easy Returns</p>
            <p className="text-slate-500 text-[11px]">7-Day Door Pickup</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Auto-Saved Cart</p>
            <p className="text-slate-500 text-[11px]">Seamless Resume Anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}