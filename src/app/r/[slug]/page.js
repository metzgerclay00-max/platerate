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

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Header skeleton */}
      <div className="h-48 bg-gradient-to-r from-brand-100 to-brand-50 animate-pulse" />

      {/* Content skeleton */}
      <div className="px-6 py-8 space-y-6">
        <div className="h-8 bg-brand-100 rounded-lg animate-pulse w-64 mx-auto" />
        <div className="flex justify-center gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-brand-100 rounded-full animate-pulse"
            />
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

    // Brief animation delay before advancing
    setTimeout(() => {
      onRatingSubmit(rating);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col">
      {/* Gradient header with restaurant name */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-12 text-white">
        <h1 className="text-4xl font-bold">{restaurant.name}</h1>
        <p className="text-brand-100 text-sm mt-2">How was your visit?</p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Question */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">
          How was your experience at {restaurant.name}?
        </h2>

        {/* Star Rating */}
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
              ⭐
            </button>
          ))}
        </div>

        {/* Emoji + Label feedback */}
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
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
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
      {/* Celebration confetti animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              '--duration': `${2 + Math.random() * 1}s`,
              '--delay': `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random() * 1}s`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          >
            🎉
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-12 text-white relative z-10">
        <h1 className="text-3xl font-bold">Thank You!</h1>
        <p className="text-emerald-100 text-sm mt-2">We're so glad you loved it</p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center relative z-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Wow, thank you! We're so glad you had a great experience!
        </h2>

        <p className="text-gray-600 mb-10 leading-relaxed max-w-sm">
          Would you mind sharing your feedback on Google? It really helps us reach new customers.
        </p>

        {/* Google Reviews Button */}
        <button
          onClick={handleGoogleClick}
          disabled={isLoading}
          className="w-full max-w-xs py-4 px-6 mb-6 bg-white border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span className="text-xl">📍</span>
          Share on Google Reviews
        </button>

        {/* Maybe later link */}
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
          to {
            transform: translateY(100vh) rotateZ(360deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti var(--duration, 3s) ease-in var(--delay, 0s) forwards;
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
      // Save feedback
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

      // Track feedback submission
      await trackEvent('feedback_submitted', restaurant.id, data.id, {
        categories: selectedCategories,
        comment_length: comment.length,
      });

      // For low ratings (1-2 stars), trigger alert
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
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-12 text-white">
        <h1 className="text-3xl font-bold">Help Us Improve</h1>
        <p className="text-brand-100 text-sm mt-2">Your feedback matters</p>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto pb-6">
        <p className="text-gray-700 text-center mb-8 leading-relaxed">
          We're sorry your experience wasn't perfect. Your feedback helps us improve.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
          {/* Categories */}
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

          {/* Comment textarea */}
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
            <p className="text-xs text-gray-500 mt-2 text-right">
              {comment.length}/500
            </p>
          </div>

          {/* Name field */}
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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-lg hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 touch-manipulation"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block">⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <span>✓</span>
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Step3ThankYou({ restaurant, customerName }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-12 text-white">
        <h1 className="text-3xl font-bold">Thank You!</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Animated checkmark */}
        <div className="mb-8 animate-bounce-slow">
          <div className="text-7xl">✓</div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Thanks for your feedback, {customerName || 'friend'}!
        </h2>

        <p className="text-gray-600 mb-12 max-w-sm leading-relaxed">
          Your feedback helps {restaurant.name} improve and serve you better next time.
        </p>

        {/* Powered by GetFives */}
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
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
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

        // Track page load
        await trackEvent('form_opened', data.id);
      } catch (err) {
        console.error('Failed to load restaurant:', err);
        setError('Restaurant not found');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [slug]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
        <p className="text-gray-600 text-center">
          {error || 'We could not find this restaurant.'}
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
          onCompleted={() => setStep(4)}
          isLoading={isSubmitting}
        />
      )}

      {step === 3 && rating < restaurant.rating_threshold && (
        <Step2bPrivateFeedback
          restaurant={restaurant}
          rating={rating}
          onSubmitted={(submittedFeedback) => {
            setFeedback(submittedFeedback);
            setStep(5);
          }}
          isLoading={isSubmitting}
        />
      )}

      {step === 4 && (
        <Step3ThankYou
          restaurant={restaurant}
          customerName={null}
        />
      )}

      {step === 5 && (
        <Step3ThankYou
          restaurant={restaurant}
          customerName={feedback?.customer_name}
        />
      )}
    </div>
  );
}
