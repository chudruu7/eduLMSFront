import { useForm } from 'react-hook-form';
import { useAuth } from './AuthContext.jsx';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { FaFacebookF, FaInstagram, FaGithub } from 'react-icons/fa'; // Social icons

export default function Login() {
  const { register: reg, handleSubmit } = useForm();
  const { login, me } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (me) navigate('/categories', { replace: true });
  }, [me, navigate]);

  // 💡💡💡 ЭНЭ ХЭСГИЙГ ЗАСВАРЛАВ 💡💡💡
  const onSubmit = async (data) => {
    try {
      // react-hook-form-оос ирсэн 'data' объектаас email, password-г задлаж өгнө.
      await login(data.email, data.password);
      
      // Амжилттай нэвтэрвэл navigate хийнэ.
      // (AuthContext дотор navigate хийх шаардлагагүй, 
      // эндээс эсвэл useEffect-ээс хийх нь зөв)
      navigate('/categories', { replace: true });

    } catch (e) {
      // Алдаа гарвал (жишээ нь: буруу нууц үг) 
      // AuthContext доторх toast.error ажиллана.
      // Энд console-д нэмэлтээр бүртгэж болно.
      console.error("Нэвтрэхэд алдаа гарлаа:", e.message);
    }
  };
  // 💡💡💡 ЗАСВАР ТӨГСӨВ 💡💡💡

  return (
    <div className="max-w-md w-full mx-auto mt-16 p-8 rounded-xl backdrop-blur-lg bg-white/30 border border-white/20 shadow-xl">
      <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-900">Welcome Back!</h2>
      <p className="text-gray-700 text-sm mb-6 text-center">
        Нэвтрэхийн тулд имэйл болон нууц үгээ оруулна уу.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="sr-only">Имэйл</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </div>
            <input
              id="email"
              type="email"
              {...reg('email', { required: true })}
              placeholder="И-мэйл хаяг"
              className="w-full pl-10 pr-4 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="sr-only">Нууц үг</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </div>
            <input
              id="password"
              type="password"
              {...reg('password', { required: true })}
              placeholder="Нууц үгээ оруулна уу"
              className="w-full pl-10 pr-4 py-2 rounded-md bg-white/50 backdrop-blur-sm border border-white/30 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Нэвтрэх
        </button>
      </form>

      <p className="text-gray-700 text-sm mt-6 text-center">
        Шинээр бүртгүүлэх бол{" "}
        <Link to="/register" className="text-indigo-500 hover:text-indigo-400 underline font-medium">
          энд дарна уу
        </Link>
      </p>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 mt-8">
        <a href="https://facebook.com" className="text-gray-600 hover:text-indigo-500">
          <FaFacebookF />
        </a>
        <a href="https://instagram.com" className="text-gray-600 hover:text-indigo-500">
          <FaInstagram />
        </a>
        <a href="https://github.com" className="text-gray-600 hover:text-indigo-500">
          <FaGithub />
        </a>
      </div>
    </div>
  );
}