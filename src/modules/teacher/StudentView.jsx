import { useEffect, useState } from "react";
import { FaPhone, FaFacebook, FaInstagram, FaGithub, FaEnvelope } from "react-icons/fa";

export default function StudentView() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("teacherProfiles");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setTeachers(parsed);
        }
      } catch (err) {
        console.error("JSON parse error:", err);
      }
    }
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 border-b border-gray p-6 mb-8">Багш нар</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.length > 0 ? (
          teachers.map((teacher, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-transform duration-300 hover:scale-105"
            >
              {/* Profile Image */}
              <div className="flex flex-col items-center p-6 bg-gray-50">
                {teacher.avatar ? (
                  <img
                    src={teacher.avatar}
                    alt={`${teacher.name} avatar`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
                    👤
                  </div>
                )}
                <h3 className="mt-4 text-xl font-bold text-gray-800">{teacher.name}</h3>
                <p className="text-gray-600">{teacher.subject}</p>

                {/* Хичээлийн ангилал Badge-ууд */}
                {Array.isArray(teacher.categories) && teacher.categories.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {teacher.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Role Badge */}
                {teacher.role && (
                  <span className="mt-3 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-semibold">
                    {teacher.role}
                  </span>
                )}
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4 py-3 border-t bg-gray-100">
                {teacher.facebook && (
                  <a href={teacher.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    <FaFacebook size={20} />
                  </a>
                )}
                {teacher.github && (
                  <a href={teacher.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
                    <FaGithub size={20} />
                  </a>
                )}
                {teacher.instagram && (
                  <a href={teacher.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                    <FaInstagram size={20} />
                  </a>
                )}
              </div>

            <div className="flex justify-around p-4 bg-green-500 backdrop-blur-md rounded-b-xl">
  {teacher.email && (
    <a
      href={`mailto:${teacher.email}`}
      className="flex items-center gap-2 hover:underline text-gray-800"
    >
      <FaEnvelope /> {teacher.email}
    </a>
  )}
  {teacher.phone && (
    <a
      href={`tel:${teacher.phone}`}
      className="flex items-center gap-2 hover:underline text-gray-800 text-bold"
    >
      <FaPhone /> {teacher.phone}
    </a>
  )}
</div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm">Одоогоор багшийн мэдээлэл алга.</p>
        )}
      </div>
    </div>
  );
}