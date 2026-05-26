import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Search,
  ArrowRight,
  Sparkles,
  Play,
  Star,
  CheckCircle2,
  Zap,
  Globe2,
  ShieldCheck,
  GraduationCap,
  Rocket,
  Clock,
  HeartHandshake,
  ChevronRight,
} from "lucide-react";
import { listCourses } from "../../services/api.js";
import CourseCard from "../course/CourseCard.jsx";
import { COURSE_CATEGORIES } from "./categories.js";

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [refresh, setRefresh] = useState(0);
  const reload = () => setRefresh((r) => r + 1);

  useEffect(() => {
    (async () => {
      try {
        const data = await listCourses();
        setCourses((data || []).slice(0, 6));
      } catch (e) {
        console.error("Хичээл ачаалахад алдаа:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh]);

  const stats = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      value: "200+",
      label: "Идэвхтэй сургалт",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: "55,000+",
      label: "Суралцагч",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "120+",
      label: "Мэргэшсэн багш",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: "95%",
      label: "Төгсөлтийн хувь",
      gradient: "from-amber-500 to-rose-500",
    },
  ];

  const features = [
    {
      icon: <Rocket className="w-7 h-7" />,
      title: "Хурдан сурах",
      desc: "Богино, ойлгомжтой видео хичээл болон практик дасгалуудаар үр дүнтэй суралц.",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Найдвартай төлбөр",
      desc: "QPay болон бүх томоохон банкуудаар аюулгүй, хялбар төлбөр төлөх боломж.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Globe2 className="w-7 h-7" />,
      title: "Хаанаас ч хандах",
      desc: "Гар утас, таблет, компьютер — хаанаас ч хүссэн үедээ хичээлээ үргэлжлүүл.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Гэрчилгээ авах",
      desc: "Хичээлээ амжилттай төгсгөж албан ёсны цахим гэрчилгээ хүлээн ав.",
      gradient: "from-amber-500 to-rose-500",
    },
    {
      icon: <HeartHandshake className="w-7 h-7" />,
      title: "Туршлагатай багш",
      desc: "Чиглэл бүрт салбарын мэргэжилтнүүд хичээлийг шууд та бүхэнд хүргэнэ.",
      gradient: "from-pink-500 to-fuchsia-500",
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Шинэ контент",
      desc: "Долоо хоног бүр шинэ хичээл нэмэгддэг тул мэдлэгээ цаг тутамд шинэчил.",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  const steps = [
    {
      n: "01",
      title: "Бүртгүүлэх",
      desc: "Хэдхэн секундэд бүртгэл үүсгээд эхэл.",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      n: "02",
      title: "Хичээл сонгох",
      desc: "Өөрт тохирох ангилал, хичээлээ олж сонго.",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      n: "03",
      title: "Суралцах",
      desc: "Видео хичээлийг үзээд дасгалаа гүйцэтгэ.",
      icon: <Play className="w-5 h-5" />,
    },
    {
      n: "04",
      title: "Гэрчилгээ авах",
      desc: "Амжилттай төгсгөөд цахим гэрчилгээгээ ав.",
      icon: <GraduationCap className="w-5 h-5" />,
    },
  ];

  const testimonials = [
    {
      name: "Б. Анар",
      role: "Багш, ЕБС",
      text: "Хүүхдүүддээ зориулсан туслах материал бэлтгэхэд маш их тус болсон. Платформ нь маш ойлгомжтой.",
      avatar: "А",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      name: "Б. Бат-Эрдэнэ",
      role: "Програм хөгжүүлэгч",
      text: "Ажлынхаа хажуугаар IT-ийн шинэ ур чадварууд эзэмших боломж олгодог нь үнэ цэнэтэй.",
      avatar: "Б",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "С. Сэлэнгэ",
      role: "Төрийн албан хаагч",
      text: "Мэргэшүүлэх сургалт онлайн хэлбэрээр хийдэг нь цаг хэмнэлттэй, агуулга нь баялаг байна.",
      avatar: "С",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  // Категорийн өнгө/иконы зураглал
  const categoryStyles = {
    "ЕБС-ийн сургуулийн хичээл": { icon: "🎒", gradient: "from-indigo-500 to-blue-500" },
    "Мэдээллийн технологийн сургалт": { icon: "💻", gradient: "from-cyan-500 to-blue-600" },
    "Төлбөргүй цахим хичээл": { icon: "🎁", gradient: "from-emerald-500 to-teal-500" },
    "Төрийн албан хаагчийн мэргэшүүлэх дунд хугацааны сургалт": {
      icon: "🏛️",
      gradient: "from-amber-500 to-rose-500",
    },
    "Хэлний сургалт": { icon: "🌐", gradient: "from-purple-500 to-pink-500" },
  };

  return (
    <div className="w-full pb-20">
      {/* Custom keyframe animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(40px,-30px) scale(1.1); }
          66% { transform: translate(-30px,30px) scale(0.95); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-blob { animation: blob 14s ease-in-out infinite; }
        .animate-blob-slow { animation: blob 22s ease-in-out infinite; }
      `}</style>

      {/* ╔══════════════════════════════════════════════════════════╗ */}
      {/* ║                       HERO SECTION                       ║ */}
      {/* ╚══════════════════════════════════════════════════════════╝ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white shadow-2xl">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          {/* Color blobs */}
          <div className="absolute -top-32 -right-20 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-20 w-[28rem] h-[28rem] bg-indigo-400/30 rounded-full blur-3xl animate-blob-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl" />
          {/* Sparkle dots */}
          <div className="absolute top-10 left-1/4 w-2 h-2 rounded-full bg-white/80 animate-pulse" />
          <div className="absolute top-32 right-1/3 w-1.5 h-1.5 rounded-full bg-yellow-300/90 animate-pulse" />
          <div className="absolute bottom-24 left-1/3 w-2 h-2 rounded-full bg-pink-200/80 animate-pulse" />
        </div>

        <div className="relative grid lg:grid-cols-2 gap-10 px-6 md:px-12 py-16 md:py-20 items-center">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">
                Монгол улсын тэргүүлэгч LMS платформ
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-6 drop-shadow-lg tracking-tight">
              Мэдлэгээ <br />
              <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-amber-200 bg-clip-text text-transparent">
                шинэ түвшинд
              </span>{" "}
              <br />
              гаргая.
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
              200+ сургалтаар <b>55,000+</b> албан хаагч, суралцагчдыг дэмжиж буй
              цахим сургалтын нэгдсэн орчин.
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mb-8">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Та юу сурахыг хүсэж байна?"
                className="w-full pl-12 pr-36 py-4 rounded-full text-gray-800 bg-white shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/40"
              />
              <Link
                to={`/dashboard${query ? `?q=${encodeURIComponent(query)}` : ""}`}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:scale-105 transition flex items-center gap-1"
              >
                Хайх <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                to="/student/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-full hover:scale-105 transition shadow-lg"
              >
                <Rocket className="w-4 h-4" /> Эхлэх
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition"
              >
                <Play className="w-4 h-4 fill-white" /> Танилцуулга үзэх
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex -space-x-2">
                {[
                  "from-pink-400 to-rose-400",
                  "from-amber-400 to-yellow-400",
                  "from-emerald-400 to-teal-400",
                  "from-cyan-400 to-blue-400",
                ].map((g, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${g} ring-2 ring-white/70`}
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-300">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-300" />
                  ))}
                  <span className="ml-1 text-white font-semibold">4.9/5</span>
                </div>
                <div className="text-white/80 text-xs">
                  10,000+ хэрэглэгчийн үнэлгээгээр
                </div>
              </div>
            </div>
          </div>

          {/* Right — Floating preview cards */}
          <div className="relative h-[420px] hidden lg:block">
            {/* Backdrop card (course preview) */}
            <div className="absolute top-6 right-4 w-80 rounded-2xl bg-white text-gray-900 shadow-2xl overflow-hidden animate-float-slow">
              <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/95 font-semibold">
                  💻 IT
                </div>
                <div className="absolute bottom-3 right-3 text-xs px-2.5 py-1 rounded-full bg-rose-500 text-white font-bold">
                  50,000₮
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 text-indigo-600 ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="font-bold text-sm leading-snug mb-1">
                  React-аар бүрэн вэб апп бүтээх
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Г. Энхтуяа • 24 хичээл
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3.5 h-3.5 fill-yellow-500" />
                    <span className="font-semibold text-gray-700">4.9</span>
                    <span className="text-gray-400">(326)</span>
                  </div>
                  <span className="text-indigo-600 font-semibold">Үзэх →</span>
                </div>
              </div>
            </div>

            {/* Floating stat card 1 */}
            <div className="absolute top-0 left-0 rounded-2xl bg-white shadow-2xl p-4 w-56 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Дууссан хичээл</div>
                  <div className="text-lg font-extrabold text-gray-900">
                    +1,248 өнөөдөр
                  </div>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
              </div>
            </div>

            {/* Floating stat card 2 — гэрчилгээ */}
            <div className="absolute bottom-2 left-6 rounded-2xl bg-white shadow-2xl p-4 w-60 animate-float-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Шинэ гэрчилгээ</div>
                  <div className="text-lg font-extrabold text-gray-900">
                    312 хэрэглэгч
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-500">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="font-semibold text-emerald-500">+18%</span>
                <span>энэ долоо хоног</span>
              </div>
            </div>

            {/* Floating "live" badge */}
            <div className="absolute top-44 right-0 px-3 py-1.5 rounded-full bg-white text-gray-800 shadow-lg text-xs font-semibold flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              48 хүн одоо суралцаж байна
            </div>
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗ */}
      {/* ║                          STATS                           ║ */}
      {/* ╚══════════════════════════════════════════════════════════╝ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-14">
        {stats.map((s, i) => (
          <div
            key={i}
            className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden"
          >
            <div
              className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${s.gradient} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`}
            />
            <div
              className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center mb-3 shadow-md`}
            >
              {s.icon}
            </div>
            <div className="relative text-2xl md:text-3xl font-extrabold text-gray-900">
              {s.value}
            </div>
            <div className="relative text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗ */}
      {/* ║                       CATEGORIES                         ║ */}
      {/* ╚══════════════════════════════════════════════════════════╝ */}
      <section className="mt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-block text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">
              Сургалтын ангилал
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Юу сурах вэ?
            </h2>
          </div>
          <Link
            to="/student/categories"
            className="hidden md:inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Бүх ангилал <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {COURSE_CATEGORIES.map((cat) => {
            const style = categoryStyles[cat] || {
              icon: "📚",
              gradient: "from-gray-500 to-gray-700",
            };
            return (
              <Link
                key={cat}
                to={`/categories/${encodeURIComponent(cat)}`}
                className={`group relative overflow-hidden rounded-2xl p-5 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all bg-gradient-to-br ${style.gradient}`}
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="text-4xl mb-3">{style.icon}</div>
                  <div className="font-bold leading-snug min-h-[3rem]">
                    {cat}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold opacity-90 group-hover:gap-2 transition-all">
                    Үзэх <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗ */}
      {/* ║                       FEATURES                           ║ */}
      {/* ╚══════════════════════════════════════════════════════════╝ */}
      <section className="mt-20">
        <div className="text-center mb-12">
          <div className="inline-block text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">
            Яагаад eduLMS?
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Сурах хэрэгтэй бүх зүйл нэг дор
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Хамгийн сайн хэрэглэгчийн туршлага, чанартай контент, уян хатан
            хэрэгслүүдийг нэг дороос.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div
                className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${f.gradient} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`}
              />
              <div
                className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform`}
              >
                {f.icon}
              </div>
              <h3 className="relative text-xl font-bold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="relative text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗ */}
      {/* ║                     HOW IT WORKS                         ║ */}
      {/* ╚══════════════════════════════════════════════════════════╝ */}
      <section className="mt-20">
        <div className="text-center mb-12">
          <div className="inline-block text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">
            Хэрхэн ажилладаг вэ?
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            4 алхамд эхэлнэ
          </h2>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200" />
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all"
            >
              <div className="absolute -top-4 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow">
                Алхам {s.n}
              </div>
              <div className="w-12 h-12 mt-4 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                {s.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗ */}
      {/* ║                   POPULAR COURSES                        ║ */}
      {/* ╚══════════════════════════════════════════════════════════╝ */}
      <section className="mt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-block text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">
              Хамгийн алдартай
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Шилдэг хичээлүүд
            </h2>
            <p className="text-gray-500 mt-1">
              Хамгийн их сонирхол татаж буй сургалтууд
            </p>
          </div>
          <Link
            to="/dashboard"
            className="hidden md:inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Бүгдийг үзэх <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 animate-pulse border border-gray-100 shadow"
              >
                <div className="h-44 bg-gray-200 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">Одоогоор хичээл байхгүй байна.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <CourseCard key={c._id || c.id} course={c} onChanged={reload} />
            ))}
          </div>
        )}
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗ */}
      {/* ║                     TESTIMONIALS                         ║ */}
      {/* ╚══════════════════════════════════════════════════════════╝ */}
      <section className="mt-20">
        <div className="text-center mb-12">
          <div className="inline-block text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">
            Хэрэглэгчдийн сэтгэгдэл
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Юу гэж хэлж байна вэ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-7 hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="absolute -top-3 -left-3 text-indigo-200 text-7xl leading-none font-serif select-none">
                "
              </div>
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 relative">
                {t.text}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} text-white flex items-center justify-center font-bold text-lg shadow-lg`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════╗ */}
      {/* ║                          CTA                             ║ */}
      {/* ╚══════════════════════════════════════════════════════════╝ */}
      <section className="mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white p-10 md:p-16 shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute -top-20 -right-10 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-24 -left-10 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-blob-slow" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 30%, white 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <div className="relative grid md:grid-cols-3 gap-10 items-center">
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-4 backdrop-blur">
                <Clock className="w-3.5 h-3.5" /> Цаг хэмнэ, мэдлэг олж ав
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                Өнөөдрөөс сурч <br />
                <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  эхлэх цаг
                </span>{" "}
                болжээ.
              </h2>
              <p className="text-white/80 max-w-xl mb-8 text-lg">
                Та өөрийн сонирхолд тохирсон хичээлээ сонгож, шинэ мэдлэгтэй болоорой.
                Анхны 7 хоног — үнэгүй туршилт.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-2xl"
                >
                  <Rocket className="w-4 h-4" /> Үнэгүй бүртгүүлэх
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition"
                >
                  Хичээлүүд үзэх <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Decorative card */}
            <div className="hidden md:block relative h-56">
              <div className="absolute right-0 top-4 w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 animate-float-slow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-300 to-pink-400 flex items-center justify-center text-gray-900 font-bold">
                    🎓
                  </div>
                  <div>
                    <div className="font-bold">Гэрчилгээ</div>
                    <div className="text-xs text-white/70">Албан ёсны цахим</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-yellow-300 to-pink-400" />
                  </div>
                  <div className="text-xs text-white/70">
                    80% дуусахад үлдсэн байна
                  </div>
                </div>
              </div>
              <div className="absolute right-10 -bottom-2 px-3 py-1.5 rounded-full bg-emerald-400 text-emerald-900 text-xs font-bold shadow-lg">
                ✓ Идэвхжсэн
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
