"use client";

import { useState } from "react";

function StarIcon({ size = 20, filled = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#f59e0b" : "none"}
      stroke={filled ? "#f59e0b" : "#d1d5db"}
      strokeWidth="2"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState(null);

  const faqs = [
    {
      q: "How does the customer get the review link?",
      a: "After a visit, you text the customer a short link. One tap takes them to your branded feedback page. No app downloads, no accounts needed.",
    },
    {
      q: "What happens with negative feedback?",
      a: "It goes directly and only to your private dashboard. Unhappy customers never get routed to Google or Yelp. You see the feedback first and can fix the issue before it becomes a public review.",
    },
    {
      q: "How long does setup take?",
      a: "Under 5 minutes. Create an account, paste your Google Reviews link, and you're live. Send your first review request today.",
    },
    {
      q: "Can I try it before paying?",
      a: "Yes. The free plan gives you 5 review requests per month so you can see it work. Most restaurants upgrade within the first week because the results are immediate.",
    },
    {
      q: "What if I have multiple locations?",
      a: "Our Pro plan supports multiple locations with a unified dashboard. You can track each location's reviews and feedback separately.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Nav */}
      <nav className="px-6 sm:px-8 py-5 max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-brand-900 tracking-tight">
            PlateRate
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#how" className="text-gray-400 text-sm hover:text-gray-600 transition-colors hidden sm:block">
            How It Works
          </a>
          <a href="#pricing" className="text-gray-400 text-sm hover:text-gray-600 transition-colors hidden sm:block">
            Pricing
          </a>
          <a
            href="/login"
            className="px-4 py-2 rounded-lg bg-brand-900 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 sm:px-8 pt-20 pb-16 text-center max-w-2xl mx-auto">
        <p className="text-brand-500 text-sm font-medium mb-4 tracking-wide">
          REVIEW MANAGEMENT FOR RESTAURANTS
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.15] mb-6 text-brand-900 tracking-tight">
          Stop losing customers to bad reviews
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg mx-auto">
          PlateRate catches unhappy customers before they post publicly, and turns happy ones into 5-star Google reviews — automatically.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <a
            href="/login"
            className="px-8 py-3.5 rounded-lg bg-brand-900 text-white font-medium hover:bg-brand-800 transition-colors"
          >
            Start free trial
          </a>
          <a
            href="#how"
            className="px-8 py-3.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:border-gray-300 transition-colors"
          >
            See how it works
          </a>
        </div>
        <p className="text-gray-300 text-xs mt-3">
          Free plan available · No credit card required
        </p>
      </section>

      {/* Mini demo */}
      <section className="px-6 sm:px-8 pb-20 max-w-lg mx-auto">
        <div className="border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Customer sees</p>
          <p className="text-brand-900 font-semibold text-lg mb-4">
            &ldquo;How was your visit?&rdquo;
          </p>
          <div className="flex justify-center gap-1.5 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} size={28} filled={i <= 4} />
            ))}
          </div>
          <div className="flex gap-3 justify-center text-xs">
            <div className="flex items-center gap-1.5 text-emerald-500">
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7" /></svg>
              4-5 stars → Google Reviews
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              1-3 stars → Private feedback
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-6 sm:px-8 py-12 border-y border-gray-100">
        <div className="flex justify-center gap-16 sm:gap-24 flex-wrap max-w-3xl mx-auto">
          {[
            { stat: "3.2x", label: "more Google reviews" },
            { stat: "4.8", label: "avg rating achieved" },
            { stat: "73%", label: "response rate" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-brand-900">{item.stat}</p>
              <p className="text-gray-400 text-xs mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 sm:px-8 py-24 max-w-3xl mx-auto">
        <p className="text-brand-500 text-sm font-medium mb-3 text-center tracking-wide">
          HOW IT WORKS
        </p>
        <h2 className="text-3xl font-bold text-center mb-4 text-brand-900 tracking-tight">
          Three steps. Five minutes.
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-md mx-auto">
          No apps to install. No training required. If you can send a text message, you can use PlateRate.
        </p>
        <div className="space-y-12">
          {[
            {
              step: "01",
              title: "Send the link",
              desc: "After a customer visits, text them your unique PlateRate link. Copy it from your dashboard — takes 5 seconds.",
            },
            {
              step: "02",
              title: "Customer taps a rating",
              desc: "They land on a clean, mobile-friendly page and rate their experience with one tap. No downloads, no sign-ups.",
            },
            {
              step: "03",
              title: "Smart routing does the rest",
              desc: "Rated 4-5 stars? They're guided to leave a Google review. Rated 1-3? Their feedback comes directly to your private dashboard.",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start">
              <span className="text-brand-200 text-3xl font-bold shrink-0 w-12">{item.step}</span>
              <div>
                <h3 className="font-semibold text-brand-900 text-lg mb-1.5">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The problem / benefit */}
      <section className="px-6 sm:px-8 py-24 bg-brand-900">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-300 text-sm font-medium mb-3 text-center tracking-wide">
            THE PROBLEM
          </p>
          <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">
            One bad review costs you 30 customers
          </h2>
          <p className="text-brand-300 text-center mb-16 max-w-lg mx-auto leading-relaxed">
            Studies show 94% of diners choose restaurants based on online reviews. A single 1-star review can drive away dozens of potential customers. PlateRate makes sure that never happens.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Catch problems early",
                desc: "Unhappy customers tell you directly instead of posting publicly. Fix issues before they hurt your rating.",
              },
              {
                title: "Boost your stars",
                desc: "Happy diners are guided to Google with one tap. No more awkward asks. Your rating climbs naturally.",
              },
              {
                title: "See everything",
                desc: "One dashboard shows every rating, every comment, every trend. Know exactly how your restaurant is performing.",
              },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-brand-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 sm:px-8 py-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-500 text-sm font-medium mb-3 text-center tracking-wide">
            PRICING
          </p>
          <h2 className="text-3xl font-bold text-center mb-4 text-brand-900 tracking-tight">
            Start free. Upgrade when it pays for itself.
          </h2>
          <p className="text-gray-400 text-center mb-14 max-w-md mx-auto">
            Most restaurants make back the cost of PlateRate with a single new customer from a Google review.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                name: "Free",
                price: "$0",
                period: "",
                desc: "See it in action",
                features: [
                  "5 review requests/mo",
                  "Google routing",
                  "Basic feedback page",
                  "Email notifications",
                ],
                cta: "Get Started",
                highlight: false,
              },
              {
                name: "Growth",
                price: "$49",
                period: "/mo",
                desc: "For restaurants ready to grow",
                features: [
                  "Unlimited review requests",
                  "Google + Yelp routing",
                  "Custom branded page",
                  "Analytics dashboard",
                  "Negative feedback alerts",
                  "Priority support",
                ],
                cta: "Start Free Trial",
                highlight: true,
              },
              {
                name: "Pro",
                price: "$99",
                period: "/mo",
                desc: "For serious operators",
                features: [
                  "Everything in Growth",
                  "Multi-location support",
                  "Weekly performance reports",
                  "Staff tracking",
                  "API access",
                  "Dedicated account manager",
                ],
                cta: "Start Free Trial",
                highlight: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 relative ${
                  plan.highlight
                    ? "bg-brand-900 ring-2 ring-brand-500 shadow-lg"
                    : "border border-gray-200"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white px-3 py-0.5 rounded-full text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <h3
                  className={`font-semibold text-lg mb-0.5 ${
                    plan.highlight ? "text-white" : "text-brand-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-5 ${
                    plan.highlight ? "text-brand-300" : "text-gray-400"
                  }`}
                >
                  {plan.desc}
                </p>
                <div className="mb-6">
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      plan.highlight ? "text-white" : "text-brand-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlight ? "text-brand-300" : "text-gray-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2.5">
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={plan.highlight ? "#a78bfa" : "#9ca3af"}
                        strokeWidth="2.5"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span
                        className={`text-sm ${
                          plan.highlight ? "text-brand-100" : "text-gray-500"
                        }`}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href="/login"
                  className={`block w-full text-center py-3 rounded-lg font-medium text-sm transition-colors ${
                    plan.highlight
                      ? "bg-white text-brand-900 hover:bg-gray-100"
                      : "bg-brand-900 text-white hover:bg-brand-800"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="px-6 sm:px-8 py-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              {
                quote: "Our Google rating went from 4.3 to 4.8 in two months. We catch unhappy guests before they post.",
                name: "Marco R.",
                role: "Owner, Trattoria Bello",
              },
              {
                quote: "I used to beg customers for reviews. Now they just do it. PlateRate paid for itself in the first week.",
                name: "Jessica T.",
                role: "GM, The Copper Pot",
              },
            ].map((t, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} size={14} />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-brand-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 sm:px-8 py-20 max-w-2xl mx-auto">
        <p className="text-brand-500 text-sm font-medium mb-3 text-center tracking-wide">
          FAQ
        </p>
        <h2 className="text-3xl font-bold text-center mb-12 text-brand-900 tracking-tight">
          Common questions
        </h2>
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-gray-100">
            <button
              onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              className="w-full py-5 flex items-center justify-between text-left bg-transparent border-none cursor-pointer"
            >
              <span className="font-medium text-brand-900 text-sm">
                {faq.q}
              </span>
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="2"
                className={`flex-shrink-0 ml-4 transition-transform duration-200 ${
                  faqOpen === i ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {faqOpen === i && (
              <p className="text-gray-400 text-sm leading-relaxed pb-5 pr-8">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-brand-900 mb-4 tracking-tight">
          Your next 5-star review is one text away
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Set up PlateRate in 5 minutes. Start seeing results today.
        </p>
        <a
          href="/login"
          className="inline-block px-8 py-3.5 rounded-lg bg-brand-900 text-white font-medium hover:bg-brand-800 transition-colors"
        >
          Get started free
        </a>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-brand-900 rounded-md flex items-center justify-center">
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <span className="font-semibold text-brand-900 text-sm">PlateRate</span>
        </div>
        <p className="text-gray-300 text-xs">
          Turn happy diners into 5-star reviews.
        </p>
      </footer>
    </div>
  );
}