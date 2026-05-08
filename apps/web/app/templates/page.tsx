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

export default function TemplatesPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth?.user);

  const [viewMode, setViewMode] = useState<"text" | "images">("text");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch categories
  const { data: categoriesData } = useGetTemplateCategoriesQuery();
  const categories = categoriesData?.data || [];

  // Fetch text templates
  const { data: textData, isLoading: textLoading } = useGetTextTemplatesQuery({
    category: selectedCategory === "all" ? "" : selectedCategory,
    page: currentPage,
    limit: 12,
  });

  // Fetch image templates
  const { data: imageData, isLoading: imageLoading } = useGetImageTemplatesQuery({
    category: selectedCategory === "all" ? "" : selectedCategory,
    page: currentPage,
    limit: 12,
  });

  // Fetch single template details for modal
  const { data: templateDetail } = useGetTemplateByIdQuery(selectedTemplate || "", {
    skip: !selectedTemplate,
  });

  const currentData = viewMode === "text" ? textData : imageData;
  const isLoading = viewMode === "text" ? textLoading : imageLoading;
  const templates = currentData?.data || [];
  const pagination = currentData?.pagination;

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode, selectedCategory]);

  // 🔄 Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0810] text-white/50">
        Loading templates...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0810",
        color: "#f5f0ff",
        position: "relative",
        overflow: "hidden",
        padding: "40px 32px",
      }}
    >
      {/* ================= BACKGROUND EFFECT ================= */}
      {[
        { w: 500, h: 500, l: "-5%", t: "-10%", c: "#e91e8c", d: 0, dur: 18 },
        { w: 350, h: 350, r: "-5%", b: "-5%", c: "#ff5252", d: 5, dur: 22 },
        { w: 250, h: 250, l: "60%", t: "40%", c: "#9c27b0", d: 9, dur: 16 },
        { w: 180, h: 180, l: "15%", t: "65%", c: "#ff9800", d: 13, dur: 20 },
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
            background: b.c,
            filter: "blur(100px)",
            opacity: 0.1,
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
          opacity: 0.04,
          backgroundImage: "radial-gradient(circle, #f5f0ff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes floatBubble {
          0%   { transform: translateY(0) translateX(0) scale(1); }
          33%  { transform: translateY(-30px) translateX(15px) scale(1.05); }
          66%  { transform: translateY(10px) translateX(-10px) scale(0.97); }
          100% { transform: translateY(0) translateX(0) scale(1); }
        }
      `}</style>

      {/* ================= CONTENT ================= */}

      {/* Header */}
      <div style={{ marginBottom: 30, position: "relative", zIndex: 2 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Create Event</h1>
        <p style={{ color: "rgba(245,240,255,0.4)", marginTop: 6 }}>Choose a template to get started</p>
      </div>

      {/* View Mode Toggle */}
      <div style={{ display: "flex", gap: 12, marginBottom: 30, position: "relative", zIndex: 2 }}>
        <button
          onClick={() => setViewMode("text")}
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.1)",
            background:
              viewMode === "text"
                ? "linear-gradient(135deg,#e91e8c,#ff5252)"
                : "rgba(255,255,255,0.05)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: viewMode === "text" ? 600 : 400,
          }}
        >
          📝 Text Templates
        </button>
        <button
          onClick={() => setViewMode("images")}
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.1)",
            background:
              viewMode === "images"
                ? "linear-gradient(135deg,#e91e8c,#ff5252)"
                : "rgba(255,255,255,0.05)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: viewMode === "images" ? 600 : 400,
          }}
        >
          🖼️ Image Templates
        </button>
      </div>

      {/* Categories Filter */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 30,
          flexWrap: "wrap",
          position: "relative",
          zIndex: 2,
        }}
      >
        <button
          onClick={() => setSelectedCategory("all")}
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.1)",
            background:
              selectedCategory === "all"
                ? "linear-gradient(135deg,#e91e8c,#ff5252)"
                : "rgba(255,255,255,0.05)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          All Categories
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.1)",
              background:
                selectedCategory === cat.name
                  ? "linear-gradient(135deg,#e91e8c,#ff5252)"
                  : "rgba(255,255,255,0.05)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: 100,
            color: "rgba(245,240,255,0.4)",
            position: "relative",
            zIndex: 2,
          }}
        >
          No templates found
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: 20,
            position: "relative",
            zIndex: 2,
          }}
        >
          {templates.map((template: any) => (
            <div
              key={template.id}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: 20,
                backdropFilter: "blur(20px)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Preview Image */}
              {viewMode === "images" && template.previewImageUrl && (
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    borderRadius: 12,
                    marginBottom: 12,
                    backgroundImage: `url(${template.previewImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}

              {/* Title */}
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>{template.title}</h2>

              {/* Description */}
              <p style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>
                {viewMode === "text"
                  ? template.textContent?.substring(0, 80) + "..."
                  : template.description}
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setShowModal(true);
                  }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Preview
                </button>
                <button
                  onClick={() => router.push(`/events?templateId=${template.id}`)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg,#e91e8c,#ff5252)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 40,
            position: "relative",
            zIndex: 2,
          }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.1)",
              background: currentPage === 1 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
              color: currentPage === 1 ? "rgba(255,255,255,0.3)" : "#fff",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.1)",
                background:
                  currentPage === page
                    ? "linear-gradient(135deg,#e91e8c,#ff5252)"
                    : "rgba(255,255,255,0.05)",
                color: "#fff",
                cursor: "pointer",
                fontWeight: currentPage === page ? 600 : 400,
              }}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={currentPage === pagination.totalPages}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.1)",
              background:
                currentPage === pagination.totalPages
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.1)",
              color: currentPage === pagination.totalPages ? "rgba(255,255,255,0.3)" : "#fff",
              cursor: currentPage === pagination.totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showModal && templateDetail?.data && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(5px)",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#0d0810",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: 40,
              maxWidth: 600,
              maxHeight: "80vh",
              overflow: "auto",
              position: "relative",
              zIndex: 1001,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 24,
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
              {templateDetail.data.title}
            </h2>

            {viewMode === "images" && templateDetail.data.previewImageUrl && (
              <img
                src={templateDetail.data.previewImageUrl}
                alt={templateDetail.data.title}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  marginBottom: 20,
                  maxHeight: 300,
                  objectFit: "cover",
                }}
              />
            )}

            {viewMode === "text" && templateDetail.data.textContent && (
              <div style={{ color: "rgba(245,240,255,0.7)", marginBottom: 20, lineHeight: 1.6 }}>
                {templateDetail.data.textContent}
              </div>
            )}

            {templateDetail.data.placeholders && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Placeholders:</h3>
                <div style={{ fontSize: 12, color: "rgba(245,240,255,0.6)" }}>
                  {Object.keys(templateDetail.data.placeholders).map((key) => (
                    <div key={key}>
                      - <strong>{key}:</strong> {templateDetail.data.placeholders?.[key]}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowModal(false);
                router.push(`/events?templateId=${templateDetail.data.id}`);
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#e91e8c,#ff5252)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Use This Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
}