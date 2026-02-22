"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-32"
          >
            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, change, icon, trend }) {
  const isPositive = trend === "up";
  const trendColor = isPositive ? "text-green-600" : "text-red-600";
  const trendBg = isPositive ? "bg-green-50" : "bg-red-50";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          <span>{isPositive ? "↑" : "↓"}</span>
          <span>{Math.abs(change)}% vs last week</span>
        </div>
      )}
    </div>
  );
}

// QR Code Card Component
function QRCodeCard({ restaurant }) {
  const [copied, setCopied] = useState(false);
  const reviewUrl = restaurant.google_review_url || `https://getfives.ai/r/${restaurant.slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(reviewUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `${restaurant.slug}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Share & QR Code</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <img
              src={qrUrl}
              alt="QR Code"
              className="w-56 h-56"
              loading="lazy"
            />
          </div>
          <button
            onClick={handleDownload}
            className="w-full px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium"
          >
            Download QR Code
          </button>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-600 mb-3">Review Link</p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={reviewUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Quick Share Tips</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Print on receipts and menus</li>
              <li>• Display on table tents</li>
              <li>• Share on social media</li>
              <li>• Add to email signatures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Google Progress Tracker
function GoogleProgressTracker({ restaurant, feedback }) {
  if (!restaurant.google_baseline_reviews) {
    return null;
  }

  const redirectCount = feedback.filter((f) => f.was_redirected).length;
  const currentEstimate = restaurant.google_baseline_reviews + redirectCount;
  const improvement = currentEstimate - restaurant.google_baseline_reviews;
  const improvementPercent = Math.round(
    (improvement / restaurant.google_baseline_reviews) * 100
  );
  const progressPercent = Math.min(
    (improvement / (restaurant.google_baseline_reviews * 0.5)) * 100,
    100
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Google Reviews Progress</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Starting Point</p>
          <p className="text-2xl font-bold text-gray-900">
            {restaurant.google_baseline_reviews}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {restaurant.google_baseline_rating.toFixed(1)} rating
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Redirected to Google</p>
          <p className="text-2xl font-bold text-brand-600">{redirectCount}</p>
          <p className="text-xs text-gray-500 mt-1">From GetFives form</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Estimated Total</p>
          <p className="text-2xl font-bold text-green-600">{currentEstimate}</p>
          <p className="text-xs text-gray-500 mt-1">
            +{improvementPercent}% growth
          </p>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700">Progress to +50%</p>
          <p className="text-sm font-bold text-gray-900">{Math.round(progressPercent)}%</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-brand-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
      </div>
      {improvement > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-sm">
          <p className="text-green-900 font-medium">
            Great momentum! You've gained {improvement} review
            {improvement !== 1 ? "s" : ""} through GetFives.
          </p>
        </div>
      )}
    </div>
  );
}

// Review Funnel Component
function ReviewFunnel({ events }) {
  const formOpens = events.filter((e) => e.event_type === "form_opened").length;
  const ratingsSubmitted = events.filter(
    (e) => e.event_type === "rating_submitted"
  ).length;
  const googleClicks = events.filter(
    (e) => e.event_type === "google_clicked"
  ).length;

  const formToRating = formOpens > 0 ? Math.round((ratingsSubmitted / formOpens) * 100) : 0;
  const ratingToGoogle =
    ratingsSubmitted > 0 ? Math.round((googleClicks / ratingsSubmitted) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Review Funnel</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Form Opens</p>
            <p className="text-sm font-bold text-gray-900">{formOpens}</p>
          </div>
          <div className="h-12 bg-brand-500 rounded-lg"></div>
        </div>

        <div className="flex justify-center">
          <span className="text-sm font-semibold text-gray-600">
            {formToRating}% conversion
          </span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Ratings Submitted</p>
            <p className="text-sm font-bold text-gray-900">{ratingsSubmitted}</p>
          </div>
          <div
            className="h-12 bg-brand-400 rounded-lg transition-all"
            style={{
              width: formOpens > 0 ? `${(ratingsSubmitted / formOpens) * 100}%` : "0%",
            }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-700">Google Clicks</p>
              <p className="text-sm font-bold text-gray-900">{googleClicks}</p>
            </div>
            <div
              className="h-10 bg-green-500 rounded-lg transition-all"
              style={{
                width:
                  ratingsSubmitted > 0
                    ? `${(googleClicks / ratingsSubmitted) * 100}%`
                    : "0%",
              }}
            ></div>
            <p className="text-xs text-gray-500 mt-2">
              {ratingToGoogle}% of submissions
            </p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-700">Private Feedback</p>
              <p className="text-sm font-bold text-gray-900">
                {ratingsSubmitted - googleClicks}
              </p>
            </div>
            <div
              className="h-10 bg-blue-500 rounded-lg transition-all"
              style={{
                width:
                  ratingsSubmitted > 0
                    ? `${((ratingsSubmitted - googleClicks) / ratingsSubmitted) * 100}%`
                    : "0%",
              }}
            ></div>
            <p className="text-xs text-gray-500 mt-2">
              {100 - ratingToGoogle}% of submissions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Breakdown Component
function CategoryBreakdown({ feedback }) {
  const categoryMap = {
    Food: 0,
    Service: 0,
    "Wait Time": 0,
    Cleanliness: 0,
    Other: 0,
  };

  feedback.forEach((item) => {
    if (item.categories && Array.isArray(item.categories)) {
      item.categories.forEach((cat) => {
        if (categoryMap.hasOwnProperty(cat)) {
          categoryMap[cat]++;
        }
      });
    }
  });

  const total = Object.values(categoryMap).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const categories = [
    { key: "Food", icon: "🍽️" },
    { key: "Service", icon: "🤝" },
    { key: "Wait Time", icon: "⏱️" },
    { key: "Cleanliness", icon: "✨" },
    { key: "Other", icon: "💭" },
  ];

  const colors = {
    Food: "bg-orange-500",
    Service: "bg-blue-500",
    "Wait Time": "bg-purple-500",
    Cleanliness: "bg-pink-500",
    Other: "bg-gray-500",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Feedback Categories
      </h3>
      <div className="space-y-4">
        {categories.map((cat) => {
          const count = categoryMap[cat.key];
          const percent = Math.round((count / total) * 100) || 0;
          return (
            <div key={cat.key}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {cat.key}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {count} ({percent}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`${colors[cat.key]} h-full rounded-full transition-all`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Rating Distribution Component
function RatingDistribution({ feedback }) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedback.forEach((item) => {
    if (item.rating >= 1 && item.rating <= 5) {
      distribution[item.rating]++;
    }
  });

  const total = feedback.length || 1;
  const avgRating =
    feedback.reduce((sum, item) => sum + (item.rating || 0), 0) / total || 0;

  const colors = {
    5: "bg-green-500",
    4: "bg-green-400",
    3: "bg-amber-500",
    2: "bg-red-400",
    1: "bg-red-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">
            {avgRating.toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">Average rating</p>
        </div>
      </div>
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating];
          const percent = Math.round((count / total) * 100) || 0;
          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="w-6 text-right text-sm font-medium text-gray-600">
                {rating}
              </span>
              <span className="text-lg">{"⭐".repeat(rating)}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`${colors[rating]} h-full rounded-full transition-all`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span className="w-12 text-right text-sm font-medium text-gray-900">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Recent Activity Feed Component
function RecentActivityFeed({ feedback }) {
  const [filter, setFilter] = useState("all");

  const getStarColor = (rating) => {
    if (rating >= 4) return "text-green-600";
    if (rating === 3) return "text-amber-600";
    return "text-red-600";
  };

  const getInitial = (name) => {
    return (name || "A").charAt(0).toUpperCase();
  };

  const filtered =
    filter === "all"
      ? feedback
      : filter === "positive"
        ? feedback.filter((f) => f.rating >= 4)
        : filter === "needs-attention"
          ? feedback.filter((f) => f.rating < 3)
          : filter === "google"
            ? feedback.filter((f) => f.was_redirected)
            : feedback;

  if (feedback.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No feedback yet
        </h3>
        <p className="text-sm text-gray-600">
          Reviews will appear here as customers submit them
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "all", label: "All" },
          { id: "positive", label: "Positive" },
          { id: "needs-attention", label: "Needs Attention" },
          { id: "google", label: "Google Reviews" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-1 ${
              filter === tab.id
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-brand-600">
                    {getInitial(item.customer_name)}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-medium text-gray-900 truncate">
                    {item.customer_name || "Anonymous"}
                  </p>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm ${getStarColor(item.rating)}`}>
                    {"⭐".repeat(item.rating)}
                  </span>
                  {item.was_redirected && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Google
                    </span>
                  )}
                  {!item.was_redirected && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Feedback
                    </span>
                  )}
                </div>
                {item.comment && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.comment}
                  </p>
                )}
                {item.categories && item.categories.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {item.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {cat}
                      </span>
                    ))}
                    {item.categories.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{item.categories.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 8 && (
        <button className="w-full mt-4 px-4 py-2 text-brand-600 font-medium hover:text-brand-700 transition-colors">
          View all ({filtered.length})
        </button>
      )}
    </div>
  );
}

// Rewards Panel Component
function RewardsPanel({ restaurant }) {
  const [rewards, setRewards] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, redeemed: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchRewards();
  }, [restaurant.id]);

  const fetchRewards = async () => {
    try {
      const res = await fetch(`/api/reward?restaurant_id=${restaurant.id}`);
      const data = await res.json();
      if (data.rewards) {
        setRewards(data.rewards);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (code) => {
    setUpdating(code);
    try {
      const res = await fetch("/api/reward", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, status: "redeemed" }),
      });
      if (res.ok) {
        fetchRewards();
      }
    } catch (err) {
      console.error("Failed to redeem:", err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all" ? rewards : rewards.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Total Issued</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
          <p className="text-3xl font-bold text-amber-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Redeemed</p>
          <p className="text-3xl font-bold text-green-600">{stats.redeemed}</p>
        </div>
      </div>

      {/* Reward Codes Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Reward Codes</h3>
          <div className="flex gap-2">
            {["all", "active", "redeemed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === f
                    ? "bg-brand-100 text-brand-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🎁</div>
            <p className="text-gray-600">No reward codes yet</p>
            <p className="text-sm text-gray-500 mt-1">Codes are generated when customers leave reviews</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium text-gray-600 py-3 px-2">Code</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3 px-2">Reward</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3 px-2">Status</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3 px-2">Issued</th>
                  <th className="text-left text-sm font-medium text-gray-600 py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((reward) => (
                  <tr key={reward.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <span className="font-mono font-bold text-gray-900">{reward.code}</span>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">{reward.reward_text}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          reward.status === "active"
                            ? "bg-amber-100 text-amber-700"
                            : reward.status === "redeemed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {reward.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-500">
                      {new Date(reward.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      {reward.status === "active" && (
                        <button
                          onClick={() => handleRedeem(reward.code)}
                          disabled={updating === reward.code}
                          className="px-3 py-1.5 text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {updating === reward.code ? "..." : "Mark Redeemed"}
                        </button>
                      )}
                      {reward.status === "redeemed" && (
                        <span className="text-xs text-gray-500">
                          {reward.redeemed_at
                            ? new Date(reward.redeemed_at).toLocaleDateString()
                            : "Redeemed"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Reviews Panel Component (AI Response Generator)
function ReviewsPanel({ restaurant, feedback }) {
  const [generating, setGenerating] = useState(null);
  const [responses, setResponses] = useState({});
  const [copied, setCopied] = useState(null);
  const [filter, setFilter] = useState("all");

  // Initialize responses from existing feedback data
  useEffect(() => {
    const existing = {};
    feedback.forEach((f) => {
      if (f.ai_response) {
        existing[f.id] = f.ai_response;
      }
    });
    setResponses(existing);
  }, [feedback]);

  const handleGenerate = async (feedbackItem) => {
    setGenerating(feedbackItem.id);
    try {
      const res = await fetch("/api/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback_id: feedbackItem.id,
          restaurant_id: restaurant.id,
        }),
      });
      const data = await res.json();
      if (data.response) {
        setResponses((prev) => ({ ...prev, [feedbackItem.id]: data.response }));
      } else {
        alert(data.error || "Failed to generate response");
      }
    } catch (err) {
      console.error("AI response failed:", err);
      alert("Failed to generate response. Please try again.");
    } finally {
      setGenerating(null);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStarColor = (rating) => {
    if (rating >= 4) return "text-green-600 bg-green-50";
    if (rating === 3) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const filtered =
    filter === "all"
      ? feedback
      : filter === "responded"
      ? feedback.filter((f) => responses[f.id])
      : filter === "unresponded"
      ? feedback.filter((f) => !responses[f.id] && f.comment)
      : filter === "low"
      ? feedback.filter((f) => f.rating <= 2)
      : feedback;

  if (feedback.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
        <div className="text-4xl mb-3">💬</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-sm text-gray-600">Reviews will appear here as customers submit them</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-2 flex-wrap">
        {[
          { id: "all", label: "All Reviews" },
          { id: "unresponded", label: "Needs Response" },
          { id: "responded", label: "Responded" },
          { id: "low", label: "Low Ratings" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === f.id
                ? "bg-brand-100 text-brand-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {filtered.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-sm font-bold text-brand-600">
                  {(item.customer_name || "A").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.customer_name || "Anonymous"}</p>
                <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStarColor(item.rating)}`}>
              {item.rating}/5
            </span>
          </div>

          {item.comment ? (
            <p className="text-gray-700 mb-4 leading-relaxed">{item.comment}</p>
          ) : (
            <p className="text-gray-400 italic mb-4">No written review</p>
          )}

          {item.categories && item.categories.length > 0 && (
            <div className="flex gap-1 mb-4 flex-wrap">
              {item.categories.map((cat) => (
                <span key={cat} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* AI Response Section */}
          <div className="border-t border-gray-100 pt-4 mt-4">
            {responses[item.id] ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">AI-Generated Response</span>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-3">
                  <p className="text-sm text-gray-800 leading-relaxed">{responses[item.id]}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(item.id, responses[item.id])}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      copied === item.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {copied === item.id ? "Copied!" : "Copy Response"}
                  </button>
                  <button
                    onClick={() => handleGenerate(item)}
                    disabled={generating === item.id}
                    className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {generating === item.id ? "Regenerating..." : "Regenerate"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleGenerate(item)}
                disabled={generating === item.id || !item.comment}
                className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {generating === item.id ? (
                  <><span className="animate-spin">...</span> Generating...</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 014 4c0 1.95-2 3-2 8h-4c0-5-2-6.05-2-8a4 4 0 014-4z"/><path d="M10 22h4"/><path d="M10 18h4"/></svg> Generate AI Response</>
                )}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Settings Panel Component
function SettingsPanel({ restaurant, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    name: restaurant.name || "",
    google_review_url: restaurant.google_review_url || "",
    rating_threshold: restaurant.rating_threshold || 3,
    alert_email: restaurant.alert_email || "",
    google_baseline_reviews: restaurant.google_baseline_reviews || 0,
    google_baseline_rating: restaurant.google_baseline_rating || 0,
    reward_enabled: restaurant.reward_enabled || false,
    reward_text: restaurant.reward_text || "Free drink of your choice",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name.includes("rating") || name.includes("reviews")
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Shop Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Review URL
            </label>
            <input
              type="url"
              name="google_review_url"
              value={formData.google_review_url}
              onChange={handleChange}
              placeholder="https://g.page/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating Threshold for Alerts
            </label>
            <select
              name="rating_threshold"
              value={formData.rating_threshold}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="1">1+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alert Email
            </label>
            <input
              type="email"
              name="alert_email"
              value={formData.alert_email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Reward Codes
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Give customers a reward code after they leave a review
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Reward Codes</label>
              <p className="text-xs text-gray-500">Customers get a unique code after reviewing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="reward_enabled"
                checked={formData.reward_enabled}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          {formData.reward_enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reward Description
              </label>
              <input
                type="text"
                name="reward_text"
                value={formData.reward_text}
                onChange={handleChange}
                placeholder="Free drink of your choice"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">This is shown to customers with their code</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Google Baseline
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Set your starting point to track progress on Google Reviews
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Baseline Review Count
            </label>
            <input
              type="number"
              name="google_baseline_reviews"
              value={formData.google_baseline_reviews}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Baseline Rating
            </label>
            <input
              type="number"
              name="google_baseline_rating"
              value={formData.google_baseline_rating}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get current user
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !currentUser) {
          router.push("/login");
          return;
        }
        setUser(currentUser);

        // Get restaurant data
        const { data: restaurantData, error: restError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("owner_id", currentUser.id)
          .single();

        if (restError || !restaurantData) {
          router.push("/login");
          return;
        }
        setRestaurant(restaurantData);

        // Get feedback data
        const { data: feedbackData, error: feedError } = await supabase
          .from("feedback")
          .select("*")
          .eq("restaurant_id", restaurantData.id)
          .order("created_at", { ascending: false });

        if (!feedError && feedbackData) {
          setFeedback(feedbackData);
        }

        // Get events data
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("event_type")
          .eq("restaurant_id", restaurantData.id);

        if (!eventsError && eventsData) {
          setEvents(eventsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSaveSettings = async (formData) => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("restaurants")
        .update(formData)
        .eq("id", restaurant.id);

      if (error) throw error;

      setRestaurant((prev) => ({ ...prev, ...formData }));
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!user || !restaurant) {
    return null;
  }

  const thisWeekFeedback = feedback.filter((f) => {
    const feedbackDate = new Date(f.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return feedbackDate >= weekAgo;
  });

  const thisWeekEvents = events.filter((e) => {
    const eventDate = new Date(e.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return eventDate >= weekAgo;
  });

  const lastWeekFeedback = feedback.filter((f) => {
    const feedbackDate = new Date(f.created_at);
    const twoWeeksAgo = new Date();
    const weekAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return feedbackDate >= twoWeeksAgo && feedbackDate < weekAgo;
  });

  const reviewChange =
    lastWeekFeedback.length > 0
      ? Math.round(
          ((thisWeekFeedback.length - lastWeekFeedback.length) /
            lastWeekFeedback.length) *
            100
        )
      : thisWeekFeedback.length > 0
        ? 100
        : 0;

  const avgRating =
    feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / (feedback.length || 1) ||
    0;

  const googleRedirects = feedback.filter((f) => f.was_redirected).length;
  const redirectPercent =
    feedback.length > 0 ? Math.round((googleRedirects / feedback.length) * 100) : 0;

  const formOpens = events.filter((e) => e.event_type === "form_opened").length;
  const ratingsSubmitted = events.filter(
    (e) => e.event_type === "rating_submitted"
  ).length;
  const responseRate =
    formOpens > 0 ? Math.round((ratingsSubmitted / formOpens) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">GetFives</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {restaurant.name}
            </span>

            <a href="/sms" className="px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
              📱 SMS
            </a>
            <a href="/notifications" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-xl">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </a>
            <a href="/billing" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Billing
            </a>

            <div className="border-l border-gray-200 h-6"></div>

            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-8 border-t border-gray-200">
          {[
            { id: "overview", label: "Overview" },
            { id: "rewards", label: "Rewards" },
            { id: "reviews", label: "Reviews" },
            { id: "analytics", label: "Analytics" },
            { id: "settings", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {saveMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
            {saveMessage}
          </div>
        )}

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <StatCard
                label="Total Reviews"
                value={feedback.length}
                change={reviewChange}
                trend={reviewChange >= 0 ? "up" : "down"}
                icon="📝"
              />
              <StatCard
                label="Average Rating"
                value={avgRating.toFixed(1)}
                icon="⭐"
              />
              <StatCard
                label="Google Redirects"
                value={`${googleRedirects}`}
                change={redirectPercent}
                trend="up"
                icon="🔗"
              />
              <StatCard
                label="Response Rate"
                value={`${responseRate}%`}
                icon="📊"
              />
              <StatCard
                label="This Week"
                value={thisWeekFeedback.length}
                icon="📈"
              />
            </div>

            {/* QR Code Section */}
            <QRCodeCard restaurant={restaurant} />

            {/* Google Progress Tracker */}
            {restaurant.google_baseline_reviews && (
              <GoogleProgressTracker restaurant={restaurant} feedback={feedback} />
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <ReviewFunnel events={events} />
                {feedback.length > 0 && (
                  <RatingDistribution feedback={feedback} />
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {feedback.length > 0 && (
                  <CategoryBreakdown feedback={feedback} />
                )}
              </div>
            </div>

            {/* Recent Activity Feed */}
            <RecentActivityFeed feedback={feedback} />
          </div>
        )}

        {activeTab === "rewards" && (
          <RewardsPanel restaurant={restaurant} />
        )}

        {activeTab === "reviews" && (
          <ReviewsPanel restaurant={restaurant} feedback={feedback} />
        )}

        {activeTab === "analytics" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-600">Analytics coming soon</p>
          </div>
        )}

        {activeTab === "settings" && (
          <SettingsPanel
            restaurant={restaurant}
            onSave={handleSaveSettings}
            isSaving={isSaving}
          />
        )}
      </main>
    </div>
  );
}
