// import React, { useState, useContext } from "react";
// import { WalletContext } from "../../context/WalletContext.jsx";

// const Purchase = ({ courseTitle = "Сургалтын нэр", coursePrice = 99000 }) => {
//   const { id: courseId } = useParams();
//   const navigate = useNavigate();
//   const { currentWalletBalance, updateWallet } = useContext(WalletContext);

//   const [walletBalance, setWalletBalance] = useState(currentWalletBalance);
//   const [topUpAmount, setTopUpAmount] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const processTopUp = (amount) => new Promise((resolve) => setTimeout(() => resolve(amount), 1500));
//   const processPurchase = (method) => new Promise((resolve) => setTimeout(() => resolve("success"), 2000));

//   const handleTopUp = async () => {
//     if (!topUpAmount || topUpAmount <= 0) return alert("Дүнгээ оруулна уу!");
//     setIsProcessing(true);
//     const addedAmount = await processTopUp(Number(topUpAmount));
//     const newBalance = walletBalance + addedAmount;
//     setWalletBalance(newBalance);
//     updateWallet(newBalance);
//     setIsProcessing(false);
//     alert(`Хэтэвч амжилттай цэнэглэгдлээ! +₮${addedAmount.toLocaleString()}`);
//     setTopUpAmount("");
//   };

//   const handlePurchase = async (method) => {
//     setIsProcessing(true);
//     const result = await processPurchase(method);
//     setIsProcessing(false);
//     if (result === "success") {
//       if (method === "wallet") {
//         const newBalance = walletBalance - coursePrice;
//         setWalletBalance(newBalance);
//         updateWallet(newBalance);
//       }
//       alert("Таны худалдан авалт амжилттай боллоо!");
//       navigate("/my-purchases");
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
//       {/* Wallet Top-up */}
//       <div className="bg-white p-6 rounded-2xl shadow-xl flex-1">
//         <h2 className="text-2xl font-bold mb-4">Хэтэвч Цэнэглэх</h2>
//         <p className="text-5xl font-extrabold text-green-600 mb-4">₮{walletBalance.toLocaleString()}</p>
//         <input
//           type="number"
//           value={topUpAmount}
//           onChange={(e) => setTopUpAmount(e.target.value)}
//           placeholder="Дүн оруулах"
//           className="border rounded-lg p-3 w-full mb-4"
//         />
//         <div className="flex gap-3 mb-4">
//           {[50000, 100000].map((amt) => (
//             <button
//               key={amt}
//               onClick={() => setTopUpAmount(amt)}
//               className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
//             >
//               +₮{amt.toLocaleString()}
//             </button>
//           ))}
//         </div>
//         <button
//           onClick={handleTopUp}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl w-full"
//           disabled={isProcessing}
//         >
//           {isProcessing ? "Түр хүлээнэ үү..." : "Хэтэвч Цэнэглэх"}
//         </button>
//       </div>

//       {/* Course Purchase */}
//       <div className="bg-white p-6 rounded-2xl shadow-xl flex-1">
//         <h2 className="text-2xl font-bold mb-4">Сургалт Худалдан Авах</h2>
//         <p className="text-xl font-semibold mb-2">{courseTitle}</p>
//         <p className="text-3xl font-bold text-blue-600 mb-4">₮{coursePrice.toLocaleString()}</p>

//         <button
//           onClick={() => handlePurchase("wallet")}
//           className={`py-3 px-6 rounded-xl w-full mb-4 ${
//             walletBalance >= coursePrice
//               ? "bg-green-600 hover:bg-green-700 text-white"
//               : "bg-gray-400 text-gray-700 cursor-not-allowed"
//           }`}
//           disabled={walletBalance < coursePrice || isProcessing}
//         >
//           {walletBalance >= coursePrice
//             ? `Хэтэвчээр Төлөх (Үлдэгдэл: ₮${walletBalance.toLocaleString()})`
//             : "Хэтэвчээр Төлөх (Үлдэгдэл хүрэлцэхгүй)"}
//         </button>

//         <div className="grid grid-cols-2 gap-4">
//           {["QPay", "Apple Pay", "Social Pay", "Samsung Pay"].map((method) => (
//             <button
//               key={method}
//               onClick={() => handlePurchase(method)}
//               className="border-2 border-gray-300 p-4 hover:border-blue-500 rounded-xl"
//               disabled={isProcessing}
//             >
//               {method}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Purchase;
