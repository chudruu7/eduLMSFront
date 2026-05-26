// src/modules/course/CourseDetail.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourse, listMyPurchases } from '../../services/api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { useEffect, useState } from 'react';
import EmbedPreview from '../common/EmbedPreview.jsx';
import QPayModal from '../payments/QPayModal.jsx';
import { hasLocalPurchase } from '../payments/purchaseStore.js';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Edit3,
  Star,
  Play,
  User,
  Tag,
  CheckCircle,
  Clock,
  Award,
  ExternalLink,
  Lock,
  ShoppingCart,
} from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const { me } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [activeLink, setActiveLink] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(true);
  const [showQPay, setShowQPay] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      setLoading(true);
      try {
        const found = await getCourse(id);
        setCourse(found);
        setActiveLink(0);
      } catch (e) {
        console.error('Хичээл ачаалахад алдаа:', e);
        toast.error('Хичээлийн мэдээллийг ачаалж чадсангүй.');
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [id]);

  // Худалдан авалтын статусыг шалгах:
  //   1) local storage-д байвал — шууд нээнэ (logout/login ч үлдэнэ)
  //   2) Үгүй бол backend `listMyPurchases()`-ээс шалгана
  useEffect(() => {
    let cancelled = false;
    async function checkPurchase() {
      setPurchaseLoading(true);
      try {
        if (!me) {
          if (!cancelled) setHasPurchased(false);
          return;
        }

        // 1) Орон нутгийн кешт үзэх (хурдан, logout-д тэсвэртэй)
        const userId = me._id || me.id;
        if (hasLocalPurchase(userId, id)) {
          if (!cancelled) setHasPurchased(true);
          return;
        }

        // 2) Backend-ээс жагсаалт татах
        const purchases = await listMyPurchases();
        // Покупка нь олон хэлбэртэй байж болох тул өргөн шалгалт хийе:
        // { course: { _id } }, { courseId }, { _id }, эсвэл зүгээр ID string
        const purchased = Array.isArray(purchases) && purchases.some((p) => {
          if (!p) return false;
          if (typeof p === 'string') return p === id;
          const pid =
            p.courseId ||
            p.course_id ||
            p?.course?._id ||
            p?.course?.id ||
            p._id ||
            p.id;
          return String(pid) === String(id);
        });
        if (!cancelled) setHasPurchased(!!purchased);
      } catch (e) {
        console.error('Худалдан авалт шалгахад алдаа:', e);
        if (!cancelled) setHasPurchased(false);
      } finally {
        if (!cancelled) setPurchaseLoading(false);
      }
    }
    checkPurchase();
    return () => { cancelled = true; };
  }, [id, me]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-72 bg-gray-200 rounded-3xl mb-6" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔎</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Хичээл олдсонгүй</h2>
        <p className="text-gray-500 mb-6">
          Таны хайсан хичээл устгагдсан эсвэл байхгүй байж магадгүй.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Буцах
        </Link>
      </div>
    );
  }

  const courseId = course._id || course.id;
  // teacherId нь string, ObjectId эсвэл populated object байж болох тул
  // string болгож харьцуулна.
  const courseTeacherId = String(
    course?.teacherId?._id ?? course?.teacherId?.id ?? course?.teacherId ?? ''
  );
  const myId = String(me?._id ?? me?.id ?? '');
  const isMine = !!myId && !!courseTeacherId && courseTeacherId === myId;
  const canEdit = me?.role === 'admin' || (me?.role === 'teacher' && isMine);
  const isFree = !course.price || course.price === 0;
  const bundleLinks = Array.isArray(course.bundleLinks) ? course.bundleLinks : [];
  const currentLink = bundleLinks[activeLink];

  // 🔒 Хандах эрхийг шалгах: үнэгүй / админ / тухайн хичээлийн багш / худалдан авсан оюутан
  const isOwnerTeacher = me?.role === 'teacher' && isMine;
  const hasAccess = isFree || me?.role === 'admin' || isOwnerTeacher || hasPurchased;

  const handleRate = (stars) => {
    setRating(stars);
    toast.success(`Та ${stars} од өгсөн. Баярлалаа!`);
  };

  const handlePurchase = () => {
    if (!me) {
      toast.error('Худалдан авахын тулд эхлээд нэвтэрнэ үү.');
      navigate('/login');
      return;
    }
    setShowQPay(true);
  };

  const handlePaymentSuccess = () => {
    setHasPurchased(true);
    setShowQPay(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-indigo-600 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Хичээлүүд
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate">{course.title}</span>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />

        <div className="relative px-6 md:px-12 py-12 md:py-20 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-sm">
              <Tag className="w-3.5 h-3.5" />
              {course.courseCategory || 'Ангилалгүй'}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold
                ${isFree
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-gray-900'
                  : 'bg-gradient-to-r from-pink-400 to-rose-400 text-gray-900'}`}
            >
              {isFree ? 'Үнэгүй' : `${course.price}₮`}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            {course.title}
          </h1>

          <p className="text-white/80 text-lg max-w-2xl mb-6 line-clamp-3">
            {course.description || 'Тайлбар алга.'}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <div className="flex items-center gap-2">
              {course.teacherImage ? (
                <img
                  src={course.teacherImage}
                  alt={course.teacherName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-white/60 text-xs">Багш</div>
                <div className="font-semibold">{course.teacherName || 'Тодорхойгүй'}</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-white/80">
              <Clock className="w-4 h-4" />
              <span>{bundleLinks.length} хичээл</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-white/80">
              <Award className="w-4 h-4" />
              <span>Төгсөлтийн гэрчилгээтэй</span>
            </div>
          </div>

          {canEdit && (
            <button
              onClick={() => navigate(`/teacher/edit/${courseId}`)}
              className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              <Edit3 className="w-4 h-4" /> Засварлах
            </button>
          )}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content — Video/Preview + Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Player area */}
          {purchaseLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
              <div className="h-48 bg-gray-200 rounded" />
            </div>
          ) : !hasAccess ? (
            /* 🔒 Төлбөртэй хичээл — худалдан аваагүй хэрэглэгчид контент харагдахгүй */
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-64 object-cover filter blur-sm"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-indigo-900" />
                )}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6 text-center">
                  <Lock className="w-14 h-14 mb-4 text-amber-400" />
                  <h3 className="text-2xl font-bold mb-2">Энэ хичээл төлбөртэй</h3>
                  <p className="text-white/80 mb-5 max-w-md">
                    Хичээлийн бүтэн агуулгыг үзэхийн тулд эхлээд
                    <span className="font-bold text-amber-300"> {course.price}₮ </span>
                    төлбөр хийнэ үү.
                  </p>
                  <button
                    onClick={handlePurchase}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Худалдан авах
                  </button>
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 text-sm text-gray-500">
                Нийт <span className="font-semibold text-gray-700">{bundleLinks.length}</span> хичээл.
                Худалдан авсны дараа бүгдийг нь үзэх боломжтой.
              </div>
            </div>
          ) : currentLink ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <div className="min-w-0">
                  <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">
                    Хичээл {activeLink + 1} / {bundleLinks.length}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {currentLink.title || `Хичээл ${activeLink + 1}`}
                  </h3>
                </div>
                <a
                  href={currentLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Шинэ цонхонд нээх <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="bg-black">
                <EmbedPreview url={currentLink.url} />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Play className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Энэ хичээлд материал нэмэгдээгүй байна.</p>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-500" />
              Хичээлийн тухай
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {course.description || 'Тайлбар алга.'}
            </p>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Үнэлгээ өгөх</h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => handleRate(s)}
                  className="transition-transform hover:scale-110"
                  aria-label={`${s} од`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm text-gray-600 font-medium">{rating}/5</span>
              )}
            </div>
          </div>
        </div>

        {/* QPay Modal */}
        {showQPay && (
          <QPayModal
            courseId={courseId}
            courseTitle={course.title}
            amount={course.price}
            teacherName={course.teacherName}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowQPay(false)}
          />
        )}

        {/* Sidebar — Lesson list */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <h3 className="font-bold text-lg">Хичээлийн жагсаалт</h3>
              <p className="text-sm text-white/80">{bundleLinks.length} хичээл</p>
            </div>
            {bundleLinks.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 italic">
                Материал алга.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-[28rem] overflow-y-auto">
                {bundleLinks.map((link, i) => {
                  const locked = !hasAccess;
                  return (
                    <li key={i}>
                      <button
                        onClick={() => (locked ? handlePurchase() : setActiveLink(i))}
                        disabled={purchaseLoading}
                        className={`w-full text-left px-5 py-3 flex items-center gap-3 transition
                          ${!locked && i === activeLink
                            ? 'bg-indigo-50 border-l-4 border-indigo-500'
                            : 'hover:bg-gray-50 border-l-4 border-transparent'}
                          ${locked ? 'cursor-not-allowed opacity-80' : ''}`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                            ${locked
                              ? 'bg-gray-200 text-gray-400'
                              : i === activeLink
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 text-gray-500'}`}
                        >
                          {locked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-gray-400">Хичээл {i + 1}</div>
                          <div className="text-sm font-medium text-gray-800 truncate">
                            {link.title || `Хичээл ${i + 1}`}
                          </div>
                        </div>
                        {locked && (
                          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide">
                            Түгжигдсэн
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
