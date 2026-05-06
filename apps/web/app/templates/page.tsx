
"use client";

import { useState } from "react";
import { useGetTemplatesQuery } from "@/store/apiSlice";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function TemplatesPage() {
  const { data, isLoading, isError } = useGetTemplatesQuery();
  const router = useRouter();
  const user = useSelector((state: any) => state.auth?.user);

  const templates = data?.data || [];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((t: any) => t.category === activeCategory);

  // 🔄 Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0810] text-white/50">
        Loading templates...
      </div>
    );
  }

  // ❌ Error
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0810] text-red-400">
        Failed to load templates
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

      {/* Floating glow balls */}
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

      {/* Dot grid */}
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

      {/* Animations */}
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
      <div style={{ marginBottom: 40, position: "relative", zIndex: 2 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>
          My Templates
        </h1>
        <p style={{ color: "rgba(245,240,255,0.4)", marginTop: 6 }}>
          Thanks for being with me 💖
        </p>
      </div>

      {/* Admin button */}
      {user?.role === "admin" && (
        <div style={{ position: "absolute", top: 40, right: 32, zIndex: 2 }}>
          <button
            onClick={() => router.push("/templates/create")}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "none",
              background: "linear-gradient(135deg,#e91e8c,#ff5252)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            + Create Template
          </button>
        </div>
      )}

      {/* Categories */}
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
        {[
          { label: "All", value: "all" },
          { label: "💍 Marriage", value: "wedding" },
          { label: "🎂 Birthday", value: "birthday" },
          { label: "🎉 Others", value: "other" },
        ].map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.1)",
              background:
                activeCategory === cat.value
                  ? "linear-gradient(135deg,#e91e8c,#ff5252)"
                  : "rgba(255,255,255,0.05)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Empty */}
      {filteredTemplates.length === 0 ? (
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
        /* Grid */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: 20,
            position: "relative",
            zIndex: 2,
          }}
        >
          {filteredTemplates.map((template: any) => (
            <div
              key={template.id}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: 20,
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Icon */}
              <div style={{ fontSize: 30, marginBottom: 10 }}>
                {template.category === "wedding" && "💍"}
                {template.category === "birthday" && "🎂"}
                {template.category === "other" && "🎉"}
              </div>

              {/* Title */}
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>
                {template.title}
              </h2>

              {/* Description */}
              <p style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>
                {template.description}
              </p>

              {/* Button */}
              <button
                onClick={() =>
                  router.push(`/events?templateId=${template.id}`)
                }
                style={{
                  marginTop: 14,
                  width: "100%",
                  padding: "10px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg,#e91e8c,#ff5252)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


