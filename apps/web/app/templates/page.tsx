// 

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

  // Handle "Use Template" - add to cart
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white/50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          Loading templates...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0318 0%, #1a0a2e 50%, #0d0810 100%)",
        color: "#f5f0ff",
        position: "relative",
        overflow: "hidden",
        padding: "0",
      }}
    >
      {[
        { w: 600, h: 600, l: "-10%", t: "-20%", c: "#e91e8c", d: 0, dur: 20 },
        { w: 400, h: 400, r: "-10%", b: "-10%", c: "#ff5252", d: 5, dur: 24 },
        { w: 300, h: 300, l: "50%", t: "50%", c: "#a855f7", d: 10, dur: 18 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            width: b.w,
            height: b.h,
            left: (b as any).l,
            right: (b as any).r,
            top: (b as any).t,
            bottom: (b as any).b,
            background: `radial-gradient(circle, ${b.c}, transparent)`,
            filter: "blur(120px)",
            opacity: 0.08,
            animation: `floatBubble ${b.dur}s ease-in-out infinite`,
            animationDelay: `${b.d}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.02,
          backgroundImage: "radial-gradient(circle, #a78bfa 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes floatBubble {
          0%   { transform: translateY(0) translateX(0) scale(1); }
          33%  { transform: translateY(-40px) translateX(20px) scale(1.08); }
          66%  { transform: translateY(15px) translateX(-15px) scale(0.95); }
          100% { transform: translateY(0) translateX(0) scale(1); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* CART BUTTON - TOP RIGHT */}
      {templateToUse && (
        <button
          onClick={() => setShowCartModal(true)}
          style={{
            position: "fixed",
            top: 30,
            right: 30,
            zIndex: 100,
            padding: "12px 20px",
            borderRadius: 50,
            border: "none",
            background: "linear-gradient(135deg, #e91e8c, #ff5252)",
            color: "white",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 8px 25px rgba(233, 30, 140, 0.4)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 12px 35px rgba(233, 30, 140, 0.6)";
            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 8px 25px rgba(233, 30, 140, 0.4)";
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          }}
        >
          🛒 Cart
          <span
            style={{
              background: "#fff",
              color: "#e91e8c",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              minWidth: 24,
            }}
          >
            {selectedImages.length > 0 ? selectedImages.length : "1"}
          </span>
        </button>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "60px 32px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 50,
            animation: "slideInDown 0.6s ease",
          }}
        >
          <h1
            style={{
              fontSize: 48,
              fontWeight: 900,
              background: "linear-gradient(135deg, #e91e8c, #ff5252, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 12,
            }}
          >
            Create Event
          </h1>
          <p style={{ color: "rgba(245,240,255,0.5)", fontSize: 16 }}>
            Choose a template to get started
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 40,
            justifyContent: "center",
            animation: "slideInDown 0.6s ease 0.1s backwards",
          }}
        >
          <button
            onClick={() => setViewMode("text")}
            style={{
              padding: "12px 24px",
              borderRadius: "50px",
              border: "1px solid rgba(255,255,255,0.1)",
              background:
                viewMode === "text"
                  ? "linear-gradient(135deg,#e91e8c,#ff5252)"
                  : "rgba(255,255,255,0.05)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: viewMode === "text" ? 700 : 500,
              transition: "all 0.3s ease",
              fontSize: 14,
              backdropFilter: "blur(10px)",
            }}
          >
            📝 Text Templates
          </button>
          <button
            onClick={() => setViewMode("images")}
            style={{
              padding: "12px 24px",
              borderRadius: "50px",
              border: "1px solid rgba(255,255,255,0.1)",
              background:
                viewMode === "images"
                  ? "linear-gradient(135deg,#e91e8c,#ff5252)"
                  : "rgba(255,255,255,0.05)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: viewMode === "images" ? 700 : 500,
              transition: "all 0.3s ease",
              fontSize: 14,
              backdropFilter: "blur(10px)",
            }}
          >
            🖼️ Image Templates
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 40,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "slideInDown 0.6s ease 0.2s backwards",
          }}
        >
          <button
            onClick={() => setSelectedCategory("all")}
            style={{
              padding: "10px 20px",
              borderRadius: "50px",
              border: "1px solid rgba(255,255,255,0.1)",
              background:
                selectedCategory === "all"
                  ? "linear-gradient(135deg,#e91e8c,#ff5252)"
                  : "rgba(255,255,255,0.05)",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: 13,
              backdropFilter: "blur(10px)",
            }}
          >
            All Categories
          </button>
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "10px 20px",
                borderRadius: "50px",
                border: "1px solid rgba(255,255,255,0.1)",
                background:
                  selectedCategory === cat
                    ? "linear-gradient(135deg,#e91e8c,#ff5252)"
                    : "rgba(255,255,255,0.05)",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: 13,
                backdropFilter: "blur(10px)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {templates.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              marginTop: 100,
              color: "rgba(245,240,255,0.4)",
              fontSize: 16,
            }}
          >
            No templates found
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {templates.map((template: any, idx: number) => (
              <div
                key={template.id}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: 20,
                  backdropFilter: "blur(20px)",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  animation: `scaleIn 0.5s ease ${idx * 0.05}s backwards`,
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(233, 30, 140, 0.4)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-8px) scale(1.02)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 20px 50px rgba(233, 30, 140, 0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {viewMode === "images" && template.previewImageUrl && (
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 14,
                      marginBottom: 16,
                      backgroundImage: `url(${template.previewImageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(135deg, rgba(233,30,140,0.1), transparent)",
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    padding: "6px 12px",
                    borderRadius: "20px",
                    background: viewMode === "text" ? "rgba(168,85,247,0.2)" : "rgba(236,72,153,0.2)",
                    border: "1px solid " + (viewMode === "text" ? "rgba(168,85,247,0.5)" : "rgba(236,72,153,0.5)"),
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {viewMode === "text" ? "Text" : "Image"}
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  {template.title}
                </h2>

                <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 16, lineHeight: 1.5 }}>
                  {viewMode === "text"
                    ? template.textContent?.substring(0, 80) + "..."
                    : template.description}
                </p>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setShowPreviewModal(true);
                    }}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.05)",
                      color: "white",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.05)";
                    }}
                  >
                    👁️ Preview
                  </button>

                  {viewMode === "text" && (
                    <button
                      onClick={() => handleUseTemplate(template)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 10,
                        border: "none",
                        background: "linear-gradient(135deg, #e91e8c, #ff5252)",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 12,
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(233, 30, 140, 0.3)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          "0 6px 25px rgba(233, 30, 140, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          "0 4px 15px rgba(233, 30, 140, 0.3)";
                      }}
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

      {/* PREVIEW MODAL */}
      {showPreviewModal && templateDetail?.data && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(8px)",
            animation: "scaleIn 0.3s ease",
          }}
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0f0318 0%, #1a0a2e 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24,
              padding: 40,
              maxWidth: 600,
              maxHeight: "85vh",
              overflow: "auto",
              position: "relative",
              zIndex: 1001,
              backdropFilter: "blur(20px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreviewModal(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#fff",
                fontSize: 28,
                cursor: "pointer",
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
              {templateDetail.data.title}
            </h2>

            {viewMode === "images" && templateDetail.data.previewImageUrl && (
              <img
                src={templateDetail.data.previewImageUrl}
                alt={templateDetail.data.title}
                style={{
                  width: "100%",
                  borderRadius: 16,
                  marginBottom: 24,
                  maxHeight: 320,
                  objectFit: "cover",
                }}
              />
            )}

            {viewMode === "text" && (templateDetail.data.textContent || templateDetail.data.description) && (
              <div
                style={{
                  color: "rgba(245,240,255,0.7)",
                  marginBottom: 24,
                  lineHeight: 1.7,
                  fontSize: 14,
                  background: "rgba(255,255,255,0.02)",
                  padding: 16,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {templateDetail.data.textContent || templateDetail.data.description}
              </div>
            )}

            {templateDetail.data.placeholders && templateDetail.data.placeholders.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
                  📋 Customizable Fields:
                </h3>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(245,240,255,0.6)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  {Array.isArray(templateDetail.data.placeholders) ? (
                    templateDetail.data.placeholders.map((placeholder: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          padding: 10,
                          borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <strong style={{ color: "#e91e8c" }}>{placeholder.key}</strong>
                        <div style={{ marginTop: 4, opacity: 0.7 }}>
                          {placeholder.label}
                        </div>
                      </div>
                    ))
                  ) : (
                    Object.keys(templateDetail.data.placeholders).map((key) => (
                      <div
                        key={key}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          padding: 10,
                          borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <strong style={{ color: "#e91e8c" }}>{key}</strong>
                        <div style={{ marginTop: 4, opacity: 0.7 }}>
                          {templateDetail.data.placeholders?.[key]}
                        </div>
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
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #e91e8c, #ff5252)",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 15,
                boxShadow: "0 8px 25px rgba(233, 30, 140, 0.3)",
              }}
            >
              🛒 Use This Template
            </button>
          </div>
        </div>
      )}

      {/* CART MODAL - Opens when clicking cart button */}
      {showCartModal && templateToUse && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(8px)",
            animation: "scaleIn 0.3s ease",
          }}
          onClick={() => setShowCartModal(false)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0f0318 0%, #1a0a2e 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24,
              padding: 40,
              maxWidth: 800,
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              zIndex: 1001,
              backdropFilter: "blur(20px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCartModal(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#fff",
                fontSize: 28,
                cursor: "pointer",
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
              🛒 Your Cart
            </h2>

            {/* Template Preview */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: 20,
                marginBottom: 30,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#e91e8c" }}>
                📋 Selected Template
              </h3>

              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  {templateToUse.title}
                </p>
                <p style={{ fontSize: 13, color: "rgba(245,240,255,0.6)", lineHeight: 1.6 }}>
                  {templateToUse.textContent || templateToUse.description}
                </p>
              </div>

              {templateToUse.placeholders && templateToUse.placeholders.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: "rgba(245,240,255,0.7)" }}>
                    Customizable Fields:
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    {Array.isArray(templateToUse.placeholders) ? (
                      templateToUse.placeholders.map((p: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: 11,
                            padding: 8,
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: 6,
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <strong style={{ color: "#e91e8c" }}>{p.key}</strong>
                          <div style={{ opacity: 0.7, marginTop: 2 }}>{p.label}</div>
                        </div>
                      ))
                    ) : (
                      Object.entries(templateToUse.placeholders).map(([key, value]: any) => (
                        <div
                          key={key}
                          style={{
                            fontSize: 11,
                            padding: 8,
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: 6,
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <strong style={{ color: "#e91e8c" }}>{key}</strong>
                          <div style={{ opacity: 0.7, marginTop: 2 }}>{value}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Images Selection */}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#e91e8c" }}>
                🖼️ Add Images (Optional)
              </h3>

              {imageData?.data && imageData.data.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  {imageData.data.map((img: any) => (
                    <div
                      key={img.id}
                      style={{
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: 12,
                        overflow: "hidden",
                        border: selectedImages.includes(img.id)
                          ? "3px solid #e91e8c"
                          : "1px solid rgba(255,255,255,0.1)",
                        transition: "all 0.3s ease",
                        transform: selectedImages.includes(img.id)
                          ? "scale(1.05)"
                          : "scale(1)",
                      }}
                      onClick={() => {
                        setSelectedImages((prev) =>
                          prev.includes(img.id)
                            ? prev.filter((id) => id !== img.id)
                            : [...prev, img.id]
                        );
                      }}
                    >
                      <img
                        src={img.previewImageUrl}
                        alt={img.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          minHeight: 120,
                        }}
                      />
                      {selectedImages.includes(img.id) && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(233, 30, 140, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "rgba(245,240,255,0.4)",
                    marginBottom: 24,
                  }}
                >
                  No images available
                </div>
              )}
            </div>

            {/* Summary */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 14, color: "rgba(245,240,255,0.7)", marginBottom: 8 }}>
                <strong>Template:</strong> {templateToUse.title}
              </div>
              <div style={{ fontSize: 14, color: "rgba(245,240,255,0.7)" }}>
                <strong>Images:</strong> {selectedImages.length} image{selectedImages.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => {
                  setShowCartModal(false);
                }}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                ← Continue Shopping
              </button>
              <button
                onClick={() => {
                  redirectToEvents(templateToUse.id, selectedImages);
                  setShowCartModal(false);
                }}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #e91e8c, #ff5252)",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 14,
                  boxShadow: "0 8px 25px rgba(233, 30, 140, 0.3)",
                }}
              >
                ✨ Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}