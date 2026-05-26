// Бүх системийн ангилалын нэг эх сурвалж.
// UploadCourse-ийн <option value> болон CategoryPage-ийн нэрс энэ массиваас гарна.
// Ингэснээр хичээл хадгалах үед бичигддэг courseCategory утга нь
// ангилалын хуудсан дээр шүүгддэг утгатай яг таарна.

export const COURSE_CATEGORIES = [
  'ЕБС-ийн сургуулийн хичээл',
  'Мэдээллийн технологийн сургалт',
  'Төлбөргүй цахим хичээл',
  'Төрийн албан хаагчийн мэргэшүүлэх дунд хугацааны сургалт',
  'Хэлний сургалт',
];

// Хуучин болон шинэ нэрс хооронд хамаарах keyword-уудыг
// тодорхойлж, ямар нэг утгыг "канон" ангилал руу буулгана.
// Жишээ нь: "ЕБС-ийн багш" → "ЕБС-ийн сургуулийн хичээл"
const CATEGORY_KEYWORDS = {
  'ЕБС-ийн сургуулийн хичээл': ['ебс', 'сургууль', 'eb'],
  'Мэдээллийн технологийн сургалт': [
    'мэдээллийн технологи',
    'мэдээллийн тенхологи', // хуучин typo
    'технологи',
    'тенхологи',
    'it',
    'мт',
  ],
  'Төлбөргүй цахим хичээл': ['төлбөргүй', 'үнэгүй', 'цахим'],
  'Төрийн албан хаагчийн мэргэшүүлэх дунд хугацааны сургалт': [
    'төрийн алба',
    'албан хаагч',
    'мэргэшүүлэх',
  ],
  'Хэлний сургалт': ['хэл', 'хэлний'],
};

const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Дурын courseCategory утгыг канон ангилал руу буулгана.
 * Таарахгүй бол анхны утгыг буцаана.
 */
export function canonicalizeCategory(raw) {
  const n = normalize(raw);
  if (!n) return '';

  // Хамгийн түрүүнд яг тэнцүү бол шууд буцаана
  for (const cat of COURSE_CATEGORIES) {
    if (normalize(cat) === n) return cat;
  }

  // Дараа нь keyword-р мөшгинө
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => n.includes(kw))) {
      return cat;
    }
  }

  return raw; // таарахгүй бол өөрчлөлгүй буцаана
}

/**
 * Тухайн course нь өгөгдсөн ангилалд хамаарах эсэх.
 */
export function courseMatchesCategory(course, category) {
  if (!category) return true;
  const courseCanon = canonicalizeCategory(course?.courseCategory);
  return normalize(courseCanon) === normalize(category);
}
