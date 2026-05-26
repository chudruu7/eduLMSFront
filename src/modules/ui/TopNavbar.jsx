// src/modules/ui/TopNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, Bell, User, Home } from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";

export default function TopNavbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();
  const { me } = useAuth();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const query = searchTerm.trim();
      if (query) {
        // ✅ /dashboard?q=... хэлбэрээр Dashboard filter-г ашиглана
        navigate(`/dashboard?q=${encodeURIComponent(query)}`);
        setSearchTerm("");
        setIsSearchExpanded(false);
      }
    }
  };

  const homeHref = me
    ? me.role === "teacher"
      ? "/teacher/dashboard"
      : me.role === "admin"
      ? "/admin/dashboard"
      : "/student/home"
    : "/";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to={homeHref} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            E
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent select-none">
            eduLMS
          </h1>
        </Link>

        {/* Icons хэсэг (баруун тал) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Home */}
          <Link
            to={homeHref}
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all"
            title="Нүүр"
          >
            <Home size={18} />
          </Link>

          {/* Search */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Хичээл хайх..."
              className={`transition-all duration-300 ease-in-out bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-200 rounded-full pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${
                isSearchExpanded
                  ? "w-52 sm:w-64 opacity-100 mr-2"
                  : "w-0 opacity-0 px-0 border-transparent"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              onBlur={() => {
                if (!searchTerm) setIsSearchExpanded(false);
              }}
              autoFocus={isSearchExpanded}
            />
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all"
              title="Хайх"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Notifications */}
          <button
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all"
            title="Мэдэгдэл"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full shadow">
              3
            </span>
          </button>

          {/* User / Profile */}
          {me ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
            >
              {me.avatar ? (
                <img
                  src={me.avatar}
                  alt={me.name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-white/70"
                />
              ) : (
                <User size={16} className="text-white" />
              )}
              <span className="hidden sm:inline text-sm font-medium pr-1">
                {me.name?.split(" ")[0] || "Миний булан"}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg transition"
            >
              Нэвтрэх
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
