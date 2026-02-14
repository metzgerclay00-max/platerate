"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // login | signup | setup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Setup fields (after signup)
  const [restaurantName, setRestaurantName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [userId, setUserId] = useState(null);

  // Google baseline fields
  const [baselineReviews, setBaselineReviews] = useState("");
  const [baselineRating, setBaselineRating] = useState("");

  function generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setUserId(data.user?.id);
    setLoading(false);
    setMode("setup");
  }

  async function handleSetup(e) {
    e.preventDefault();
    if (!restaurantName.trim()) return;
    setError("");
    setLoading(true);

    const slug = generateSlug(restaurantName);

    const insertData = {
      owner_id: userId,
      name: restaurantName.trim(),
      slug,
      google_review_url: googleUrl.trim(),
      rating_threshold: 4,
      alert_email: email,
    };

    // Add Google baseline if provided
    if (baselineReviews) {
      insertData.google_baseline_reviews = parseInt(baselineReviews, 10);
      insertData.google_baseline_date = new Date().toISOString();
    }
    if (baselineRating) {
      insertData.google_baseline_rating = parseFloat(baselineRating);
      insertData.google_baseline_date = new Date().toISOString();
    }

    const { error: insertError } = await supabase.from("restaurants").insert(insertData);

    if (insertError) {
      if (insertError.message.includes("duplicate")) {
        setError(
          "That restaurant name is already taken. Try a slightly different name."
        );
      } else {
        setError(insertError.message);
      }
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  // Setup screen (after signup)
  if (mode === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl p-10 sm:p-12 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-300 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              🍽️
            </div>
            <h1 className="text-2xl font-bold text-brand-900 mb-2">
              Set up your restaurant
            </h1>
            <p className="text-gray-500 text-sm">
              A few quick things and you&apos;re live.
            </p>
          </div>

          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g., Bella Cucina"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-brand-400 transition-colors"
              />
              {restaurantName && (
                <p className="text-xs text-gray-400 mt-1">
                  Your review link: yoursite.com/r/
                  {generateSlug(restaurantName)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Reviews link
              </label>
              <input
                type="url"
                value={googleUrl}
                onChange={(e) => setGoogleUrl(e.target.value)}
                placeholder="https://g.page/r/your-restaurant/review"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-brand-400 transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">
                Find this by searching your restaurant on Google → &quot;Write a
                review&quot; → copy the URL
              </p>
            </div>

            {/* Google Baseline Section */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Current Google stats{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </p>
              <p className="text-xs text-gray-400 mb-3">
                We&apos;ll use this to show how much PlateRate improves your ratings over time.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Total reviews
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={baselineReviews}
                    onChange={(e) => setBaselineReviews(e.target.value)}
                    placeholder="e.g., 47"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-brand-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Star rating
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={baselineRating}
                    onChange={(e) => setBaselineRating(e.target.value)}
                    placeholder="e.g., 4.2"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-brand-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !restaurantName.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-base hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Setting up..." : "Launch My Review Page"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Login / Signup
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl p-10 sm:p-12 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-300 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              🍽️
            </div>
          </a>
          <h1 className="text-2xl font-bold text-brand-900 mb-2">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-gray-500 text-sm">
            {mode === "login"
              ? "Sign in to manage your reviews"
              : "Start collecting reviews in 5 minutes"}
          </p>
        </div>

        <form
          onSubmit={mode === "login" ? handleLogin : handleSignup}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@restaurant.com"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-brand-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "signup" ? "Create a password (6+ chars)" : "••••••••"
              }
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-brand-400 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-base hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                className="text-brand-500 font-semibold hover:underline"
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="text-brand-500 font-semibold hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}