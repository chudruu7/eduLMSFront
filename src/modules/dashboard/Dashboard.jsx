import { useAuth } from '../auth/AuthContext.jsx';
import { listCourses } from '../../services/api.js';
import { useLocation } from 'react-router-dom';
import CourseCard from '../course/CourseCard.jsx';
import AdminPanel from '../admin/AdminPanel.jsx';
import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, BookOpen, BadgeDollarSign, LayoutGrid } from 'lucide-react';

export default function Dashboard() {
  const { me, loading: authLoading } = useAuth();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const q = (params.get('q') || '').trim().toLowerCase();

  // Дата болон ачааллын төлөв
  const [allCourses, setAllCourses] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  // Tab: 'all' | 'free' | 'paid'
  const [tab, setTab] = useState('all');

  // Асинхрон дата авалт
  useEffect(() => {
    if (authLoading || (me && me.role === 'admin')) {
      setDataLoading(false);
      return;
    }

    async function fetchCourses() {
      try {
        setDataLoading(true);
        const coursesData = await listCourses();
        setAllCourses(coursesData || []);
      } catch (error) {
        console.error('Хичээлүүдийг ачаалахад алдаа гарлаа:', error);
        setAllCourses([]);
      } finally {
        setDataLoading(false);
      }
    }

    if (!authLoading && me && me.role !== 'admin') {
      fetchCourses();
    }
  }, [me, authLoading, refresh]);

  const reload = () => setRefresh((r) => r + 1);

  // Role-оор хандах эрх + хайлт
  const visibleCourses = useMemo(() => {
    return allCourses.filter((c) => {
      if (!me || me.role === 'admin') return false;

      const allowed = Array.isArray(c.allowedRoles)
        ? c.allowedRoles
        : [c.allowedRoles].filter(Boolean);
      let visibleByRole = false;
      const myId = String(me._id ?? me.id ?? '');
      const courseTeacherId = String(
        c?.teacherId?._id ?? c?.teacherId?.id ?? c?.teacherId ?? ''
      );
      if (me.role === 'teacher' && myId && courseTeacherId === myId) {
        visibleByRole = true;
      } else {
        visibleByRole = allowed.includes(me.role);
      }
      if (!visibleByRole) return false;

      if (q) {
        const hay = `${c.title}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [allCourses, me, q]);

  // Үнэгүй / төлбөртэй ангилал
  const freeCourses = useMemo(
    () => visibleCourses.filter((c) => !c.price || c.price === 0),
    [visibleCourses]
  );
  const paidCourses = useMemo(
    () => visibleCourses.filter((c) => c.price && c.price > 0),
    [visibleCourses]
  );

  // Tab-аар үзүүлэх список
  const shownCourses =
    tab === 'free' ? freeCourses : tab === 'paid' ? paidCourses : visibleCourses;

  if (authLoading || dataLoading) {
    return <div className="text-center py-20 text-gray-500">Ачаалж байна...</div>;
  }

  if (me && me.role === 'admin') {
    return <AdminPanel />;
  }

  // Tab metadata
  const tabs = [
    {
      key: 'all',
      label: 'Бүгд',
      count: visibleCourses.length,
      icon: LayoutGrid,
      activeStyle: 'bg-indigo-600 text-white shadow-md',
    },
    {
      key: 'free',
      label: 'Үнэгүй',
      count: freeCourses.length,
      icon: Sparkles,
      activeStyle: 'bg-emerald-500 text-white shadow-md',
    },
    {
      key: 'paid',
      label: 'Төлбөртэй',
      count: paidCourses.length,
      icon: BadgeDollarSign,
      activeStyle: 'bg-rose-500 text-white shadow-md',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-7 h-7 text-indigo-600" />
        <h2 className="text-3xl text-gray-900 font-extrabold">Миний хичээлүүд</h2>
      </div>
      <p className="text-gray-500 mt-1">
        Энд таны хандалттай хичээлүүд харагдана. Үнэгүй болон төлбөртэй хичээлүүд
        тусдаа табтай.
      </p>

      {/* Tab бар */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-gray-100 pb-3">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${
                  isActive
                    ? t.activeStyle
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  isActive ? 'bg-white/25' : 'bg-white text-gray-600'
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Хэрэв All табтай үед, хоёр section-р үзүүлж болно (хүсэлт ёсоор тусгаар) */}
      {tab === 'all' ? (
        <div className="mt-8 space-y-12">
          {/* Үнэгүй */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-6 rounded-full bg-emerald-500" />
                <h3 className="text-xl font-bold text-gray-900">
                  Үнэгүй хичээлүүд
                </h3>
                <span className="text-sm text-gray-400">
                  ({freeCourses.length})
                </span>
              </div>
              {freeCourses.length > 6 && (
                <button
                  onClick={() => setTab('free')}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Бүгдийг үзэх →
                </button>
              )}
            </div>
            {freeCourses.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {freeCourses.slice(0, 6).map((c) => (
                  <CourseCard key={c._id || c.id} course={c} onChanged={reload} />
                ))}
              </div>
            ) : (
              <EmptyState message="Үнэгүй хичээл одоогоор алга." />
            )}
          </section>

          {/* Төлбөртэй */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-6 rounded-full bg-rose-500" />
                <h3 className="text-xl font-bold text-gray-900">
                  Төлбөртэй хичээлүүд
                </h3>
                <span className="text-sm text-gray-400">
                  ({paidCourses.length})
                </span>
              </div>
              {paidCourses.length > 6 && (
                <button
                  onClick={() => setTab('paid')}
                  className="text-sm font-medium text-rose-600 hover:text-rose-700"
                >
                  Бүгдийг үзэх →
                </button>
              )}
            </div>
            {paidCourses.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {paidCourses.slice(0, 6).map((c) => (
                  <CourseCard key={c._id || c.id} course={c} onChanged={reload} />
                ))}
              </div>
            ) : (
              <EmptyState message="Төлбөртэй хичээл одоогоор алга." />
            )}
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {shownCourses.map((c) => (
            <CourseCard key={c._id || c.id} course={c} onChanged={reload} />
          ))}
          {!shownCourses.length && (
            <div className="col-span-full">
              <EmptyState
                message={
                  tab === 'free'
                    ? 'Үнэгүй хичээл алга байна.'
                    : 'Төлбөртэй хичээл алга байна.'
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
      <div className="text-4xl mb-2">📭</div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
