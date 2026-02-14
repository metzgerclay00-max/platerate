"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

function Star({ filled, onHover, onClick, size = 48 }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      className="bg-transparent border-none cursor-pointer p-1.5 transition-transform duration-150 active:scale-95"
      style={{ transform: filled ? "scale(1.1)" : "scale(1)" }}
      aria-label={`${size === 48 ? "Rate " : ""}${Math.round(size / 10)} stars`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? "#f59e0b" : "none"}
        stroke={filled ? "#f59e0b" : "#d1d5db"}
        strokeWidth="1.5"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </button>
  );
}

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl p-10 sm:p-12 max-w-md w-full shadow-2xl animate-pulse">
        <div className="w-[72px] h-[72px] bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6" />
        <div className="h-8 bg-gray-200 rounded-lg mb-4 w-3/4 mx-auto" />
        <div className="h-6 bg-gray-200 rounded-lg mb-8 w-2/3 mx-auto" />
        <div className="h-20 bg-gray-200 rounded-lg mb-6" />
        <div className="h-12 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

async function trackEvent(restaurantId, eventType, feedbackId = null, metadata = {}) {
  if (!restaurantId) return;
  try {
    await supabase.from("events").insert({
      restaurant_id: restaurantId,
      event_type: eventType,
      feedback_id: feedbackId,
      metadata: metadata,
    });
  } catch (err) {
    console.error("Failed to track event:", err);
  }
}

export default function ReviewPage({ params }) {
  const { slug } = params;
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("rate"); // rate | google | feedback | thanks | notfound
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastInsertedFeedbackId, setLastInsertedFeedbackId] = useState(null);

  const feedbackCategories = [
    { id: "food", label: "Food", icon: "🍽️" },
    { id: "service", label: "Service", icon: "🤝" },
    { id: "wait_time", label: "Wait Time", icon: "⏱️" },
    { id: "cleanliness", label: "Cleanliness", icon: "✨" },
    { id: "other", label: "Other", icon: "💭" },
  ];

  useEffect(() => {
    async function loadRestaurant() {
      try {
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          setStep("notfound");
        } else {
          setRestaurant(data);
          // Track form_opened event when page loads with valid restaurant
          await trackEvent(data.id, "form_opened", null, { slug });
        }
      } catch (err) {
        console.error("Failed to load restaurant:", err);
        setStep("notfound");
      } finally {
        setLoading(false);
      }
    }
    loadRestaurant();
  }, [slug]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleRate = async () => {
    if (rating === 0 || !restaurant) return;
    const threshold = restaurant?.rating_threshold || 4;

    // Track rating_submitted event
    await trackEvent(restaurant.id, "rating_submitted", null, {
      rating,
      threshold,
    });

    if (rating >= threshold) {
      // Save as redirected, then show Google page
      const { data, error } = await supabase
        .from("feedback")
        .insert({
          restaurant_id: restaurant.id,
          rating,
          was_redirected: true,
          customer_name: "Happy Customer",
          categories: [],
        })
        .select()
        .single();

      if (!error && data) {
        setLastInsertedFeedbackId(data.id);
      }

      setStep("google");
    } else {
      setStep("feedback");
    }
  };

  const handleGoogleClick = async () => {
    if (restaurant) {
      await trackEvent(restaurant.id, "google_clicked", lastInsertedFeedbackId);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!comment.trim() || !restaurant) return;
    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("feedback")
        .insert({
          restaurant_id: restaurant.id,
          rating,
          comment: comment.trim(),
          customer_name: customerName.trim() || "Anonymous",
          was_redirected: false,
          categories: selectedCategories,
        })
        .select()
        .single();

      if (!error && data) {
        // Track feedback_submitted event
        await trackEvent(restaurant.id, "feedback_submitted", data.id, {
          categories: selectedCategories,
          hasComment: true,
        });

        // Trigger low-rating alert (fire and forget — don't block the user)
        if (rating <= 2) {
          fetch("/api/alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              restaurant_id: restaurant.id,
              rating,
              comment: comment.trim(),
              customer_name: customerName.trim() || "Anonymous",
            }),
          }).catch(() => {}); // Silently fail — alert is best-effort
        }
      }

      setStep("thanks");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (step === "notfound") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl animate-fadeIn">
          <div className="text-5xl mb-4">🍽️</div>
          <h1 className="text-2xl font-bold text-brand-900 mb-3">
            Restaurant not found
          </h1>
          <p className="text-gray-500">
            This review link doesn&apos;t seem to be active. Please check with
            the restaurant for the correct link.
          </p>
        </div>
      </div>
    );
  }

  // Step: Rate
  if (step === "rate") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl p-10 sm:p-12 max-w-md w-full text-center shadow-2xl animate-fadeIn">
          <div className="w-[72px] h-[72px] bg-gradient-to-br from-brand-500 to-brand-300 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            🍽️
          </div>
          <h1 className="text-2xl font-bold text-brand-900 mb-1">
            Thanks for visiting
          </h1>
          <h2 className="text-xl font-semibold text-brand-600 mb-2">
            {restaurant.name}
          </h2>
          <p className="text-gray-500 mb-10">
            How was your experience today?
          </p>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                filled={(hoverRating || rating) >= i}
                onHover={() => setHoverRating(i)}
                onClick={() => setRating(i)}
                size={48}
              />
            ))}
          </div>
          <div
            className="mb-10 h-6"
            onMouseLeave={() => setHoverRating(0)}
          >
            <p className="text-gray-400 text-sm font-medium">
              {rating === 0
                ? "Tap a star to rate"
                : rating <= 2
                ? "We're sorry to hear that"
                : rating === 3
                ? "Thanks for the feedback"
                : rating === 4
                ? "Glad you enjoyed it!"
                : "Amazing! We love to hear it!"}
            </p>
          </div>

          <button
            onClick={handleRate}
            disabled={rating === 0}
            className={`w-full py-4 rounded-xl text-base font-semibold transition-all ${
              rating > 0
                ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white cursor-pointer hover:shadow-lg active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-default"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Step: Google redirect
  if (step === "google") {
    const googleUrl = restaurant.google_review_url || "#";
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl p-10 sm:p-12 max-w-md w-full text-center shadow-2xl animate-fadeIn">
          <div className="w-[72px] h-[72px] bg-gradient-to-br from-emerald-500 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            🎉
          </div>
          <h1 className="text-2xl font-bold text-brand-900 mb-3">
            We&apos;re so glad!
          </h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Would you mind sharing your experience? A quick review helps other
            food lovers discover {restaurant.name}.
          </p>

          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleGoogleClick}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-brand-900 text-white font-semibold text-base hover:bg-brand-800 transition-colors active:scale-95 mb-3"
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Leave a Google Review
          </a>

          <p className="text-gray-400 text-xs mt-6">
            Thank you for supporting local restaurants! ❤️
          </p>
        </div>
      </div>
    );
  }

  // Step: Private feedback form
  if (step === "feedback") {
    const showCategories = rating >= 1 && rating <= 3;

    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl p-10 sm:p-12 max-w-md w-full shadow-2xl animate-fadeIn">
          <div className="w-[72px] h-[72px] bg-gradient-to-br from-indigo-500 to-indigo-300 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            💬
          </div>
          <h1 className="text-2xl font-bold text-brand-900 mb-1">
            We&apos;d love to hear more
          </h1>
          <p className="text-gray-500 mb-6 leading-relaxed text-sm">
            Your feedback goes directly to the {restaurant.name} team. We
            take every comment seriously.
          </p>

          {showCategories && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                What could we improve?
              </p>
              <div className="flex flex-wrap gap-2">
                {feedbackCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                      selectedCategories.includes(category.id)
                        ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-brand-300"
                    }`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm mb-3 outline-none focus:border-brand-400 transition-colors"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what happened..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm mb-5 outline-none focus:border-brand-400 transition-colors resize-none"
          />

          <button
            onClick={handleSubmitFeedback}
            disabled={!comment.trim() || submitting}
            className={`w-full py-4 rounded-xl text-base font-semibold transition-all ${
              comment.trim() && !submitting
                ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white cursor-pointer hover:shadow-lg active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-default"
            }`}
          >
            {submitting ? "Sending..." : "Send Feedback"}
          </button>
        </div>
      </div>
    );
  }

  // Step: Thank you
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl p-10 sm:p-12 max-w-md w-full text-center shadow-2xl animate-fadeIn">
        <div className="w-[72px] h-[72px] bg-gradient-to-br from-emerald-500 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            width={36}
            height={36}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-brand-900 mb-3">Thank you!</h1>
        <p className="text-gray-500 leading-relaxed">
          Your feedback has been sent to the {restaurant.name} team. We
          appreciate you helping us improve.
        </p>
      </div>
    </div>
  );
}
