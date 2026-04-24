"use client";

import { useGetTemplatesQuery } from "@/store/apiSlice";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function TemplatesPage() {
  const { data, isLoading, isError } = useGetTemplatesQuery();
  const router = useRouter();

  // ✅ get user from redux (adjust path if needed)
  const user = useSelector((state: any) => state.auth?.user);

  const templates = data?.data || [];

  // 🔄 Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading templates...</p>
      </div>
    );
  }

  // ❌ Error
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load templates</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10 relative">

      {/* 🔥 ADMIN BUTTON (TOP RIGHT) */}
      {user?.role === "admin" && (
        <div className="absolute top-6 right-8">
          <button
            onClick={() => router.push("/templates/create")}
            className="px-5 py-2 rounded-full text-white font-medium
            bg-gradient-to-r from-pink-500 to-orange-500
            shadow-md hover:shadow-xl hover:scale-105 transition"
          >
            + Create Template
          </button>
        </div>
      )}

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Choose a Template
      </h1>

      {/* EMPTY STATE */}
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <p className="text-gray-500 text-lg mb-4">
            No templates added yet
          </p>

          {user?.role === "admin" && (
            <button
              onClick={() => router.push("/templates/create")}
              className="px-6 py-3 rounded-full text-white
              bg-gradient-to-r from-pink-500 to-orange-500"
            >
              Create First Template
            </button>
          )}
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {templates.map((template: any) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              {/* IMAGE */}
              <div className="h-40 bg-pink-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {template.image ? (
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-pink-500 font-semibold">
                    Preview
                  </span>
                )}
              </div>

              {/* CONTENT */}
              <h2 className="text-lg font-semibold text-gray-800">
                {template.title}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {template.description}
              </p>

              {/* ACTION */}
              <button
                onClick={() =>
                  router.push(`/events?templateId=${template.id}`)
                }
                className="mt-4 w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 rounded-lg hover:scale-105 transition"
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