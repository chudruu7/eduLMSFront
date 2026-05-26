import React from "react";
import { FaFacebook, FaGithub, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa"; 

// Холбоо барих хуудас
const ContactPage = () => {
  // Дизайны үндсэн өнгө
  const primaryColor = "text-indigo-600";
  const primaryBg = "bg-indigo-600";
  const lightBg = "bg-gray-50"; 

  const contactInfo = [
    { 
      icon: FaMapMarkerAlt, 
      title: "Миний хаяг", 
      desc: "Ховд аймаг, Жаргалант сум, МУИС-ийн Баруун бүсийн сургууль 4-р дамжааны оюутан.",
      value: "Хаягийг харах",
      href: "#map",
    },
    { 
      icon: FaPhoneAlt, 
      title: "Утсаар холбогдох бол", 
      desc: "Танд яаралтай тусламж, асуулт байвал ажлын цагаар надтай холбогдоорой.",
      value: "+976 8012 5269", 
      href: "tel:+97680125269",
    },
    { 
      icon: FaEnvelope, 
      title: "Мэйл бичих бол", 
      desc: "Төслийн санал, албан бичиг, эсвэл хамтын ажиллагааны хүсэлтийг имэйлээр илгээнэ үү.",
      value: "chudruujbch@gmail.com", 
      href: "mailto:chudruujbch@gmail.com",
    },
  ];

  return (
    <div className=" bg-gray-50 antialiased pt-16"> 
      {/* Арын фон (Glassmorphism-ийг дэмжих) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="h-64 w-64 rounded-full bg-blue-200 opacity-50 absolute top-10 left-1/4 animate-pulse-slow" style={{ filter: 'blur(100px)' }} />
        <div className="h-96 w-96 rounded-full bg-indigo-200 opacity-40 absolute bottom-0 right-1/3 animate-pulse-slow delay-1000" style={{ filter: 'blur(120px)' }} />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
     <header className="bg-white-100 rounded-3xl overflow-hidden mb-12">
  <div className="grid grid-cols-1 lg:grid-cols-2">
    
    {/* Зүүн тал: Текст */}
    <div className="p-8 md:p-12 lg:p-20 flex flex-col justify-center">
      
      {/* Үндсэн Гарчиг (Цагаан, Том) */}
      <h1 className="text-blue-950 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
        
        {/* 💡 Эхлэлийн Том Хашилт */}
        <span className="text-gray-950 text-6xl mr-2 select-none font-bold">
            "
        </span>
        
        Өнөөдрийн 
        <span className="text-cyan-400"> сурах тэмүүлэл</span> бол 
        ирээдүйн амжилтын хөрөнгө оруулалт юм.
        
        {/* 💡 Төгсгөлийн Том Хашилт */}
        <span className="text-gray-950 text-6xl ml-2 select-none font-bold">
            "
        </span>
        
      </h1>
      
      {/* Дэд текст (Жижиг, саарал) */}
      <p className="mt-6 text-lg text-gray-800 max-w-xl">
        Бидэнтэй нэгдэж, амжилтдаа хөрөнгө оруулалт хийгээрэй. Таны аялал энэ мөчөөс эхэлж байна.
      </p>
    </div>
    
    {/* Баруун тал: Зураг */}
    <div className="hidden lg:block relative aspect-video lg:aspect-auto">
      <img
        src="/newlogo.png" 
        alt="A passionate group of people"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</header>

        {/* Main Content: Image + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">

          {/* 1. Зураг (Зүүн тал) */}
          <div className="lg:col-span-1 hidden lg:block relative group">
            <img
              src="/contact-img.svg" // Өмнөх зургийг ашиглав
              alt="Contact Illustration"
              className="w-full h-auto object-cover rounded-xl  transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>

          {/* 2. Contact Form (Баруун тал - том зай эзэлнэ) */}
          <form className="lg:col-span-2 p-10 rounded-3xl border border-white/40 backdrop-filter backdrop-blur-lg bg-white-70 w-full flex flex-col space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Шууд мессеж илгээх
            </h2>
            <p className="text-gray-600">
              Таны асуулт, санал эсвэл төслийн санааг сонсоход бид баяртай байх болно.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Таны Нэр *"
                className="p-4 rounded-xl border border-white/50 bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 shadow-sm"
                required
              />
              <input
                type="email"
                placeholder="Таны Имэйл *"
                className="p-4 rounded-xl border border-white/50 bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 shadow-sm"
                required
              />
            </div>

            <textarea
              placeholder="Таны Мессеж эсвэл Төслийн Танилцуулга *"
              rows="6"
              className="p-4 rounded-xl border border-white/50 bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 shadow-sm"
              required
            ></textarea>
            <button
              type="submit"
              className={`${primaryBg} text-white py-4 px-8 rounded-xl hover:bg-indigo-700 transition duration-300 font-bold text-lg shadow-lg shadow-indigo-400/50 hover:shadow-xl hover:shadow-indigo-400/70`}
            >
              Мессеж илгээх 
            </button>
          </form>
        </div>
      </div>
      
      {/* 📍 МЭДЭЭЛЭЛ ХЭСЭГ (Guiding Principles-ийн загварт шилжүүлсэн) */}
      <section className={`${lightBg} py-24`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className={`text-sm font-semibold uppercase tracking-widest ${primaryColor}`}>
            Бидний мэдээлэл
          </h2>
          <p className="mt-2 text-4xl font-extrabold uppercase text-gray-900">
            Холбогдох аргууд
          </p>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactInfo.map((value) => (
              <div
                key={value.title}
                // 👈 Таны өгсөн загварын классууд
                className="bg-white rounded-xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-indigo-200 hover:border-indigo-600"
              >
                <value.icon className={`h-10 w-10 ${primaryColor} mx-auto mb-4`} />
                <h3 className="text-2xl font-bold text-gray-900">
                  {value.title}
                </h3>
                
                {/* Description */}
                <p className="mt-4 text-gray-600">{value.desc}</p>

                {/* Link/Action Button */}
                {value.href && (
                  <a href={value.href} className={`mt-4 inline-block text-sm font-semibold ${primaryColor} hover:text-indigo-800 transition`}>
                    {value.value} &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer - Хэвээр үлдсэн */}
      <footer className="bg-white/90 border-t border-gray-200 py-6 w-full relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/onlyicon.png"
              alt="EduLMS Logo"
              className="h-7 w-auto rounded-full"
            />
            <span className="text-xl font-bold text-gray-800">EduLMS</span>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 text-gray-600 text-2xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition">
              <FaFacebook />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition">
              <FaGithub />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="text-center mt-4 text-xs text-gray-500">
          © {new Date().getFullYear()} EduLMS. Бүх эрх хуулиар хамгаалагдсан. | Програм хангамжийн 4-р дамжааны оюутан Г.Мөнхболдийн бүтээл.
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;