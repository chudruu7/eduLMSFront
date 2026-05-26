import { useForm, useFieldArray } from 'react-hook-form';
import { createCourse } from '../../services/api.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { COURSE_CATEGORIES } from '../category/categories.js';

const normalizeRoles = (val) => {
  if (!val) return ['student', 'teacher'];
  if (Array.isArray(val)) return val.length ? val : ['student', 'teacher'];
  return [val];
};

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

export default function UploadCourse() {
  const { register, handleSubmit, control, watch } = useForm({ defaultValues: { bundleLinks: [] } });
  const navigate = useNavigate();
  const { me } = useAuth();
  const [thumbPreview, setThumbPreview] = useState('/Untitled.jpg');
  const [teacherImagePreview, setTeacherImagePreview] = useState('');
  const { fields, append, remove } = useFieldArray({ control, name: 'bundleLinks' });
  const isPaid = watch('isPaid');

  const onSubmit = async (data) => {
    try {
      const thumbData = data.thumbnail?.[0]
        ? await imageToBase64Compressed(data.thumbnail[0], 1280, 720, 0.7)
        : thumbPreview;
      if (!data.title || !data.description) {
        toast.error('Гарчиг, тайлбар хоёрыг бөглөнө үү');
        return;
      }
      if (!data.bundleLinks || data.bundleLinks.length === 0) {
        toast.error('Дор хаяж 1 линк нэмнэ үү');
        return;
      }
      if (!data.courseCategory) {
        toast.error('Хичээлийн төрлийг сонгоно уу');
        return;
      }
      if (!teacherImagePreview) {
        toast.error('Багшийн зураг заавал оруулна уу (3x4)');
        return;
      }
      if (data.isPaid === 'yes' && (!data.price || Number(data.price) <= 0)) {
        toast.error('Төлбөртэй бол үнэ оруулна уу');
        return;
      }

      const course = {
        id: `c${Date.now()}`,
        title: data.title,
        description: data.description,
        thumbnail: thumbData,
        allowedRoles: normalizeRoles(data.allowedRoles),
        teacherId: me.id,
        teacherName: me.name,
        teacherImage: teacherImagePreview,
        courseType: 'bundle',
        courseCategory: data.courseCategory,
        isPaid: data.isPaid === 'yes',
        price: data.isPaid === 'yes' ? Number(data.price) : 0,
        bundleLinks: (data.bundleLinks || []).map((b, i) => ({
          title: (b?.title || '').trim() || `Link ${i + 1}`,
          url: (b?.url || '').trim() || '#',
        })),
      };

      // ✅ ЗАСВАР: createCourse нь async. await-гүй тул алдаа залгамжлагдахгүй, navigate эрт ажилладаг байв.
      await createCourse(course);
      toast.success('Багц хичээл нэмэгдлээ');
      navigate('/dashboard');
    } catch (err) {
      console.error('Upload bundle error:', err);
      toast.error('Хичээл нэмэхэд алдаа гарлаа. Дахин оролдоно уу.');
    }
  };

  return (
    <div className="
      max-w-2xl mx-auto p-6 rounded-2xl
      bg-white/10 backdrop-blur-lg border border-white/20
      shadow-xl
    ">
      <h2 className="text-3xl font-bold text-gray-950 mb-4">Багц хичээл нэмэх</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-4 text-gray-950">
        
        {/* Гарчиг */}
        <div>
          <label className="block mb-1 text-gray-950">Гарчиг</label>
          <input
            className="w-full bg-white/10 backdrop-blur-sm border border-gray/20 rounded-lg text-gray-950 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 p-2"
            {...register('title', { required: true })}
          />
        </div>

        {/* Тайлбар */}
        <div>
          <label className="block mb-1 text-gray-950">Тайлбар</label>
          <textarea
            rows={3}
            className="w-full bg-white/10 backdrop-blur-sm border border-gray/20 rounded-lg text-gray-950 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 p-2"
            {...register('description', { required: true })}
          />
        </div>

        {/* Thumbnail зураг */}
        <div>
          <label className="block mb-1 text-gray-950">Thumbnail зураг</label>
          <input
            type="file"
            accept="image/*"
            className="w-full bg-white/10 backdrop-blur-sm border border-gray/20 rounded-lg text-gray-950 p-2"
            {...register('thumbnail')}
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
          <div className="mt-2">
            <img
              src={thumbPreview}
              alt="preview"
              className="w-full max-h-52 object-cover rounded-xl border border-gray/30 shadow-lg"
            />
          </div>
        </div>

        {/* Багшийн зураг */}
        <div>
          <label className="block mb-1 text-gray-950">Багшийн зураг (3x4)</label>
          <input
            type="file"
            accept="image/*"
            className="w-full bg-white/10 backdrop-blur-sm border border-gray/20 rounded-lg text-gray-950 p-2"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) {
                try {
                  // ✅ ЗАСВАР: JPEG quality нь 0..1 хооронд байх ёстой. 2 байсан тул буруу байв.
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
          <label className="block mb-1 text-gray-950">Хичээлийн төрөл</label>
          <select
            className="w-full bg-white/10 backdrop-blur-sm border border-gray/20 rounded-lg text-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-400 p-2"
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
          <label className="block mb-1 text-gray-950">Төлбөртэй эсэх</label>
          <select
            className="w-full bg-white/10 backdrop-blur-sm border border-gray/20 rounded-lg text-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-400 p-2"
            {...register('isPaid')}
          >
            <option value="no">Үнэгүй</option>
            <option value="yes">Төлбөртэй</option>
          </select>
        </div>

        {isPaid === 'yes' && (
          <div>
            <label className="block mb-1 text-gray-950">Үнэ (₮)</label>
            <input
              type="number"
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-950 placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-blue-400 p-2"
              {...register('price')}
              placeholder="Жишээ: 50000"
            />
          </div>
        )}

        {/* Линкүүд */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block mb-1 text-gray-950">Хичээлийн линк</label>
            <button
              type="button"
              className="bg-white/20 hover:bg-white/30 text-gray-950 rounded-lg shadow-md hover:scale-105 transition-transform px-3 py-1"
              onClick={() => append({ title: '', url: '' })}
            >
              + Нэмэх
            </button>
          </div>
          {fields.map((f, idx) => (
            <div key={f.id} className="grid grid-cols-5 gap-3 mt-2">
              <input
                className="col-span-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-950 placeholder-gray/50 p-2"
                placeholder="Линк гарчиг"
                {...register(`bundleLinks.${idx}.title`)}
              />
              <input
                className="col-span-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-950 placeholder-gray/50 p-2"
                placeholder="https://..."
                {...register(`bundleLinks.${idx}.url`, { required: true })}
              />
              <div className="col-span-5 flex justify-end">
                <button
                  type="button"
                  className="bg-white/20 hover:bg-white/30 text-gray-950 rounded-lg shadow-md hover:scale-105 transition-transform px-3 py-1"
                  onClick={() => remove(idx)}
                >
                  Хасах
                </button>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-950/70 mt-1">
            YouTube/Vimeo/PDF/веб хуудас зэргийг линк болгон оруулж болно.
          </p>
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1 text-gray-950">Энэ хичээл харагдах role</label>
          <select
            multiple
            className="w-full h-28 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-400 p-2"
            {...register('allowedRoles')}
          >
            <option value="student">Оюутан</option>
            <option value="teacher">Багш</option>
          </select>
          <p className="text-xs text-gray-950/70 mt-1">Windows: Ctrl+Click | macOS: Cmd+Click</p>
        </div>

        <button
          className="bg-blue-500/80 hover:bg-blue-500 text-gray-950 rounded-xl shadow-lg hover:scale-105 transition-transform px-4 py-2"
        >
          Нэмэх
        </button>
      </form>
    </div>
  );
}
