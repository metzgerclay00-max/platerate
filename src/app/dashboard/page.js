"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function StatCard({ label, value, sub, color = "text-brand-900" }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 min-w-[140px]">
      <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-gray-400 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function RatingBar({ stars, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const color =
    stars >= 4
      ? "bg-brand-500"
      : stars === 3
      ? "bg-amber-400"
      : "bg-red-400";
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-xs text-gray-500 w-3 text-right">{stars}</span>
      <svg
        width={12}
        height={12}
        viewBox="0 0 24 24"
        fill="#f59e0b"
        stroke="none"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-8">{pct}%</span>
    </div>
  );
}

function CategoryBadge({ category }) {
  const colors = {
    Food: "bg-orange-100 text-orange-700",
    Service: "bg-blue-100 text-blue-700",
    "Wait Time": "bg-purple-100 text-purple-700",
    Cleanliness: "bg-green-100 text-green-700",
    Other: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
        colors[category] || colors.Other
      }`}
    >
      {category}
    </span>
  );
}

function CategoryBar({ category, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const colorMap = {
    Food: "bg-orange-400",
    Service: "bg-blue-400",
    "Wait Time": "bg-purple-400",
    Cleanliness: "bg-green-400",
    Other: "bg-gray-400",
  };
  const color = colorMap[category] || colorMap.Other;

  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-sm text-gray-600 font-medium w-24">{category}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 font-semibold w-12 text-right">
        {count}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all"); // all | negative | positive
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings state
  const [editName, setEditName] = useState("");
  const [editGoogleUrl, setEditGoogleUrl] = useState("");
  const [editThreshold, setEditThreshold] = useState(4);
  const [editAlertEmail, setEditAlertEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      const { data: rest } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_id", currentUser.id)
        .single();

      if (!rest) {
        router.push("/login");
        return;
      }

      setRestaurant(rest);
      setEditName(rest.name);
      setEditGoogleUrl(rest.google_review_url || "");
      setEditThreshold(rest.rating_threshold || 4);
      setEditAlertEmail(rest.alert_email || "");

      const { data: fb } = await supabase
        .from("feedback")
        .select("*")
        .eq("restaurant_id", rest.id)
        .order("created_at", { ascending: false });

      setFeedback(fb || []);

      // Load events for funnel tracking
      const { data: ev } = await supabase
        .from("events")
        .select("event_type")
        .eq("restaurant_id", rest.id);

      setEvents(ev || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    setSaving(true);
    const { data } = await supabase
      .from("restaurants")
      .update({
        name: editName.trim(),
        google_review_url: editGoogleUrl.trim(),
        rating_threshold: editThreshold,
        alert_email: editAlertEmail.trim(),
      })
      .eq("id", restaurant.id)
      .select()
      .single();

    if (data) setRestaurant(data);
    setSaving(false);
    setShowSettings(false);
  }

  function copyLink() {
    const link = `${window.location.origin}/r/${restaurant.slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function downloadQRCode() {
    const link = `${window.location.origin}/r/${restaurant.slug}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      link
    )}`;

    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `${restaurant.slug}-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Compute stats
  const totalFeedback = feedback.length;
  const avgRating =
    totalFeedback > 0
      ? (
          feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
        ).toFixed(1)
      : "—";
  const googleRedirects = feedback.filter((f) => f.was_redirected).length;
  const privateFeedback = feedback.filter((f) => !f.was_redirected).length;
  const ratingCounts = [0, 0, 0, 0, 0];
  feedback.forEach((f) => {
    ratingCounts[f.rating - 1]++;
  });

  // Week stats
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekFeedback = feedback.filter(
    (f) => new Date(f.created_at) > weekAgo
  );

  // Filter
  const filtered =
    tab === "all"
      ? feedback
      : tab === "negative"
      ? feedback.filter((f) => f.rating < (restaurant.rating_threshold || 4))
      : feedback.filter((f) => f.rating >= (restaurant.rating_threshold || 4));

  // Category breakdown
  const categoryCount = {};
  const categoryNames = ["Food", "Service", "Wait Time", "Cleanliness", "Other"];
  categoryNames.forEach((cat) => {
    categoryCount[cat] = 0;
  });
  feedback.forEach((f) => {
    if (f.categories && Array.isArray(f.categories)) {
      f.categories.forEach((cat) => {
        if (categoryCount.hasOwnProperty(cat)) {
          categoryCount[cat]++;
        }
      });
    }
  });
  const totalCategoryMentions = Object.values(categoryCount).reduce(
    (a, b) => a + b,
    0
  );

  // Funnel tracking
  const eventCounts = {};
  const eventTypes = [
    "form_opened",
    "rating_submitted",
    "google_clicked",
    "feedback_submitted",
  ];
  eventTypes.forEach((type) => {
    eventCounts[type] = events.filter((e) => e.event_type === type).length;
  });

  // Google baseline
  const googleImprovement = feedback.filter((f) => f.was_redirected).length;
  const baselineDate = restaurant.google_baseline_date
    ? new Date(restaurant.google_baseline_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const reviewLink = `${typeof window !== "undefined" ? window.location.origin : ""}/r/${restaurant.slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    reviewLink
  )}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-900 to-brand-800 px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-300 rounded-lg flex items-center justify-center text-lg">
              🍽️
            </div>
            <div>
              <span className="text-white font-bold text-lg">PlateRate</span>
              <span className="text-indigo-300 text-sm ml-3 hidden sm:inline">
                {restaurant.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
            >
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        {/* Settings panel */}
        {showSettings && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-brand-900 mb-4">
              Settings
            </h2>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Reviews URL
                  </label>
                  <input
                    type="url"
                    value={editGoogleUrl}
                    onChange={(e) => setEditGoogleUrl(e.target.value)}
                    placeholder="https://g.page/r/your-restaurant/review"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-brand-400"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Redirect threshold (stars and above go to Google)
                  </label>
                  <select
                    value={editThreshold}
                    onChange={(e) => setEditThreshold(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-brand-400"
                  >
                    <option value={3}>3+ stars → Google</option>
                    <option value={4}>4+ stars → Google (recommended)</option>
                    <option value={5}>5 stars only → Google</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alert Email (low ratings)
                  </label>
                  <input
                    type="email"
                    value={editAlertEmail}
                    onChange={(e) => setEditAlertEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-brand-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Review link card */}
        <div className="bg-gradient-to-r from-brand-900 to-brand-800 rounded-2xl p-6 mb-6 text-white">
          <p className="text-indigo-200 text-sm font-medium mb-2">
            Your review link — copy this and text it to customers after their
            visit
          </p>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-sm font-mono truncate">
              {reviewLink}
            </code>
            <button
              onClick={copyLink}
              className="px-5 py-3 rounded-xl bg-white text-brand-600 font-semibold text-sm hover:bg-brand-50 transition-colors whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* QR Code & Links card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-brand-900 mb-5">
            QR Code & Links
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <img
                src={qrUrl}
                alt="QR Code"
                className="w-64 h-64 border-2 border-gray-200 rounded-xl"
              />
              <button
                onClick={downloadQRCode}
                className="mt-4 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-semibold text-sm hover:bg-brand-600 transition-colors"
              >
                Download QR Code
              </button>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm text-gray-600 mb-4">
                Share this QR code with customers to let them quickly access
                your review form. Perfect for printing on receipts, menus, or
                table tents.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-500 font-medium mb-2">
                  Your Review Link
                </p>
                <code className="text-sm text-gray-700 break-all">
                  {reviewLink}
                </code>
              </div>
              <button
                onClick={copyLink}
                className="px-5 py-2.5 rounded-xl border-2 border-brand-300 bg-brand-50 text-brand-600 font-semibold text-sm hover:bg-brand-100 transition-colors"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Total Responses"
            value={totalFeedback}
            sub={`${weekFeedback.length} this week`}
          />
          <StatCard
            label="Avg Rating"
            value={avgRating}
            color="text-amber-500"
          />
          <StatCard
            label="→ Google"
            value={googleRedirects}
            sub={`${Math.round(
              totalFeedback > 0 ? (googleRedirects / totalFeedback) * 100 : 0
            )}% of total`}
            color="text-brand-500"
          />
          <StatCard
            label="Private Feedback"
            value={privateFeedback}
            color="text-amber-500"
          />
        </div>

        {/* Google Progress card (if baseline exists) */}
        {restaurant.google_baseline_reviews !== null && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-brand-900 mb-4">
              Google Progress
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Starting Point</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-brand-900">
                    {restaurant.google_baseline_reviews}
                  </span>
                  <span className="text-gray-500 text-sm">reviews</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-2xl font-bold text-amber-500">
                    {parseFloat(restaurant.google_baseline_rating || 0).toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">stars</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  as of {baselineDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Improvement via PlateRate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">
                    +{googleImprovement}
                  </span>
                  <span className="text-gray-500 text-sm">reviews redirected</span>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700 font-medium">
                    {googleImprovement > 0
                      ? `You've added ${googleImprovement} review${
                          googleImprovement !== 1 ? "s" : ""
                        } to Google!`
                      : "Start collecting positive feedback to boost your Google presence."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Funnel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-brand-900 mb-5">
            Review Funnel
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Form Opens
                </p>
                <p className="text-2xl font-bold text-brand-900">
                  {eventCounts.form_opened || 0}
                </p>
              </div>
              <div className="flex-shrink-0 text-gray-300 text-2xl">→</div>
            </div>

            {eventCounts.form_opened > 0 && (
              <div className="ml-4 pb-4 border-l-2 border-gray-200 pl-4">
                <p className="text-xs text-gray-500 mb-2">Conversion Rate</p>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden w-32">
                  <div
                    className="h-full bg-brand-400 rounded-full"
                    style={{
                      width: `${
                        eventCounts.form_opened > 0
                          ? Math.round(
                              (eventCounts.rating_submitted /
                                eventCounts.form_opened) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1 font-semibold">
                  {eventCounts.form_opened > 0
                    ? Math.round(
                        (eventCounts.rating_submitted /
                          eventCounts.form_opened) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="w-32">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Ratings Submitted
                </p>
                <p className="text-2xl font-bold text-brand-900">
                  {eventCounts.rating_submitted || 0}
                </p>
              </div>
              <div className="flex-shrink-0 text-gray-300 text-2xl">→</div>
            </div>

            {eventCounts.rating_submitted > 0 && (
              <div className="ml-4 pb-4 border-l-2 border-gray-200 pl-4">
                <p className="text-xs text-gray-500 mb-2">Split Between:</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">
                      Google ({eventCounts.google_clicked || 0})
                    </p>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden w-32">
                      <div
                        className="h-full bg-blue-400 rounded-full"
                        style={{
                          width: `${
                            eventCounts.rating_submitted > 0
                              ? Math.round(
                                  (eventCounts.google_clicked /
                                    eventCounts.rating_submitted) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {eventCounts.rating_submitted > 0
                        ? Math.round(
                            (eventCounts.google_clicked /
                              eventCounts.rating_submitted) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">
                      Private Feedback ({eventCounts.feedback_submitted || 0})
                    </p>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden w-32">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width: `${
                            eventCounts.rating_submitted > 0
                              ? Math.round(
                                  (eventCounts.feedback_submitted /
                                    eventCounts.rating_submitted) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {eventCounts.rating_submitted > 0
                        ? Math.round(
                            (eventCounts.feedback_submitted /
                              eventCounts.rating_submitted) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        {totalCategoryMentions > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-brand-900 mb-5">
              Category Breakdown
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Most common feedback topics across {totalFeedback} responses
            </p>
            <div className="space-y-2">
              {categoryNames.map((cat) => (
                <CategoryBar
                  key={cat}
                  category={cat}
                  count={categoryCount[cat] || 0}
                  total={totalCategoryMentions}
                />
              ))}
            </div>
          </div>
        )}

        {/* Rating overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-900">
              Rating Overview
            </h2>
            <span className="text-sm text-gray-400">All time</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-brand-900">{avgRating}</p>
              <div className="flex gap-0.5 justify-center my-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill={
                      i <= Math.round(parseFloat(avgRating) || 0)
                        ? "#f59e0b"
                        : "#e5e7eb"
                    }
                    stroke="none"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                {totalFeedback} ratings
              </p>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((stars) => (
                <RatingBar
                  key={stars}
                  stars={stars}
                  count={ratingCounts[stars - 1]}
                  total={totalFeedback}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feedback list */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-brand-900">
              Recent Activity
            </h2>
            <div className="flex gap-1">
              {[
                { key: "all", label: "All" },
                { key: "negative", label: "Needs Attention" },
                { key: "positive", label: "Positive" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    tab === t.key
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 font-medium">No feedback yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Share your review link with customers to start collecting
                feedback
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const date = new Date(item.created_at).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" }
              );
              const threshold = restaurant.rating_threshold || 4;
              const isPositive = item.rating >= threshold;

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${
                      isPositive
                        ? "bg-gradient-to-br from-brand-300 to-brand-500"
                        : "bg-gradient-to-br from-red-300 to-red-500"
                    }`}
                  >
                    {(item.customer_name || "A").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-brand-900 text-sm">
                        {item.customer_name || "Anonymous"}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <svg
                            key={i}
                            width={12}
                            height={12}
                            viewBox="0 0 24 24"
                            fill={i <= item.rating ? "#f59e0b" : "#e5e7eb"}
                            stroke="none"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{date}</span>
                    </div>

                    {/* Category tags */}
                    {item.categories && item.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.categories.map((cat) => (
                          <CategoryBadge key={cat} category={cat} />
                        ))}
                      </div>
                    )}

                    {item.comment ? (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        &ldquo;{item.comment}&rdquo;
                      </p>
                    ) : (
                      <p className="text-gray-400 text-xs italic">
                        Redirected to Google Reviews
                      </p>
                    )}
                  </div>
                  <div>
                    {item.was_redirected ? (
                      <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-600 text-xs font-semibold">
                        Reviewed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold">
                        Feedback
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
