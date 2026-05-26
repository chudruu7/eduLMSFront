import { useForm, useFieldArray } from 'react-hook-form';
import { getCourse, updateCourse, deleteCourse } from '../../services/api.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { COURSE_CATEGORIES } from '../category/categories.js';

const imageToBase64Compressed = (file, maxW = 1280, maxH = 720, quality = 0.7) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxW / width, maxH / height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL('image/jpeg', quality);
        resolve(data);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { me } = useAuth();

  const { register, handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      allowedRoles: ['student', 'teacher'],
      bundleLinks: [],
      courseCategory: '',
      isPaid: 'no',
      price: 0,
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'bundleLinks' });
  const isPaid = watch('isPaid');

  const [thumbPreview, setThumbPreview] = useState('/Untitled.jpg');
  const [teacherImagePreview, setTeacherImagePreview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const c = await getCourse(id);
        if (cancelled) return;
        if (!c) {
          navigate('/dashboard');
          return;
        }
        // teacherId нь string, ObjectId эсвэл populated { _id, name } object
        // байх боломжтой тул өргөн хэлбэрээр гаргаж авч string болгож харьцуулна.
        const courseTeacherId = String(
          c?.teacherId?._id ?? c?.teacherId?.id ?? c?.teacherId ?? ''
        );
        const myId = String(me?._id ?? me?.id ?? '');
        const isOwner = courseTeacherId && myId && courseTeacherId === myId;

        if (me?.role !== 'admin' && !isOwner) {
          toast.error('Та зөвхөн өөрийн оруулсан хичээлийг засварлах боломжтой.');
          navigate('/dashboard');
          return;
        }

        setThumbPreview(c.thumbnail || '/Untitled.jpg');
        setTeacherImagePreview(c.teacherImage || '');
        reset({
          title: c.title || '',
          description: c.description || '',
          allowedRoles: c.allowedRoles || ['student', 'teacher'],
          bundleLinks: c.bundleLinks || [],
          courseCategory: c.courseCategory || '',
          isPaid: c.isPaid || (c.price > 0) ? 'yes' : 'no',
          price: c.price || 0,
        });
      } catch (e) {
        console.error('Course ачаалахад алдаа:', e);
        toast.error('Хичээл ачаалахад алдаа гарлаа.');
        navigate('/dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, me?.id, me?.role, reset, navigate]);

  const onSave = async (data) => {
    try {
      if (!data.title || !data.description) {
        toast.error('Гарчиг, тайлбар хоёрыг бөглөнө үү');
        return;
      }
      if (!data.courseCategory) {
        toast.error('Хичээлийн төрлийг сонгоно уу');
        return;
      }
      if (data.isPaid === 'yes' && (!data.price || Number(data.price) <= 0)) {
        toast.error('Төлбөртэй бол үнэ оруулна уу');
        return;
      }

      const updated = {
        id,
        title: data.title,
        description: data.description,
        thumbnail: thumbPreview,
        teacherImage: teacherImagePreview,
        courseCategory: data.courseCategory,
        isPaid: data.isPaid === 'yes',
        price: data.isPaid === 'yes' ? Number(data.price) : 0,
        allowedRoles: Array.isArray(data.allowedRoles)
          ? data.allowedRoles
          : [data.allowedRoles].filter(Boolean),
        bundleLinks: (data.bundleLinks || []).map((b, i) => ({
          title: (b?.title || '').trim() || `Link ${i + 1}`,
          url: (b?.url || '').trim() || '#',
        })),
      };
      await updateCourse(id, updated);
      toast.success('Хичээл амжилттай засагдлаа.');
      navigate(`/course/${id}`);
    } catch (e) {
      console.error('Update error', e);
      toast.error('Засвар хадгалахад алдаа гарлаа.');
    }
  };

  const onDelete = async () => {
    if (!confirm('Энэ хичээлийг бүр мөсөн устгах уу? Энэ үйлдлийг буцаах боломжгүй.')) return;
    try {
      await deleteCourse(id);
      navigate('/dashboard');
    } catch (e) {
      console.error('Delete error', e);
      toast.error('Устгахад алдаа гарлаа.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 text-center text-gray-500">
        Ачаалж байна...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 rounded-xl backdrop-blur-lg bg-gradient-to-br from-white/40 via-white/20 to-white/10 border border-white/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">Хичээл засварлах</h2>
        <button
          onClick={onDelete}
          className="px-4 py-2 rounded-md border border-red-400 text-red-500 hover:bg-red-500/10 transition"
        >
          Устгах
        </button>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="grid gap-5">
        {/* Гарчиг */}
        <div>
          <label className="block text-gray-800 mb-1">Гарчиг</label>
          <input
            className="w-full px-3 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register('title', { required: true })}
          />
        </div>

        {/* Тайлбар */}
        <div>
          <label className="block text-gray-800 mb-1">Дэлгэрэнгүй тайлбар бичнэ үү</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register('description', { required: true })}
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-gray-800 mb-1">Thumbnail оруулах</label>
          <input
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30 text-gray-900"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) {
                try {
                  const base64 = await imageToBase64Compressed(f, 1280, 720, 0.7);
                  setThumbPreview(base64);
                } catch {
                  toast.error('Зураг уншихад алдаа гарлаа');
                }
              }
            }}
          />
          <div className="mt-3">
            <img
              src={thumbPreview}
              alt="preview"
              className="w-full max-h-52 object-cover rounded-xl border border-white/30"
            />
          </div>
        </div>

        {/* Багшийн зураг */}
        <div>
          <label className="block text-gray-800 mb-1">Багшийн зураг (3x4)</label>
          <input
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30 text-gray-900"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) {
                try {
                  const base64 = await imageToBase64Compressed(f, 800, 1000, 0.85);
                  setTeacherImagePreview(base64);
                } catch {
                  toast.error('Зураг уншихад алдаа гарлаа');
                }
              }
            }}
          />
          <div className="mt-3">
            <img
              src={teacherImagePreview || '/default-teacher.png'}
              alt="Teacher"
              className="w-24 h-32 object-cover rounded-lg border border-white/30 shadow-lg"
            />
          </div>
        </div>

        {/* Хичээлийн төрөл */}
        <div>
          <label className="block text-gray-800 mb-1">Хичээлийн төрөл</label>
          <select
            className="w-full px-3 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register('courseCategory', { required: true })}
          >
            <option value="">Сонгоно уу</option>
            {COURSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Төлбөртэй эсэх */}
        <div>
          <label className="block text-gray-800 mb-1">Төлбөртэй эсэх</label>
          <select
            className="w-full px-3 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register('isPaid')}
          >
            <option value="no">Үнэгүй</option>
            <option value="yes">Төлбөртэй</option>
          </select>
        </div>

        {isPaid === 'yes' && (
          <div>
            <label className="block text-gray-800 mb-1">Үнэ (₮)</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('price')}
              placeholder="Жишээ: 50000"
            />
          </div>
        )}

        {/* Линкүүд */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-800">Хичээлийн линкүүд</label>
            <button
              type="button"
              className="px-3 py-1 rounded-md bg-indigo-500 text-white hover:bg-cyan-500"
              onClick={() => append({ title: '', url: '' })}
            >
              + Нэмэх
            </button>
          </div>
          {fields.map((f, idx) => (
            <div key={f.id} className="grid grid-cols-5 gap-3 mt-2">
              <input
                className="input col-span-2 px-3 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30"
                placeholder="Линк гарчиг"
                {...register(`bundleLinks.${idx}.title`)}
              />
              <input
                className="input col-span-3 px-3 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30"
                placeholder="https://..."
                {...register(`bundleLinks.${idx}.url`, { required: true })}
              />
              <div className="col-span-5 flex justify-end">
                <button
                  type="button"
                  className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
                  onClick={() => remove(idx)}
                >
                  Хасах
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Role сонголт */}
        <div>
          <label className="block text-gray-800 mb-1">Энэ хичээл харагдах role</label>
          <select
            multiple
            className="w-full h-28 px-3 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30 text-gray-900"
            {...register('allowedRoles')}
          >
            <option value="student">Оюутан</option>
            <option value="teacher">Багш</option>
          </select>
          <p className="text-xs text-gray-600 mt-1">Windows: Ctrl+Click | macOS: Cmd+Click</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Буцах
          </button>
          <button
            className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Хадгалах
          </button>
        </div>
      </form>
    </div>
  );
}
