// src/modules/payments/QPayModal.jsx
// QPay modal — хичээл худалдан авахад зориулсан (EduLMS хувилбар).
// Төлбөр амжилттай болмогц createPurchase API-р backend/админ руу мэдээлэл илгээнэ.

import { useState, useEffect, useRef } from "react";
import { createPurchase, getMe } from "../../services/api.js";
import { addLocalPurchase } from "./purchaseStore.js";
import toast from "react-hot-toast";

const POLL_INTERVAL_MS = 3000;
const PAYMENT_TIMEOUT_SEC = 180;

// QPay-ийн албан ёсны лого
const QPAY_LOGO = "https://qpay.mn/q/logo_qpay.png";

// Банкны албан ёсны лого URL-ууд (public CDN / Wikipedia эх сурвалж)
const BANKS = [
  {
    name: "Хаан банк",
    short: "ХБ",
    color: "#00843D",
    deeplink: "khanbank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Khan_Bank_logo.svg/512px-Khan_Bank_logo.svg.png",
  },
  {
    name: "Голомт банк",
    short: "ГБ",
    color: "#1565c0",
    deeplink: "golomtbank",
    logo: "https://companieslogo.com/img/orig/GOLOMT.MN-12a05a42.png?t=1637187775",
  },
  {
    name: "ХХБ",
    short: "ХХБ",
    color: "#2e7d32",
    deeplink: "tdbbank",
    logo: "https://upload.wikimedia.org/wikipedia/en/0/0b/Trade_and_Development_Bank_of_Mongolia_logo.png",
  },
  {
    name: "Төрийн банк",
    short: "ТБ",
    color: "#6a1b9a",
    deeplink: "statebankmongolia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/State_Bank_Mongolia_logo.svg/512px-State_Bank_Mongolia_logo.svg.png",
  },
  {
    name: "ХАС банк",
    short: "ХАС",
    color: "#e65100",
    deeplink: "xacbank",
    logo: "https://companieslogo.com/img/orig/XAC.MN-0a0d292a.png?t=1637187775",
  },
  {
    name: "Social Pay",
    short: "SP",
    color: "#0288d1",
    deeplink: "socialpay-payment",
    logo: "https://play-lh.googleusercontent.com/KXfz3ZeCoVXtTc6j2cFS2JeDfbW4F3i_sWVfSG_7j8F4fGJgwf7rN8xEv6hKHkWPvQ=w240",
  },
  {
    name: "Ард Апп",
    short: "АРД",
    color: "#00796b",
    deeplink: "ard",
    logo: "https://play-lh.googleusercontent.com/WAGAWvkOoyJVvmLvBClFTHjFwj8Cl9qcp1pINBFZM-cRl6CBv4oFYhTrYj2bZhhBrg=w240",
  },
  {
    name: "Богд банк",
    short: "БГД",
    color: "#37474f",
    deeplink: "bogdbank",
    logo: "https://www.bogdbank.com/images/bogdbank-logo.png",
  },
  {
    name: "M банк",
    short: "М",
    color: "#ad1457",
    deeplink: "mbank",
    logo: "https://www.mbank.mn/assets/images/logo.png",
  },
  {
    name: "Чингис банк",
    short: "ЧК",
    color: "#4527a0",
    deeplink: "ckbank",
    logo: "https://chinggisbank.mn/assets/img/logo.png",
  },
  {
    name: "Мост Мани",
    short: "MM",
    color: "#558b2f",
    deeplink: "most",
    logo: "https://play-lh.googleusercontent.com/YB_3AJDx4H6z5wWQ_6AJ6bVJGpqKqKrhDqKq=w240",
  },
  {
    name: "Транс банк",
    short: "ТРБ",
    color: "#455a64",
    deeplink: "transbank",
    logo: "https://transbank.mn/images/logo.png",
  },
];

function formatTime(s) {
  return (
    String(Math.floor(s / 60)).padStart(2, "0") +
    ":" +
    String(s % 60).padStart(2, "0")
  );
}

// Банкны лого load бүтэлгүйтвэл fallback-д initials харуулна
function BankLogo({ bank }) {
  const [broken, setBroken] = useState(false);
  if (broken || !bank.logo) {
    return (
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[10px] font-bold text-white"
        style={{ background: bank.color }}
      >
        {bank.short}
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-gray-100 overflow-hidden">
      <img
        src={bank.logo}
        alt={bank.name}
        className="h-full w-full object-contain p-0.5"
        onError={() => setBroken(true)}
        loading="lazy"
      />
    </div>
  );
}

export default function QPayModal({
  courseId,
  courseTitle,
  amount,
  teacherName,
  onSuccess,
  onClose,
}) {
  const [step, setStep] = useState("loading"); // loading | qr | success | error
  const [invoiceId, setInvoiceId] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT_SEC);
  const pollRef = useRef(null);
  const timerRef = useRef(null);

  // ── Init: invoice үүсгэх (одоохондоо mock, backend дээр QPay интеграцчлалыг хийнэ)
  useEffect(() => {
    initInvoice();
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initInvoice = async () => {
    setStep("loading");
    setTimeLeft(PAYMENT_TIMEOUT_SEC);
    try {
      // QPay invoice-ийн дүр эсгэсэн ID. Backend QPay API холбосны дараа
      // энэ хэсгийг бодит /api/qpay/create-invoice руу солино.
      const fakeInvoiceId = `LMS-${courseId?.slice?.(-6) || "CRS"}-${Date.now()}`;
      const qrData = encodeURIComponent(
        `qpay://q?inv=${fakeInvoiceId}&amt=${amount}&c=${courseId}`
      );
      const qr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=4&data=${qrData}`;

      setInvoiceId(fakeInvoiceId);
      setQrUrl(qr);
      setStep("qr");
      startPolling(fakeInvoiceId);
      startTimer();
    } catch (e) {
      console.error("QPay init алдаа:", e);
      setErrorMsg("QPay холбогдоход алдаа гарлаа. Дахин оролдоно уу.");
      setStep("error");
    }
  };

  // Backend-д бодит төлбөрийн статусыг шалгах endpoint бэлэн болоход энд холбоно.
  // Одоохондоо полл нь зүгээр л timer-ийг барина, бодит confirm нь DEV товч эсвэл
  // backend webhook-оос ирнэ.
  const startPolling = (id) => {
    pollRef.current = setInterval(async () => {
      // TODO: /api/qpay/check/:invoiceId руу шалгалт хийх
      // Одоохондоо автоматаар confirm хийхгүй.
    }, POLL_INTERVAL_MS);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          cleanup();
          setStep("error");
          setErrorMsg("Төлбөрийн хугацаа дууслаа. Дахин оролдоно уу.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cleanup = () => {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
    pollRef.current = null;
    timerRef.current = null;
  };

  // 💳 Төлбөрийг баталгаажуулах → backend /api/purchases руу POST
  // Энэ API нь админ удирдлагын хэсгээр харагдах худалдан авалтын бичлэг үүсгэнэ.
  const confirmPaymentToBackend = async () => {
    const payload = {
      courseId,
      courseTitle,
      amount: Number(amount),
      paymentMethod: "qpay",
      invoiceId,
    };
    const res = await createPurchase(payload);
    return res;
  };

  const handleConfirm = async () => {
    cleanup();

    const me = getMe();
    const userId = me?._id || me?.id;

    // 1) Backend руу илгээх (админ руу мэдээлэл очих)
    let backendOk = false;
    try {
      await confirmPaymentToBackend();
      backendOk = true;
    } catch (e) {
      console.error("Backend purchase save error:", e);
      // Backend бичилт амжилтгүй ч хэрэглэгч төлсөн тул local руу хадгалаад
      // дараа нь sync хийх боломжтой. Гэхдээ алдааг console-д үлдээнэ.
    }

    // 2) Local storage-д үргэлж хадгалах — logout/login хийсэн ч үлдэнэ.
    //    Админ самбарт backend endpoint байхгүй үед энэ кеш нь гол эх сурвалж
    //    болдог тул хэрэглэгч/хичээлийн бүрэн мэдээллийг хадгална.
    try {
      addLocalPurchase(userId, {
        courseId,
        courseTitle,
        amount: Number(amount),
        paymentMethod: "qpay",
        invoiceId,
        userName: me?.name || "",
        userEmail: me?.email || "",
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error("Local purchase save error:", e);
    }

    setStep("success");
    if (backendOk) {
      toast.success("Төлбөр амжилттай! Хичээлд хандах эрх нээгдлээ.");
    } else {
      toast.success("Төлбөр бүртгэгдлээ. Админтай sync хийгдсэн үед гэрчилгээ илгээгдэнэ.");
    }
    setTimeout(() => onSuccess?.(), 2000);
  };

  const handleClose = () => {
    cleanup();
    // TODO: backend QPay invoice cancel endpoint холбогдсон үед
    // /api/qpay/cancel/:invoiceId руу дуудаж invoice-г хүчингүй болгоно.
    onClose?.();
  };

  const handleRetry = () => {
    cleanup();
    initInvoice();
  };

  const timerColor =
    timeLeft > 60 ? "#1a56db" : timeLeft > 30 ? "#f59e0b" : "#ef4444";
  const progressPct = Math.round((timeLeft / PAYMENT_TIMEOUT_SEC) * 100);
  const isUrgent = timeLeft <= 30;

  // Банкны аппыг нээх deep-link (бодит invoice-ыг backend үүсгэмэгц урсгалаар орно)
  const getBankUrl = (bank) =>
    `${bank.deeplink}://q?qPay_QRcode=${invoiceId || ""}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-sm rounded-t-2xl bg-white sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
          <div className="h-1 w-9 rounded-full bg-gray-200" />
        </div>

        {/* Header with official QPay logo */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 pb-3 pt-1">
          <div className="flex items-center gap-2.5">
            <img
              src={QPAY_LOGO}
              alt="QPay"
              className="h-7 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
            <div
              className="h-7 w-7 items-center justify-center rounded-lg bg-blue-700 hidden"
              style={{ display: "none" }}
            >
              <span className="text-sm font-bold text-white">Q</span>
            </div>
            <span className="text-[15px] font-semibold text-gray-900">QPay</span>
          </div>
          <button
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Loading */}
        {step === "loading" && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="h-9 w-9 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500">QR код бэлдэж байна...</p>
          </div>
        )}

        {/* QR */}
        {step === "qr" && (
          <>
            <div className="bg-blue-50/60 px-5 py-3.5 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-0.5">Төлбөрийн дүн</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  {Number(amount).toLocaleString()}
                </span>
                <span className="text-base font-medium text-gray-600">₮</span>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-700 truncate max-w-[200px]">
                  {courseTitle}
                </span>
                {teacherName && (
                  <span className="rounded-md bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                    Багш: {teacherName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 border-b border-gray-100 px-5 py-4">
              <div className="rounded-2xl border border-gray-200 p-2.5 bg-white">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="QPay QR"
                    width={168}
                    height={168}
                    className="block"
                  />
                ) : (
                  <div className="h-[168px] w-[168px] bg-gray-100 animate-pulse rounded" />
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="9" r="5.5" stroke="#9ca3af" strokeWidth="1.4" />
                  <path d="M8 6.5V9l1.5 1" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
                  <path d="M6 2h4" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span
                  style={{ color: timerColor }}
                  className={`font-mono text-base font-bold tabular-nums transition-colors ${
                    isUrgent ? "animate-pulse" : ""
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs text-gray-400">дотор уншуулна уу</span>
              </div>
              <div className="h-0.5 w-52 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${progressPct}%`, background: timerColor }}
                />
              </div>
              <p className="text-xs text-gray-400 text-center">
                Банкны аппликейшнаараа QR уншуулна уу
              </p>

              {/* DEV: төлбөрийг шууд баталгаажуулж backend руу purchase илгээх */}
              <button
                onClick={handleConfirm}
                className="w-full rounded-xl border border-dashed border-green-400 bg-green-50 py-2.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors"
              >
                ✅ Төлбөр хийгдсэн (тест)
              </button>
            </div>

            <div className="px-4 pb-5 pt-1">
              <p className="py-3 text-center text-xs text-gray-400">
                эсвэл банкаа сонгоно уу
              </p>
              <div className="grid grid-cols-3 gap-2">
                {BANKS.map((bank) => (
                  <a
                    key={bank.deeplink}
                    href={getBankUrl(bank)}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-white px-2 py-2.5 transition-all active:scale-95 hover:border-blue-200 hover:bg-blue-50"
                  >
                    <BankLogo bank={bank} />
                    <span className="text-center text-[10px] font-medium leading-tight text-gray-700">
                      {bank.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="flex flex-col items-center px-5 py-10 gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Төлбөр амжилттай!</h3>
            <p className="text-center text-sm text-gray-500 leading-relaxed">
              Хичээл худалдан авалт баталгаажлаа.
              <br />
              Одоо хичээлийг үзэх боломжтой боллоо.
            </p>
            <div className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 mt-1">
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-500">Хичээл</span>
                <span className="font-semibold text-gray-800 truncate ml-2">
                  {courseTitle}
                </span>
              </div>
              {teacherName && (
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-gray-500">Багш</span>
                  <span className="font-semibold text-gray-800">
                    {teacherName}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-blue-100 pt-2 mt-1 text-sm">
                <span className="text-gray-500">Нийт</span>
                <span className="font-bold text-blue-700">
                  {Number(amount).toLocaleString()}₮
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onSuccess?.();
                onClose?.();
              }}
              className="mt-1 w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-opacity active:opacity-80"
            >
              Хичээл рүү очих →
            </button>
          </div>
        )}

        {/* Error */}
        {step === "error" && (
          <div className="flex flex-col items-center px-5 py-10 gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="1.8" />
                <path
                  d="M12 8v4m0 4h.01"
                  stroke="#ef4444"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Алдаа гарлаа</h3>
            <p className="text-center text-sm text-gray-500 leading-relaxed">
              {errorMsg}
            </p>
            <button
              onClick={handleRetry}
              className="w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white transition-opacity active:opacity-80"
            >
              Дахин оролдох
            </button>
            <button
              onClick={handleClose}
              className="text-sm text-gray-400 py-1"
            >
              Цуцлах
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
