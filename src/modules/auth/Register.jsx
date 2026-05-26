import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import { User, Mail, Lock, BookOpen, ChevronDown, ArrowRight } from 'lucide-react';

const PRIMARY_COLOR = 'indigo'; 

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', 
    motivation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        motivation: formData.role === 'teacher' ? formData.motivation : undefined,
    };

    try {
        await register(dataToSend);
        toast.success('Амжилттай бүртгүүлж, нэвтэрлээ!', { duration: 3000 });
        navigate('/'); 
    } catch (error) {
        if (error.message === 'TeacherRequestSent') {
            navigate('/login');
        } else {
            // ✅ ЗАСВАР: Өмнө нь зөвхөн console-д гаргадаг байсан тул хэрэглэгч алдааны талаар мэдэхгүй байв.
            toast.error(`Бүртгэлийн алдаа: ${error.message || 'Үл мэдэгдэх алдаа'}`);
            console.error('Бүртгэлийн алдаа:', error.message);
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  // Input field-ийн загвар
  const inputClass = `w-full pl-10 pr-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR}-500 focus:border-${PRIMARY_COLOR}-500 transition duration-200 shadow-sm`;

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-white-100">
      <div className={`w-full max-w-lg p-10 space-y-7`}>
        <header className="text-center">
          <div className={`mx-auto w-24 h-24 flex items-center justify-center mb-4`}>
             <img src="/newlogo.png" alt="EduLMS Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-wide font-sans">
            Шинээр eduLMS системийн эрх нээх
          </h2>
          <p className="mt-2 text-md text-gray-600 font-light opacity-90">
            Мэдээллийн сан руу нэвтрэх эрх үүсгэнэ.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Нэр */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">Бүтэн нэр</label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${PRIMARY_COLOR}-500`} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Овог нэр"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* И-мэйл */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">И-мэйл хаяг</label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${PRIMARY_COLOR}-500`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="И-мэйл хаяг"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Нууц үг */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">Нууц үг</label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${PRIMARY_COLOR}-500`} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Нууц үг оруулна уу"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Роль сонголт */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800">Бүртгүүлэх төрөл:</label>
            <div className="relative">
              <BookOpen className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${PRIMARY_COLOR}-500`} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR}-500 focus:border-${PRIMARY_COLOR}-500 transition duration-200 shadow-sm appearance-none`}
              >
                <option value="student" className="bg-white text-gray-900">
                  СУРАГЧ 
                </option>
                <option value="teacher" className="bg-white text-gray-900">
                  БАГШ  - Хүсэлт илгээнэ
                </option>
              </select>
              <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none`} />
            </div>
          </div>

          {/* Багш бол нэмэлт талбар (Motivation) */}
          {formData.role === 'teacher' && (
            <div className="space-y-1">
              <label htmlFor="motivation" className="block text-sm font-semibold text-gray-800">
                Багшлах хүсэлтийн тайлбар:
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                placeholder="Системд багшаар бүртгүүлэх шалтгаан/мэргэжил..."
                required
                rows="4"
                className={`w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR}-500 focus:border-${PRIMARY_COLOR}-500 transition duration-200 shadow-sm resize-none`}
              />
            </div>
          )}

          {/* Бүртгүүлэх товч */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center gap-2 px-4 py-3 text-lg font-bold rounded-xl shadow-md transition duration-300 transform 
              ${
                isSubmitting
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : `bg-${PRIMARY_COLOR}-600 hover:bg-${PRIMARY_COLOR}-700 text-white hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-${PRIMARY_COLOR}-500 focus:ring-opacity-50`
              }`}
          >
            {isSubmitting ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Бүртгэл хийгдэж байна...
                </span>
            ) : (
                <>
                    Бүртгэл үүсгэх <ArrowRight className="w-4 h-4" />
                </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 pt-2">
          <span className="opacity-80">Хэдийн бүртгэл үүсгэсэн үү? </span>
          <Link 
            to="/login" 
            className={`font-semibold text-${PRIMARY_COLOR}-600 hover:text-${PRIMARY_COLOR}-500 transition duration-150`}
          >
            Нэвтрэх
          </Link>
        </p>
      </div>
    </div>
  );
}