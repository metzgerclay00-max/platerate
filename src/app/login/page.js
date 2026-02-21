"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Step 1: Authentication
function AuthStep({ onSuccess, onSignupSent }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      onSuccess(data.user);
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      onSignupSent(email);
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

      if (resetError) throw resetError;

      setResetSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (forgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto">
        <button
          onClick={() => {
            setForgotPassword(false);
            setResetSent(false);
            setError("");
          }}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium mb-6"
        >
          â Back to login
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset password</h2>
        <p className="text-gray-600 text-sm mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {resetSent ? (
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 text-center">
            <p className="text-gray-900 font-medium">Check your email</p>
            <p className="text-gray-600 text-sm mt-2">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbusiness.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isSignUp ? "Create account" : "Welcome back"}
        </h1>
        <p className="text-gray-600">
          {isSignUp
            ? "Get started with GetFives and boost your reviews"
            : "Log in to manage your reviews"}
        </p>
      </div>

      <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!isSignUp && (
          <button
            type="button"
            onClick={() => setForgotPassword(true)}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            Forgot password?
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Loading..." : isSignUp ? "Create account" : "Log in"}
        </button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={async () => {
          setError("");
          setLoading(true);
          try {
            const { error: oauthError } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: window.location.origin + "/login",
              },
            });
            if (oauthError) throw oauthError;
          } catch (err) {
            setError(err.message || "Google sign-in failed");
            setLoading(false);
          }
        }}
        className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-gray-600 text-sm mt-6">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
          }}
          className="text-brand-600 hover:text-brand-700 font-medium ml-1"
        >
          {isSignUp ? "Log in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}

// Step 2: Restaurant Profile
function RestaurantStep({ userEmail, onComplete }) {
  const [restaurantName, setRestaurantName] = useState("");
  const [slug, setSlug] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [restaurantType, setRestaurantType] = useState("Casual Dining");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setRestaurantName(name);
    setSlug(generateSlug(name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!restaurantName.trim()) {
        throw new Error("Coffee shop name is required");
      }

      if (!slug.trim()) {
        throw new Error("Shop URL slug is required");
      }

      onComplete({
        restaurantName: restaurantName.trim(),
        slug: slug.trim(),
        googleUrl,
        phoneNumber,
        restaurantType,
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Your coffee shop</h2>
      <p className="text-gray-600 mb-8">
        Tell us about your shop so we can set up your review tracking.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Coffee Shop Name *
          </label>
          <input
            type="text"
            value={restaurantName}
            onChange={handleNameChange}
            placeholder="e.g., Daily Grind Coffee"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Your GetFives URL
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 text-sm">getfives.ai/r/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="your-coffee-shop"
              className="w-full px-4 py-3 pl-40 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono text-sm"
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            This is your public review page URL. You can customize it.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Shop Type *
          </label>
          <select
            value={restaurantType}
            onChange={(e) => setRestaurantType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option>Coffee Shop</option>
            <option>CafÃ©</option>
            <option>Espresso Bar</option>
            <option>Coffee & Bakery</option>
            <option>Drive-Thru Coffee</option>
            <option>Roastery / Coffee Bar</option>
            <option>Tea & Coffee House</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Google Reviews URL (Optional)
          </label>
          <input
            type="url"
            value={googleUrl}
            onChange={(e) => setGoogleUrl(e.target.value)}
            placeholder="https://www.google.com/maps/place/..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
          />
          <p className="text-gray-500 text-xs mt-2">
            Find this by searching your coffee shop on Google Maps, then copy the URL.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Setting up your shop..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

// Step 3: Google Baseline
function BaselineStep({ onComplete, onSkip }) {
  const [reviews, setReviews] = useState("");
  const [rating, setRating] = useState("4.5");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      onComplete({
        googleBaselineReviews: reviews ? parseInt(reviews) : null,
        googleBaselineRating: rating ? parseFloat(rating) : null,
      });
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Capture your baseline</h2>
      <p className="text-gray-600 mb-8">
        Let's save your current Google reviews stats so we can track your improvement over time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-6">
          <div className="text-4xl font-bold text-brand-600 mb-2">ð</div>
          <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
          <p className="text-gray-600 text-sm">
            See how your coffee shop's Google rating improves each week with GetFives's dashboard.
          </p>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-lg p-6">
          <div className="text-4xl font-bold text-brand-600 mb-2">ð¯</div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Routing</h3>
          <p className="text-gray-600 text-sm">
            Route only satisfied customers to Google to improve your rating consistently.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Current Google Reviews
            </label>
            <input
              type="number"
              value={reviews}
              onChange={(e) => setReviews(e.target.value)}
              placeholder="e.g., 247"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Current Google Rating
            </label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="e.g., 4.5"
              step="0.1"
              min="0"
              max="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <p className="text-gray-500 text-xs mt-2">Out of 5.0 stars</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : "Save baseline"}
        </button>
      </form>

      <button
        onClick={onSkip}
        className="w-full text-gray-600 hover:text-gray-900 py-3 rounded-lg font-medium transition-colors"
      >
        Skip for now
      </button>
    </div>
  );
}

// Step 4: Customize Review Flow
function CustomizeStep({ userEmail, onComplete }) {
  const [threshold, setThreshold] = useState(4);
  const [alertEmail, setAlertEmail] = useState(userEmail);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Thank you for dining with us! Your feedback helps us improve."
  );
  const [loading, setLoading] = useState(false);

  const thresholds = [
    {
      value: 3,
      label: "3+ stars",
      color: "bg-amber-400",
      description: "Send all reviews 3 stars and above to Google",
    },
    {
      value: 4,
      label: "4+ stars",
      color: "bg-green-500",
      description: "Send reviews 4 stars and above to Google",
    },
    {
      value: 5,
      label: "5+ stars",
      color: "bg-emerald-600",
      description: "Send only perfect 5-star reviews to Google",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      onComplete({
        ratingThreshold: threshold,
        alertEmail: alertEmail.trim(),
        welcomeMessage: welcomeMessage.trim(),
      });
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Customize your flow</h2>
      <p className="text-gray-600 mb-8">
        Configure how GetFives routes customer feedback to optimize your Google rating.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Rating Threshold
          </label>
          <div className="space-y-3">
            {thresholds.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setThreshold(t.value)}
                className={`w-full border-2 rounded-lg p-4 text-left transition-all ${
                  threshold === t.value
                    ? "border-brand-600 bg-brand-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full mt-0.5 flex-shrink-0 ${t.color}`}
                  />
                  <div className="flex-grow">
                    <div className="font-medium text-gray-900">{t.label}</div>
                    <div className="text-gray-600 text-sm">{t.description}</div>
                  </div>
                  {threshold === t.value && (
                    <div className="text-brand-600 font-medium">â</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Alert Email
          </label>
          <input
            type="email"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            required
          />
          <p className="text-gray-500 text-xs mt-2">
            We'll send you alerts when you get new reviews
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Welcome Message (Optional)
          </label>
          <textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="What would you like customers to see when they access your review page?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            rows="4"
          />
          <p className="text-gray-500 text-xs mt-2">
            This message appears at the top of your review page
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Setting up..." : "Continue to QR code"}
        </button>
      </form>
    </div>
  );
}

// Step 5: Success / QR Code
function SuccessStep({ restaurant, onDashboard }) {
  const canvasRef = useRef(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    // Simplified QR code generation - in production, use a library like qrcode.react
    // For now, we'll create a placeholder with gradient
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Draw a simple gradient as placeholder
      canvas.width = 256;
      canvas.height = 256;

      const gradient = ctx.createLinearGradient(0, 0, 256, 256);
      gradient.addColorStop(0, "#6366f1");
      gradient.addColorStop(1, "#8b5cf6");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);

      // Add QR pattern grid
      ctx.fillStyle = "white";
      const blockSize = 16;
      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
          }
        }
      }

      // Add center circle
      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.arc(128, 128, 48, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("QR", 128, 128);

      setQrGenerated(true);
    }
  }, []);

  const reviewUrl = `https://getfives.ai/r/${restaurant.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reviewUrl);
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.href = canvasRef.current.toDataURL();
      link.download = `${restaurant.slug}-qr.png`;
      link.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">ð</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">You're all set!</h2>
        <p className="text-gray-600">
          Your coffee shop is ready to collect better reviews
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="border border-gray-200 rounded-lg p-8 flex flex-col items-center">
          <p className="text-sm font-medium text-gray-600 mb-4 uppercase tracking-wide">
            Your QR Code
          </p>
          <canvas
            ref={canvasRef}
            className="w-32 h-32 md:w-40 md:h-40 border border-gray-200 rounded-lg mb-6"
          />
          <button
            onClick={handleDownload}
            className="text-brand-600 hover:text-brand-700 font-medium text-sm"
          >
            Download QR
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-8">
          <p className="text-sm font-medium text-gray-600 mb-4 uppercase tracking-wide">
            Review Link
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-900 font-mono break-all">{reviewUrl}</p>
          </div>
          <button
            onClick={handleCopy}
            className="w-full bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors text-sm"
          >
            Copy link
          </button>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Tips</h3>
        <ul className="space-y-3 text-gray-700 text-sm">
          <li className="flex gap-3">
            <span className="text-brand-600 font-bold">â¢</span>
            <span>Print your QR code and display it on receipts, tables, and at checkout</span>
          </li>
          <li className="flex gap-3">
            <span className="text-brand-600 font-bold">â¢</span>
            <span>Share the review link in follow-up emails and text messages</span>
          </li>
          <li className="flex gap-3">
            <span className="text-brand-600 font-bold">â¢</span>
            <span>Monitor incoming feedback from your dashboard in real-time</span>
          </li>
          <li className="flex gap-3">
            <span className="text-brand-600 font-bold">â¢</span>
            <span>Respond to feedback and watch your Google rating improve</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onDashboard}
        className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors text-lg"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

// Email Verification Screen
function EmailVerificationScreen({ email }) {
  return (
    <div className="w-full max-w-md mx-auto text-center py-12">
      <div className="text-6xl mb-6">âï¸</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h2>
      <p className="text-gray-600 mb-6">
        We've sent a verification link to <strong>{email}</strong>. Click the link to confirm
        your account and complete your setup.
      </p>
      <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 text-sm text-gray-700 mb-8">
        Don't see the email? Check your spam folder or try signing up again.
      </div>
      <a
        href="/login"
        className="text-brand-600 hover:text-brand-700 font-medium"
      >
        â Back to login
      </a>
    </div>
  );
}

// Main Login Component
export default function LoginPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [baselineData, setBaselineData] = useState(null);
  const [customizeData, setCustomizeData] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check for existing session on page load (handles OAuth redirect)
  useEffect(() => {
    async function checkSession() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        // User is logged in â check if they have a restaurant
        const { data: restaurants } = await supabase
          .from("restaurants")
          .select("id")
          .eq("owner_id", currentUser.id)
          .limit(1);

        if (restaurants && restaurants.length > 0) {
          router.push("/dashboard");
          return;
        } else {
          setUser(currentUser);
          setUserEmail(currentUser.email);
          setCurrentStep(2);
        }
      }
      setCheckingSession(false);
    }
    checkSession();
  }, [router]);

  const handleAuthSuccess = async (userData) => {
    setUser(userData);
    setUserEmail(userData.email);

    // Check if user already has a restaurant
    const { data: restaurants } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", userData.id)
      .limit(1);

    if (restaurants && restaurants.length > 0) {
      router.push("/dashboard");
    } else {
      setCurrentStep(2);
    }
  };

  const handleSignupSent = (email) => {
    setSignupEmail(email);
    setCurrentStep("email-verification");
  };

  const handleRestaurantComplete = (data) => {
    setRestaurantData(data);
    setCurrentStep(3);
  };

  const handleBaselineComplete = (data) => {
    setBaselineData(data);
    setCurrentStep(4);
  };

  const handleCustomizeComplete = (data) => {
    setCustomizeData(data);
    createRestaurant(data);
  };

  const handleBaselineSkip = () => {
    setCurrentStep(4);
  };

  const createRestaurant = async (customizeData) => {
    setCurrentStep("loading");

    try {
      const { error } = await supabase.from("restaurants").insert([
        {
          owner_id: user.id,
          name: restaurantData.restaurantName,
          slug: restaurantData.slug,
          google_review_url: restaurantData.googleUrl || null,
          rating_threshold: customizeData.ratingThreshold,
          alert_email: customizeData.alertEmail,
          google_baseline_reviews: baselineData?.googleBaselineReviews || null,
          google_baseline_rating: baselineData?.googleBaselineRating || null,
          google_baseline_date:
            baselineData?.googleBaselineReviews || baselineData?.googleBaselineRating
              ? new Date().toISOString()
              : null,
        },
      ]);

      if (error) throw error;

      setCurrentStep("success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error creating restaurant:", error);
      setCurrentStep(4);
    }
  };

  const steps = [
    { number: 1, label: "Account" },
    { number: 2, label: "Your Shop" },
    { number: 3, label: "Baseline" },
    { number: 4, label: "Customize" },
    { number: 5, label: "Launch" },
  ];

  // Show loading while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render email verification screen
  if (currentStep === "email-verification") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
        <EmailVerificationScreen email={signupEmail} />
      </div>
    );
  }

  // Render success/loading screen
  if (currentStep === "success" || currentStep === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
        {currentStep === "loading" ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4" />
            <p className="text-gray-600">Setting up your coffee shop...</p>
          </div>
        ) : (
          <SuccessStep
            restaurant={restaurantData}
            onDashboard={() => router.push("/dashboard")}
          />
        )}
      </div>
    );
  }

  // Step 1: Split screen layout with brand panel
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-white flex">
        {/* Left side - Brand Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 to-brand-800 text-white flex-col justify-between p-12">
          <div>
            <div className="text-3xl font-bold mb-2">GetFives</div>
            <p className="text-brand-100">Review Management Platform</p>
          </div>

          <div className="max-w-sm">
            <h3 className="text-2xl font-bold mb-4">Grow your online reputation</h3>
            <ul className="space-y-4 text-brand-50">
              <li className="flex gap-3">
                <span className="text-2xl flex-shrink-0">â</span>
                <span>Route satisfied customers to Google</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl flex-shrink-0">â</span>
                <span>Track review improvements weekly</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl flex-shrink-0">â</span>
                <span>Respond to feedback in one place</span>
              </li>
            </ul>
          </div>

          <div className="text-brand-100 text-sm">
            Join 500+ coffee shops using GetFives
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 lg:p-12">
          <div className="max-w-md mx-auto w-full">
            <AuthStep
              onSuccess={handleAuthSuccess}
              onSignupSent={handleSignupSent}
            />
          </div>
        </div>
      </div>
    );
  }

  // Steps 2-4: Centered card layout with progress bar
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex flex-col">
      {/* Progress Bar */}
      <div className="pt-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    step.number < currentStep
                      ? "bg-green-500 text-white"
                      : step.number === currentStep
                        ? "bg-brand-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.number < currentStep ? "â" : step.number}
                </div>
                <div className="ml-2 text-xs font-medium text-gray-600 hidden sm:inline">
                  {step.label}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      step.number < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full">
          {currentStep === 2 && (
            <RestaurantStep userEmail={userEmail} onComplete={handleRestaurantComplete} />
          )}
          {currentStep === 3 && (
            <BaselineStep onComplete={handleBaselineComplete} onSkip={handleBaselineSkip} />
          )}
          {currentStep === 4 && (
            <CustomizeStep userEmail={userEmail} onComplete={handleCustomizeComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
