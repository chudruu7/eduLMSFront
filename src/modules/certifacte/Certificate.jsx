import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const Certificate = ({
  studentName,
  courseName,
  systemName = "МУИС-ийн Баруун Бүсийн Сургууль", 
  signature = "Б.Г.Мөнхболд, Админ",
  certificateID = "HEX-0x2025-0F0A-C0D1" 
}) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Сертификат-${studentName}`,
  });

  const completionDate = new Date().toLocaleDateString('en-GB'); 
  const logoUrl = '/newlogo.png'; 
  
  // PUBLIC ХАВТАС ДОТОРХ ГАРЫН ҮСГИЙН ЗУРГИЙН ЗАМ
  const signatureImageUrl = ''; 

  // Дижитал, Цагаан загварт тохирсон өнгөнүүд
  const primaryColor = "text-blue-600"; 
  const secondaryColor = "text-cyan-500"; 
  const lightBg = "bg-white"; 
  const darkText = "text-gray-900"; 

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
     
      <div
        ref={componentRef}
        className={`shadow-2xl p-20 w-[11in] h-[8.5in] relative rounded-xl flex flex-col justify-between text-center font-sans overflow-hidden ${lightBg} ${darkText}`}
      >
        {/* ДИЖИТАЛ ХҮРЭЭ (Grid + Нимгэн Шугам) */}
        <div className="absolute inset-0 [background:repeating-linear-gradient(0deg,rgba(0,0,0,0.03)_0,rgba(0,0,0,0.03)_1px,transparent_1px,transparent_50px),repeating-linear-gradient(90deg,rgba(0,0,0,0.03)_0,rgba(0,0,0,0.03)_1px,transparent_1px,transparent_50px)]" />
        <div className="absolute inset-0 border-4 border-blue-600 opacity-20" />
        
        {/* 1. ДЭЭД ХЭСЭГ: Лого ба Гарчиг */}
        <div className="text-center pt-8 relative z-10">
          <img src={logoUrl} alt="Системийн Лого" className="mx-auto transalate-y-8 h-24 mb-2" />
          <p className={`text-xl font-light tracking-wider text-gray-600`}>{systemName}</p>

          <h1 className={`text-6xl font-extrabold ${primaryColor} mt-10 uppercase tracking-widest`}>
            СУРГАЛТЫН ГЭРЧИЛГЭЭ
          </h1>
        </div>

        {/* 2. ТӨВ ХЭСЭГ: Сурагчийн Нэр ба Амжилт */}
        <div className="flex flex-col items-center relative z-10 my-8">
            <p className="text-xl text-gray-600 mb-4 font-light uppercase tracking-wider">
              ЭНЭХҮҮ БАТАЛГААГ ОЛГОЖ БАЙНА:
            </p>

            <p className={`text-7xl font-mono font-bold ${secondaryColor} mb-10 border-b-2 border-blue-400 inline-block px-12 tracking-wide`}>
              {studentName}
            </p>

            <p className="text-lg text-gray-700 max-w-4xl leading-relaxed font-sans">
              <span className="font-mono text-gray-500">[ТӨЛӨВ: АМЖИЛТТАЙ]</span> Тус **<span className="font-bold text-gray-900">"{courseName}"</span>** сургалтын шаардлагыг амжилттай хангаж, бүх техникийн модулиудыг гүйцэтгэн, сургалтын хөтөлбөрийн эцсийн зорилтуудыг амжилттай биелүүлснийг баталж байна.
            </p>
        </div>

        {/* 3. ДООД ХЭСЭГ: Огноо ба Гарын Үсэг */}
        <div className="flex justify-between w-full mt-auto pb-8 relative z-10">
          
          {/* Огноо ба ID */}
          <div className="text-left font-mono">
            <p className="text-sm text-gray-500 uppercase tracking-widest">ОЛГОСОН ОГНОО:</p>
            <p className={`font-bold text-lg ${primaryColor} mt-1`}>{completionDate}</p>
            <p className="text-xs text-gray-500 mt-2">ГЭРЧИЛГЭЭНИЙ ДУГААР: <span className="font-bold text-gray-700">{certificateID}</span></p>
          </div>
          
          {/* ГАРЫН ҮСЭГ ОРУУЛАХ ХЭСЭГ - ЗУРАГТАЙ */}
          <div className="text-center w-64">
            
            {/* 💡 Гарын үсгийн ЗУРАГ: w-full болгож, height-ийг томруулж, голлосон */}
            <img 
              src={signatureImageUrl} 
              alt="Албан ёсны гарын үсэг" 
              // 💡 W-full болон h-20 болгов
              className="w-full h-20 mx-auto translate-x-8 object-contain" 
              // 💡 Дээд талын зайг багасгав (-20px -> -30px)
              style={{ marginTop: '-30px' }} 
            />

            {/* Гарын үсгийн доорх нэр болон албан тушаал */}
            <div className="h-0.5 border-b-2 border-gray-600 w-full mx-auto mb-1"></div>
            
            <p className={`font-bold text-lg ${darkText}`}>{signature}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">СИСТЕМИЙН АДМИН / БАТАЛГААЖУУЛАГЧ</p>

          </div>
        </div>
      </div>
 <button
        onClick={handlePrint}
        className="mt-6 mb-6 px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 shadow-xl transition duration-300 print:hidden"
      >
        PDF татах (Хэвлэх)
      </button>
    </div>

  );
};

export default Certificate;