'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const CATEGORY_EMOJIS = {
  'Food': '🍽️',
  'Service': '🤝',
  'Wait Time': '⏱️',
  'Cleanliness': '✨',
  'Ambiance': '🎵',
  'Value': '💰',
  'Other': '💭',
};

const RATING_FEEDBACK = {
  1: { emoji: '😞', label: 'Terrible' },
  2: { emoji: '😕', label: 'Not Great' },
  3: { emoji: '😐', label: 'Okay' },
  4: { emoji: '😊', label: 'Great' },
  5: { emoji: '🤩', label: 'Amazing!' },
};

async function trackEvent(eventType, restaurantId, feedbackId = null, metadata = null) {
  try {
    await supabase.from('events').insert({
      restaurant_id: restaurantId,
      event_type: eventType,
      feedback_id: feedbackId,
      metadata: metadata,
    });
  } catch (error) {
    console.error('Event tracking failed:', error);
  }
}

async function generateRewardCode(restaurantId, feedbackId = null) {
  try {
    const response = await fetch('/api/reward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurant_id: restaurantId, feedback_id: feedbackId }),
    });
    const data = await response.json();
    if (data.enabled && data.code) {
      return { code: data.code, reward_text: data.reward_text };
    }
    return null;
  } catch (err) {
    console.error('Reward generation failed:', err);
    return null;
  }
}

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <div className="h-48 bg-gradient-to-r from-brand-100 to-brand-50 animate-pulse" />
      <div className="px-6 py-8 space-y-6">
        <div className="h-8 bg-brand-100 rounded-lg animate-pulse w-64 mx-auto" />
        <div className="flex justify-center gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-brand-100 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="h-20 bg-brand-50 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

function Step1Rating({ restaurant, onRatingSubmit, isLoading }) {
  const [hoveredRating, setHoveredRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const handleStarClick = async (rating) => {
    setSelectedRating(rating);
    await trackEvent('rating_submitted', restaurant.id, null, { rating });
    setTimeout(() => {
      onRatingSubmit(rating);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col">
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-12 text-white">
        <h1 className="text-4xl font-bold">{restaurant.name}</h1>
        <p className="text-brand-100 text-sm mt-2">How was your visit?</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">
          How was your experience at {restaurant.name}?
        </h2>
        <div className="flex gap-4 mb-12 justify-center flex-wrap">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleStarClick(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(null)}
              disabled={isLoading}
              className={`relative w-14 h-14 flex items-center justify-center text-5xl transition-all duration-200 active:scale-95 disabled:opacity-50 touch-manipulation ${
                selectedRating && selectedRating !== rating ? 'opacity-30' : ''
              } ${
                hoveredRating && hoveredRating >= rating
                  ? 'scale-110'
                  : selectedRating && selectedRating >= rating
                  ? 'scale-100'
                  : 'scale-95'
              }`}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill={
                (hoveredRating && hoveredRating >= rating) || (selectedRating && selectedRating >= rating)
                  ? '#F59E0B' : '#D1D5DB'
              }>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>
          ))}
        </div>
        {selectedRating && (
          <div className="animate-fade-in text-center mb-8">
            <div className="text-6xl mb-3">{RATING_FEEDBACK[selectedRating].emoji}</div>
            <p className="text-xl font-semibold text-gray-900">
              {RATING_FEEDBACK[selectedRating].label}
            </p>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}

function Step2aGoogleRedirect({ restaurant, onCompleted, isLoading }) {
  const handleGoogleClick = async () => {
    await trackEvent('google_clicked', restaurant.id, null, {
      google_review_url: restaurant.google_review_url,
    });
    window.open(restaurant.google_review_url, '_blank');
    setTimeout(() => onCompleted(), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              animationDuration: `${2 + Math.random() * 1}s`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          >
            🎉
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-12 text-white relative z-10">
        <h1 className="text-3xl font-bold">Thank You!</h1>
        <p className="text-emerald-100 text-sm mt-2">We're so glad you loved it</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center relative z-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Wow, thank you! We're so glad you had a great experience!
        </h2>
        <p className="text-gray-600 mb-10 leading-relaxed max-w-sm">
          Would you mind sharing your feedback on Google? It really helps us reach new customers.
        </p>
        <button
          onClick={handleGoogleClick}
          disabled={isLoading}
          className="w-full max-w-xs py-4 px-6 mb-6 bg-white border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Share on Google Reviews
        </button>
        <button
          onClick={onCompleted}
          disabled={isLoading}
          className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
        >
          Maybe later
        </button>
      </div>
      <style jsx>{`
        @keyframes confetti {
          to { transform: translateY(100vh) rotateZ(360deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}

function Step2bPrivateFeedback({ restaurant, rating, onSubmitted, isLoading }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = Object.keys(CATEGORY_EMOJIS);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          restaurant_id: restaurant.id,
          rating,
          comment,
          customer_name: customerName || null,
          was_redirected: false,
          categories: selectedCategories,
        })
        .select()
        .single();

      if (error) throw error;

      await trackEvent('feedback_submitted', restaurant.id, data.id, {
        categories: selectedCategories,
        comment_length: comment.length,
      });

      if (rating <= 2) {
        try {
          await fetch('/api/alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              restaurant_id: restaurant.id,
              rating,
              comment,
              customer_name: customerName || 'Anonymous',
            }),
          });
        } catch (alertError) {
          console.error('Alert notification failed:', alertError);
        }
      }

      onSubmitted(data);
    } catch (error) {
      console.error('Feedback submission failed:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col">
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-12 text-white">
        <h1 className="text-3xl font-bold">Help Us Improve</h1>
        <p className="text-brand-100 text-sm mt-2">Your feedback matters</p>
      </div>
      <div className="flex-1 px-6 py-8 overflow-y-auto pb-6">
        <p className="text-gray-700 text-center mb-8 leading-relaxed">
          We're sorry your experience wasn't perfect. Your feedback helps us improve.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              What could we improve? (select all that apply)
            </label>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 active:scale-95 touch-manipulation ${
                    selectedCategories.includes(category)
                      ? 'bg-brand-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{CATEGORY_EMOJIS[category]}</span>
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tell us more (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="What happened? How can we do better?"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:outline-none resize-none font-sans text-base transition-colors"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-2 text-right">{comment.length}/500</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your name (optional)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:outline-none font-sans text-base transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-lg hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 touch-manipulation"
          >
            {isSubmitting ? (
              <><span className="animate-spin inline-block">...</span> Submitting...</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> Submit Feedback</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Step3ThankYou({ restaurant, customerName, rewardCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (rewardCode?.code) {
      navigator.clipboard.writeText(rewardCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-12 text-white">
        <h1 className="text-3xl font-bold">Thank You!</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-8 animate-bounce-slow">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Thanks for your feedback, {customerName || 'friend'}!
        </h2>
        <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
          Your feedback helps {restaurant.name} improve and serve you better next time.
        </p>

        {/* Reward Code Section */}
        {rewardCode && (
          <div className="w-full max-w-sm mb-8 animate-slide-up">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/></svg>
                <span className="text-amber-800 font-semibold text-sm uppercase tracking-wide">Your Reward</span>
              </div>
              <p className="text-amber-700 text-sm mb-4">{rewardCode.reward_text}</p>
              <div className="bg-white rounded-xl p-4 border border-amber-200 mb-4">
                <p className="text-3xl font-mono font-bold text-gray-900 tracking-widest">{rewardCode.code}</p>
              </div>
              <button
                onClick={handleCopy}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors active:scale-95 flex items-center justify-center gap-2"
              >
                {copied ? (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> Copied!</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy Code</>
                )}
              </button>
              <p className="text-amber-600 text-xs mt-3">Show this code to your barista to redeem</p>
            </div>
          </div>
        )}

        <a
          href="https://getfives.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Powered by GetFives
        </a>
      </div>
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out 0.3s both; }
      `}</style>
    </div>
  );
}

export default function ReviewPage({ params }) {
  const { slug } = params;
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rewardCode, setRewardCode] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data, error: err } = await supabase
          .from('restaurants')
          .select('*')
          .eq('slug', slug)
          .single();

        if (err) throw err;
        setRestaurant(data);
        await trackEvent('form_opened', data.id);
      } catch (err) {
        console.error('Failed to load restaurant:', err);
        setError('Coffee shop not found');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [slug]);

  const handleGoogleRedirectComplete = async () => {
    // Generate reward code after Google redirect
    const reward = await generateRewardCode(restaurant.id);
    if (reward) setRewardCode(reward);
    setStep(4);
  };

  const handleFeedbackSubmitted = async (submittedFeedback) => {
    setFeedback(submittedFeedback);
    // Generate reward code after feedback submission
    const reward = await generateRewardCode(restaurant.id, submittedFeedback.id);
    if (reward) setRewardCode(reward);
    setStep(5);
  };

  if (loading) return <SkeletonLoader />;

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
        <p className="text-gray-600 text-center">
          {error || 'We could not find this coffee shop.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {step === 1 && (
        <Step1Rating
          restaurant={restaurant}
          onRatingSubmit={(selectedRating) => {
            setRating(selectedRating);
            setStep(selectedRating >= restaurant.rating_threshold ? 2 : 3);
          }}
          isLoading={isSubmitting}
        />
      )}

      {step === 2 && rating >= restaurant.rating_threshold && (
        <Step2aGoogleRedirect
          restaurant={restaurant}
          onCompleted={handleGoogleRedirectComplete}
          isLoading={isSubmitting}
        />
      )}

      {step === 3 && rating < restaurant.rating_threshold && (
        <Step2bPrivateFeedback
          restaurant={restaurant}
          rating={rating}
          onSubmitted={handleFeedbackSubmitted}
          isLoading={isSubmitting}
        />
      )}

      {step === 4 && (
        <Step3ThankYou
          restaurant={restaurant}
          customerName={null}
          rewardCode={rewardCode}
        />
      )}

      {step === 5 && (
        <Step3ThankYou
          restaurant={restaurant}
          customerName={feedback?.customer_name}
          rewardCode={rewardCode}
        />
      )}
    </div>
  );
}
