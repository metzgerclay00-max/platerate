'use client';

import { useState } from 'react';

// --- SVG Icon Components ---
function IconQR() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3z" />
      <path d="M21 14v7h-7" />
      <path d="M21 21h0" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconTrending() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function IconMessageCircle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevron({ open }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// --- Star Rating Component ---
function StarIcon({ filled }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function StarRating({ selected, onSelect }) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onSelect(star)}
          className={`transition-all duration-150 ${
            star <= selected
              ? 'text-amber-400 scale-110'
              : 'text-gray-300 hover:text-amber-300 hover:scale-105'
          }`}
        >
          <StarIcon filled={star <= selected} />
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
  const [selectedStars, setSelectedStars] = useState(0);

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "How does GetFives work?",
      answer: "Customers scan a QR code at your coffee shop or click a link, rate their experience, and are intelligently routed. Happy customers (4-5 stars) go directly to Google Reviews, while lower ratings are collected as private feedback for you to improve.",
    },
    {
      question: "Will this actually increase my Google reviews?",
      answer: "Coffee shops using GetFives see an average of 67% more Google reviews in their first 90 days. By capturing happy customers at peak satisfaction and making it effortless to leave a review, you get more 5-star ratings while catching issues before they go public.",
    },
    {
      question: "How do customers leave a review?",
      answer: "We generate a QR code for your shop. Print it, stick it by the register, on tables, or on cup sleeves. Customers scan with their phone camera, tap a star rating, and they're done in 15 seconds. You can also text the link directly.",
    },
    {
      question: "Can I customize the rating threshold?",
      answer: "Yes. You control which ratings go to Google and which come to your private dashboard. Most shops set it at 4+ stars for Google, but you can adjust it anytime.",
    },
    {
      question: "Is there a contract?",
      answer: "No contracts, no hidden fees. Cancel anytime with a single click. We earn your business monthly by delivering real results.",
    },
    {
      question: "How long does setup take?",
      answer: "About 2 minutes. Create an account, add your coffee shop details, download your QR code, and you're live. No credit card required on the free plan.",
    },
  ];

  const testimonials = [
    {
      quote: "Our Google reviews went from 4.1 to 4.7 stars in two months. We went from getting maybe one review a week to getting several. Huge difference for foot traffic.",
      author: "Marco D.",
      shop: "Daily Grind Coffee, Seattle",
      rating: 5,
      initials: "MD",
      color: "bg-brand-500",
    },
    {
      quote: "The private feedback alone is worth the price. We found out our oat milk latte was consistently under-extracted -fixed it, and complaints dropped overnight.",
      author: "Sarah C.",
      shop: "Brewed Awakening, San Francisco",
      rating: 5,
      initials: "SC",
      color: "bg-amber-600",
    },
    {
      quote: "Between pulling shots and managing staff, I have zero time for marketing. Stuck the QR code by the register and had 23 new reviews in the first week.",
      author: "Antonio R.",
      shop: "Café Cubano, Miami",
      rating: 4,
      initials: "AR",
      color: "bg-brand-700",
    },
  ];

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center gap-2">
              <span className="font-bold text-lg text-gray-900 tracking-tight">GetFives</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition">
                FAQ
              </a>
            </div>

            <div className="flex items-center gap-3">
              <a href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition font-medium">
                Log in
              </a>
              <a href="/login" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                Start Free
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-medium text-brand-500 mb-4 tracking-wide uppercase">
                Review management for coffee shops
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
                Turn happy customers into 5-star Google reviews
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                GetFives routes satisfied customers straight to Google Reviews and sends critical feedback directly to you -before it goes public. Built specifically for coffee shops.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/login" className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-md font-medium transition text-center">
                  Get Started Free
                </a>
                <a href="#how-it-works" className="border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-6 py-3 rounded-md font-medium transition text-center">
                  See How It Works
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-4">Free plan available. No credit card required.</p>
            </div>

            {/* Demo Card */}
            <div className="relative">
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 max-w-sm mx-auto">
                <p className="text-sm text-gray-500 font-medium text-center mb-1">Your Coffee Shop</p>
                <p className="text-center text-gray-900 font-semibold mb-6">How was your visit today?</p>
                <StarRating selected={selectedStars} onSelect={setSelectedStars} />

                {selectedStars >= 4 && (
                  <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-green-800">
                      Awesome! Tap below to share your experience on Google.
                    </p>
                    <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-md text-sm font-medium transition">
                      Leave a Google Review
                    </button>
                  </div>
                )}

                {selectedStars > 0 && selectedStars < 4 && (
                  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-gray-700">
                      We're sorry to hear that. Tell us what happened.
                    </p>
                    <textarea
                      placeholder="Your feedback stays private..."
                      className="mt-3 w-full border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent resize-none"
                      rows="2"
                    />
                  </div>
                )}

                {selectedStars === 0 && (
                  <p className="text-center text-sm text-gray-400 mt-6">Tap a star to try it out</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">67%</div>
              <p className="text-sm text-gray-600 mt-1">More Google reviews</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">+0.8</div>
              <p className="text-sm text-gray-600 mt-1">Avg. rating improvement</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">45%</div>
              <p className="text-sm text-gray-600 mt-1">Fewer negative reviews</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">2 min</div>
              <p className="text-sm text-gray-600 mt-1">Setup time</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-600">Three steps. Two minutes to set up. Results in days.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: '01',
                title: 'Customer scans your QR code',
                description: 'Place the QR code at the register, on tables, or on cup sleeves. Customers scan and rate their experience in 15 seconds.',
                icon: <IconQR />,
              },
              {
                step: '02',
                title: 'Happy customers go to Google',
                description: '4-5 star ratings are redirected straight to your Google Reviews page. One tap, and they\'re leaving a public review.',
                icon: <IconStar />,
              },
              {
                step: '03',
                title: 'Critical feedback stays private',
                description: '1-3 star ratings go to your private dashboard. You see the issue, fix it, and respond -before it hits the internet.',
                icon: <IconShield />,
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need</h2>
            <p className="text-gray-600">Built for coffee shop owners who are too busy to manage their online reputation manually.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <IconQR />,
                title: 'QR Code Generation',
                description: 'Instant printable QR codes for the register, tables, cup sleeves, or receipts.',
              },
              {
                icon: <IconSliders />,
                title: 'Smart Routing',
                description: 'You control the threshold. Decide which ratings go to Google and which stay private.',
              },
              {
                icon: <IconChart />,
                title: 'Real-time Dashboard',
                description: 'Live analytics, feedback tracking, and actionable insights -all in one place.',
              },
              {
                icon: <IconBell />,
                title: 'Instant Alerts',
                description: 'Get notified the moment someone leaves a low rating so you can respond fast.',
              },
              {
                icon: <IconTrending />,
                title: 'Review Funnel Analytics',
                description: 'Track conversion from QR scan to published Google review.',
              },
              {
                icon: <IconMessageCircle />,
                title: 'Category Insights',
                description: 'Understand feedback patterns across drink quality, service, atmosphere, and more.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:border-brand-200 transition"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple pricing</h2>
            <p className="text-gray-600">No hidden fees. No long-term contracts. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '$0',
                description: 'Try it out',
                features: [
                  '1 location',
                  '50 reviews/month',
                  'Basic dashboard',
                  'QR code generation',
                  'Email support',
                ],
                popular: false,
              },
              {
                name: 'Growth',
                price: '$49',
                description: 'For growing shops',
                features: [
                  '3 locations',
                  'Unlimited reviews',
                  'Funnel analytics',
                  'Email alerts',
                  'Category insights',
                  'Priority support',
                ],
                popular: true,
              },
              {
                name: 'Pro',
                price: '$99',
                description: 'Multi-location brands',
                features: [
                  'Unlimited locations',
                  'Custom branding',
                  'SMS delivery',
                  'Form builder',
                  'API access',
                  'Dedicated support',
                ],
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-lg border transition ${
                  plan.popular
                    ? 'border-brand-500 ring-1 ring-brand-500 bg-white'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="bg-brand-500 text-white text-xs font-semibold text-center py-1.5 rounded-t-lg">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== '$0' && <span className="text-gray-500">/mo</span>}
                  </div>

                  <a
                    href="/login"
                    className={`block w-full py-2.5 rounded-md font-medium transition text-center text-sm mb-6 ${
                      plan.popular
                        ? 'bg-brand-500 text-white hover:bg-brand-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </a>

                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-gray-600">
                        <span className="text-brand-500 flex-shrink-0"><IconCheck /></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What shop owners are saying</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill={j < t.rating ? "#f59e0b" : "#e5e7eb"} stroke="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                    <p className="text-xs text-gray-500">{t.shop}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Questions & answers</h2>
          </div>

          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-5 py-4 flex justify-between items-center hover:bg-gray-50 transition text-left"
                >
                  <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                  <IconChevron open={expandedFaqIndex === i} />
                </button>

                {expandedFaqIndex === i && (
                  <div className="px-5 pb-4">
                    <p className="text-gray-600 leading-relaxed text-sm">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to be the top-rated coffee shop in town?</h2>
          <p className="text-brand-200 mb-8">
            Start free. See your first results within a week. No credit card required.
          </p>
          <a href="/login" className="inline-block bg-white text-brand-900 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition">
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <span className="font-semibold text-white text-lg">GetFives</span>
              <p className="text-sm mt-2 max-w-xs">Helping coffee shops earn more 5-star reviews and catch problems early.</p>
            </div>

            <div className="flex gap-12 text-sm">
              <div>
                <p className="font-medium text-white mb-3">Product</p>
                <ul className="space-y-2">
                  <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                  <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-white mb-3">Company</p>
                <ul className="space-y-2">
                  <li><a href="/login" className="hover:text-white transition">Log in</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-white mb-3">Legal</p>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-sm">
            <p>© 2026 GetFives. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
