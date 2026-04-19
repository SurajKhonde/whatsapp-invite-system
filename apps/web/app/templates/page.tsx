"use client";

const templates = [
  {
    id: 1,
    title: "Wedding Invite",
    description: "Elegant wedding invitation design",
  },
  {
    id: 2,
    title: "Birthday Party",
    description: "Fun and colorful birthday template",
  },
  {
    id: 3,
    title: "Corporate Event",
    description: "Professional event invitation",
  },
  {
    id: 4,
    title: "Baby Shower",
    description: "Cute and soft theme invite",
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      {/* Header */}
      
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Choose a Template
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Image placeholder */}
            <div className="h-40 bg-pink-100 rounded-lg mb-4 flex items-center justify-center text-pink-500 font-semibold">
              Preview
            </div>

            {/* Content */}
            <h2 className="text-lg font-semibold text-gray-800">
              {template.title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {template.description}
            </p>

            {/* Button */}
            <button className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition">
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}