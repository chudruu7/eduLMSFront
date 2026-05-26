import { useState, createContext, useContext, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL, loginUser, registerUser } from "../../services/api.js";
import { useLocation, useNavigate } from "react-router-dom";

const LS_ME = "lms_me";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const getLocalMe = () => {
    try {
        const s = localStorage.getItem(LS_ME);
        return s ? JSON.parse(s) : null;
    } catch {
        localStorage.removeItem(LS_ME);
        return null;
    }
};

export function AuthProvider({ children }) {
    const [me, setMe] = useState(getLocalMe());
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // ── fetchMe: зөвхөн нэг удаа, loop үгүй ──────────────────────────
    const fetchMe = useCallback(async () => {
        const local = getLocalMe();
        if (!local?.token) { setLoading(false); return; }

        try {
            const res = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: { 'Authorization': `Bearer ${local.token}` }
            });
            if (res.ok) {
                const fresh = await res.json();
                // ✅ ЗАСВАР: Backend-ээс ирсэн хариулт хэрэв phone зэрэг талбаргүй байвал
                // local-д хадгалсан өгөгдлөө сүйтгэхгүйгээр merge хийнэ.
                const user = { ...local, ...(fresh?.user || fresh || {}), token: local.token };
                setMe(user);
                localStorage.setItem(LS_ME, JSON.stringify(user));
            }
        } catch (e) {
            console.error('fetchMe алдаа:', e.message);
        } finally {
            setLoading(false);
        }
    }, []); // ← хоосон: loop үгүй

    // ── Login ─────────────────────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        try {
            const user = await loginUser(email, password);
            setMe(user);
            localStorage.setItem(LS_ME, JSON.stringify(user));
            return user;
        } catch (e) {
            toast.error(e.message || 'Нэвтрэхэд алдаа гарлаа.');
            throw e;
        }
    }, []);

    // ── Register ──────────────────────────────────────────────────────
    const registerFn = useCallback(async (data) => {
        try {
            const user = await registerUser(data);
            toast.success('Бүртгэл амжилттай. Одоо нэвтэрнэ үү.');
            return user;
        } catch (e) {
            toast.error(e.message || 'Бүртгэлд алдаа гарлаа.');
            throw e;
        }
    }, []);

    // ── Logout ────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        // lms_ угтвартай бүх key-г устга
        Object.keys(localStorage)
            .filter(k => k.startsWith('lms_') || k.startsWith('lms-'))
            .forEach(k => localStorage.removeItem(k));

        setMe(null);
        toast.success('Амжилттай гарлаа.');
        setTimeout(() => navigate('/login', { replace: true }), 100);
    }, [navigate]);

    // ── updateProfile ─────────────────────────────────────────────────
    const updateProfile = useCallback(async (profileData) => {
        const local = getLocalMe();
        if (!local?.token) { toast.error('Нэвтрэх эрхгүй.'); return; }

        try {
            // Avatar хэт том бол хасах
            if (profileData.avatar?.length > 1_000_000) {
                const { avatar, ...rest } = profileData;
                profileData = rest;
                toast('Зураг хэт том байна. Зураггүйгээр шинэчлэгдлээ.');
            }

            const res = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${local.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            if (!res.ok) throw new Error(`Шинэчлэхэд алдаа: ${res.status}`);

            const updated = await res.json();
            // ✅ ЗАСВАР: Backend шинэ талбарыг буцаахгүй байхад (жишээ: phone schema-д байхгүй)
            // илгээсэн profileData-аа merge хийж, хуучин me өгөгдлөө хадгална.
            const user = {
                ...local,
                ...profileData,
                ...(updated?.user || updated || {}),
                token: local.token,
            };
            setMe(user);
            localStorage.setItem(LS_ME, JSON.stringify(user));
            toast.success('Профайл амжилттай шинэчлэгдлээ.');
            return user;
        } catch (e) {
            toast.error(e.message || 'Профайл шинэчлэхэд алдаа гарлаа.');
            throw e;
        }
    }, []);

    // ── Effects ───────────────────────────────────────────────────────
    useEffect(() => {
        const local = getLocalMe();
        if (local?.token) fetchMe();
        else setLoading(false);
    }, []); // ← нэг удаа

    useEffect(() => {
        if (loading || me) return;
        const path = location.pathname.toLowerCase();
        if (!['/login', '/register', '/'].includes(path)) {
            navigate('/login', { replace: true });
        }
    }, [me, loading, location.pathname, navigate]);

    // ── Context value ─────────────────────────────────────────────────
    const value = useMemo(() => ({
        me, loading,
        isAuthenticated: !!me,
        isAdmin:   me?.role === 'admin',
        isTeacher: me?.role === 'teacher',
        isStudent: me?.role === 'student',
        login, logout,
        register: registerFn,
        updateProfile,
        fetchMe,
    }), [me, loading, login, logout, registerFn, updateProfile, fetchMe]);

    return (
        <AuthContext.Provider value={value}>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 text-white text-xl">
                    Ачаалж байна...
                </div>
            )}
            {!loading && children}
        </AuthContext.Provider>
    );
}
