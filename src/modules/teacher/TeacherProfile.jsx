import { useState } from 'react';

export default function TeacherProfile() {
  const [form, setForm] = useState({
    avatar: null,
    name: '',
    nickname: '',
    gender: '',
    country: '',
    subject: '',
    phone: '',
    facebook: '',
    instagram: '',
    github: '',
    lessonImage: null,
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [lessonImageFile, setLessonImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, avatar: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleLessonImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLessonImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, lessonImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // ✅ teacherProfiles массив хэлбэрээр хадгална
    const existingData = localStorage.getItem('teacherProfiles');
    let profiles = [];

    if (existingData) {
      try {
        profiles = JSON.parse(existingData);
        if (!Array.isArray(profiles)) profiles = [];
      } catch {
        profiles = [];
      }
    }

    profiles.push(form); // шинэ багшийг нэмнэ
    localStorage.setItem('teacherProfiles', JSON.stringify(profiles));

    alert('Мэдээлэл хадгалагдлаа!');
    console.log('Saved Profiles:', profiles);
  };

  const fields = [
    { label: 'Овог', name: 'nickname', type: 'text' },
    { label: 'Нэр', name: 'name', type: 'text' },
    {
      label: 'Хүйс', name: 'gender', type: 'select', options: [
        { value: '', label: 'Сонгоно уу' },
        { value: 'male', label: 'Эрэгтэй' },
        { value: 'female', label: 'Эмэгтэй' },
        { value: 'other', label: 'Бусад' },
      ]
    },
    {
      label: 'Улсаа сонгоно уу', name: 'country', type: 'select', options: [
        { value: '', label: 'Select Country' },
        { value: 'Mongolia', label: 'Mongolia' },
        { value: 'USA', label: 'USA' },
        { value: 'UK', label: 'UK' },
        { value: 'Japan', label: 'Japan' },
        { value: 'China', label: 'China' },
      ]
    },
    {
      label: 'Хичээл оруулах төрөл', name: 'subject', type: 'select', options: [
        { value: '', label: 'Сонгоно уу' },
        { value: 'math', label: 'ЕБС-ийн сургуулийн хичээл' },
        { value: 'programming', label: 'Мэдээллийн технологийн сургалт' },
        { value: 'physics', label: 'Төлбөргүй цахим хичээл' },
        { value: 'chemistry', label: 'Төрийн албан хаагчийн мэргэшүүлэх дунд хугацааны сургалт' },
        { value: 'english', label: 'Хэлний сургалт' },
      ]
    },
    { label: 'Утасны дугаар', name: 'phone', type: 'text' },
    { label: 'Facebook линк', name: 'facebook', type: 'text' },
    { label: 'Instagram линк', name: 'instagram', type: 'text' },
    { label: 'GitHub линк', name: 'github', type: 'text' },
  ];

  return (
    <div className=" ml-20 max-w-4xl w-full p-8 rounded-2xl shadow-2xl backdrop-blur-xl bg-gray border border-white/30">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
        📚 БАГШИЙН ХУВИЙН МЭДЭЭЛЭЛ
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/40 shadow-lg">
            {form.avatar ? (
              <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-3xl text-gray-300">👤</div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" id="avatarInput" />
          <label htmlFor="avatarInput" className="mt-4 px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold">
            Зураг өөрчлөх
          </label>
        </div>

        {/* Form Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(field => (
            <div key={field.name} className="form-control">
              <label className="block text-sm font-medium text-gray mb-1">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  className="w-full rounded-lg bg-blue-500 shadow-lg shadow-blue-500/50 text-white px-3 py-2"
                  value={form[field.name]}
                  onChange={handleChange}
                >
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-white text-black">
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  className="w-full rounded-lg bg-white/40 text-gray-800 px-3 py-2"
                  value={form[field.name]}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Image */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-950 mb-2">Хичээл оруулах зураг (3x4)</h3>
        <div className="flex items-center gap-4">
          <div className="w-24 h-32 border-4 border-dashed border-gray-40 rounded-lg overflow-hidden bg-gray/10 flex items-center justify-center">
            {form.lessonImage ? (
              <img src={form.lessonImage} alt="Lesson" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm">3x4</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleLessonImageChange} className="hidden" id="lessonImageInput" />
          <label htmlFor="lessonImageInput" className="px-6 py-2 rounded-lg bg-purple-500 text-white font-semibold">
            Upload Image
          </label>
        </div>
      </div>

      {/* Save */}
      <div className="mt-8 flex justify-end">
        <button onClick={handleSave} className="px-6 py-3 rounded-lg bg-green-500 shadow-lg shadow-green-500 text-white font-bold">
          Өөрчлөлтийг хадгалах
        </button>
      </div>
    </div>
  );
}
``