// src/modules/category/CategoryCourses.jsx
// Ангилал дээр дарахад тухайн ангилалын хичээлүүдийг шүүж харуулна.

import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { listCourses } from '../../services/api.js';
import CourseCard from '../course/CourseCard.jsx';
import { courseMatchesCategory } from './categories.js';

// Нэрийг хооронд нь харьцуулж байхдаа: том/жижиг үсэг, илүү зай хасаад тэнцүүлнэ.
const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

export default function CategoryCourses() {
  const { cat } = useParams();
  const category = decodeURIComponent(cat || '');

  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const [refresh, setRefresh] = useState(0);
  const reload = () => setRefresh((r) => r + 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await listCourses();
        if (!cancelled) setAllCourses(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Хичээл ачаалахад алдаа:', e);
        if (!cancelled) setAllCourses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const courses = useMemo(() => {
    let list = allCourses.filter((c) => courseMatchesCategory(c, category));
    if (query.trim()) {
      const q = normalize(query);
      list = list.filter((c) =>
        `${c.title} ${c.description || ''} ${c.teacherName || ''}`
          .toLowerCase()
          .includes(q)
      );
    }
    return list;
  }, [allCourses, category, query]);

  const freeCount = courses.filter((c) => !c.price).length;
  const paidCount = courses.length - freeCount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link
          to="/student/categories"
          className="hover:text-indigo-600 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Ангилалууд
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">{category}</span>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-6 md:p-8 mb-8 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%)]" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
            Сургалтын ангилал
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
            {category}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              Нийт {courses.length} хичээл
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/80">
              Үнэгүй {freeCount}
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-500/80">
              Төлбөртэй {paidCount}
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Хичээл / багшаар хайх..."
          className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : courses.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <CourseCard key={c._id || c.id} course={c} onChanged={reload} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-5xl mb-3">📭</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Энэ ангилалд хичээл олдсонгүй
          </h3>
          <p className="text-gray-500 text-sm">
            "<span className="font-medium">{category}</span>" ангилалд одоогоор
            нэмсэн хичээл байхгүй байна.
          </p>
        </div>
      )}
    </div>
  );
}
