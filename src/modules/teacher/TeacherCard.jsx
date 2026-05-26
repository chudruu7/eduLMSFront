import { useEffect, useState } from "react";
import { FaPhone, FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";

export default function TeacherCard() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    // ✅ ЗАСВАР: localStorage дахь lms_me эвдэрсэн JSON бол модуль бүхэлдээ унахаас сэргийлж try-catch-т оруулав.
    let local = {};
    try {
        local = JSON.parse(localStorage.getItem('lms_me') || '{}');
    } catch (e) {
        console.warn('lms_me задлахад алдаа:', e);
        localStorage.removeItem('lms_me');
    }

    fetch("http://localhost:5000/api/teachers", {
        headers: {
            'Authorization': `Bearer ${local?.token || ''}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    })
    .then(data => {
        // ✅ { teachers: [...] } эсвэл [...] аль ч байсан зөв авна
        const arr = Array.isArray(data) ? data : data?.teachers || [];
        setTeachers(arr);
        setLoading(false);
    })
    .catch(err => {
        console.error("Error fetching teachers:", err);
        setLoading(false);
    });
}, []);

  if (loading) {
    return <p className="text-center text-gray-500">Түр хүлээнэ үү...</p>;
  }

  if (teachers.length === 0) {
    return <p className="text-center text-red-500">Багшийн мэдээлэл олдсонгүй.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {teachers.map((teacher, idx) => (
        <div
          // ✅ ЗАСВАР: backend нь _id буцаадаг. id, _id байхгүй үед index fallback.
          key={teacher._id || teacher.id || teacher.email || idx}
          className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition"
        >
          <img
            src={teacher.avatar || "/default-avatar.png"}
            alt={teacher.name}
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
          <h3 className="text-xl font-extrabold text-center mt-4">
            {teacher.name} {teacher.nickname && `(${teacher.nickname})`}
          </h3>
          <p className="text-center text-gray-600">{teacher.subject}</p>

          <div className="flex justify-center gap-4 mt-4 text-blue-600 text-2xl">
            {teacher.phone && (
              <a href={`tel:${teacher.phone}`} aria-label="Phone">
                <FaPhone />
              </a>
            )}
            {teacher.facebook && (
              <a href={teacher.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
            )}
            {teacher.instagram && (
              <a href={teacher.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            )}
            {teacher.github && (
              <a href={teacher.github} target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}