import { useAuth } from './AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiSettings, FiUser } from 'react-icons/fi'; // React Icons-ийг импортлов

export default function Profile() {
  // updateProfile функцыг AuthContext-ээс татаж авна.
  const { me, logout, updateProfile } = useAuth(); 
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState(null);
  // me?.avatar-ийг эхний утга болгож, context шинэчлэгдэхэд preview мөн шинэчлэгдэх боломжтой
  const [preview, setPreview] = useState(me?.avatar || null); 
  const [name, setName] = useState(me?.name || '');
  const [phone, setPhone] = useState(me?.phone || '');
  const [isSaving, setIsSaving] = useState(false); // Хадгалах үйлдэл хийгдэж байгаа эсэх

  // AuthContext-ийн me state өөрчлөгдөхөд дотоод state-үүдийг шинэчлэх (me-г өөр хүнээр сольж нэвтрэх тохиолдолд)
  useEffect(() => {
    if (me) {
      setName(me.name || '');
      setPhone(me.phone || '');
      setPreview(me.avatar || null);
    } else {
      // Хэрэглэгч гарах үед login руу шилжүүлэх
      navigate('/login', { replace: true });
    }
  }, [me, navigate]);

  if (!me) {
    return null; // me байхгүй бол рендэр хийхгүй
  }

  const handleLogout = () => {
    logout();
    // navigate('/login', { replace: true }); // Энэ үйлдлийг useEffect хийнэ
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  // 💡 ШИНЭЧЛЭГДСЭН: updateProfile-ийг зөв дуудах логик
  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    let avatarBase64 = null;

    try {
      // 1. Аватарын файлыг base64 болгох
      if (avatarFile) {
        avatarBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });
      }

      // 2. Шинэчлэх мэдээллийг бэлтгэх
      const partialUpdate = {};
      // Зөвхөн өөрчлөгдсөн утгуудыг илгээнэ.
      if (name.trim() !== (me.name || '').trim()) partialUpdate.name = name.trim();
      if (phone.trim() !== (me.phone || '').trim()) partialUpdate.phone = phone.trim();
      if (avatarBase64) partialUpdate.avatar = avatarBase64;
      
      // Хэрэв өөрчлөлт ороогүй бол хадгалахгүй
      if (Object.keys(partialUpdate).length === 0) {
        toast('Ямар ч өөрчлөлт оруулаагүй байна.', { icon: 'ℹ️' });
        setIsSaving(false);
        return;
      }
      
      // 3. AuthContext-ийн updateProfile функцийг дуудах
      await updateProfile(partialUpdate); 

      toast.success('Профайл амжилттай шинэчлэгдлээ!');
      setAvatarFile(null); // Амжилттай хадгалсны дараа файлыг null болгоно.

    } catch (error) {
      console.error("Профайл хадгалахад алдаа гарлаа:", error);
      toast.error(`Профайл шинэчлэхэд алдаа гарлаа: ${error.message || 'Үл мэдэгдэх алдаа'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden p-6 md:p-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <FiSettings className="w-6 h-6 mr-3 text-indigo-600" />
            Миний Профайл
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition duration-300 shadow-lg"
          >
            Гарах
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Аватар ба Мэдээлэл */}
          <div className="md:col-span-1 flex flex-col items-center space-y-4">
            <div className="relative group">
              <img
                src={preview || 'https://placehold.co/200x200/4F46E5/FFFFFF?text=Аватар'}
                alt="Профайл зураг"
                className="w-48 h-48 object-cover rounded-full border-4 border-indigo-200 shadow-xl transition-transform duration-300 group-hover:scale-105"
              />
              <label htmlFor="avatar-upload" className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full cursor-pointer">
                <span className="text-white text-sm font-semibold p-2 rounded-full bg-indigo-500 hover:bg-indigo-600">Зураг солих</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            
            <p className="text-xl font-bold text-gray-800">{me.name}</p>
            <span className={`px-4 py-1 text-sm font-semibold rounded-full capitalize shadow-md
              ${me.role === 'admin' ? 'bg-red-100 text-red-800' :
               me.role === 'teacher' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`
            }>
              {me.role}
            </span>
            
            {/* Шинэчлэгдэхгүй мэдээлэл */}
            <div className="w-full text-center mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-500">Бүртгүүлсэн огноо:</p>
              <p className="text-md font-semibold text-gray-700">{new Date(me.createdAt).toLocaleDateString('mn-MN')}</p>
            </div>
          </div>

          {/* Мэдээлэл Засах Хэсэг */}
          <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl shadow-inner">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Үндсэн Мэдээлэл</h2>
            <div className="space-y-5">
              
              {/* Нэр */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Нэр</label>
                <input
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              {/* Утасны дугаар */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Утасны дугаар</label>
                <input
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Жишээ: 9911xxxx"
                />
              </div>
              
              {/* Имэйл (Өөрчлөгдөхгүй) */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Имэйл</label>
                <div className="w-full px-4 py-2 rounded-xl bg-gray-200 text-gray-600 border border-gray-300 select-none">
                  {me.email}
                </div>
              </div>
              
              {/* Эрх (Өөрчлөгдөхгүй) */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Эрх</label>
                <div className="w-full px-4 py-2 rounded-xl bg-gray-200 text-gray-600 border border-gray-300 select-none capitalize">
                  {me.role}
                </div>
              </div>

            </div>

            {/* Хадгалах Товч */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full mt-8 px-6 py-3 text-white font-bold rounded-xl transition duration-300 shadow-lg ${
                isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSaving ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Хадгалж байна...
                </span>
              ) : (
                'Өөрчлөлтүүдийг Хадгалах'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
