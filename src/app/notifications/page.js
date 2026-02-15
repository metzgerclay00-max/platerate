'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readAlerts, setReadAlerts] = useState(new Set());

  // Alert settings state
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [alertEmail, setAlertEmail] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState('1-2');
  const [notificationFrequency, setNotificationFrequency] = useState('instant');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState('');

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
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (restaurantError) throw restaurantError;
        setRestaurant(restaurantData);
        setAlertEmail(user.email || '');
        setTempEmail(user.email || '');

        // Fetch low ratings (alerts)
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('feedback')
          .select('*')
          .eq('restaurant_id', restaurantData.id)
          .lte('rating', 2)
          .order('created_at', { ascending: false });

        if (feedbackError) throw feedbackError;
        setAlerts(feedbackData || []);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const toggleAlertRead = (alertId) => {
    const newReadAlerts = new Set(readAlerts);
    if (newReadAlerts.has(alertId)) {
      newReadAlerts.delete(alertId);
    } else {
      newReadAlerts.add(alertId);
    }
    setReadAlerts(newReadAlerts);
  };

  const handleEmailSave = () => {
    setAlertEmail(tempEmail);
    setIsEditingEmail(false);
  };

  const getStarRating = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-brand-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const calculateStats = () => {
    if (alerts.length === 0) {
      return {
        totalAlerts: 0,
        avgRating: 0,
        mostCommonCategory: 'N/A',
        responseRate: 0,
      };
    }

    const avgRating =
      (alerts.reduce((sum, alert) => sum + alert.rating, 0) / alerts.length).toFixed(1);
    const categoryCount = {};
    let mostCommon = 'N/A';
    let maxCount = 0;

    alerts.forEach((alert) => {
      if (alert.category) {
        categoryCount[alert.category] = (categoryCount[alert.category] || 0) + 1;
        if (categoryCount[alert.category] > maxCount) {
          maxCount = categoryCount[alert.category];
          mostCommon = alert.category;
        }
      }
    });

    return {
      totalAlerts: alerts.length,
      avgRating: parseFloat(avgRating),
      mostCommonCategory: mostCommon,
      responseRate: '0%', // Placeholder
    };
  };

  const stats = calculateStats();

  const getAbbreviatedComment = (comment, length = 80) => {
    if (!comment) return '';
    return comment.length > length ? comment.substring(0, length) + '...' : comment;
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      service: 'bg-red-100 text-red-700',
      food: 'bg-orange-100 text-orange-700',
      cleanliness: 'bg-red-100 text-red-700',
      ambiance: 'bg-yellow-100 text-yellow-700',
      price: 'bg-amber-100 text-amber-700',
      wait_time: 'bg-orange-100 text-orange-700',
      default: 'bg-brand-100 text-brand-700',
    };
    return colors[category] || colors.default;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-brand-600">Loading...</div>
      </div>
    );
  }

  const noAlerts = alerts.length === 0;

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Header */}
      <header className="bg-white border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-brand-600">PlateRate</div>
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
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-brand-900 mb-2">Notifications & Alerts</h1>
          <p className="text-brand-600">
            Monitor and manage low-rating alerts and notification settings
          </p>
        </div>

        {noAlerts ? (
          // Empty State - Great News
          <div className="bg-white rounded-lg border border-brand-200 p-16 text-center shadow-sm mb-12">
            <div className="mb-6">
              <svg
                className="w-20 h-20 text-brand-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-brand-900 mb-2">Great news!</h2>
            <p className="text-brand-600 text-lg mb-4">No low ratings to report</p>
            <p className="text-brand-500">
              Keep up the excellent work! Your restaurant is maintaining high-quality reviews.
            </p>
          </div>
        ) : (
          // Quick Stats
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-lg border border-brand-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">
                Total Alerts
              </h3>
              <div className="text-3xl font-bold text-brand-900">{stats.totalAlerts}</div>
              <p className="text-xs text-brand-500 mt-1">this week</p>
            </div>

            <div className="bg-white rounded-lg border border-brand-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">
                Avg Rating
              </h3>
              <div className="text-3xl font-bold text-amber-600">{stats.avgRating}</div>
              <p className="text-xs text-brand-500 mt-1">in low ratings</p>
            </div>

            <div className="bg-white rounded-lg border border-brand-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">
                Top Issue
              </h3>
              <div className="text-lg font-bold text-brand-900">
                {stats.mostCommonCategory === 'N/A'
                  ? 'N/A'
                  : stats.mostCommonCategory.replace('_', ' ')}
              </div>
              <p className="text-xs text-brand-500 mt-1">most common category</p>
            </div>

            <div className="bg-white rounded-lg border border-brand-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">
                Response Rate
              </h3>
              <div className="text-3xl font-bold text-brand-900">{stats.responseRate}</div>
              <p className="text-xs text-brand-500 mt-1">to alerts</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alert Feed */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-brand-900 mb-6">Recent Alerts</h2>

            {noAlerts ? (
              <div className="bg-white rounded-lg border border-brand-200 p-8 text-center shadow-sm">
                <svg
                  className="w-12 h-12 text-brand-200 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p className="text-brand-600 font-medium">No alerts yet</p>
                <p className="text-sm text-brand-500 mt-1">Low-rating notifications will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border-2 transition-all cursor-pointer ${
                      readAlerts.has(alert.id)
                        ? 'border-brand-200 bg-white'
                        : 'border-red-300 bg-red-50'
                    }`}
                    onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Status Indicator */}
                          <div className="mt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAlertRead(alert.id);
                              }}
                              className={`w-3 h-3 rounded-full ${
                                readAlerts.has(alert.id)
                                  ? 'bg-brand-300 hover:bg-brand-400'
                                  : 'bg-red-500 hover:bg-red-600'
                              } transition-colors`}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex gap-1">{getStarRating(alert.rating)}</div>
                              <span className="text-sm font-semibold text-brand-700">
                                {alert.rating}/5
                              </span>
                            </div>

                            {/* Name and Date */}
                            <h3 className="font-bold text-brand-900 mb-2">
                              {alert.customer_name || 'Anonymous'}
                            </h3>
                            <p className="text-sm text-brand-600 mb-3">
                              {getAbbreviatedComment(alert.comment)}
                            </p>

                            {/* Categories */}
                            {alert.category && (
                              <div className="flex flex-wrap gap-2">
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded ${getCategoryBadgeColor(alert.category)}`}
                                >
                                  {alert.category.replace('_', ' ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Date */}
                        <div className="text-right ml-4 flex-shrink-0">
                          <p className="text-sm text-brand-500">{formatDate(alert.created_at)}</p>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedAlert === alert.id && (
                        <div className="pt-6 border-t border-brand-200 mt-6">
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-brand-900 mb-2">
                              Full Comment
                            </h4>
                            <p className="text-brand-700 leading-relaxed">{alert.comment}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {alert.source && (
                              <div>
                                <p className="text-brand-600 font-semibold mb-1">Source</p>
                                <p className="text-brand-700">{alert.source}</p>
                              </div>
                            )}
                            {alert.created_at && (
                              <div>
                                <p className="text-brand-600 font-semibold mb-1">Submitted</p>
                                <p className="text-brand-700">
                                  {new Date(alert.created_at).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAlertRead(alert.id);
                            }}
                            className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-700 underline"
                          >
                            {readAlerts.has(alert.id) ? 'Mark as Unread' : 'Mark as Read'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alert Settings Sidebar */}
          <div>
            <div className="sticky top-6">
              <h2 className="text-2xl font-bold text-brand-900 mb-6">Alert Settings</h2>

              <div className="bg-white rounded-lg border border-brand-200 shadow-sm p-6 space-y-6">
                {/* Email Notifications Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-brand-900">
                      Email Notifications
                    </label>
                    <button
                      onClick={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailNotificationsEnabled ? 'bg-brand-500' : 'bg-brand-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-brand-500">
                    Get notified about new low ratings
                  </p>
                </div>

                {/* Alert Email */}
                <div>
                  <label className="text-sm font-semibold text-brand-900 block mb-3">
                    Alert Email Address
                  </label>
                  {isEditingEmail ? (
                    <div className="space-y-3">
                      <input
                        type="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-brand-300 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                        placeholder="your@email.com"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleEmailSave}
                          className="flex-1 bg-brand-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-brand-600 active:bg-brand-700 transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingEmail(false);
                            setTempEmail(alertEmail);
                          }}
                          className="flex-1 bg-brand-100 text-brand-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-brand-200 active:bg-brand-300 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-brand-50 rounded-lg">
                      <span className="text-sm text-brand-700 break-all">{alertEmail}</span>
                      <button
                        onClick={() => setIsEditingEmail(true)}
                        className="ml-2 text-brand-600 hover:text-brand-700 text-sm font-medium whitespace-nowrap"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Alert Threshold */}
                <div>
                  <label className="text-sm font-semibold text-brand-900 block mb-3">
                    Alert Threshold
                  </label>
                  <select
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-300 rounded-lg text-sm focus:outline-none focus:border-brand-500 bg-white"
                  >
                    <option value="1-2">1-2 stars (critical only)</option>
                    <option value="1-3">1-3 stars (below average)</option>
                    <option value="1-4">1-4 stars (all ratings)</option>
                  </select>
                  <p className="text-xs text-brand-500 mt-2">
                    Only alerts for ratings at or below this threshold
                  </p>
                </div>

                {/* Notification Frequency */}
                <div>
                  <label className="text-sm font-semibold text-brand-900 block mb-3">
                    Notification Frequency
                  </label>
                  <select
                    value={notificationFrequency}
                    onChange={(e) => setNotificationFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-300 rounded-lg text-sm focus:outline-none focus:border-brand-500 bg-white"
                  >
                    <option value="instant">Instant notifications</option>
                    <option value="daily">Daily digest (9:00 AM)</option>
                    <option value="weekly">Weekly summary</option>
                  </select>
                  <p className="text-xs text-brand-500 mt-2">
                    How often you receive alert notifications
                  </p>
                </div>

                {/* Save Settings Button */}
                <button className="w-full bg-brand-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-brand-600 active:bg-brand-700 transition-all">
                  Save Settings
                </button>

                {/* Divider */}
                <div className="border-t border-brand-200 pt-6">
                  <a
                    href="mailto:support@platerate.com"
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium underline block text-center"
                  >
                    Need help? Contact support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
