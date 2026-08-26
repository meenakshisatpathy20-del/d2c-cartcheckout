import React, { useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  MapPin,
  Store,
  TrendingUp,
  Users,
  Megaphone,
  ShieldCheck,
  ArrowRight,
  Phone,
  BriefcaseBusiness,
  ChevronDown,
  Sparkles,
  Globe2,
  Clock3
} from 'lucide-react';
import { api } from '../../services/api';

export default function FranchisePortalView() {
  const [model, setModel] = useState('FOFO');
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    pincode: '',
    budget: '',
    businessIntent: '',
    existingBusiness: '',
    preferredModel: 'FOFO',
    storeSize: '',
    preferredBrand: '',
    message: ''
  });

  const models = useMemo(
    () => ({
      FOFO: {
        title: 'FOFO',
        subtitle: 'Franchise Owned, Franchise Operated',
        description:
          'A partner-led retail model where the franchise partner invests in and operates the store with D2C Mall business support.',
        suitable:
          'Suitable for entrepreneurs who want active involvement in day-to-day retail operations.'
      },
      FOCO: {
        title: 'FOCO',
        subtitle: 'Franchise Owned, Company Operated',
        description:
          'A structured model where the franchise partner invests while operations can be supported through the company operating framework.',
        suitable:
          'Suitable for investors who prefer a more structured operating arrangement.'
      }
    }),
    []
  );

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleModelChange = (value) => {
    setModel(value);
    updateForm('preferredModel', value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    setLoading(true);

    try {
      await api.submitFranchiseLead({
        ...form,
        preferredModel: model
      });

      setSubmitted(true);

      setForm({
        name: '',
        phone: '',
        email: '',
        city: '',
        state: '',
        pincode: '',
        budget: '',
        businessIntent: '',
        existingBusiness: '',
        preferredModel: model,
        storeSize: '',
        preferredBrand: '',
        message: ''
      });
    } catch (err) {
      setError(
        err?.message ||
          'Unable to submit your enquiry. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'What is the difference between FOFO and FOCO?',
      a: 'FOFO is designed for partners who want to invest in and operate the franchise. FOCO is designed around a company-supported operating structure. The suitable model depends on your investment preference, involvement and location.'
    },
    {
      q: 'How is a franchise location evaluated?',
      a: 'The team can evaluate factors such as city, locality, customer profile, competition, rent levels, accessibility, market potential and suitability for the selected retail model.'
    },
    {
      q: 'Can I apply if I already operate another business?',
      a: 'Yes. Existing business experience can be useful, especially when evaluating whether the franchise should be your primary or secondary business activity.'
    },
    {
      q: 'What kind of marketing support is available?',
      a: 'The business positioning includes marketing support, brand communication and promotional opportunities. Exact support depends on the selected model and commercial arrangement.'
    },
    {
      q: 'Is franchise success guaranteed?',
      a: 'No. Franchise performance depends on location, execution, market conditions, investment and several other factors. The company provides the business model and support framework rather than guaranteeing a particular outcome.'
    }
  ];

  if (submitted) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-6 sm:px-12 py-14 text-white text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-300 mt-6">
              Enquiry Received
            </p>

            <h1 className="text-3xl sm:text-4xl font-black mt-2">
              Thank you for your interest
            </h1>

            <p className="max-w-xl mx-auto text-sm text-white/65 mt-4 leading-relaxed">
              Your franchise enquiry has been submitted. Our team can review
              your preferred model, location and business requirements before
              the next discussion.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoBox
                icon={Phone}
                title="Next Discussion"
                text="Business and location suitability"
              />

              <InfoBox
                icon={MapPin}
                title="Location Review"
                text="City and market suitability"
              />

              <InfoBox
                icon={BriefcaseBusiness}
                title="Model Discussion"
                text={`${model} franchise structure`}
              />
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="mt-7 mx-auto flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-xs font-black hover:bg-slate-800 transition"
            >
              Submit Another Enquiry
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="relative overflow-hidden rounded-[32px] bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/40 via-indigo-700/20 to-transparent" />

        <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 p-7 sm:p-10 lg:p-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-orange-400" />
              Franchise Opportunities
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.05] mt-5 max-w-3xl">
              Build your retail business with D2C Mall
            </h1>

            <p className="text-sm sm:text-base text-white/65 max-w-2xl mt-5 leading-relaxed">
              Explore a multi-brand retail opportunity connecting ecommerce,
              offline stores, regional markets and a growing portfolio of D2C
              brands.
            </p>

            <div className="flex flex-wrap gap-2 mt-7">
              {[
                'Multi-brand retail',
                'Online + Offline',
                'Marketing support',
                'Location evaluation'
              ].map((item) => (
                <span
                  key={item}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-[10px] font-bold text-white/80"
                >
                  {item}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById('franchise-enquiry')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl text-xs font-black inline-flex items-center gap-2 transition"
            >
              Explore Franchise
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white/[0.07] border border-white/10 rounded-3xl p-5 sm:p-6 self-end">
            <p className="text-[10px] uppercase tracking-wider font-black text-blue-300">
              Start with your location
            </p>

            <p className="text-sm font-black mt-2">
              Tell us where you want to build
            </p>

            <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
              Share your city, budget and business intent. The team can then
              assess the opportunity.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <Metric
                icon={Store}
                value="21+"
                label="Brand categories"
              />

              <Metric
                icon={Globe2}
                value="Pan-India"
                label="Growth vision"
              />

              <Metric
                icon={Users}
                value="FOFO"
                label="Partner model"
              />

              <Metric
                icon={Building2}
                value="FOCO"
                label="Operating model"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-black text-blue-600">
              Choose your approach
            </p>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
              Franchise models
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(models).map(([key, item]) => {
            const active = model === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleModelChange(key)}
                className={`text-left rounded-3xl p-6 border transition-all ${
                  active
                    ? 'bg-blue-50 border-blue-500 shadow-lg shadow-blue-600/10'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black ${
                        active
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.title}
                    </span>

                    <h3 className="text-lg font-black text-slate-950 mt-4">
                      {item.subtitle}
                    </h3>
                  </div>

                  {active && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mt-3">
                  {item.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-[10px] font-bold text-slate-700">
                    Best suited for
                  </p>

                  <p className="text-[11px] text-slate-500 mt-1">
                    {item.suitable}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ValueCard
          icon={Store}
          title="Multi-Brand"
          text="Build around multiple lifestyle categories."
        />

        <ValueCard
          icon={Megaphone}
          title="Marketing Support"
          text="Brand communication and promotional support."
        />

        <ValueCard
          icon={MapPin}
          title="Location Review"
          text="Understand city and locality suitability."
        />

        <ValueCard
          icon={TrendingUp}
          title="Retail Network"
          text="Online and offline growth opportunity."
        />
      </section>

      <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
        <div className="bg-slate-900 rounded-[28px] p-6 sm:p-8 text-white">
          <p className="text-[10px] uppercase tracking-wider font-black text-orange-400">
            Why D2C Mall
          </p>

          <h2 className="text-2xl font-black mt-2">
            More than a storefront
          </h2>

          <p className="text-xs text-white/55 leading-relaxed mt-3">
            The vision combines brands, ecommerce, offline retail, logistics
            and local entrepreneurship into one growing ecosystem.
          </p>

          <div className="space-y-4 mt-7">
            {[
              'Multi-category product portfolio',
              'Online and offline retail presence',
              'Marketing and promotional support',
              'Location and market suitability discussions',
              'Structured franchise operating models',
              'Growing pan-India expansion vision'
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />

                <span className="text-xs font-semibold text-white/75">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-7 pt-5 border-t border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />

              <span className="text-[10px] font-bold text-white/60">
                Business discussions are evaluated individually
              </span>
            </div>
          </div>
        </div>

        <div
          id="franchise-enquiry"
          className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 shadow-sm"
        >
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-wider font-black text-blue-600">
              Franchise Enquiry
            </p>

            <h2 className="text-2xl font-black text-slate-950 mt-1">
              Tell us about your opportunity
            </h2>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              The more information you provide, the easier it is for the team
              to understand your requirements.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field
                label="Full Name"
                required
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="Your name"
              />

              <Field
                label="Mobile Number"
                required
                value={form.phone}
                onChange={(e) =>
                  updateForm(
                    'phone',
                    e.target.value.replace(/\D/g, '').slice(0, 10)
                  )
                }
                placeholder="10-digit mobile number"
                inputMode="numeric"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                placeholder="you@example.com"
              />

              <Field
                label="Preferred City"
                required
                value={form.city}
                onChange={(e) => updateForm('city', e.target.value)}
                placeholder="e.g. Ranchi"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field
                label="State"
                value={form.state}
                onChange={(e) => updateForm('state', e.target.value)}
                placeholder="e.g. Jharkhand"
              />

              <Field
                label="Pincode"
                value={form.pincode}
                onChange={(e) =>
                  updateForm(
                    'pincode',
                    e.target.value.replace(/\D/g, '').slice(0, 6)
                  )
                }
                placeholder="6-digit pincode"
                inputMode="numeric"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <SelectField
                label="Investment Budget"
                required
                value={form.budget}
                onChange={(e) => updateForm('budget', e.target.value)}
                options={[
                  'Prefer to discuss',
                  'Under ₹10 Lakh',
                  '₹10–25 Lakh',
                  '₹25–50 Lakh',
                  '₹50 Lakh–₹1 Crore',
                  '₹1 Crore+'
                ]}
              />

              <SelectField
                label="Business Intent"
                required
                value={form.businessIntent}
                onChange={(e) =>
                  updateForm('businessIntent', e.target.value)
                }
                options={[
                  'Primary income',
                  'Secondary income',
                  'Investment opportunity',
                  'Existing retail expansion'
                ]}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <SelectField
                label="Already Running a Business?"
                required
                value={form.existingBusiness}
                onChange={(e) =>
                  updateForm('existingBusiness', e.target.value)
                }
                options={[
                  'Yes',
                  'No',
                  'Family business',
                  'Planning first business'
                ]}
              />

              <SelectField
                label="Preferred Store Size"
                value={form.storeSize}
                onChange={(e) => updateForm('storeSize', e.target.value)}
                options={[
                  'Not decided',
                  'Under 500 sq ft',
                  '500–1000 sq ft',
                  '1000–2000 sq ft',
                  '2000+ sq ft'
                ]}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <SelectField
                label="Preferred Franchise Model"
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                options={['FOFO', 'FOCO', 'Open to discussion']}
              />

              <SelectField
                label="Brand Interest"
                value={form.preferredBrand}
                onChange={(e) =>
                  updateForm('preferredBrand', e.target.value)
                }
                options={[
                  'Open to portfolio',
                  'Hungama HiLife',
                  'Luxura Sciences',
                  'AccessHer'
                ]}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-700 mb-1.5">
                Anything else you want us to know?
              </label>

              <textarea
                value={form.message}
                onChange={(e) => updateForm('message', e.target.value)}
                rows={4}
                placeholder="Tell us about your location, business experience or expectations..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 resize-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/15 transition"
            >
              {loading ? (
                'Submitting Enquiry...'
              ) : (
                <>
                  Request Franchise Discussion
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[9px] text-slate-400 text-center leading-relaxed">
              Submitting this form does not guarantee franchise approval or
              business success. Final commercial terms and suitability are
              subject to discussion and evaluation.
            </p>
          </form>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-black text-blue-600">
              Frequently Asked Questions
            </p>

            <h2 className="text-2xl font-black text-slate-950 mt-1">
              Before you apply
            </h2>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Understand the model, location discussion and business
              expectations before starting a franchise conversation.
            </p>

            <div className="mt-5 flex items-center gap-2 text-[10px] font-bold text-slate-500">
              <Clock3 className="w-4 h-4 text-blue-600" />
              Structured business discussion
            </div>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const open = openFaq === index;

              return (
                <div
                  key={faq.q}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(open ? null : index)
                    }
                    className="w-full px-4 py-4 flex items-center justify-between gap-4 text-left"
                  >
                    <span className="text-xs font-black text-slate-900">
                      {faq.q}
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {open && (
                    <div className="px-4 pb-4">
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-orange-50 border border-orange-100 rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />

            <p className="text-xs font-black text-orange-950">
              Have a location in mind?
            </p>
          </div>

          <h3 className="text-xl font-black text-slate-950 mt-1">
            Let's evaluate the opportunity together.
          </h3>

          <p className="text-[11px] text-slate-600 mt-1">
            City, locality, budget and operating preference all matter.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById('franchise-enquiry')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition"
        >
          Start My Enquiry
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}

function Field({
  label,
  required,
  type = 'text',
  value,
  onChange,
  placeholder,
  inputMode
}) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition"
      />
    </div>
  );
}

function SelectField({
  label,
  required,
  value,
  onChange,
  options
}) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>

      <select
        required={required}
        value={value}
        onChange={onChange}
        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition"
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Metric({
  icon: Icon,
  value,
  label
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <Icon className="w-4 h-4 text-blue-300" />

      <p className="text-sm font-black mt-2">
        {value}
      </p>

      <p className="text-[9px] text-white/40 mt-0.5">
        {label}
      </p>
    </div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  text
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>

      <p className="text-xs font-black text-slate-900 mt-3">
        {title}
      </p>

      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function InfoBox({
  icon: Icon,
  title,
  text
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-4">
      <Icon className="w-5 h-5 text-blue-600" />

      <p className="text-xs font-black text-slate-900 mt-3">
        {title}
      </p>

      <p className="text-[10px] text-slate-500 mt-1">
        {text}
      </p>
    </div>
  );
}