"use client";

import { useEffect, useState } from "react";
import { useGenerateImageMutation, useGetImageStatusQuery } from "@/store/apiSlice";
import { useCreateEvent } from "@/hooks/useCreateEvent";

interface EventDetailsFormData {
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
}

export default function Step2_EventDetails() {
  const {
    eventDetails,
    messageType,
    imageGeneration,
    goNext,
    goPrev,
    setEventDetails,
    setMessageType,
    setImageSuccess,
    setImageError,
    setError,
    error,
  } = useCreateEvent();

  const [generateImage] = useGenerateImageMutation();
  const [jobId, setJobId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ POLLING: Poll image status every 3 seconds
  const { data: imageStatus, isLoading: isPolling } = useGetImageStatusQuery(jobId!, {
    skip: !jobId,
    pollingInterval: 3000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Watch for image completion
  useEffect(() => {
    if (!imageStatus) return;

    if (imageStatus.status === "completed") {
      setImageSuccess(imageStatus.imageUrl);
      setIsGenerating(false);
    } else if (imageStatus.status === "failed") {
      setImageError(imageStatus.error || "Image generation failed");
      setIsGenerating(false);
    }
  }, [imageStatus, setImageSuccess, setImageError]);

  // Handle form input changes
  const handleInputChange = (field: keyof EventDetailsFormData, value: string) => {
    setEventDetails({ [field]: value });
  };

  // Handle image generation
  const handleGenerateImage = async () => {
    if (!eventDetails.groomName || !eventDetails.brideName || !eventDetails.eventDate) {
      setError("Please fill required fields (Groom Name, Bride Name, Event Date)");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      const result = await generateImage({
        eventType: "wedding",
        groomName: eventDetails.groomName,
        brideName: eventDetails.brideName,
        eventDate: eventDetails.eventDate,
        eventTime: eventDetails.eventTime,
        venueName: eventDetails.venueName,
        venueAddress: eventDetails.venueAddress,
      }).unwrap();

      setJobId(result.jobId);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      setIsGenerating(false);
    }
  };

  // Handle next step
  const handleNext = () => {
    if (!eventDetails.groomName || !eventDetails.brideName || !eventDetails.eventDate) {
      setError("Please fill all required fields");
      return;
    }

    if (messageType !== "text_only" && !imageGeneration.imageUrl) {
      setError("Please generate and select an image");
      return;
    }

    goNext();
  };

  // Handle regenerate image
  const handleRegenerateImage = () => {
    setJobId(null);
    setImageSuccess("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Step 2 of 5: Event Details & Preview
        </h2>
        <p className="text-gray-600">
          Fill in your event details and optionally generate a preview image
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Groom Name *</label>
            <input
              type="text"
              value={eventDetails.groomName}
              onChange={(e) => handleInputChange("groomName", e.target.value)}
              placeholder="Enter groom's name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bride Name *</label>
            <input
              type="text"
              value={eventDetails.brideName}
              onChange={(e) => handleInputChange("brideName", e.target.value)}
              placeholder="Enter bride's name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
              <input
                type="date"
                value={eventDetails.eventDate}
                onChange={(e) => handleInputChange("eventDate", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Time</label>
              <input
                type="time"
                value={eventDetails.eventTime}
                onChange={(e) => handleInputChange("eventTime", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Name</label>
            <input
              type="text"
              value={eventDetails.venueName}
              onChange={(e) => handleInputChange("venueName", e.target.value)}
              placeholder="Enter venue name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Address</label>
            <textarea
              value={eventDetails.venueAddress}
              onChange={(e) => handleInputChange("venueAddress", e.target.value)}
              placeholder="Enter full venue address"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Message Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Message Type</label>
            <div className="space-y-2">
              {["text_only", "image_only", "image_and_text"].map((type) => (
                <label
                  key={type}
                  className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition hover:border-blue-400"
                  style={{
                    borderColor: messageType === type ? "#3b82f6" : "#e5e7eb",
                    backgroundColor: messageType === type ? "#eff6ff" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="messageType"
                    value={type}
                    checked={messageType === type}
                    onChange={(e) => setMessageType(e.target.value as any)}
                    className="w-4 h-4 text-blue-500"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    {type === "text_only" && "📝 Text Only"}
                    {type === "image_only" && "🖼️ Image Only"}
                    {type === "image_and_text" && "📋 Image + Text"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Image Preview & Generation */}
        <div>
          {/* Image Generation Section */}
          {messageType !== "text_only" && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎨 Generate Preview Image
              </h3>

              {/* Generate Button */}
              {!imageGeneration.imageUrl && (
                <button
                  onClick={handleGenerateImage}
                  disabled={isGenerating || isPolling}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 mb-4"
                >
                  {isGenerating || isPolling ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block animate-spin">⟳</span>
                      Generating Image...
                    </span>
                  ) : (
                    "Generate Preview"
                  )}
                </button>
              )}

              {/* Loading State */}
              {(isGenerating || isPolling) && (
                <div className="bg-white rounded-lg p-6 text-center mb-4">
                  <div className="mb-4 flex justify-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-600 font-medium">
                    {imageStatus?.progress
                      ? `${imageStatus.progress}% complete`
                      : "Generating your preview..."}
                  </p>
                  {imageStatus?.progress && (
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${imageStatus.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}

              {/* Image Preview */}
              {imageGeneration.imageUrl && (
                <div className="mb-4">
                  <img
                    src={imageGeneration.imageUrl}
                    alt="Event Preview"
                    className="w-full rounded-lg shadow-lg mb-3"
                  />
                  <p className="text-sm text-gray-600 text-center mb-3">✓ Preview image ready</p>
                  <button
                    onClick={handleRegenerateImage}
                    className="w-full py-2 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                  >
                    🔄 Regenerate
                  </button>
                </div>
              )}

              {/* Error State */}
              {imageGeneration.status === "failed" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700 text-sm font-medium">
                    ⚠️ {imageGeneration.error || "Generation failed"}
                  </p>
                  <button
                    onClick={handleGenerateImage}
                    className="mt-3 w-full py-2 text-red-600 font-semibold hover:bg-red-100 rounded transition"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-white bg-opacity-60 rounded-lg p-3 text-xs text-gray-600 mt-4">
                <p className="font-medium mb-1">💡 Tip:</p>
                <p>
                  AI-generated preview images help recipients visualize your event. The final
                  WhatsApp message will include the template you select.
                </p>
              </div>
            </div>
          )}

          {/* Summary Card */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">📋 Summary</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Groom:</span>{" "}
                <span className="font-medium">{eventDetails.groomName || "—"}</span>
              </p>
              <p>
                <span className="text-gray-600">Bride:</span>{" "}
                <span className="font-medium">{eventDetails.brideName || "—"}</span>
              </p>
              <p>
                <span className="text-gray-600">Date:</span>{" "}
                <span className="font-medium">
                  {eventDetails.eventDate
                    ? new Date(eventDetails.eventDate).toLocaleDateString()
                    : "—"}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Message:</span>{" "}
                <span className="font-medium">
                  {messageType === "text_only" && "Text Only"}
                  {messageType === "image_only" && "Image Only"}
                  {messageType === "image_and_text" && "Image + Text"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-12">
        <button
          onClick={goPrev}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="ml-auto px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:bg-gray-400 transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
