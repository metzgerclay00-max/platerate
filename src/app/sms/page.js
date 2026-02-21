"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Toast Notification Component
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  }[type];

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    info: "text-blue-800",
  }[type];

  return (
    <div
      className={`fixed bottom-6 right-6 p-4 rounded-lg border ${bgColor} ${textColor} shadow-lg max-w-md`}
    >
      {message}
    </div>
  );
}

// Skeleton Loader Component
function SkeletonLoader({ rows = 5 }) {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  );
}

// Header Component
function Header({ restaurant, onSignOut }) {
  return (
    <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-brand-600">
              G5
            </div>
            <div>
              <h1 className="text-xl font-bold">GetFives</h1>
              <p className="text-sm text-brand-100">{restaurant?.name || "Coffee Shop"}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/dashboard"
              className="text-brand-50 hover:text-white transition-colors font-medium"
            >
              Dashboard
            </a>
            <a
              href="/sms"
              className="text-white transition-colors font-medium border-b-2 border-white"
            >
              SMS
            </a>
            <a
              href="/notifications"
              className="text-brand-50 hover:text-white transition-colors font-medium"
            >
              Notifications
            </a>
            <a
              href="/billing"
              className="text-brand-50 hover:text-white transition-colors font-medium"
            >
              Billing
            </a>
          </nav>

          <button
            onClick={onSignOut}
            className="px-4 py-2 bg-white text-brand-600 rounded-lg hover:bg-brand-50 transition-colors font-medium text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// Tab Navigation Component
function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "send", label: "Send SMS", icon: "📱" },
    { id: "history", label: "History", icon: "📋" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Phone Number Formatter
function formatPhoneNumber(value) {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
}

// Send SMS Tab Component
function SendSMSTab({ restaurant, smsTemplate, smsLimit, smsSent }) {
  const [mode, setMode] = useState("manual"); // manual or bulk
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkResults, setBulkResults] = useState(null);

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const fillTemplate = (phone, name = "") => {
    let message = smsTemplate || "Hello {name}, visit {business} today!";
    message = message.replace("{name}", name || "Valued Customer");
    message = message.replace("{business}", restaurant?.name || "our coffee shop");
    message = message.replace("{link}", `https://getfives.ai/r/${restaurant?.slug || ""}`);
    return message;
  };

  const handleSendManual = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.replace(/\D/g, "").length !== 10) {
      setToast({ message: "Please enter a valid phone number", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              phone: phoneNumber.replace(/\D/g, ""),
              name: customerName,
              message: fillTemplate(phoneNumber, customerName),
            },
          ],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send SMS");

      setToast({ message: "SMS sent successfully!", type: "success" });
      setPhoneNumber("");
      setCustomerName("");
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const lines = text.split(/\n/).filter((line) => line.trim());
        const data = [];

        lines.forEach((line, index) => {
          if (index === 0) return; // Skip header
          const values = line.split(/[,\t]/).map((v) => v.trim());
          if (values[0]) {
            data.push({
              phone: values[0],
              name: values[1] || "",
            });
          }
        });

        setCsvData(data);
        setBulkFile(file.name);
      } catch (error) {
        setToast({ message: "Failed to parse CSV file", type: "error" });
      }
    };
    reader.readAsText(file);
  };

  const handleBulkSend = async () => {
    if (csvData.length === 0) {
      setToast({ message: "No data to send", type: "error" });
      return;
    }

    setLoading(true);
    setShowConfirm(false);
    setBulkProgress(0);
    setBulkResults(null);

    try {
      const messages = csvData.map((row) => ({
        phone: row.phone.replace(/\D/g, ""),
        name: row.name,
        message: fillTemplate(row.phone, row.name),
      }));

      const response = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send SMS");

      setBulkResults({
        sent: data.sent || messages.length,
        failed: data.failed || 0,
      });

      setToast({ message: "Bulk SMS sent successfully!", type: "success" });
      setCsvData([]);
      setBulkFile(null);
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Mode Toggle */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => {
            setMode("manual");
            setCsvData([]);
          }}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            mode === "manual"
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Manual Send
        </button>
        <button
          onClick={() => setMode("bulk")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            mode === "bulk"
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Bulk Send
        </button>
      </div>

      {mode === "manual" ? (
        // Manual Send Form
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Send Individual SMS</h3>

          <form onSubmit={handleSendManual} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="(123) 456-7890"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                maxLength="14"
              />
              <p className="text-xs text-gray-500 mt-1">Format: (123) 456-7890</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name (Optional)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Preview
              </label>
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 text-sm text-gray-800 min-h-20 whitespace-pre-wrap">
                {fillTemplate(phoneNumber, customerName)}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Remaining: {200 - (fillTemplate(phoneNumber, customerName).length)} characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? "Sending..." : "Send SMS"}
            </button>
          </form>
        </div>
      ) : (
        // Bulk Send Form
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload CSV File</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".csv,.tsv,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer"
              >
                <div className="text-4xl mb-3">📁</div>
                <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-600 mt-1">CSV, TSV, or TXT files</p>
                <p className="text-xs text-gray-500 mt-2">
                  Required columns: phone | Optional: name
                </p>
              </label>
            </div>

            {bulkFile && (
              <p className="mt-4 text-sm text-green-600 font-medium">
                ✓ File loaded: {bulkFile} ({csvData.length} rows)
              </p>
            )}
          </div>

          {csvData.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preview ({csvData.length} messages)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        Message Preview
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{row.phone}</td>
                        <td className="px-4 py-3 text-gray-900">{row.name || "-"}</td>
                        <td className="px-4 py-3 text-gray-600 truncate max-w-xs">
                          {fillTemplate(row.phone, row.name)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {csvData.length > 10 && (
                <p className="text-xs text-gray-600 mt-3">
                  Showing 10 of {csvData.length} messages
                </p>
              )}

              <button
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className="w-full mt-6 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-400 transition-colors font-medium"
              >
                {loading ? "Sending..." : `Send ${csvData.length} Messages`}
              </button>
            </div>
          )}

          {bulkResults && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Send Results</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-green-600 font-medium">Successfully Sent</p>
                  <p className="text-3xl font-bold text-green-900">{bulkResults.sent}</p>
                </div>
                <div>
                  <p className="text-sm text-red-600 font-medium">Failed</p>
                  <p className="text-3xl font-bold text-red-900">{bulkResults.failed}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Bulk Send</h3>
            <p className="text-gray-600 mb-6">
              This will send SMS to {csvData.length} phone numbers. Continue?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSend}
                className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// History Tab Component
function HistoryTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    totalSent: 0,
    delivered: 0,
    failed: 0,
    clickRate: 0,
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/sms/history");
        const data = await response.json();
        setMessages(data.messages || []);
        setStats(data.stats || {});
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredMessages = messages.filter((msg) => {
    if (filter === "all") return true;
    return msg.status === filter;
  });

  const maskPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return `***-***-${cleaned.slice(-4)}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      sent: "bg-green-100 text-green-800",
      delivered: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
      clicked: "bg-purple-100 text-purple-800",
    };
    return styles[status] || styles.sent;
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 font-medium mb-2">Total Sent</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalSent}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 font-medium mb-2">Delivered</p>
          <p className="text-3xl font-bold text-blue-600">{stats.delivered}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 font-medium mb-2">Failed</p>
          <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 font-medium mb-2">Click Rate</p>
          <p className="text-3xl font-bold text-purple-600">{stats.clickRate}%</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        >
          <option value="all">All</option>
          <option value="sent">Sent</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Failed</option>
          <option value="clicked">Clicked</option>
        </select>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8">
            <SkeletonLoader rows={5} />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-600">No SMS messages yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">
                    Customer Name
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Phone</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Message</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-700">Sent Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {msg.customerName || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{maskPhone(msg.phone)}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                      {msg.message}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          msg.status
                        )}`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {new Date(msg.sentDate).toLocaleDateString()}
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

// Settings Tab Component
function SettingsTab({ restaurant, smsTemplate, setSmsTemplate, smsSent, smsLimit, planLimits }) {
  const [template, setTemplate] = useState(smsTemplate || "");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSaveTemplate = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/sms/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template }),
      });

      if (!response.ok) throw new Error("Failed to save template");
      setToast({ message: "Template saved successfully!", type: "success" });
      setSmsTemplate(template);
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const insertVariable = (variable) => {
    setTemplate(template + `{${variable}}`);
  };

  const progressPercent = (smsSent / smsLimit) * 100;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* SMS Template Editor */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Template</h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Message
          </label>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Hi {name}, thanks for visiting {business}! We'd love your feedback:"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            rows="4"
            maxLength="160"
          />
          <p className="text-xs text-gray-500 mt-2">
            {160 - template.length} characters remaining
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Variable Helper</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => insertVariable("name")}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-800 transition-colors"
            >
              + {"{name}"}
            </button>
            <button
              type="button"
              onClick={() => insertVariable("business")}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-800 transition-colors"
            >
              + {"{business}"}
            </button>
            <button
              type="button"
              onClick={() => insertVariable("link")}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-800 transition-colors"
            >
              + {"{link}"}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Live Preview</p>
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 text-sm text-gray-800 min-h-20">
            {template || "Your template preview will appear here..."}
          </div>
        </div>

        <button
          onClick={handleSaveTemplate}
          disabled={saving}
          className="w-full px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-400 transition-colors font-medium"
        >
          {saving ? "Saving..." : "Save Template"}
        </button>
      </div>

      {/* Twilio Configuration */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Twilio Configuration</h3>
            <p className="text-sm text-blue-800">
              Your SMS sending is powered by Twilio. To configure your phone number and manage
              credentials, please contact our support team.
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Usage */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly SMS Usage</h3>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">
              {smsSent} / {smsLimit} SMS sent this month
            </p>
            <p className="text-sm text-gray-600">{Math.round(progressPercent)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-brand-500 to-indigo-500 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
          </div>
        </div>

        {progressPercent >= 90 && (
          <p className="text-sm text-orange-600 font-medium">
            ⚠️ You're approaching your monthly limit. Consider upgrading your plan.
          </p>
        )}
      </div>

      {/* Plan Limits */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Plan Limits</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Free Plan</span>
            <span className="font-medium text-gray-900">50 SMS/month</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Growth Plan</span>
            <span className="font-medium text-gray-900">500 SMS/month</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Pro Plan</span>
            <span className="font-medium text-gray-900">2000 SMS/month</span>
          </div>
        </div>

        <a
          href="/billing"
          className="inline-block mt-6 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium text-sm"
        >
          View Plans
        </a>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// Main SMS Page Component
export default function SMSPage() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("send");
  const [smsTemplate, setSmsTemplate] = useState("");
  const [smsSent, setSmsSent] = useState(0);
  const [smsLimit, setSmsLimit] = useState(50);
  const [planLimits] = useState({
    free: 50,
    growth: 500,
    pro: 2000,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: restaurantData } = await supabase
          .from("restaurants")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!restaurantData) {
          router.push("/login");
          return;
        }

        setRestaurant(restaurantData);
        setSmsTemplate(restaurantData.sms_template || "");
        setSmsSent(restaurantData.sms_sent || 0);
        setSmsLimit(restaurantData.sms_limit || 50);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header restaurant={restaurant} onSignOut={handleSignOut} />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <SkeletonLoader rows={10} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header restaurant={restaurant} onSignOut={handleSignOut} />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "send" && (
          <SendSMSTab
            restaurant={restaurant}
            smsTemplate={smsTemplate}
            smsLimit={smsLimit}
            smsSent={smsSent}
          />
        )}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "settings" && (
          <SettingsTab
            restaurant={restaurant}
            smsTemplate={smsTemplate}
            setSmsTemplate={setSmsTemplate}
            smsSent={smsSent}
            smsLimit={smsLimit}
            planLimits={planLimits}
          />
        )}
      </main>
    </div>
  );
}
