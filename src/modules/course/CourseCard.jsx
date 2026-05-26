import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, User, Tag, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { deleteCourse } from '../../services/api.js';
import toast from 'react-hot-toast';

export default function CourseCard({ course, onChanged }) {
  const { me } = useAuth();
  const navigate = useNavigate();

  const isFree = !course.price || course.price === 0;
  const courseId = course._id || course.id;
  const myId = me?._id || me?.id;
  const canManage =
    me?.role === 'admin' ||
    (me?.role === 'teacher' && String(course.teacherId) === String(myId));

  // Link нь Card-ыг бүхэлд нь хамардаг тул товч дээр дарвал navigate болохоос сэргийлнэ.
  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleEdit = (e) => {
    stop(e);
    navigate(`/teacher/edit/${courseId}`);
  };

  const handleDelete = async (e) => {
    stop(e);
    const ok = window.confirm(
      `"${course.title}" хичээлийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`
    );
    if (!ok) return;
    try {
      await deleteCourse(courseId);
      // toast амжилттай мессежийг api.js доторх deleteCourse хариуцана.
      if (typeof onChanged === 'function') onChanged();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Устгахад алдаа гарлаа.');
    }
  };

  return (
    <Link
      to={`/course/${courseId}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md
                 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail || '/Untitled.jpg'}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Play icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
            <PlayCircle className="w-10 h-10 text-indigo-600" />
          </div>
        </div>

        {/* Category badge (top-left) */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-gray-800 font-semibold shadow">
          <Tag className="w-3 h-3 text-indigo-600" />
          {course.courseCategory || 'Ангилалгүй'}
        </div>

        {/* Price badge (top-right) */}
        <div
          className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-lg
            ${isFree
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
              : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'}`}
        >
          {isFree ? 'Үнэгүй' : `${course.price}₮`}
        </div>

        {/* 🎯 Засварлах / Устгах товч — зөвхөн өөрийн хичээл (эсвэл админ) дээр харагдана */}
        {canManage && (
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleEdit}
              title="Засварлах"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/95 hover:bg-indigo-500 hover:text-white text-indigo-600 shadow-lg transition"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              title="Устгах"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/95 hover:bg-rose-500 hover:text-white text-rose-600 shadow-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>

        {course.description && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
            {course.description}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {course.teacherImage ? (
              <img
                src={course.teacherImage}
                alt={course.teacherName}
                className="w-8 h-8 rounded-full object-cover border-2 border-indigo-100"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
            )}
            <span className="text-xs text-gray-600 truncate">
              {course.teacherName || 'Тодорхойгүй'}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:gap-2 transition-all">
            Үзэх <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
