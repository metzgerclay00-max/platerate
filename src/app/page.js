'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [stats, setStats] = useState({
    reviews: 0,
    rating: 0,
    negative: 0,
  });

  useEffect(() => {
    const animationDuration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      setStats({
        reviews: Math.floor(67 * progress),
        rating: (0.8 * progress).toFixed(1),
        negative: Math.floor(45 * progress),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 3000);
  };

  const faqItems = [
    {
      question: "How does PlateRate work?",
      answer: "PlateRate intercepts customer feedback at the moment of truth. Customers scan a QR code or click a link, rate their experience with stars, and are intelligently routedâhappy customers (4-5 stars) go directly to leave a Google review, while lower ratings are collected as private feedback for you to improve.",
    },
    {
      question: "Will this actually increase my Google reviews?",
      answer: "Yes. Our customers see an average of 67% more Google reviews. By capturing happy customers at peak satisfaction and making it effortless to leave a review, PlateRate turns word-of-mouth into 5-star ratings. Plus, you get immediate feedback from less-satisfied customers to address issues before they post publicly.",
    },
    {
      question: "How do customers access the review form?",
      answer: "We provide instant QR codes you can print and display in-house, include on receipts, or send via text message. You can also share a direct link. When customers scan or click, they land on a beautiful, mobile-optimized form that takes 15 seconds to complete.",
    },
    {
      question: "Can I customize what star ratings go to Google?",
      answer: "Absolutely. You control the thresholdâdecide whether 4+ stars, 3+ stars, or custom ratings go to Google Reviews. Lower ratings automatically flow to your private dashboard so you can respond to feedback and improve your operation.",
    },
    {
      question: "Is there a contract or can I cancel anytime?",
      answer: "No contracts, no hidden fees. Cancel anytime with a single click. We believe in earning your business monthly by delivering real results. Most customers stay because they see the ROIâbut we never lock you in.",
    },
    {
      question: "How long does setup take?",
      answer: "About 2 minutes. Create an account, configure your threshold and location details, download your QR code, and you're live. No credit card required for the free plan. Paid plans can be set up just as quickly with instant activation.",
    },
  ];

  const testimonials = [
    {
      quote: "PlateRate increased our Google reviews by 340% in just two months. Our rating went from 4.1 to 4.7 stars, and we're getting way fewer surprise negative reviews.",
      author: "Marco Deluca",
      restaurant: "Mario's Bistro, Seattle WA",
      rating: 5,
    },
    {
      quote: "The private feedback from customers has been invaluable. We fixed our wait time process after getting consistent feedbackânow it's our strongest asset. PlateRate literally pays for itself.",
      author: "Sarah Chen",
      restaurant: "The Golden Fork, San Francisco CA",
      rating: 5,
    },
    {
      quote: "As someone who barely has time to breathe, PlateRate is a lifesaver. Setup took 90 seconds, and within a week we had 23 new Google reviews. This is what a real SaaS product feels like.",
      author: "Antonio Rodriguez",
      restaurant: "La Cascada, Miami FL",
      rating: 5,
    },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slideInFromLeft 0.8s ease-out forwards;
        }

        .animate-pulse-subtle {
          animation: pulse 2s ease-in-out infinite;
        }

        .stagger-1 {
          animation-delay: 0.1s;
        }

        .stagger-2 {
          animation-delay: 0.2s;
        }

        .stagger-3 {
          animation-delay: 0.3s;
        }

        .stagger-4 {
          animation-delay: 0.4s;
        }

        .stagger-5 {
          animation-delay: 0.5s;
        }

        .stagger-6 {
          animation-delay: 0.6s;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">ð½ï¸</span>
              <span className="font-bold text-xl text-gray-900">PlateRate</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-brand-600 transition">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-brand-600 transition">
                Pricing
              </a>
              <a href="#faq" className="text-gray-600 hover:text-brand-600 transition">
                FAQ
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-brand-600 transition font-medium">
                Login
              </button>
              <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition font-medium">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up mb-6">
                Turn Every Diner Into a <span className="text-brand-600">5-Star Review</span>
              </h1>
              <p className="text-xl text-gray-600 animate-fade-in-up stagger-1 mb-8 leading-relaxed">
                PlateRate intercepts low ratings before they hit Google and redirects happy customers to leave glowing reviews. Get more 5-star ratings while fixing problems before they go public.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-2">
                <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-lg font-semibold transition shadow-lg hover:shadow-xl">
                  Get Started Free
                </button>
                <button className="border-2 border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-4 rounded-lg font-semibold transition">
                  See How It Works
                </button>
              </div>
            </div>

            {/* Right mockup */}
            <div className="relative h-96 animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-50 rounded-2xl shadow-2xl p-6 border border-brand-200">
                <div className="h-full bg-white rounded-xl shadow-inner p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">How was your experience?</p>
                    <div className="flex justify-center gap-3 mt-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSelectedStars(star)}
                          className={`text-3xl transition transform hover:scale-125 ${
                            star <= selectedStars ? 'opacity-100' : 'opacity-30'
                          }`}
                        >
                          â­
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedStars >= 4 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
                      <p className="text-sm font-medium text-green-900">
                        â Redirecting to Google Reviews...
                      </p>
                    </div>
                  )}
                  {selectedStars > 0 && selectedStars < 4 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in">
                      <p className="text-sm font-medium text-blue-900">
                        ð¬ Thanks for your feedback
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600 font-medium mb-8">
            Trusted by 500+ restaurants nationwide
          </p>
          <div className="flex justify-center items-center flex-wrap gap-8 mb-12">
            {['Mario\'s Bistro', 'The Golden Fork', 'La Cascada', 'Ember & Sage', 'Noodle Co'].map((name, i) => (
              <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-gray-700 font-semibold text-sm">{name}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in-up stagger-1">
              <div className="text-4xl font-bold text-brand-600">3.2x</div>
              <p className="text-gray-600 mt-2">More reviews in 90 days</p>
            </div>
            <div className="animate-fade-in-up stagger-2">
              <div className="text-4xl font-bold text-brand-600">4.8</div>
              <p className="text-gray-600 mt-2">Average rating increase</p>
            </div>
            <div className="animate-fade-in-up stagger-3">
              <div className="text-4xl font-bold text-brand-600">73%</div>
              <p className="text-gray-600 mt-2">Feedback response rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How PlateRate Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to transform your reviews</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-300 -z-10"></div>

            {[
              {
                step: '1',
                title: 'Customer Scans QR Code',
                description: 'Display a QR code in-house or on receipts. Customers scan and rate in 15 seconds.',
                icon: 'ð±',
              },
              {
                step: '2',
                title: 'Happy Customers to Google',
                description: '4-5 star ratings instantly redirect to Google Reviews with a single tap.',
                icon: 'â­',
              },
              {
                step: '3',
                title: 'Lower Ratings to You',
                description: '1-3 star ratings flow to your private dashboard. Fix issues before they go public.',
                icon: 'ð¬',
              },
            ].map((item, i) => (
              <div key={i} className="relative animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition h-full">
                  <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="text-6xl font-bold text-brand-200 mb-4 text-center">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-center">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to own your online reputation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'ð¯',
                title: 'QR Code Generation',
                description: 'Instant printable QR codes. Display in-house, on receipts, or text to customers.',
              },
              {
                icon: 'ðï¸',
                title: 'Smart Routing',
                description: 'Threshold-based routing. You control where each rating goesâGoogle or private.',
              },
              {
                icon: 'ð',
                title: 'Real-time Dashboard',
                description: 'Live analytics, feedback tracking, and actionable insights at a glance.',
              },
              {
                icon: 'ð',
                title: 'Low-Rating Alerts',
                description: 'Instant email notifications for any 1-3 star ratings so you can respond fast.',
              },
              {
                icon: 'ð',
                title: 'Review Funnel Analytics',
                description: 'Track conversion rates from QR scan to published Google review effortlessly.',
              },
              {
                icon: 'ð¥',
                title: 'Category Insights',
                description: 'Breakdown feedback by food quality, service speed, cleanliness, and more.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-50 hover:bg-brand-50 rounded-xl p-8 transition border border-gray-100 hover:border-brand-200 animate-fade-in-up"
                style={{ animationDelay: `${(i % 3) * 0.15}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See It In Action</h2>
            <p className="text-xl text-gray-600">Try rating your experience below</p>
          </div>

          <div className="flex justify-center animate-fade-in-up stagger-1">
            {/* Phone mockup */}
            <div className="w-80 bg-black rounded-3xl p-3 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 h-96 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                    How was your visit?
                  </h3>
                  <p className="text-sm text-gray-500 text-center mb-6">Your feedback helps us improve</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSelectedStars(star)}
                        className={`text-4xl transition transform ${
                          star <= selectedStars ? 'scale-110 opacity-100' : 'opacity-30 hover:scale-105'
                        }`}
                      >
                        â­
                      </button>
                    ))}
                  </div>
                </div>

                {selectedStars >= 4 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 text-center animate-fade-in">
                    <p className="text-sm font-bold text-green-900">
                      Thanks! Tap below to leave a Google review
                    </p>
                    <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition">
                      Leave Review â
                    </button>
                  </div>
                )}

                {selectedStars > 0 && selectedStars < 4 && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 text-center animate-fade-in">
                    <p className="text-sm font-bold text-blue-900">
                      Help us improve. Tell us what happened.
                    </p>
                    <textarea
                      placeholder="Your feedback..."
                      className="mt-3 w-full border border-blue-200 rounded p-2 text-xs focus:outline-none focus:border-blue-500"
                      rows="2"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The PlateRate Effect</h2>
            <p className="text-xl text-gray-600">Real results from real restaurants</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in-up stagger-1">
              <div className="text-5xl font-bold text-brand-600 mb-3">{stats.reviews}%</div>
              <p className="text-gray-600">Increase in Google reviews</p>
              <p className="text-sm text-gray-500 mt-2">in first 90 days</p>
            </div>
            <div className="text-center animate-fade-in-up stagger-2">
              <div className="text-5xl font-bold text-brand-600 mb-3">+{stats.rating}</div>
              <p className="text-gray-600">Average rating improvement</p>
              <p className="text-sm text-gray-500 mt-2">star rating jump</p>
            </div>
            <div className="text-center animate-fade-in-up stagger-3">
              <div className="text-5xl font-bold text-brand-600 mb-3">{stats.negative}%</div>
              <p className="text-gray-600">Fewer negative public reviews</p>
              <p className="text-sm text-gray-500 mt-2">thanks to early intervention</p>
            </div>
            <div className="text-center animate-fade-in-up stagger-4">
              <div className="text-5xl font-bold text-brand-600 mb-3">2 min</div>
              <p className="text-gray-600">Average setup time</p>
              <p className="text-sm text-gray-500 mt-2">from account creation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">No hidden fees. No long-term contracts.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                description: 'Perfect for getting started',
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
                description: 'Most popular for growing restaurants',
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
                description: 'For serious multi-location operators',
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
                className={`rounded-2xl transition transform animate-fade-in-up ${
                  plan.popular
                    ? 'bg-brand-600 text-white shadow-2xl scale-105'
                    : 'bg-white border border-gray-200 hover:shadow-lg'
                }`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {plan.popular && (
                  <div className="bg-brand-700 text-white text-sm font-bold text-center py-2">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={plan.popular ? 'text-brand-100' : 'text-gray-600'}>{plan.description}</p>

                  <div className="my-8">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    {plan.price !== '$0' && (
                      <span className={plan.popular ? 'text-brand-100' : 'text-gray-600'}>/month</span>
                    )}
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition mb-8 ${
                      plan.popular
                        ? 'bg-white text-brand-600 hover:bg-gray-100'
                        : 'bg-brand-600 text-white hover:bg-brand-700'
                    }`}
                  >
                    Get Started
                  </button>

                  <ul className="space-y-4">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="text-xl mt-1">â</span>
                        <span>{feature}</span>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by Restaurant Owners</h2>
            <p className="text-xl text-gray-600">See what customers are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-xl">â­</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-lg">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.restaurant}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${(i % 3) * 0.1}s` }}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold text-gray-900 text-left">{item.question}</h3>
                  <span className={`text-2xl transition transform ${expandedFaqIndex === i ? 'rotate-180' : ''}`}>
                    â¼
                  </span>
                </button>

                {expandedFaqIndex === i && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 animate-fade-in">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in-up">Ready to Transform Your Reviews?</h2>
          <p className="text-xl text-brand-100 mb-8 animate-fade-in-up stagger-1">
            Get started for free. No credit card required. See results in days.
          </p>

          <form onSubmit={handleEmailSubmit} className="flex gap-3 max-w-md mx-auto animate-fade-in-up stagger-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-brand-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition"
            >
              {submitted ? 'â Sent!' : 'Get Started'}
            </button>
          </form>

          <p className="text-brand-100 text-sm mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">ð½ï¸</span>
                <span className="font-bold text-white">PlateRate</span>
              </div>
              <p className="text-sm">Turning diners into 5-star reviewers.</p>
            </div>

            <div>
              <p className="font-semibold text-white mb-4">Product</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Login
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">Â© 2024 PlateRate. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition">
                LinkedIn
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
