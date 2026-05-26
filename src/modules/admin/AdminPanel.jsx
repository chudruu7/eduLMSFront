import {
  listCourses,
  listUsers,
  listPaymentRequests,
  listRegistrationRequests,
  listAllPurchases,
  updateUserRole,
  setCoursePrice,
  approveRegistrationRequest,
  denyRegistrationRequest,
  deleteUser,
} from '../../services/api.js'; // 💡 Засвар: Замын түвшний алдааг засаж, зөв харьцангуй зам болох '../../services/api.js'-ийг ашиглав.

import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  LineChart,
  BarChart,
  DonutChart,
  ChartCard,
  groupPurchasesByDay,
  groupPurchasesByCourse,
  groupUsersByRole,
} from './Charts.jsx';
import { getAllLocalPurchases } from '../payments/purchaseStore.js';

// -------------------------------------------------------------
// Icon Components (lucide-react-ийн оронд SVG ашиглана)
// -------------------------------------------------------------

const UsersIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-2"><path d="M14 19a6 6 0 0 0-12 0"/><circle cx="8" cy="10" r="4"/><path d="M22 19a6 6 0 0 0-6-6 3 3 0 1 0 0-6"/><circle cx="16" cy="10" r="4"/></svg>
);

const BookOpenIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-text"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><path d="M6 8h2"/><path d="M6 12h2"/><path d="M16 8h2"/><path d="M16 12h2"/></svg>
);

const DollarSignIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

const MailQuestionIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-question"><path d="M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 10-7.245 4.347a1 1 0 0 1-1.428-.236L10 10"/><path d="M17 21h.01"/><path d="M21 21h.01"/><path d="M19 19.5v-2h-.01"/><path d="M20 17v-2h-.01"/></svg>
);


// -------------------------------------------------------------
// Хэсгүүд
// -------------------------------------------------------------

// 💡 А. Статистикийн Карт
const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className={`p-5 rounded-xl shadow-lg flex items-center justify-between transition-all duration-300 hover:scale-[1.02] ${color}`}>
        <div>
            <p className="text-sm font-medium text-white opacity-80">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{count}</p>
        </div>
        <Icon className="w-8 h-8 text-white opacity-70" />
    </div>
);


// 💡 1. Хэрэглэгчдийн Жагсаалт
const UserList = ({ users, handleRoleChange, handleUserDelete }) => (
  <section className="bg-white p-6 rounded-xl shadow-2xl">
    <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">Хэрэглэгчид ({users.length})</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50 border-b-2">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Нэр</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">И-мэйл</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Үйлдэл</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {users.length > 0 ? users.map((user) => (
            <tr key={user._id || user.id} className="hover:bg-indigo-50 transition-colors"> 
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 
                      user.role === 'teacher' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`
                }>
                    {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {user.role !== 'admin' ? (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleRoleChange(user._id || user.id, 'teacher')}
                      className="px-3 py-1 border border-green-500 text-green-700 text-xs font-medium rounded-lg hover:bg-green-50 transition-colors"
                      title="Багш болгох"
                    >
                      Багш
                    </button>
                    <button 
                        onClick={() => handleRoleChange(user._id || user.id, 'student')}
                        className="px-3 py-1 border border-yellow-500 text-yellow-700 text-xs font-medium rounded-lg hover:bg-yellow-50 transition-colors"
                        title="Сурагч болгох"
                      >
                        Сурагч
                    </button>
                    <button 
                        onClick={() => handleUserDelete(user._id || user.id, user.name)}
                        className="p-1.5 ml-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                        title="Хэрэглэгчийг устгах"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                ) : (
                  <span className="text-indigo-500 font-medium">Систем Администратор</span>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">Хэрэглэгч алга байна</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);

// 💡 2. Хичээлийн Жагсаалт
const CourseList = ({ courses, handlePriceChange }) => (
  <section className="bg-white p-6 rounded-xl shadow-2xl">
    <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">Хичээлүүд ({courses.length})</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50 border-b-2">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Нэр</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Багш</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Үнэ (₮)</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Үйлдэл</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {courses.length > 0 ? courses.map((course) => (
            <tr key={course._id || course.id} className="hover:bg-indigo-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.teacherName || 'Тодорхойгүй'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <span className="font-bold">{course.price ? `${course.price}₮` : 'Үнэгүй'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  onClick={() => handlePriceChange(course._id || course.id, course.price)}
                  className="px-3 py-1 bg-indigo-500 text-white text-xs font-medium rounded-lg hover:bg-indigo-600 transition-colors shadow-md"
                >
                  Үнэ өөрчлөх
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">Хичээл алга байна</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);

// 💡 3. Төлбөрийн Хүсэлтүүд (Mock) — хуучин хуудсыг хадгалав
const PaymentRequests = ({ payments }) => (
    <section className="bg-white p-6 rounded-xl shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Төлбөрийн хүсэлтүүд ({payments.length})</h2>
        <div className="p-4 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
            Төлбөрийн хүсэлтийн API-г back-end-д нэмээгүй байна. (Mock Data)
        </div>
        {!payments.length && <div className="p-4 text-center text-gray-500">Төлбөрийн хүсэлт алга байна</div>}
    </section>
);

// 💡 3.b. Бодит худалдан авалтын жагсаалт (QPay-р төлсөн хэрэглэгчдийн)
const PurchasesTable = ({ purchases }) => {
    const [query, setQuery] = useState('');
    const filtered = useMemo(() => {
        if (!query.trim()) return purchases;
        const q = query.toLowerCase();
        return purchases.filter((p) =>
            [
                p.courseTitle,
                p?.course?.title,
                p.userName,
                p?.user?.name,
                p.userEmail,
                p?.user?.email,
                p.invoiceId,
                p.paymentMethod,
            ]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q))
        );
    }, [purchases, query]);

    const fmtDate = (ts) => {
        if (!ts) return '—';
        const d = new Date(ts);
        if (isNaN(d)) return String(ts);
        return d.toLocaleString('mn-MN', { hour12: false });
    };

    return (
        <section className="bg-white p-6 rounded-xl shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Төлбөрийн мэдээлэл ({purchases.length})
                </h2>
                <input
                    type="search"
                    placeholder="Хэрэглэгч / хичээл / invoice хайх..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50 border-b-2">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Огноо</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Хэрэглэгч</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Хичээл</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Дүн</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Арга</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filtered.length > 0 ? (
                            filtered.map((p) => {
                                const user = p.user || {};
                                const course = p.course || {};
                                return (
                                    <tr key={p._id || p.id || p.invoiceId} className="hover:bg-indigo-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                            {fmtDate(p.createdAt || p.date || p.paidAt)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            <div className="font-medium">{p.userName || user.name || '—'}</div>
                                            <div className="text-xs text-gray-500">{p.userEmail || user.email || ''}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">
                                            {p.courseTitle || course.title || p.courseId || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-bold text-emerald-700 whitespace-nowrap">
                                            {Number(p.amount || p.price || 0).toLocaleString()}₮
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium uppercase">
                                                {p.paymentMethod || 'qpay'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs font-mono text-gray-500">
                                            {p.invoiceId || '—'}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic">
                                    {query ? 'Хайлтанд тохирох бичлэг олдсонгүй.' : 'Худалдан авалт одоогоор бүртгэгдээгүй байна.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

// 💡 4. Бүртгэлийн Хүсэлтүүд
const RegistrationRequests = ({ registrations, handleRegistrationAction }) => (
    <section className="bg-white p-6 rounded-xl shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Багшаар бүртгүүлэх хүсэлт ({registrations.length})</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50 border-b-2">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Нэр</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">И-мэйл</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Тайлбар</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Үйлдэл</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {registrations.length > 0 ? registrations.map((request) => (
                        <tr key={request._id || request.id} className="hover:bg-indigo-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.userName || request.userEmail}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.userEmail}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">{request.message || 'Тайлбар байхгүй'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => handleRegistrationAction(request._id || request.id, 'approve')}
                                    className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors mr-2"
                                >
                                    <span className='inline-flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle mr-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> Батлах</span>
                                </button>
                                <button
                                    onClick={() => handleRegistrationAction(request._id || request.id, 'deny')}
                                    className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <span className='inline-flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle mr-1"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg> Татгалзах</span>
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">Бүртгэлийн хүсэлт алга байна</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </section>
);


// -------------------------------------------------------------
// Үндсэн AdminPanel Компонент
// -------------------------------------------------------------

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💡 Hook: loadAll - Бүх датаг татах
  async function loadAll() {
    setLoading(true);
    try {
        // listAllPurchases нь backend /api/purchases бэлэн биш үед [] буцаана —
        // дараагийн алхамд localStorage-оос fallback хийнэ.
        const [coursesData, usersData, paymentsData, registrationsData, purchasesData] = await Promise.all([
            listCourses(),
            listUsers(),
            listPaymentRequests(),
            listRegistrationRequests(),
            listAllPurchases().catch(() => []),
        ]);

        // ✅ Бүх response-ийг array болгон задлах
        const courses = Array.isArray(coursesData)
            ? coursesData
            : coursesData?.courses || coursesData?.data || [];

        const users = Array.isArray(usersData)
            ? usersData
            : usersData?.users || usersData?.data || [];

        const payments = Array.isArray(paymentsData)
            ? paymentsData
            : paymentsData?.payments || paymentsData?.data || [];

        const registrations = Array.isArray(registrationsData)
            ? registrationsData
            : registrationsData?.registrations || registrationsData?.data || [];

        let purchases = Array.isArray(purchasesData)
            ? purchasesData
            : purchasesData?.purchases || purchasesData?.data || [];

        // 🛟 Backend endpoint байхгүй / хоосон ирвэл localStorage-оос
        //    browser дээр бүртгэгдсэн бүх худалдан авалтыг fallback болгон уншина
        if (!purchases.length) {
            purchases = getAllLocalPurchases();
        }

        // ✅ Эдгээр array-уудыг state-д хадгална
        setCourses(courses);
        setUsers(users);
        setPayments(payments);
        setRegistrations(registrations);
        setPurchases(purchases);

    } catch (error) {
        console.error('Админ дата ачаалахад алдаа гарлаа (API):', error);
        toast.error('Админ дата ачаалахад алдаа гарлаа.');
    } finally {
        // ✅ ЗАСВАР: loading-г заавал false болгож, loop үгүй spinner-оос гарах
        setLoading(false);
    }
}

  useEffect(() => {
    loadAll();
  }, []); 

  // -------------------------------------------------------------
  // Хэрэглэгчийн Үйлдэл Handler-ууд
  // -------------------------------------------------------------
  
  // 💡 Role өөрчлөхдөө window.confirm-ийг custom modal-аар солих ёстой ч, одоохондоо confirm-ийг ашиглая
  const handleRoleChange = async (userId, newRole) => {
    // NOTE: 'alert()', 'confirm()'-ийг custom modal-аар солих ёстой.
    if (!window.confirm(`Та хэрэглэгчийн role-ийг '${newRole}' болгохдоо итгэлтэй байна уу?`)) return;
    try {
        await updateUserRole(userId, newRole);
        toast.success(`Хэрэглэгчийн role амжилттай ${newRole} боллоо.`);
        loadAll(); 
    } catch (e) {
        toast.error(`Role өөрчлөхөд алдаа гарлаа: ${e.message}`);
    }
  };

  const handleUserDelete = async (userId, userName) => {
    // NOTE: 'alert()', 'confirm()'-ийг custom modal-аар солих ёстой.
    if (!window.confirm(`Та '${userName}' (ID: ${userId}) хэрэглэгчийг ҮНЭХЭЭР устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.`)) return;
    
    try {
        await deleteUser(userId); 
        toast.success(`Хэрэглэгч '${userName}' амжилттай устгагдлаа.`);
        loadAll(); 
    } catch (e) {
        toast.error(`Хэрэглэгч устгахад алдаа гарлаа: ${e.message}`);
    }
  };


  const handlePriceChange = async (courseId, currentPrice) => {
    const newPriceStr = window.prompt(`Хичээлийн шинэ үнийг оруулна уу (Одоогийн үнэ: ${currentPrice || '0'}₮):`);
    
    if (newPriceStr === null) return; 
    
    const newPrice = parseInt(newPriceStr.trim());
    if (isNaN(newPrice) || newPrice < 0) {
        toast.error('Зөвхөн эерэг тоо оруулна уу.');
        return;
    }
    
    try {
        await setCoursePrice(courseId, newPrice);
        toast.success(`Хичээлийн үнэ амжилттай ${newPrice}₮ боллоо.`);
        loadAll(); 
    } catch (e) {
        toast.error(`Үнэ өөрчлөхөд алдаа гарлаа: ${e.message}`);
    }
  };
  
  // 💡 Mock функцүүдийг хадгалж байна
  const handlePaymentAction = async (id, action) => { 
    toast.error("Төлбөрийн үйлдлийн API дутуу байна.");
  };
  
  const handleRegistrationAction = async (id, action) => {
    const actionText = action === 'approve' ? 'Батлах' : 'Татгалзах';
    // NOTE: 'alert()', 'confirm()'-ийг custom modal-аар солих ёстой.
    if (!window.confirm(`Бүртгэлийн хүсэлт ${id}-ийг ${actionText}даа итгэлтэй байна уу?`)) return;

    try {
        if (action === 'approve') {
            await approveRegistrationRequest(id); 
            toast.success(`Бүртгэлийн хүсэлт амжилттай батлагдаж, хэрэглэгчийг багш болголоо.`);
        } else if (action === 'deny') {
            await denyRegistrationRequest(id); 
            toast.success(`Бүртгэлийн хүсэлтээс амжилттай татгалзлаа.`);
        }
        
        loadAll(); 
    } catch (e) {
        toast.error(`Бүртгэлийн үйлдэл гүйцэтгэхэд алдаа гарлаа: ${e.message}`);
    }
  };


  // -------------------------------------------------------------
  // Render
  // -------------------------------------------------------------
  const totalCourses = courses.length;
  const totalUsers = users.length;
  const totalPendingRequests = registrations.length;
  const totalRevenue = useMemo(
    () => purchases.reduce((sum, p) => sum + Number(p.amount || p.price || 0), 0),
    [purchases]
  );
  const revenueSeries = useMemo(() => {
    const byDay = groupPurchasesByDay(purchases, 30);
    return byDay.map((b) => ({ label: b.label, value: b.revenue }));
  }, [purchases]);
  const purchaseCountSeries = useMemo(() => {
    const byDay = groupPurchasesByDay(purchases, 30);
    return byDay.map((b) => ({ label: b.label, value: b.count }));
  }, [purchases]);
  const topCourses = useMemo(() => groupPurchasesByCourse(purchases, 6), [purchases]);
  const roleBreakdown = useMemo(() => groupUsersByRole(users), [users]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
          <div className="text-center text-gray-600">
              <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="text-lg">Админ дата ачаалж байна...</p>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b pb-2">Админ Самбар</h1>
        
        {/* 💡 Статистикийн Хэсэг */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Нийт Хэрэглэгчид"
                count={totalUsers}
                icon={UsersIcon}
                color="bg-indigo-600"
            />
            <StatCard
                title="Нийт Хичээл"
                count={totalCourses}
                icon={BookOpenIcon}
                color="bg-green-600"
            />
            <StatCard
                title="Худалдан авалт"
                count={purchases.length}
                icon={MailQuestionIcon}
                color="bg-yellow-600"
            />
            <StatCard
                title={`Нийт орлого (${Number(totalRevenue).toLocaleString()}₮)`}
                count={`${Number(totalRevenue).toLocaleString()}₮`}
                icon={DollarSignIcon}
                color="bg-rose-600"
            />
        </div>

        {/* 📊 Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <ChartCard
              title="Сүүлийн 30 хоногийн орлого"
              subtitle="QPay-ээр төлөгдсөн бүх худалдан авалтын нийлбэр (₮)"
            >
              <LineChart data={revenueSeries} color="#4f46e5" label="Орлого" />
            </ChartCard>
          </div>
          <ChartCard title="Хэрэглэгчийн бүтэц" subtitle="Role-р ангилсан хуваарилалт">
            <DonutChart data={roleBreakdown} />
          </ChartCard>
          <ChartCard title="Өдөр тутмын худалдан авалтын тоо" subtitle="Сүүлийн 30 хоног">
            <BarChart data={purchaseCountSeries} color="#10b981" />
          </ChartCard>
          <div className="lg:col-span-2">
            <ChartCard
              title="Хамгийн их худалдан авсан хичээлүүд"
              subtitle="Худалдан авалтын тоогоор эрэмбэлсэн (Top 6)"
            >
              <BarChart
                horizontal
                data={topCourses.map((c, i) => ({
                  ...c,
                  color: ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 6],
                }))}
                height={Math.max(160, topCourses.length * 34 + 20)}
              />
            </ChartCard>
          </div>
        </div>

        <div className="space-y-10">
          {/* 💳 Бодит худалдан авалтууд */}
          <PurchasesTable purchases={purchases} />

          <UserList
              users={users}
              handleRoleChange={handleRoleChange}
              handleUserDelete={handleUserDelete}
          />

          <CourseList courses={courses} handlePriceChange={handlePriceChange} />

          {/* 💡 Хүсэлтүүдийн Хэсэг (2 баганатай) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <PaymentRequests payments={payments} handlePaymentAction={handlePaymentAction} />
              <RegistrationRequests registrations={registrations} handleRegistrationAction={handleRegistrationAction} />
          </div>
        </div>
      </div>
    </div>
  );
}
