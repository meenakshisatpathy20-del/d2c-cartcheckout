import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
  Building2,
  ArrowRight,
  ChevronDown,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  Globe2,
  Headphones,
  Clock3,
  BadgeCheck,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(
      openSection === section ? null : section
    );
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
  };

  const footerSections = [
    {
      id: 'shop',
      title: 'Shop D2C Mall',
      links: [
        'All Products',
        'Beauty & Personal Care',
        'Smart Electronics',
        'Fashion & Accessories',
        'Jewellery',
        'New Arrivals',
        'Trending Products',
        'Best Sellers'
      ]
    },
    {
      id: 'brands',
      title: 'Our Brands',
      links: [
        'Hungama HiLife',
        'Luxura Sciences',
        'AccessHer',
        'Brand Partners',
        'Become a Brand Partner',
        'Wholesale Enquiries'
      ]
    },
    {
      id: 'support',
      title: 'Customer Support',
      links: [
        'Track My Order',
        'Shipping & Delivery',
        'Returns & Refunds',
        'Cancellation Policy',
        'Payment & Security',
        'Frequently Asked Questions',
        'Contact Support'
      ]
    },
    {
      id: 'business',
      title: 'Business With D2C',
      links: [
        'Become a Franchise Partner',
        'FOFO Franchise',
        'FOCO Franchise',
        'Franchise Opportunities',
        'Investor Enquiries',
        'Corporate Partnerships'
      ]
    }
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 mt-16 border-t border-slate-800">
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-white" />
              </div>

              <div>
                <p className="text-white text-base font-black">
                  D2C Mall is building India's next multi-brand retail network.
                </p>

                <p className="text-white/70 text-xs mt-1 max-w-2xl leading-relaxed">
                  Shop online, discover our offline stores and explore franchise opportunities across a growing network of categories and brands.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="shrink-0 bg-white text-slate-900 hover:bg-slate-100 px-5 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition"
            >
              Explore D2C Network
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <TrustCard
            icon={ShieldCheck}
            title="Verified Brands"
            text="Products sourced through trusted brand channels"
          />

          <TrustCard
            icon={Truck}
            title="Pan-India Delivery"
            text="Built for customers across India"
          />

          <TrustCard
            icon={RotateCcw}
            title="Easy Returns"
            text="Simple support for eligible purchases"
          />

          <TrustCard
            icon={Headphones}
            title="Customer Support"
            text="Help when you need it"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
                <Store className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center leading-none">
                  <span className="text-2xl font-black text-blue-400">
                    D2C
                  </span>

                  <span className="text-2xl font-black text-orange-400">
                    MALL
                  </span>
                </div>

                <p className="text-[9px] uppercase tracking-[0.16em] font-bold text-slate-500 mt-1">
                  One Stop Lifestyle Shop
                </p>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-500 mt-5">
              A growing multi-brand ecommerce and offline retail platform bringing beauty, electronics, fashion accessories and other lifestyle categories together under one network.
            </p>

            <div className="mt-5 space-y-3">
              <ContactRow
                icon={Phone}
                text="1800-D2C-MALL"
              />

              <ContactRow
                icon={Mail}
                text="support@d2cmall.com"
              />

              <ContactRow
                icon={Clock3}
                text="Mon–Sat · 9:00 AM–7:00 PM"
              />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <SocialButton icon={Instagram} />
              <SocialButton icon={Facebook} />
              <SocialButton icon={Linkedin} />
              <SocialButton icon={Youtube} />
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.id}>
              <button
                type="button"
                onClick={() =>
                  toggleSection(section.id)
                }
                className="w-full flex items-center justify-between lg:cursor-default"
              >
                <h4 className="font-black text-slate-200 uppercase tracking-wider text-[10px]">
                  {section.title}
                </h4>

                <ChevronDown
                  className={`w-4 h-4 text-slate-500 lg:hidden transition-transform ${
                    openSection === section.id
                      ? 'rotate-180'
                      : ''
                  }`}
                />
              </button>

              <ul
                className={`space-y-2.5 mt-4 ${
                  openSection === section.id
                    ? 'block'
                    : 'hidden'
                } lg:block`}
              >
                {section.links.map(
                  (link) => (
                    <li key={link}>
                      <button
                        type="button"
                        className="text-left text-[11px] text-slate-500 hover:text-white transition"
                      >
                        {link}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 grid lg:grid-cols-[1fr_420px] gap-7 items-center">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />

              <h4 className="text-sm font-black text-white">
                Stay ahead of new launches & offers
              </h4>
            </div>

            <p className="text-[11px] text-slate-500 mt-1.5">
              Get updates about new products, brand launches, exclusive deals and D2C Mall events.
            </p>
          </div>

          <form
            onSubmit={handleNewsletter}
            className="flex gap-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 min-w-0 h-11 bg-slate-900 border border-slate-700 rounded-xl px-4 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition"
            />

            <button
              type="submit"
              className="h-11 px-5 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-2"
            >
              Subscribe
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-orange-400 shrink-0" />

              <div>
                <p className="text-xs font-black text-white">
                  Want to build a business with D2C Mall?
                </p>

                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                  Explore FOFO and FOCO franchise opportunities, understand location suitability and connect with our business development team.
                </p>

                <button
                  type="button"
                  className="mt-3 text-[10px] font-black text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  Explore Franchise Opportunities
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Globe2 className="w-5 h-5 text-blue-400 shrink-0" />

              <div>
                <p className="text-xs font-black text-white">
                  Growing across India
                </p>

                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                  From online orders to regional hubs and offline franchise stores, D2C Mall is designed to connect brands, customers and local entrepreneurs.
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    'North India',
                    'South India',
                    'East India',
                    'West India'
                  ].map((region) => (
                    <span
                      key={region}
                      className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[9px] font-bold text-slate-400"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-orange-400 shrink-0" />

            <div>
              <p className="text-[10px] uppercase tracking-wider font-black text-slate-300">
                Corporate & Hub Headquarters
              </p>

              <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
                D2C Mall Logistics & E-Commerce Technologies,
                <br />
                Mesra Express Complex, Outer Ring Hub,
                <br />
                Ranchi, Jharkhand, India - 835215
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col lg:flex-row justify-between gap-5">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 text-[10px] text-slate-600">
              <span>
                © 2007–2026 D2C MALL Private Limited.
              </span>

              <button className="hover:text-slate-300 transition">
                Privacy
              </button>

              <button className="hover:text-slate-300 transition">
                Terms
              </button>

              <button className="hover:text-slate-300 transition">
                Refund Policy
              </button>

              <button className="hover:text-slate-300 transition">
                Sitemap
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold text-slate-600">
              <span>Secure Payments</span>

              <span className="text-slate-500">
                Razorpay
              </span>

              <span className="text-slate-500">
                UPI
              </span>

              <span className="text-slate-500">
                Visa
              </span>

              <span className="text-slate-500">
                Mastercard
              </span>

              <span className="text-slate-500">
                RuPay
              </span>

              <span className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck className="w-3 h-3" />
                Secure Checkout
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-900 flex flex-col sm:flex-row justify-between gap-2 text-[9px] text-slate-700">
            <span>
              D2C Mall · Ecommerce · Offline Retail · Franchise Network
            </span>

            <span className="flex items-center gap-1">
              <BadgeCheck className="w-3 h-3" />
              Built for India's growing retail ecosystem
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TrustCard({
  icon: Icon,
  title,
  text
}) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
      <div className="w-9 h-9 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>

      <p className="text-xs font-black text-slate-200 mt-3">
        {title}
      </p>

      <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  text
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="w-3.5 h-3.5 text-blue-400 shrink-0" />

      <span className="text-[10px] text-slate-500 font-semibold">
        {text}
      </span>
    </div>
  );
}

function SocialButton({
  icon: Icon
}) {
  return (
    <button
      type="button"
      className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition"
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}