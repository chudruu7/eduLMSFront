// src/modules/payments/purchaseStore.js
// Худалдан авалтыг localStorage-д хадгалах туслах модул.
// Backend endpoint бэлэн болоогүй тул front-end тал дээр бүрэн бичлэгүүдийг
// хадгалж, AdminPanel болон CourseDetail аль нь ч ашиглаж чадна.
//
// Key загвар: `edulms_user_purchases_{userId}` → array of purchase objects
//   purchase: {
//     courseId, courseTitle, amount, paymentMethod, invoiceId,
//     userId, userName, userEmail, createdAt
//   }
//
// Чухал: `lms_` угтвар ашиглахгүй — AuthContext.logout нь `lms_`/`lms-`
// угтвартай key-г устгадаг учраас.

const KEY_PREFIX = 'edulms_user_purchases_';
const keyFor = (userId) => `${KEY_PREFIX}${userId}`;

function safeParse(json) {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

// ── Тухайн хэрэглэгчийн худалдан авалтуудыг авах ───────────────────
export function getLocalPurchases(userId) {
  if (!userId) return [];
  const raw = safeParse(localStorage.getItem(keyFor(userId)));
  // Хуучин хадгалалт нь string[] (зөвхөн courseId) байсан — хэвийн object-той
  // хэлбэр рүү normalize хийе.
  return raw.map((p) => {
    if (typeof p === 'string') return { courseId: p };
    return p;
  });
}

// ── Тухайн хэрэглэгчийн шинэ покупка нэмэх ─────────────────────────
// record: {courseId, courseTitle, amount, paymentMethod, invoiceId, userName, userEmail}
export function addLocalPurchase(userId, record) {
  if (!userId) return;

  // Backwards-compat: хэрэв дан string/id дамжуулсан бол object болгоно
  if (typeof record === 'string' || typeof record === 'number') {
    record = { courseId: String(record) };
  }
  if (!record?.courseId) return;

  const arr = getLocalPurchases(userId);
  const exists = arr.some((p) => String(p.courseId) === String(record.courseId));
  if (exists) return;

  const full = {
    courseId: String(record.courseId),
    courseTitle: record.courseTitle || '',
    amount: Number(record.amount || 0),
    paymentMethod: record.paymentMethod || 'qpay',
    invoiceId: record.invoiceId || '',
    userId: String(userId),
    userName: record.userName || '',
    userEmail: record.userEmail || '',
    createdAt: record.createdAt || new Date().toISOString(),
  };

  arr.push(full);
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(arr));
  } catch (e) {
    console.warn('localStorage бичихэд алдаа:', e);
  }
}

// ── Тухайн хэрэглэгч тухайн хичээлийг авсан эсэх ───────────────────
export function hasLocalPurchase(userId, courseId) {
  if (!userId || !courseId) return false;
  return getLocalPurchases(userId).some(
    (p) => String(p.courseId) === String(courseId)
  );
}

// ── Админ-ийн харах: browser дотор хадгалагдсан БҮХ хэрэглэгчийн
//    худалдан авалтуудыг нэг массив болгон буцаана.
//    (Backend endpoint бэлэн биш үед demo/тестийн өгөгдлийг харуулахад ашиглана)
export function getAllLocalPurchases() {
  const out = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !k.startsWith(KEY_PREFIX)) continue;
    const userId = k.slice(KEY_PREFIX.length);
    const list = safeParse(localStorage.getItem(k));
    list.forEach((p) => {
      if (typeof p === 'string') {
        out.push({ courseId: p, userId });
      } else {
        out.push({ userId, ...p });
      }
    });
  }
  // Огноогоор шинэ→хуучин эрэмбэлнэ
  out.sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    return tb - ta;
  });
  return out;
}
