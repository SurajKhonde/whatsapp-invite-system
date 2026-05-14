"use client";

import { useState, useEffect } from "react";
import {
  useGetTextTemplatesQuery,
  useGetImageTemplatesQuery,
  useGetTemplateCategoriesQuery,
  useGetTemplateByIdQuery,
} from "@/store/apiSlice";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "text" | "image";
  textContent?: string;
  previewImageUrl?: string;
  placeholders?: any;
}

export default function TemplatesPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth?.user);

  const [viewMode, setViewMode] = useState<"text" | "images">("text");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [templateToUse, setTemplateToUse] = useState<Template | null>(null);

  const { data: categoriesData } = useGetTemplateCategoriesQuery();
  const categories = categoriesData?.data || [];

  const { data: textData, isLoading: textLoading } = useGetTextTemplatesQuery({});
  const { data: imageData, isLoading: imageLoading } = useGetImageTemplatesQuery({});

  const { data: templateDetail } = useGetTemplateByIdQuery(
    selectedTemplate || "",
    { skip: !selectedTemplate }
  );

  const currentData = viewMode === "text" ? textData : imageData;
  const isLoading = viewMode === "text" ? textLoading : imageLoading;
  const allTemplates = currentData?.data || [];

  const templates =
    selectedCategory === "all"
      ? allTemplates
      : allTemplates.filter((t: any) => t.category === selectedCategory);

  const handleUseTemplate = (template: any) => {
    if (viewMode === "text") {
      setTemplateToUse(template);
      setSelectedImages([]);
    }
  };

  const redirectToEvents = (templateId: string, imageIds: string[]) => {
    const params = new URLSearchParams();
    params.append("templateId", templateId);
    if (imageIds.length > 0) {
      imageIds.forEach((id) => params.append("imageId", id));
    }
    router.push(`/events?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="templatesLoading">
        <div className="templatesSpinner" />
        <p>Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="templatesPage">
      {/* Background elements */}
      {[
        { w: 600, h: 600, l: "-10%", t: "-20%", c: "#e91e8c", d: 0, dur: 20 },
        { w: 400, h: 400, r: "-10%", b: "-10%", c: "#ff5252", d: 5, dur: 24 },
        { w: 300, h: 300, l: "50%", t: "50%", c: "#a855f7", d: 10, dur: 18 },
      ].map((b, i) => (
        <div
          key={i}
          className="templatesBlob"
          style={{
            width: b.w,
            height: b.h,
            left: (b as any).l,
            right: (b as any).r,
            top: (b as any).t,
            bottom: (b as any).b,
            background: `radial-gradient(circle, ${b.c}, transparent)`,
            animation: `floatBubble ${b.dur}s ease-in-out infinite`,
            animationDelay: `${b.d}s`,
          }}
        />
      ))}

      <div className="templatesGrid" />

      {/* Cart Button */}
      {templateToUse && (
        <button
          onClick={() => setShowCartModal(true)}
          className="templatesCartButton"
        >
          🛒 Cart
          <span className="templatesCartBadge">
            {selectedImages.length > 0 ? selectedImages.length : "1"}
          </span>
        </button>
      )}

      <div className="templatesInner">
        {/* Header */}
        <div className="templatesHeader">
          <h1 className="templatesTitle">
            Create <span className="templatesTitleHighlight">Event</span>
          </h1>
          <p className="templatesSubtitle">Choose a template to get started</p>
        </div>

        {/* View Mode Buttons */}
        <div className="templatesViewButtons">
          <button
            onClick={() => setViewMode("text")}
            className={`templatesViewButton ${viewMode === "text" ? "templatesViewButtonActive" : ""}`}
          >
            📝 Text Templates
          </button>
          <button
            onClick={() => setViewMode("images")}
            className={`templatesViewButton ${viewMode === "images" ? "templatesViewButtonActive" : ""}`}
          >
            🖼️ Image Templates
          </button>
        </div>

        {/* Category Buttons */}
        <div className="templatesCategoryButtons">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`templatesCategoryButton ${selectedCategory === "all" ? "templatesCategoryButtonActive" : ""}`}
          >
            All Categories
          </button>
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`templatesCategoryButton ${selectedCategory === cat ? "templatesCategoryButtonActive" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid or Empty State */}
        {templates.length === 0 ? (
          <div className="templatesEmptyStateContainer">
            <div className="templatesEmptyStateIcon">📋</div>
            <h2 className="templatesEmptyStateTitle">No Templates Available</h2>
            <p className="templatesEmptyStateSubtitle">
              {viewMode === "text"
                ? "There are no text templates available right now. Check back soon!"
                : "There are no image templates available right now. Check back soon!"}
            </p>

            <div className="templatesEmptyStateSteps">
              <div className="templatesEmptyStateStep">
                <div className="templatesEmptyStateStepNumber">1</div>
                <span className="templatesEmptyStateStepText">Select a template type</span>
              </div>
              <div className="templatesEmptyStateStep">
                <div className="templatesEmptyStateStepNumber">2</div>
                <span className="templatesEmptyStateStepText">Choose from categories</span>
              </div>
              <div className="templatesEmptyStateStep">
                <div className="templatesEmptyStateStepNumber">3</div>
                <span className="templatesEmptyStateStepText">Create your event</span>
              </div>
            </div>

            <div className="templatesEmptyStateHint">
              <span className="templatesEmptyStateHintIcon">💡</span>
              Templates will help you create beautiful events faster
            </div>
          </div>
        ) : (
          <div className="templatesCardGrid">
            {templates.map((template: any, idx: number) => (
              <div
                key={template.id}
                className="templatesCard"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {viewMode === "images" && template.previewImageUrl && (
                  <div className="templatesCardImage">
                    <img
                      src={template.previewImageUrl}
                      alt={template.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div className="templatesCardImageOverlay" />
                  </div>
                )}

                <div className="templatesCardBadge">
                  {viewMode === "text" ? "Text" : "Image"}
                </div>

                <h2 className="templatesCardTitle">{template.title}</h2>

                <p className="templatesCardDescription">
                  {viewMode === "text"
                    ? template.textContent?.substring(0, 80) + "..."
                    : template.description}
                </p>

                <div className="templatesCardButtons">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setShowPreviewModal(true);
                    }}
                    className="templatesCardButtonPreview"
                  >
                    👁️ Preview
                  </button>

                  {viewMode === "text" && (
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="templatesCardButtonUse"
                    >
                      🛒 Use Template
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && templateDetail?.data && (
        <div className="templatesModalOverlay" onClick={() => setShowPreviewModal(false)}>
          <div className="templatesModalContent" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="templatesModalClose"
            >
              ✕
            </button>

            <h2 className="templatesModalTitle">{templateDetail.data.title}</h2>

            {viewMode === "images" && templateDetail.data.previewImageUrl && (
              <img
                src={templateDetail.data.previewImageUrl}
                alt={templateDetail.data.title}
                className="templatesModalImage"
              />
            )}

            {viewMode === "text" &&
              (templateDetail.data.textContent || templateDetail.data.description) && (
                <div className="templatesModalText">
                  {templateDetail.data.textContent || templateDetail.data.description}
                </div>
              )}

            {templateDetail.data.placeholders && templateDetail.data.placeholders.length > 0 && (
              <div className="templatesModalPlaceholders">
                <h3>📋 Customizable Fields:</h3>
                <div className="templatesModalPlaceholdersGrid">
                  {Array.isArray(templateDetail.data.placeholders) ? (
                    templateDetail.data.placeholders.map((placeholder: any, idx: number) => (
                      <div key={idx} className="templatesModalPlaceholderItem">
                        <strong>{placeholder.key}</strong>
                        <div>{placeholder.label}</div>
                      </div>
                    ))
                  ) : (
                    Object.keys(templateDetail.data.placeholders).map((key) => (
                      <div key={key} className="templatesModalPlaceholderItem">
                        <strong>{key}</strong>
                        <div>{templateDetail.data.placeholders?.[key]}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowPreviewModal(false);
                handleUseTemplate(templateDetail.data);
              }}
              className="templatesModalButton"
            >
              🛒 Use This Template
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && templateToUse && (
        <div className="templatesModalOverlay" onClick={() => setShowCartModal(false)}>
          <div className="templatesModalContent templatesCartModal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowCartModal(false)}
              className="templatesModalClose"
            >
              ✕
            </button>

            <h2 className="templatesModalTitle">🛒 Your Cart</h2>

            {/* Template Preview */}
            <div className="templatesCartSection">
              <h3>📋 Selected Template</h3>

              <div className="templatesCartItem">
                <p className="templatesCartItemTitle">{templateToUse.title}</p>
                <p className="templatesCartItemDescription">
                  {templateToUse.textContent || templateToUse.description}
                </p>
              </div>

              {templateToUse.placeholders && templateToUse.placeholders.length > 0 && (
                <div className="templatesCartPlaceholders">
                  <p>Customizable Fields:</p>
                  <div className="templatesCartPlaceholdersGrid">
                    {Array.isArray(templateToUse.placeholders) ? (
                      templateToUse.placeholders.map((p: any, idx: number) => (
                        <div key={idx} className="templatesCartPlaceholderItem">
                          <strong>{p.key}</strong>
                          <div>{p.label}</div>
                        </div>
                      ))
                    ) : (
                      Object.entries(templateToUse.placeholders).map(([key, value]: any) => (
                        <div key={key} className="templatesCartPlaceholderItem">
                          <strong>{key}</strong>
                          <div>{value}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Images Selection */}
            <div className="templatesCartSection">
              <h3>🖼️ Add Images (Optional)</h3>

              {imageData?.data && imageData.data.length > 0 ? (
                <div className="templatesCartImageGrid">
                  {imageData.data.map((img: any) => (
                    <div
                      key={img.id}
                      className={`templatesCartImageItem ${
                        selectedImages.includes(img.id) ? "templatesCartImageItemSelected" : ""
                      }`}
                      onClick={() => {
                        setSelectedImages((prev) =>
                          prev.includes(img.id)
                            ? prev.filter((id) => id !== img.id)
                            : [...prev, img.id]
                        );
                      }}
                    >
                      <img src={img.previewImageUrl} alt={img.title} />
                      {selectedImages.includes(img.id) && (
                        <div className="templatesCartImageCheckmark">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="templatesCartEmpty">No images available</div>
              )}
            </div>

            {/* Summary */}
            <div className="templatesCartSummary">
              <div>
                <strong>Template:</strong> {templateToUse.title}
              </div>
              <div>
                <strong>Images:</strong> {selectedImages.length} image{selectedImages.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Buttons */}
            <div className="templatesCartButtons">
              <button
                onClick={() => setShowCartModal(false)}
                className="templatesCartButtonContinue"
              >
                ← Continue Shopping
              </button>
              <button
                onClick={() => {
                  redirectToEvents(templateToUse.id, selectedImages);
                  setShowCartModal(false);
                }}
                className="templatesCartButtonCheckout"
              >
                ✨ Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};