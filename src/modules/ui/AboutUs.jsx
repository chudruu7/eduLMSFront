import React from "react";
// Шаардлагатай Lucide Icons
import { Sparkles, Users, Zap, Handshake, CheckCircle, Calendar, Briefcase, GraduationCap } from "lucide-react"; 

// ===========================================
// 1. TIMELINE ӨГӨГДӨЛ БА ТУСЛАХ КОМПОНЕНТ
// ===========================================

// Цаг хугацааны хэлхээний (Timeline) өгөгдөл
const timelineData = [
    {
        id: 1,
        date: '2020 Оны 4 Сар',
        title: 'Төсөл Эхэлсэн',
        description: 'Бидний үйл ажиллагаа албан ёсоор эхэлж, анхны багийг бүрдүүлэн, суурь технологийн судалгааг хийж гүйцэтгэсэн.',
    },
    {
        id: 2,
        date: '2021 Оны 12 Сар',
        title: 'Анхны Бета Хувилбар',
        description: 'Бүтээгдэхүүний анхны туршилтын (Beta) хувилбарыг гаргаж, 100 гаруй хэрэглэгчээс санал хүсэлт авч, сайжруулалт хийсэн.',
    },
    {
        id: 3,
        date: '2022 Оны 7 Сар',
        title: 'Албан Ёсны Нээлт',
        description: 'Бүрэн хэмжээний бүтээгдэхүүн зах зээлд нэвтэрч, хэрэглэгчийн тоо 10,000-д хүрсэн.',
    },
    {
        id: 4,
        date: '2023 Оны 3 Сар',
        title: 'Олон Улсын Түншлэл',
        description: 'Азийн тэргүүлэгч 3 компанитай түншлэлийн гэрээ байгуулж, үйлчилгээний цар хүрээгээ өргөжүүлсэн.',
    },
];


// Хэвтээ Timeline (Зөвхөн том дэлгэцэнд)
const HorizontalTimeline = ({ primaryColor }) => (
    // Холбогч шугамтай хэвтээ загвар
    <div className="hidden lg:grid grid-cols-4 gap-8 mt-16 text-left relative">
        {/* Холбогч шугам: Эхний цэгээс сүүлийн цэг хүртэл үргэлжилнэ */}
        <div className="absolute top-[35px] left-0 right-0 h-0.5 bg-indigo-200 mx-4"></div>
        
        {timelineData.map((item) => (
            <div key={item.id} className="relative pt-6">
                
                {/* Дээд хэсэг (Огноо ба Цэг) */}
                <div className="flex items-center mb-4 relative z-10">
                    {/* Холбогч Цэг */}
                    <div className={`h-2.5 w-2.5 rounded-full ${primaryColor.replace('text', 'bg')} mr-2 ring-4 ring-white`}></div>
                    
                    {/* Огноо */}
                    <p className={`text-sm font-bold uppercase tracking-widest ${primaryColor}`}>
                        {item.date.split(' ')[0]} {item.date.split(' ')[1]} 
                    </p>
                </div>
                
                {/* Контент */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                    {item.description}
                </p>
            </div>
        ))}
    </div>
);

export default function About() {
  // Үндсэн Зарчмууд
  const values = [
    {
      title: "Шинэчлэл", 
      desc: "Бид бүтээлч байдлыг дэмжиж, тасралтгүй сайжруулалтыг эрэлхийлж, үйлчлүүлэгчдэдээ үйлчлэх илүү сайн арга замыг байнга хайж байдаг.",
      icon: Zap,
    },
    {
      title: "Шударга Зарчим", 
      desc: "Бид бүх үйл ажиллагаандаа шударга, ил тод байдлыг эрхэмлэж, ёс зүйтэй үйлдлээр итгэлцлийг бий болгодог.",
      icon: Handshake,
    },
    {
      title: "Хамтын Ажиллагаа", 
      desc: "Бид дотоод болон үйлчлүүлэгчидтэйгээ бат бөх түншлэлийг бий болгож, хамтарсан амжилтад хүрэхийн тулд багийн ажлыг эрхэмлэдэг.",
      icon: Users,
    },
  ];

  // Багийн Гишүүд
  const team = [
    {
      name: "Алимаа Б.",
      role: "Гүйцэтгэх Захирал (CEO)",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Мөнх-Оргил Д.",
      role: "Технологийн Захирал (CTO)",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Солонго Л.",
      role: "Ерөнхий Дизайнер", 
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

    // Өнгөний тохиргоог цагаан дэвсгэрт тохируулсан
  const primaryColor = "text-indigo-600"; // Үндсэн өргөлт өнгө
  const primaryBg = "bg-indigo-600";
  const lightBg = "bg-indigo-50"; // Хөнгөн дэвсгэр

  return (
    <div className="bg-white antialiased text-gray-900">
      {/* Hero Section - Үндсэн хэсэг */}
      <section className="relative px-6 pt-24 pb-16 lg:px-8 text-left overflow-hidden">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Текст Хэсэг */}
            <div>
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
                    Бид ирээдүйг<br /> бүтээж буй<br /> <span className={primaryColor.replace('600', '700')}>хүсэл тэмүүлэлтэй баг.</span>
                </h1>
                <p className="mt-8 text-xl leading-relaxed text-gray-600 max-w-xl font-light">
                    Бид дижитал эрин үед бизнесүүдийг **хөгжүүлж, амжилтад хүргэх** шинэлэг шийдлүүдийг бий болгодог. Үүний тулд үр нөлөө, дизайн, найдвартай технологид анхаарлаа хандуулдаг.
                </p>
                <div className="mt-10">
                    <a
                        href="#mission"
                        className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white ${primaryBg} hover:bg-indigo-700 transition duration-300 transform hover:scale-105`}
                    >
                        Бидний түүхийг сонирхох
                    </a>
                </div>
            </div>

            {/* Зураг Хэсэг */}
            <div className="lg:order-2">
                <img
                    src="/champ.jpg"
                    alt="Баг хамтран ажиллаж байна"
                    className="rounded-xl shadow-2xl w-full h-[500px] object-cover"
                />
            </div>
        </div>
      </section>

      <hr className="max-w-7xl mx-auto border-t border-gray-200" />

      {/* Mission Section - Эрхэм Зорилгын хэсэг */}
      <section id="mission" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="lg:order-2">
            <h2 className={`text-sm font-semibold uppercase tracking-widest ${primaryColor}`}>
              Бидний Зорилго
            </h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Дижитал Хөгжлийг Жолоодох
            </p>
            <p className="mt-6 text-lg text-justify text-gray-600 leading-relaxed">
              Манай эрхэм зорилго бол байгууллагуудыг хамгийн сүүлийн үеийн 
              технологи болон бүтээлч шийдлүүдээр хүчирхэгжүүлэх явдал юм. 
              Бид зөвхөн программ хангамж бүтээгээд зогсохгүй; хэмжигдэхүйц 
              өсөлт, үйл ажиллагааны өндөр гүйцэтгэл, ирээдүйг баталгаажуулах 
              бизнесийн загварыг бий болгох **дижитал түншлэлийг** цогцлоодог.
            </p>
            <ul className="mt-6 space-y-3 text-gray-700">
                <li className="flex items-center"><Zap className={`h-5 w-5 mr-2 ${primaryColor}`} /> Хамгийн сүүлийн үеийн технологи</li>
                <li className="flex items-center"><Users className={`h-5 w-5 mr-2 ${primaryColor}`} /> Үйлчлүүлэгч төвтэй хамтын ажиллагаа</li>
                <li className="flex items-center"><Handshake className={`h-5 w-5 mr-2 ${primaryColor}`} /> Ёс зүйтэй, ил тод үйл ажиллагаа</li>
            </ul>
          </div>
          <div className="lg:order-1 relative group">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600&h=1000"
              alt="Бидний эрхэм зорилго - Баг хамтран ажиллаж байна"
              className="rounded-xl shadow-2xl w-full h-[450px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* --------------------------------------------- */}
      {/* 💡 ЦАГ ХУГАЦААНЫ ХЭЛХЭЭ ХЭСЭГ */}
      {/* --------------------------------------------- */}
      <section id="history" className={`bg-white py-20 sm:py-24`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              {/* Гарчиг */}
              <div className="mb-16">
                  <h2 className={`text-sm font-semibold uppercase tracking-widest ${primaryColor}`}>
                      БИДНИЙ ТҮҮХ
                  </h2>
                  <p className="mt-2 text-4xl font-extrabold text-gray-900">
                      Цаг Хугацааны Хэлхээ
                  </p>
              </div>

              {/* Хэвтээ Timeline - Зөвхөн том дэлгэцэнд */}
              <HorizontalTimeline primaryColor={primaryColor} />

              {/* Босоо Timeline - Жижиг дэлгэцэнд */}
              <div className="lg:hidden relative max-w-md mx-auto">
                {timelineData.map((item) => (
                    <div key={item.id} className="flex relative items-start pb-10 text-left">
                        {/* Тэнхлэг ба Цэг */}
                        <div className="flex flex-col items-center mr-6">
                            {/* Босоо шугам */}
                            <div className="h-full w-0.5 bg-gray-300 absolute top-0 left-1/2 transform -translate-x-1/2" />
                            {/* Цэг */}
                            <div className={`w-3 h-3 rounded-full z-10 ${primaryBg} ring-4 ring-white`} />
                        </div>

                        {/* Контент */}
                        <div className="flex-grow pt-1">
                            <p className={`text-sm font-bold uppercase tracking-widest ${primaryColor} mb-1`}>
                                {item.date}
                            </p>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

          </div>
      </section>

      {/* Values Section - Үндсэн Зарчмуудын хэсэг (Илүү Тод HOVER EFFECT-ТЭЙ) */}
      <section className={`${lightBg} py-24`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className={`text-sm font-semibold uppercase tracking-widest ${primaryColor}`}>
            Бидний үндэс
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">
            Удирдах зарчмууд
          </p>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                 
                className={`bg-white rounded-xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-indigo-200 hover:border-indigo-600`}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 mx-auto mb-6">
                  <value.icon className={`h-6 w-6 ${primaryColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="mt-4 text-gray-600 leading-relaxed text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      ---

      {/* Team Section - Багийн хэсэг */}
      <section className={`bg-white py-24`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className={`text-sm font-semibold uppercase tracking-widest ${primaryColor}`}>
            Амжилтын Ард Байгаа Хүмүүс
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">
            Манай шилдэг багтай танилц
          </p>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
            {team.map((person) => (
              <div key={person.name} className="text-center group">
                <div className="relative inline-block">
                  <img
                    src={person.img}
                    alt={person.name + " гишүүний зураг"}
                    className="mx-auto h-32 w-32 rounded-full object-cover shadow-lg border-4 border-white ring-4 ring-indigo-100 group-hover:ring-indigo-300 transition-all duration-300"
                  />
                  {/* Subtle hover effect on image */}
                  <div className={`absolute inset-0 h-32 w-32 rounded-full mx-auto ${primaryBg} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {person.name}
                </h3>
                <p className="text-indigo-600 font-medium italic mt-1">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Доод хэсэг */}
      <footer className="bg-gray-50 text-gray-700 py-10 text-center border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="text-sm font-light leading-6">&copy; {new Date().getFullYear()} eduLMS. Програм хангамжийн 4-р дамжааны оюутан Г.Мөнхболдийн бүтээл.</p>
        </div>
      </footer>
    </div>
  );
}