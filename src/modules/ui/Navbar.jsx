import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import logo from '/onlyicon.png';

// React Icons
import { FaHome, FaBook, FaChalkboardTeacher, FaCertificate, FaInfoCircle, FaPhone, FaWallet } from 'react-icons/fa';
import { MdDashboard, MdSettings, MdUpload } from 'react-icons/md';
import { HiUsers } from 'react-icons/hi';

export default function Navbar() {
  const { me, logout } = useAuth();
  const navigate = useNavigate();

  const studentItems = [
    // ✅ ЗАСВАР: Нүүр нь бодит HomePage рүү зааж байна
    { label: 'Нүүр', to: '/student/home', icon: <FaHome /> },
    { label: 'Миний хичээлүүд', to: '/student/courses', icon: <FaBook /> },
    { label: 'Багш нар', to: '/student/teachers', icon: <FaChalkboardTeacher /> },
    { label: 'Ангилал', to: '/student/categories', icon: <FaBook /> },
    { label: 'Certificate', to: '/student/certificates', icon: <FaCertificate /> },
    { label: 'Бидний тухай', to: '/student/about', icon: <FaInfoCircle /> },
    { label: 'Холбоо барих', to: '/student/contact', icon: <FaPhone /> },
  ];

  const teacherItems = [
    { label: 'Үндсэн', to: '/teacher/dashboard', icon: <MdDashboard /> },
    { label: 'Миний оруулсан хичээл', to: '/teacher/courses', icon: <FaBook /> },
    { label: 'Хичээл нэмэх', to: '/teacher/upload', icon: <MdUpload /> },
    { label: 'Мэдээлэл засах', to: '/teacher/settings', icon: <MdSettings /> },
  ];

  const adminItems = [
    { label: 'Админ самбар', to: '/admin/dashboard', icon: <MdDashboard /> },
    { label: 'Хэрэглэгчид', to: '/admin/users', icon: <HiUsers /> },
    { label: 'Хичээлүүд', to: '/admin/courses', icon: <FaBook /> },
  ];

  const menuItems =
    me?.role === 'admin'
      ? adminItems
      : me?.role === 'teacher'
      ? teacherItems
      : studentItems;

  // 💡 isActive төлөвөөс хамаарч className-ийг буцаах функц
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-300 relative
      hover:bg-white/20 hover:backdrop-blur-sm hover:border hover:border-white/20
      ${isActive
        ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-inner text-blue-400 font-semibold'
        : 'text-gray-500'}`;

  // 💡 Gradient Overlay-г isActive-аар шалгаж рендэрлэх компонент
  const GradientOverlay = () => (
    <span
      className="absolute inset-0 rounded-lg pointer-events-none"
      style={{
        background: 'linear-gradient(to right, rgba(255,255,255,0.3), transparent)',
        padding: '2px',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor'
      }}
    ></span>
  );

  return (
    <aside
      className="md:block fixed top-[56px] left-0 h-[calc(100vh-56px)] w-[258px]
      bg-white/10 backdrop-blur-lg border border-red/500 shadow-xl text-gray-950"
    >
      <div className="h-full flex flex-col">
        {/* Logo section */}
        <div className="px-4 py-6 flex items-center gap-3 border-b border-red/20">
          <img src={logo} alt="EduLMS Logo" className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm" />
          <div>
            <div className="font-bold text-lg text-gray-900">eduLMS</div>
            <div className="text-xs text-gray-500">Залуу насандаа суралц</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto mt-6">
          <ul className="space-y-1 px-2">
            {menuItems.map((it) => (
              <li key={it.label} className="relative">
                <NavLink
                  to={it.to}
                  end 
                  className={getNavLinkClass} // 💡 Зөвхөн className-ийг буцаах функц
                >
                  {/* 💡 ЗАСВАР: Children-ийг шууд рендэрлэж, isActive-ийг шалгахдаа */}
                  {/* render prop-ын оронд NavLink-ийн дотор useMatch-ийн логик ашиглана */}
                  {/* Одоогийн байдлаар children-ийг NavLink-ээс шууд авч чадахгүй тул */}
                  {/* isActive-ийг NavLink-ийн className функц дотор биш, гаднаас шалгах аргагүй */}
                  {/* учир isActive-ийг NavLink-ийн доторх content дотор дахин шалгана. */}

                  <NavContent isActivePath={it.to} icon={it.icon} label={it.label} />

                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info + logout */}
        <div className="px-4 py-4 border-t border-white/20">
          {me ? (
            <div className="flex flex-col gap-2">
              <Link to="/profile" className="flex items-center gap-3">
                {me.avatar ? (
                  <img
                    src={me.avatar}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border border-blue/30"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm grid place-items-center text-gray-100">
                    👤
                  </div>
                )}
                <div className="text-md text-gray-950">
                  <div className="font-bold">{me.name}</div>
                  <div className="text-sm text-gray-500">{me.role}</div>
                </div>
              </Link>
              <div className="pt-2">
                <button
                  className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-2 rounded-md text-sm w-full transition-transform hover:scale-105 shadow-lg"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  Гарах
                </button>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-blue-500/80 hover:bg-blue-500 text-white px-3 py-2 rounded-md text-sm w-full text-center transition-transform hover:scale-105 shadow-lg"
            >
              Нэвтрэх
            </NavLink>
          )}
        </div>
      </div>
    </aside>
  );
}

// 💡 Туслах компонент: NavLink-ийн доторх агуулгыг рендэрлэх
import { useMatch } from 'react-router-dom';

function NavContent({ isActivePath, icon, label }) {
  // useMatch-ийг ашиглан одоогийн зам таарч байгаа эсэхийг шалгана
  const match = useMatch(isActivePath); 
  const isActive = !!match;

  const GradientOverlay = () => (
    <span
      className="absolute inset-0 rounded-lg pointer-events-none"
      style={{
        background: 'linear-gradient(to right, rgba(255,255,255,0.3), transparent)',
        padding: '2px',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor'
      }}
    ></span>
  );

  return (
    <>
      {/* isActive-ийг шалгаж Gradient Overlay-г рендэрлэж байна */}
      {isActive && <GradientOverlay />}
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </>
  );
}