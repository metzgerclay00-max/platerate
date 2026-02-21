'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: '/month',
    description: 'Perfect for getting started',
    locations: 1,
    reviewsPerMonth: 50,
    features: [
      '1 location',
      '50 reviews/month',
      'Basic dashboard',
      'QR code generation',
      'Email support',
    ],
    cta: 'Current Plan',
    badge: null,
    popular: false,
  },
  {
    name: 'Growth',
    price: 49,
    period: '/month',
    description: 'For growing businesses',
    locations: 3,
    reviewsPerMonth: null,
    features: [
      '3 locations',
      'Unlimited reviews',
      'Funnel analytics',
      'Email alerts',
      'Category insights',
      'Priority support',
    ],
    cta: 'Upgrade to Growth',
    badge: 'MOST POPULAR',
    popular: true,
  },
  {
    name: 'Pro',
    price: 99,
    period: '/month',
    description: 'For large operations',
    locations: null,
    reviewsPerMonth: null,
    features: [
      'Unlimited locations',
      'Everything in Growth',
      'Custom branding',
      'SMS delivery',
      'Form builder',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Upgrade to Pro',
    badge: null,
    popular: false,
  },
];

export default function BillingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('Free');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        setUser(user);

        // Fetch restaurant data
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setRestaurant(data);

        // Set current plan (hardcoded for now since subscription table doesn't exist yet)
        setCurrentPlan(data?.plan || 'Free');
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handlePlanClick = (planName) => {
    if (planName === currentPlan) return;
    setModalMessage('Stripe integration coming soon! We\'ll notify you when billing is ready.');
    setShowModal(true);
  };

  const getCurrentPlanStats = () => {
    const stats = {
      Free: {
        reviews: '0 / 50',
        locations: '1 / 1',
        unlimited: false,
      },
      Growth: {
        reviews: 'Unlimited',
        locations: '3 / 3',
        unlimited: true,
      },
      Pro: {
        reviews: 'Unlimited',
        locations: 'Unlimited',
        unlimited: true,
      },
    };
    return stats[currentPlan] || stats['Free'];
  };

  const currentStats = getCurrentPlanStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-brand-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Header */}
      <header className="bg-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-brand-600">GetFives</div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-brand-600 hover:text-brand-700 font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Plan Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-brand-900 mb-2">Billing & Subscription</h1>
          <p className="text-brand-600 mb-8">Manage your GetFives subscription and billing</p>

          <div className="bg-white rounded-lg border border-brand-200 p-8 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-brand-900 mb-1">Current Plan</h2>
                <p className="text-brand-600">You are currently on the {currentPlan} plan</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-brand-600 mb-1">
                  ${plans.find((p) => p.name === currentPlan)?.price || 0}
                </div>
                <div className="text-sm text-brand-600">/month</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">
                  Reviews Used
                </h3>
                <div className="text-3xl font-bold text-brand-900">{currentStats.reviews}</div>
                <p className="text-sm text-brand-500 mt-1">this month</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">
                  Locations
                </h3>
                <div className="text-3xl font-bold text-brand-900">{currentStats.locations}</div>
                <p className="text-sm text-brand-500 mt-1">active locations</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">
                  Features
                </h3>
                <div className="text-3xl font-bold text-brand-900">
                  {
                    plans.find((p) => p.name === currentPlan)?.features.length
                  }
                </div>
                <p className="text-sm text-brand-500 mt-1">available features</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-4">
                Your Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plans
                  .find((p) => p.name === currentPlan)
                  ?.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-brand-500 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-brand-700">{feature}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Plan Comparison Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-brand-900 mb-8">Upgrade Your Plan</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-lg border-2 transition-all ${
                  plan.popular
                    ? 'border-brand-500 bg-brand-50 shadow-lg'
                    : 'border-brand-200 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-brand-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-brand-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="text-4xl font-bold text-brand-900">
                      ${plan.price}
                      <span className="text-lg text-brand-600 font-normal">{plan.period}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlanClick(plan.name)}
                    disabled={plan.name === currentPlan}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all mb-8 ${
                      plan.name === currentPlan
                        ? 'bg-white border-2 border-brand-300 text-brand-700 cursor-default'
                        : plan.popular
                          ? 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700'
                          : 'bg-brand-100 text-brand-700 hover:bg-brand-200 active:bg-brand-300'
                    }`}
                  >
                    {plan.name === currentPlan ? 'Current Plan' : plan.cta}
                  </button>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-brand-900 uppercase tracking-wide">
                      What's Included
                    </h4>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-brand-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Billing History */}
          <div className="bg-white rounded-lg border border-brand-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-brand-900 mb-6">Billing History</h2>

            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-brand-200 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-brand-600 font-medium">No billing history yet</p>
              <p className="text-sm text-brand-500 mt-1">
                Your billing history will appear here once you upgrade
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg border border-brand-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-brand-900 mb-6">Payment Method</h2>

            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-brand-200 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 10h18M7 15h10M3 6h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"
                />
              </svg>
              <p className="text-brand-600 font-medium mb-4">No payment method added</p>
              <button
                onClick={() => {
                  setModalMessage(
                    'Stripe integration coming soon! We\'ll notify you when billing is ready.'
                  );
                  setShowModal(true);
                }}
                className="bg-brand-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-600 active:bg-brand-700 transition-all"
              >
                Add Payment Method
              </button>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-brand-50 rounded-lg border border-brand-200 p-8 text-center">
          <h3 className="text-xl font-bold text-brand-900 mb-2">Need Help?</h3>
          <p className="text-brand-600 mb-4">Have questions about our plans or need a custom solution?</p>
          <a
            href="mailto:support@getfives.ai"
            className="inline-block text-brand-600 hover:text-brand-700 font-medium underline"
          >
            Contact our support team
          </a>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-8 shadow-lg">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-brand-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-900 text-center mb-4">Coming Soon</h2>
            <p className="text-brand-600 text-center mb-6">{modalMessage}</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-brand-100 text-brand-700 py-2 px-4 rounded-lg font-medium hover:bg-brand-200 active:bg-brand-300 transition-all"
              >
                Dismiss
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-brand-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-brand-600 active:bg-brand-700 transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
