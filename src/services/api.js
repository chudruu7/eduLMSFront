import toast from 'react-hot-toast';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const LS_ME = 'lms_me';

// ----------------------------------------------------------------------
// I. Local Storage Utilities
// ----------------------------------------------------------------------
export const getMe = () => {
    try {
        const meStorage = localStorage.getItem(LS_ME);
        return meStorage ? JSON.parse(meStorage) : null;
    } catch (e) {
        localStorage.removeItem(LS_ME);
        return null;
    }
};

export const setMe = (user) => {
    if (user && user.token) {
        localStorage.setItem(LS_ME, JSON.stringify(user));
    } else {
        localStorage.removeItem(LS_ME);
    }
};

// ----------------------------------------------------------------------
// II. Core API Call
// ----------------------------------------------------------------------
export const apiCall = async (endpoint, config = {}) => {
    const meObject = getMe();
    const isFormData = config.body instanceof FormData;

    // ✅ ЗАСВАР: Content-Type-г зөвхөн FormData биш үед тавих.
    // (FormData үед browser өөрөө multipart boundary-тай Content-Type нэмнэ.)
    const headers = { ...(config.headers || {}) };
    if (!isFormData && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }
    if (meObject && meObject.token) {
        headers['Authorization'] = `Bearer ${meObject.token}`;
    }

    let body = config.body;
    if (body && typeof body === 'object' && !isFormData) {
        body = JSON.stringify(body);
    }

    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...config,
            headers,
            body,
        });

        // ✅ ЗАСВАР: 204 No Content эсвэл хоосон хариу ирвэл JSON.parse алдаа өгөхгүй
        const text = await res.text();
        let data = {};
        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                data = { message: text };
            }
        }

        if (!res.ok) {
            if (res.status === 401) {
                console.error(`401 Зөвшөөрөлгүй: ${endpoint}`);
                localStorage.removeItem(LS_ME);
            }
            throw new Error(data.message || `API алдаа: ${res.status} ${res.statusText}`);
        }

        return data;
    } catch (error) {
        console.error(`API call error [${endpoint}]:`, error);
        throw error;
    }
};

// ----------------------------------------------------------------------
// III. Auth & Profile
// ----------------------------------------------------------------------
export const loginUser = async (email, password) => {
    try {
        console.log('🔐 Login:', email?.substring(0, 10) + '...');

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email?.trim(), password }),
        });

        console.log('📡 Status:', response.status, response.statusText);

        const responseText = await response.text();
        console.log('📄 Raw (200 chars):', responseText.substring(0, 200));

        if (responseText.trim().startsWith('<!DOCTYPE') || responseText.includes('<html')) {
            throw new Error('Серверт алдаа гарсан. HTML хуудас ирлээ.');
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error(`Серверээс буруу хариу: ${response.status} ${response.statusText}`);
        }

        if (!response.ok) {
            throw new Error(data.message || `Нэвтрэхэд алдаа: ${response.status}`);
        }

        // ✅ ЗАСВАР: Backend { success, message, user: {...}, token: "..." } буцаана
        // data.user байвал задлах, эс бол data-г шууд ашиглах
        const userData = {
            ...(data.user || data),
            token: data.token || data.user?.token || data._id,
        };

        console.log('✅ Login successful:', {
            id: userData._id || userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
        });

        return userData;
    } catch (error) {
        console.error('❌ Login error:', error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const responseText = await response.text();
        console.log('Register response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error('Серверээс буруу хариу ирлээ');
        }

        if (!response.ok) {
            throw new Error(data.message || 'Бүртгэлд алдаа гарлаа');
        }

        return data;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

export const logoutApi = () => {
    localStorage.removeItem(LS_ME);
    toast.success('Амжилттай гарлаа.');
};

export const getMyProfile = async () => {
    // ✅ Backend { success, user: {...}, ...userObj } хоёуланг буцаана
    const res = await apiCall('/users/profile', { method: 'GET' });
    return res?.user || res;
};

export const updateMyProfile = async (data) => {
    // ✅ Backend route нь PUT / PATCH хоёуланг зөвшөөрнө
    const res = await apiCall('/users/profile', { method: 'PUT', body: data });
    return res?.user || res;
};

// ----------------------------------------------------------------------
// IV. User Management (Admin)
// ----------------------------------------------------------------------
export const listUsers = async () => {
    try {
        const res = await apiCall('/users');
        return Array.isArray(res) ? res : res?.users || res?.data || [];
    } catch {
        return [];
    }
};

export const deleteUser = async (id) => {
    return await apiCall(`/users/${id}`, { method: 'DELETE' });
};

export const updateUserRole = async (id, newRole) => {
    // ✅ Backend route нь PUT
    return await apiCall(`/users/${id}/role`, { method: 'PUT', body: { role: newRole } });
};

// ----------------------------------------------------------------------
// V. Course Management
// ----------------------------------------------------------------------
export const listCourses = async () => {
    try {
        const res = await apiCall('/courses');
        return Array.isArray(res) ? res : res?.courses || res?.data || [];
    } catch {
        return [];
    }
};

export const getCourse = async (courseId) => {
    // ✅ ЗАСВАР: Backend { success, course } хэлбэрээр буцаана
    const res = await apiCall(`/courses/${courseId}`);
    return res?.course || res;
};

export const createCourse = async (data) => {
    // ✅ ЗАСВАР: Backend { success, course } хэлбэрээр буцаана
    const res = await apiCall('/courses', { method: 'POST', body: data });
    const newCourse = res?.course || res;
    toast.success(`${newCourse?.title || 'Сургалт'} амжилттай үүслээ.`);
    return newCourse;
};

export const uploadCourse = createCourse;

export const editCourse = async (courseId, data) => {
    // ✅ ЗАСВАР: Backend route нь PUT гэж тодорхойлсон, PATCH биш
    const res = await apiCall(`/courses/${courseId}`, { method: 'PUT', body: data });
    const updated = res?.course || res;
    toast.success(`${updated?.title || 'Сургалт'} шинэчлэгдлээ.`);
    return updated;
};

export const updateCourse = editCourse;

export const deleteCourse = async (courseId) => {
    await apiCall(`/courses/${courseId}`, { method: 'DELETE' });
    toast.success('Сургалт амжилттай устгалаа.');
};

export const setCoursePrice = async (courseId, newPrice) => {
    // ✅ ЗАСВАР: Backend { success, course } хэлбэрээр буцаана
    const res = await apiCall(`/courses/${courseId}/price`, {
        method: 'PATCH',
        body: { price: newPrice }
    });
    toast.success(`Үнэ ${newPrice}₮ болж өөрчлөгдлөө.`);
    return res?.course || res;
};

// ----------------------------------------------------------------------
// V.b Purchases (My Purchases / Certificates)
// ----------------------------------------------------------------------
export const listMyPurchases = async () => {
    try {
        const res = await apiCall('/purchases/my-purchases');
        return Array.isArray(res) ? res : res?.purchases || res?.data || [];
    } catch {
        return [];
    }
};

export const createPurchase = async (data) => {
    const res = await apiCall('/purchases', { method: 'POST', body: data });
    return res?.purchase || res;
};

// 🛡 Админ: бүх худалдан авалтын жагсаалт (хэрэглэгч, хичээл, дүн, огноо)
export const listAllPurchases = async () => {
    try {
        const res = await apiCall('/purchases');
        return Array.isArray(res) ? res : res?.purchases || res?.data || [];
    } catch {
        return [];
    }
};

// ----------------------------------------------------------------------
// VI. Teachers
// ----------------------------------------------------------------------
export const listTeachers = async () => {
    try {
        const res = await apiCall('/teachers');
        return Array.isArray(res) ? res : res?.teachers || res?.data || [];
    } catch {
        return [];
    }
};

// ----------------------------------------------------------------------
// VII. Requests & Administrative Actions
// ----------------------------------------------------------------------
export const listPaymentRequests = async () => {
    try {
        const res = await apiCall('/requests/payments');
        return Array.isArray(res) ? res : res?.payments || res?.data || [];
    } catch {
        return [];
    }
};

export const listRegistrationRequests = async () => {
    try {
        const res = await apiCall('/requests/registrations');
        return Array.isArray(res) ? res : res?.registrations || res?.data || [];
    } catch {
        return [];
    }
};

export const approvePaymentRequest = async (id) => { 
    return await apiCall(`/requests/payments/${id}/approve`, { method: 'PATCH' }); 
};

export const denyPaymentRequest = async (id) => { 
    return await apiCall(`/requests/payments/${id}/deny`, { method: 'PATCH' }); 
};

export const approveRegistrationRequest = async (id) => { 
    return await apiCall(`/requests/registrations/${id}/approve`, { method: 'PATCH' }); 
};

export const denyRegistrationRequest = async (id) => { 
    return await apiCall(`/requests/registrations/${id}/deny`, { method: 'PATCH' }); 
};
