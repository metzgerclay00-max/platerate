'use client';

import { useState } from 'react';

// --- SVG Icons ---
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevron({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function MiniStar({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "#374151"} stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function StarRating({ selected, onSelect }) {
  return (
    <div className="flex justify-center gap-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onSelect(star)} className={`transition-all duration-150 ${star <= selected ? 'text-amber-400 scale-110' : 'text-gray-600 hover:text-amber-300 hover:scale-105'}`}>
          <StarIcon filled={star <= selected} />
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
  const [selectedStars, setSelectedStars] = useState(0);

  const toggleFaq = (i) => setExpandedFaqIndex(expandedFaqIndex === i ? null : i);

  return (
    <div className="bg-[#09090b] text-white">

      {/* =================== NAV =================== */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-14">
          <a href="/" className="font-semibold text-white tracking-tight">GetFives</a>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-gray-400 hover:text-white transition">Log in</a>
            <a href="/login" className="text-sm bg-white text-[#09090b] px-4 py-1.5 rounded-md font-medium hover:bg-gray-200 transition">Start Free</a>
          </div>
        </div>
      </nav>

      {/* =================== 1. HERO =================== */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs text-gray-400 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Built for coffee shops
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Turn happy customers into<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">5-star Google reviews</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            GetFives uses simple QR codes and smart routing to send satisfied customers straight to Google Reviews, while catching negative feedback privately before it goes public.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <a href="/login" className="inline-flex items-center justify-center gap-2 bg-white text-[#09090b] px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition text-sm">
              Get Your QR Code <IconArrowRight />
            </a>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 border border-white/15 text-gray-300 px-6 py-3 rounded-md font-medium hover:bg-white/5 transition text-sm">
              See How It Works
            </a>
          </div>
          <p className="text-xs text-gray-500">Free plan available. No credit card required.</p>
        </div>

        {/* Hero Visual - Interactive Demo */}
        <div className="max-w-sm mx-auto mt-16 relative z-10">
          <div className="bg-[#111113] rounded-2xl border border-white/10 p-8 shadow-2xl shadow-black/50">
            <p className="text-xs text-gray-500 text-center mb-1 uppercase tracking-wider">Your Coffee Shop</p>
            <p className="text-center text-gray-200 font-medium mb-6">How was your visit?</p>
            <StarRating selected={selectedStars} onSelect={setSelectedStars} />

            {selectedStars >= 4 && (
              <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <p className="text-sm text-green-300 font-medium">Redirecting to Google Reviews...</p>
                <div className="mt-2 w-full bg-green-500/20 rounded-full h-1"><div className="bg-green-400 h-1 rounded-full w-3/4" /></div>
              </div>
            )}

            {selectedStars > 0 && selectedStars < 4 && (
              <div className="mt-6 bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-300 font-medium">Tell us what happened</p>
                <textarea placeholder="Your feedback stays private..." className="mt-3 w-full bg-white/5 border border-white/10 rounded-md p-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-white/20 resize-none" rows="2" />
              </div>
            )}

            {selectedStars === 0 && (
              <p className="text-center text-xs text-gray-600 mt-6">Tap a star to try it</p>
            )}
          </div>
        </div>
      </section>

      {/* =================== 2. SOCIAL PROOF BAR =================== */}
      <section className="py-10 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-white">67%</div>
            <p className="text-xs text-gray-500 mt-1">More Google reviews</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">+0.8</div>
            <p className="text-xs text-gray-500 mt-1">Avg. rating increase</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">45%</div>
            <p className="text-xs text-gray-500 mt-1">Fewer negative reviews</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">2 min</div>
            <p className="text-xs text-gray-500 mt-1">Setup time</p>
          </div>
        </div>
      </section>

      {/* =================== 3. PROBLEM / SOLUTION =================== */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">The problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Great coffee. Not enough reviews.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Problem */}
            <div className="space-y-6">
              {[
                { title: 'Happy customers leave silently', desc: 'They loved the latte. They tell a friend. They never leave a review.' },
                { title: 'One bad review tanks your rating', desc: 'A single 1-star review can undo months of good work on Google.' },
                { title: 'Staff are too busy to ask', desc: 'Between orders, inventory, and the morning rush, asking for reviews never happens.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-200 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Solution */}
            <div className="space-y-6">
              {[
                { title: 'QR code asks automatically', desc: 'No staff training needed. A QR code at the register does the work for you, every time.' },
                { title: 'Happy customers go to Google', desc: '4-5 star ratings are routed directly to your Google Reviews page. One tap.' },
                { title: 'Bad feedback stays private', desc: 'Low ratings go to your dashboard. You see the issue, fix it, respond - no public damage.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-200 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================== 4. HOW IT WORKS =================== */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Three steps. Two minutes. Done.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Place your QR code', desc: 'Print it, stick it by the register, on tables, or on cup sleeves. Customers scan with their phone camera.' },
              { step: '02', title: 'Customer rates their visit', desc: 'A quick, beautiful feedback flow opens instantly. Takes 15 seconds to complete.' },
              { step: '03', title: 'Reviews flow automatically', desc: 'Happy customers are guided to Google. Critical feedback goes straight to your private dashboard.' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-[#111113] rounded-xl border border-white/5 p-6 hover:border-white/10 transition h-full">
                  <span className="text-xs font-mono text-gray-600 mb-4 block">{item.step}</span>
                  <h3 className="font-semibold text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== 5. PRODUCT DEMO =================== */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Your dashboard</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything at a glance</h2>
          </div>

          {/* Mock Dashboard */}
          <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 sm:p-8">
            {/* Dashboard header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div>
                <p className="text-sm text-gray-500">Dashboard</p>
                <p className="text-lg font-semibold text-white">Daily Grind Coffee</p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 text-xs rounded-md bg-white/5 text-gray-400">Last 30 days</div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Reviews', value: '147', change: '+23 this month' },
                { label: 'Google Rating', value: '4.7', change: 'Up from 4.1' },
                { label: 'Feedback Caught', value: '34', change: 'Private responses' },
                { label: 'Response Rate', value: '89%', change: 'Within 24 hours' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-green-400 mt-1">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Review growth chart mockup */}
            <div className="bg-white/[0.03] rounded-lg p-6 border border-white/5">
              <p className="text-sm text-gray-400 mb-4">Review growth</p>
              <div className="flex items-end gap-2 h-32">
                {[20, 28, 25, 35, 42, 38, 55, 48, 62, 58, 72, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-amber-500/40 to-amber-400/80 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== 6. RESULTS / TRANSFORMATION =================== */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Results</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What happens after you install GetFives</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'More 5-star reviews weekly', desc: 'Stop hoping customers leave reviews. GetFives makes it effortless for them.' },
              { title: 'Higher Google ranking', desc: 'More recent, positive reviews signal to Google that your shop is active and trusted.' },
              { title: 'More foot traffic', desc: 'Higher ratings mean more clicks, more visits, and more first-time customers.' },
              { title: 'Fewer public complaints', desc: 'Catch unhappy customers before they post. Resolve issues privately.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 bg-[#111113] rounded-xl border border-white/5 p-6">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div>
                  <p className="font-medium text-gray-200 mb-1">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== 7. WHO IT'S FOR =================== */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Who it's for</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for local businesses that rely on reviews</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Coffee Shops', emoji: 'Primary focus' },
              { name: 'Restaurants', emoji: 'Coming soon' },
              { name: 'Bars & Breweries', emoji: 'Coming soon' },
              { name: 'Local Services', emoji: 'Coming soon' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl border p-6 text-center transition ${i === 0 ? 'bg-amber-400/5 border-amber-400/20' : 'bg-[#111113] border-white/5'}`}>
                <p className="font-semibold text-gray-200 mb-1">{item.name}</p>
                <p className={`text-xs ${i === 0 ? 'text-amber-400' : 'text-gray-600'}`}>{item.emoji}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== 8. TESTIMONIALS =================== */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Hear from shop owners</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Our Google reviews went from 4.1 to 4.7 stars in two months. Huge difference for foot traffic.",
                author: "Marco D.",
                shop: "Daily Grind Coffee, Seattle",
                rating: 5,
                initials: "MD",
              },
              {
                quote: "The private feedback alone is worth it. We found out our oat milk latte was under-extracted. Fixed it, complaints dropped overnight.",
                author: "Sarah C.",
                shop: "Brewed Awakening, SF",
                rating: 5,
                initials: "SC",
              },
              {
                quote: "Stuck the QR code by the register. 23 new Google reviews in the first week. Zero extra effort.",
                author: "Antonio R.",
                shop: "Cafe Cubano, Miami",
                rating: 5,
                initials: "AR",
              },
            ].map((t, i) => (
              <div key={i} className="bg-[#111113] rounded-xl border border-white/5 p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <MiniStar key={j} filled={j < t.rating} />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-gray-400">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{t.author}</p>
                    <p className="text-xs text-gray-600">{t.shop}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== 9. PRICING =================== */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
            <p className="text-gray-500 mt-3">No hidden fees. No long-term contracts. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: 'Starter',
                price: '$0',
                desc: 'For getting started',
                features: ['1 location', '50 reviews/month', 'Basic dashboard', 'QR code generation', 'Email support'],
                popular: false,
              },
              {
                name: 'Growth',
                price: '$49',
                desc: 'For growing shops',
                features: ['3 locations', 'Unlimited reviews', 'Funnel analytics', 'Email alerts', 'Category insights', 'Priority support'],
                popular: true,
              },
              {
                name: 'Pro',
                price: '$99',
                desc: 'Multi-location brands',
                features: ['Unlimited locations', 'Custom branding', 'SMS delivery', 'Form builder', 'API access', 'Dedicated support'],
                popular: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`rounded-xl border p-6 ${plan.popular ? 'border-amber-400/30 bg-amber-400/[0.03]' : 'border-white/5 bg-[#111113]'}`}>
                {plan.popular && <p className="text-xs font-medium text-amber-400 mb-4">Most popular</p>}
                <h3 className="font-semibold text-gray-100">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  {plan.price !== '$0' && <span className="text-gray-500 text-sm">/mo</span>}
                </div>
                <a href="/login" className={`block w-full py-2.5 rounded-md font-medium transition text-center text-sm mb-6 ${plan.popular ? 'bg-white text-[#09090b] hover:bg-gray-200' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                  Get Started
                </a>
                <ul className="space-y-2.5">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-green-400 flex-shrink-0"><IconCheck /></span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== 10. FINAL CTA =================== */}
      <section className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Start getting more 5-star reviews today</h2>
          <p className="text-gray-500 mb-8">Set it up once. Let it work for you every day.</p>
          <a href="/login" className="inline-flex items-center gap-2 bg-white text-[#09090b] px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition text-sm">
            Get Your QR Code <IconArrowRight />
          </a>
          <p className="text-xs text-gray-600 mt-4">Free plan available. No credit card required.</p>
        </div>
      </section>

      {/* =================== 11. FAQ =================== */}
      <section id="faq" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="text-3xl font-bold tracking-tight">Common questions</h2>
          </div>

          <div className="space-y-2">
            {[
              { q: "How does GetFives work?", a: "Customers scan a QR code at your shop, rate their experience, and are intelligently routed. 4-5 stars go to Google Reviews. Lower ratings go to your private dashboard." },
              { q: "Do I need any POS integration?", a: "No. GetFives works independently of your point-of-sale system. Just print the QR code and place it where customers can see it." },
              { q: "How fast can I start?", a: "About 2 minutes. Create an account, add your shop details, and download your QR code. You can be collecting reviews today." },
              { q: "Will this block bad reviews?", a: "GetFives doesn't block reviews. It routes unhappy customers to give you private feedback instead. You get a chance to fix issues before they post publicly." },
              { q: "Is this allowed by Google's policies?", a: "Yes. GetFives does not create fake reviews or incentivize ratings. It simply makes it easier for genuinely happy customers to leave reviews they were already inclined to write." },
              { q: "Is there a contract?", a: "No contracts. No hidden fees. Cancel anytime with one click." },
            ].map((item, i) => (
              <div key={i} className="border border-white/5 rounded-lg overflow-hidden">
                <button onClick={() => toggleFaq(i)} className="w-full px-5 py-4 flex justify-between items-center hover:bg-white/[0.02] transition text-left">
                  <span className="font-medium text-gray-200 text-sm pr-4">{item.q}</span>
                  <IconChevron open={expandedFaqIndex === i} />
                </button>
                {expandedFaqIndex === i && (
                  <div className="px-5 pb-4">
                    <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== FOOTER =================== */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <span className="font-semibold text-white">GetFives</span>
            <p className="text-xs text-gray-600 mt-2 max-w-xs">Helping coffee shops earn more 5-star reviews and catch problems early.</p>
          </div>
          <div className="flex gap-10 text-xs text-gray-500">
            <div>
              <p className="text-gray-400 font-medium mb-2">Product</p>
              <a href="#how-it-works" className="block hover:text-white transition mb-1.5">How It Works</a>
              <a href="#pricing" className="block hover:text-white transition mb-1.5">Pricing</a>
              <a href="#faq" className="block hover:text-white transition">FAQ</a>
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-2">Company</p>
              <a href="/login" className="block hover:text-white transition mb-1.5">Log in</a>
              <a href="#" className="block hover:text-white transition">Contact</a>
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-2">Legal</p>
              <a href="#" className="block hover:text-white transition mb-1.5">Privacy</a>
              <a href="#" className="block hover:text-white transition">Terms</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5">
          <p className="text-xs text-gray-700">2026 GetFives. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
