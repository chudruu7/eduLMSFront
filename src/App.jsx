import React from "react";
// ✅ ЗАСВАР: BrowserRouter-ийг main.jsx-д аль хэдийн wrap хийсэн, useNavigate энд хэрэглэгддэггүй тул хассан.
import { Routes, Route, useLocation } from "react-router-dom";

// UI Components
import Navbar from "./modules/ui/Navbar.jsx";
import TopNavbar from "./modules/ui/TopNavbar.jsx";

// Auth
import Login from "./modules/auth/Login.jsx";
import Register from "./modules/auth/Register.jsx";
import Profile from "./modules/auth/Profile.jsx";
import ProtectedRoute from "./modules/auth/ProtectedRoute.jsx";

// Pages
import Dashboard from "./modules/dashboard/Dashboard.jsx";
import CourseDetail from "./modules/course/CourseDetail.jsx";
import UploadCourse from "./modules/teacher/UploadCourse.jsx";
import EditCourse from "./modules/teacher/EditCourse.jsx";
import AdminPanel from "./modules/admin/AdminPanel.jsx";
import TeacherProfile from "./modules/teacher/TeacherProfile.jsx";
import TeacherCard from "./modules/teacher/TeacherCard.jsx";
import TrainingCategories from "./modules/category/TrainingCategories.jsx";
import CategoryPage from "./modules/category/CategoryPage.jsx";
import CategoryCourses from "./modules/category/CategoryCourses.jsx";
import HomePage from "./modules/category/HomePage.jsx";
import Certificate from "./modules/certifacte/Certificate.jsx";
import ContactForm from "./modules/ui/contact.jsx";
import AboutUs from "./modules/ui/AboutUs.jsx";

function Layout() {
  const location = useLocation();
  const hideNavbars = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbars && <TopNavbar />}

      <main className={`flex flex-1 ${!hideNavbars ? "pt-16" : ""}`}>
        {!hideNavbars && (
          <aside className="hidden md:flex md:flex-col w-64 bg-white border-r shadow-sm">
            <Navbar />
          </aside>
        )}

        <div
          className={`flex-1 ${
            hideNavbars
              ? "flex justify-center items-center w-full"
              : "px-4 py-6 max-w-7xl mx-auto"
          }`}
        >
          <Routes>
            {/* Public */}
            <Route path="/" element={<TrainingCategories />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/categories" element={<TrainingCategories />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Common - нэвтэрсэн бүх хэрэглэгч */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/categories/:cat" element={<ProtectedRoute><CategoryCourses /></ProtectedRoute>} />

            {/* Teacher */}
            <Route path="/teacher/dashboard" element={<ProtectedRoute allowed={["teacher"]}><Dashboard /></ProtectedRoute>} />
            <Route path="/teacher/courses"   element={<ProtectedRoute allowed={["teacher"]}><Dashboard /></ProtectedRoute>} />
            <Route path="/teacher/upload"    element={<ProtectedRoute allowed={["teacher"]}><UploadCourse /></ProtectedRoute>} />
            <Route path="/teacher/edit/:id"  element={<ProtectedRoute allowed={["teacher", "admin"]}><EditCourse /></ProtectedRoute>} />
            <Route path="/teacher/settings"  element={<ProtectedRoute allowed={["teacher"]}><TeacherProfile /></ProtectedRoute>} />

            {/* Student */}
            <Route path="/student/dashboard"    element={<ProtectedRoute allowed={["student"]}><Dashboard /></ProtectedRoute>} />
            <Route path="/student/courses"      element={<ProtectedRoute allowed={["student"]}><Dashboard /></ProtectedRoute>} />
            <Route path="/student/home"         element={<ProtectedRoute allowed={["student"]}><HomePage /></ProtectedRoute>} />
            <Route path="/student/categories"   element={<ProtectedRoute allowed={["student"]}><CategoryPage /></ProtectedRoute>} />
            <Route path="/student/teachers"     element={<ProtectedRoute allowed={["student"]}><TeacherCard /></ProtectedRoute>} />
            <Route path="/student/certificates" element={<ProtectedRoute allowed={["student"]}><Certificate /></ProtectedRoute>} />
            <Route path="/student/contact"      element={<ProtectedRoute allowed={["student"]}><ContactForm /></ProtectedRoute>} />
            <Route path="/student/about"        element={<ProtectedRoute allowed={["student"]}><AboutUs /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowed={["admin"]}><AdminPanel /></ProtectedRoute>} />
            <Route path="/admin/users"     element={<ProtectedRoute allowed={["admin"]}><AdminPanel /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default Layout;
