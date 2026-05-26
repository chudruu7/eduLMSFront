// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MyPurchases = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_URL = "http://localhost:5000/api/purchases"; // Backend API

//   useEffect(() => {
//     const fetchPurchases = async () => {
//       try {
//         const response = await axios.get(API_URL, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setPurchases(response.data);
//       } catch (err) {
//         setError("Худалдан авалтуудыг авахад алдаа гарлаа.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPurchases();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <p className="text-red-500 text-center mt-6">{error}</p>;
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-bold mb-4">Миний Худалдан Авалтууд</h2>
//       {purchases.length === 0 ? (
//         <p className="text-gray-600">Та одоогоор ямар ч сургалт худалдан аваагүй байна.</p>
//       ) : (
//         <div className="grid gap-4">
//           {purchases.map((course) => (
//             <div key={course._id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
//               <h3 className="text-lg font-semibold">{course.title}</h3>
//               <p className="text-blue-600 font-bold">₮{course.price.toLocaleString()}</p>
//               <p className="text-gray-500 text-sm">Худалдан авсан огноо: {new Date(course.date).toLocaleDateString()}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyPurchases;