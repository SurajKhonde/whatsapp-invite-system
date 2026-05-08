"use client";

import { useEffect, useState } from "react";
import { useGetWhatsappEventStatusQuery } from "@/store/apiSlice";
import { useCreateEvent } from "@/hooks/useCreateEvent";

export default function Step5_Tracking() {
  const { eventId, sending, selectedGuests, goNext, updateSendingStatus, sendingCompleted } =
    useCreateEvent();

  const [isComplete, setIsComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // ✅ POLLING: Poll event status every 5 seconds
  const { data: eventStatus, isLoading } = useGetWhatsappEventStatusQuery(eventId!, {
    skip: !eventId,
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Update state when status arrives
  useEffect(() => {
    if (!eventStatus) return;

    const { summary } = eventStatus;
    updateSendingStatus({
      sentCount: summary?.sent || 0,
      deliveredCount: summary?.delivered || 0,
      readCount: summary?.read || 0,
      failedCount: summary?.failed || 0,
      pendingCount: summary?.pending || 0,
    });

    // Check if all messages processed
    const total =
      (summary?.sent || 0) +
      (summary?.delivered || 0) +
      (summary?.read || 0) +
      (summary?.failed || 0);
    if (total >= selectedGuests.length) {
      setIsComplete(true);
      sendingCompleted();
    }
  }, [eventStatus, selectedGuests.length, updateSendingStatus, sendingCompleted]);

  // Track elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate progress percentage
  const totalProcessed =
    sending.sentCount + sending.deliveredCount + sending.readCount + sending.failedCount;
  const percentage =
    selectedGuests.length > 0 ? Math.round((totalProcessed / selectedGuests.length) * 100) : 0;

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get status text
  const getStatusText = () => {
    if (isComplete) {
      return "✓ Complete! All messages processed";
    }
    if (isLoading && percentage < 100) {
      return "📤 Sending invites...";
    }
    return "📤 Sending invites...";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Step 5 of 5: Tracking</h2>
        <p className="text-gray-600">
          {isComplete
            ? "All invites have been sent! 🎉"
            : "Sending WhatsApp invites to your guests..."}
        </p>
      </div>

      {/* Main Progress Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 mb-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-indigo-50 opacity-50"></div>

        <div className="relative z-10">
          {/* Status Icon & Message */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              {isComplete ? (
                <div className="text-6xl animate-bounce">🎉</div>
              ) : (
                <div className="text-6xl animate-spin">📤</div>
              )}
            </div>
            <p className="text-xl font-semibold text-gray-900">{getStatusText()}</p>
            <p className="text-sm text-gray-600 mt-2">
              {isComplete
                ? "Your invites are on their way!"
                : `Elapsed: ${formatTime(elapsedTime)}`}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-blue-600">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Sent */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center hover:shadow-md transition">
              <p className="text-3xl font-bold text-blue-600">{sending.sentCount}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Sent</p>
              <p className="text-xs text-gray-500 mt-1">📤</p>
            </div>

            {/* Delivered */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center hover:shadow-md transition">
              <p className="text-3xl font-bold text-green-600">{sending.deliveredCount}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Delivered</p>
              <p className="text-xs text-gray-500 mt-1">✓</p>
            </div>

            {/* Read */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center hover:shadow-md transition">
              <p className="text-3xl font-bold text-purple-600">{sending.readCount}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Read</p>
              <p className="text-xs text-gray-500 mt-1">👁️</p>
            </div>

            {/* Failed */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center hover:shadow-md transition">
              <p className="text-3xl font-bold text-red-600">{sending.failedCount}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Failed</p>
              <p className="text-xs text-gray-500 mt-1">❌</p>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center hover:shadow-md transition">
              <p className="text-3xl font-bold text-gray-600">{sending.pendingCount}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Pending</p>
              <p className="text-xs text-gray-500 mt-1">⏳</p>
            </div>
          </div>

          {/* Detailed Stats Row */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-semibold">{totalProcessed}</span> of{" "}
              <span className="font-semibold">{selectedGuests.length}</span> messages processed
            </p>
            <div className="flex gap-3 flex-wrap">
              <div className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                📤 {sending.sentCount} sent
              </div>
              <div className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
                ✓ {sending.deliveredCount} delivered
              </div>
              <div className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                👁️ {sending.readCount} read
              </div>
              {sending.failedCount > 0 && (
                <div className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">
                  ❌ {sending.failedCount} failed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      {!isComplete && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* What's Happening */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 What's Happening?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span>1.</span>
                <span>WhatsApp messages are being queued</span>
              </li>
              <li className="flex gap-2">
                <span>2.</span>
                <span>Messages are sent to each guest</span>
              </li>
              <li className="flex gap-2">
                <span>3.</span>
                <span>Real-time status updates below</span>
              </li>
              <li className="flex gap-2">
                <span>4.</span>
                <span>Track delivery & read status</span>
              </li>
            </ul>
          </div>

          {/* Expected Timeframe */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">⏱️ Expected Timeframe</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Sent:</strong> Immediately (within seconds)
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Delivered:</strong> Few seconds to minutes
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Read:</strong> When guest opens message
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  <strong>Failed:</strong> Invalid numbers shown here
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isComplete && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Summary */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">✓ Summary</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Total Guests:</span> {selectedGuests.length}
              </p>
              <p>
                <span className="font-semibold">Successfully Sent:</span>{" "}
                {sending.sentCount + sending.deliveredCount + sending.readCount}
              </p>
              {sending.failedCount > 0 && (
                <p>
                  <span className="font-semibold">Failed:</span> {sending.failedCount}
                </p>
              )}
              <p>
                <span className="font-semibold">Total Time:</span> {formatTime(elapsedTime)}
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🚀 Next Steps</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span>1.</span>
                <span>Guests will receive WhatsApp message</span>
              </li>
              <li className="flex gap-2">
                <span>2.</span>
                <span>Message includes event details</span>
              </li>
              <li className="flex gap-2">
                <span>3.</span>
                <span>You'll see read status updates</span>
              </li>
              <li className="flex gap-2">
                <span>4.</span>
                <span>Check your events page anytime</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Live Updates Status */}
      <div className="text-center mb-8">
        {isLoading && !isComplete && (
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            🔄 Updating live... {elapsedTime}s elapsed
          </div>
        )}
        {isComplete && (
          <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            ✓ All updates complete
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 justify-center mb-6">
        {isComplete && (
          <>
            <button
              onClick={() => (window.location.href = "/events")}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition"
            >
              ← View Events
            </button>
            <button
              onClick={goNext}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Create Another Event →
            </button>
          </>
        )}
        {!isComplete && (
          <div className="text-center text-gray-600">
            <p className="text-sm">Please wait while messages are being sent...</p>
            <p className="text-xs text-gray-500 mt-2">Do not close this page</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 pb-4">
        <p>💡 Updates every 5 seconds. Your event ID: {eventId?.substring(0, 8)}...</p>
      </div>
    </div>
  );
}
