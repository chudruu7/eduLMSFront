import React from "react";
import { useNavigate } from "react-router-dom";
import { COURSE_CATEGORIES } from "./categories.js";

export default function CategoryPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-10xl mx-auto px-6 py-8">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 drop-shadow-lg flex items-center gap-3 mt-4 border-b border-gray-300 pb-6">
        <span>📚</span> СУРГАЛТЫН АНГИЛАЛ
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {COURSE_CATEGORIES.map((category, index) => (
          <div
            key={index}
            onClick={() => navigate(`/categories/${encodeURIComponent(category)}`)}
            className="group rounded-xl shadow-lg mt-8 transition duration-300 p-6 cursor-pointer flex items-center gap-3 text-left font-semibold
                       bg-white/30 backdrop-blur-lg border border-white/20 text-gray-800 hover:bg-white/50 hover:text-blue-700 hover:shadow-xl"
          >
            <img
              src="/onlinepng.png"
              alt="icon"
              className="w-10 h-10 object-contain"
            />
            {/* Текст */}
            <span className="leading-snug">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
