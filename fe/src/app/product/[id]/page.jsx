// "use client";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "@/axiosConfig";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);
//   const [addingToCart, setAddingToCart] = useState(false);
//   const [showNotification, setShowNotification] = useState(false);
//   const [notificationMessage, setNotificationMessage] = useState("");
//   const [notificationType, setNotificationType] = useState("success");

//   /* tải thông tin sản phẩm */
//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await axios.get(`/products/${id}`);
//         if (res.data.success) setProduct(res.data.data);
//         else router.push("/");
//       } catch (err) {
//         console.error(err);
//         router.push("/");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [id, router]);

//   /* hiển thị thông báo */
//   const showToast = (message, type = "success") => {
//     setNotificationMessage(message);
//     setNotificationType(type);
//     setShowNotification(true);
//     setTimeout(() => setShowNotification(false), 3000);
//   };

//   /* thêm vào giỏ */
//   const addToCart = async () => {
//     if (quantity < 1 || quantity > product.stock) return;
    
//     setAddingToCart(true);
//     try {
//       const res = await axios.post("/cart/add", {
//         product_id: product.id,
//         quantity: quantity,
//       });
//       if (res.data.success) {
//         showToast("Đã thêm vào giỏ hàng!");
//       } else {
//         showToast("Lỗi khi thêm vào giỏ!", "error");
//       }
//     } catch (err) {
//       console.error("Cart add error:", err);
//       showToast("Vui lòng đăng nhập để thêm sản phẩm!", "error");
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   /* tăng giảm số lượng */
//   const decreaseQuantity = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   const increaseQuantity = () => {
//     if (quantity < product?.stock) setQuantity(quantity + 1);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
//           <div className="h-8 w-48 bg-gray-300 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!product) return null;

//   return (
//     <div className="bg-gray-50 min-h-screen pb-12">
//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6">
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
//             {/* Image Section */}
//             <div className="p-6 flex items-center justify-center bg-gray-50">
//               <div className="relative w-full aspect-square overflow-hidden rounded-lg">
//                 <img
//                   src={product.image || "/ex_img.png"}
//                   alt={product.name}
//                   className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
//                 />
//                 {product.stock <= 5 && product.stock > 0 && (
//                   <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
//                     Còn ít hàng
//                   </div>
//                 )}
//                 {product.stock === 0 && (
//                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <span className="text-white text-xl font-bold">Hết hàng</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Product Details */}
//             <div className="p-8 flex flex-col justify-between">
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
                
//                 {/* Price */}
//                 <div className="flex items-baseline mb-6">
//                   <span className="text-3xl font-bold text-red-600">
//                     {Number(product.price).toLocaleString("vi-VN")}₫
//                   </span>
//                   {/* Giá cũ nếu có giảm giá */}
//                   {product.old_price && (
//                     <span className="ml-3 text-lg text-gray-400 line-through">
//                       {Number(product.old_price).toLocaleString("vi-VN")}₫
//                     </span>
//                   )}
//                 </div>

//                 {/* Meta info */}
//                 <div className="mb-6 space-y-2 text-sm text-gray-600 border-t border-b py-4">
//                   <div className="flex items-center">
//                     <span className="w-32 font-medium">Mã sản phẩm:</span>
//                     <span>#{product.id}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <span className="w-32 font-medium">Danh mục:</span>
//                     <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">{product.category}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <span className="w-32 font-medium">Tình trạng:</span>
//                     <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
//                       {product.stock > 0 ? `Còn hàng (${product.stock})` : "Hết hàng"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div className="mb-8">
//                   <h3 className="text-lg font-medium mb-2">Mô tả sản phẩm</h3>
//                   <p className="text-gray-600 whitespace-pre-line leading-relaxed">
//                     {product.description}
//                   </p>
//                 </div>
//               </div>

//               {/* Add to cart section */}
//               {product.stock > 0 && (
//                 <div className="pt-4 border-t">
//                   <div className="flex items-center mb-4">
//                     <span className="text-gray-700 mr-4">Số lượng:</span>
//                     <div className="flex items-center border border-gray-300 rounded-md">
//                       <button
//                         onClick={decreaseQuantity}
//                         className="px-3 py-1 bg-gray-100 border-r border-gray-300 hover:bg-gray-200"
//                       >
//                         -
//                       </button>
//                       <input
//                         type="number"
//                         min="1"
//                         max={product.stock}
//                         value={quantity}
//                         onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))}
//                         className="w-12 text-center py-1 border-none focus:outline-none focus:ring-0"
//                       />
//                       <button
//                         onClick={increaseQuantity}
//                         className="px-3 py-1 bg-gray-100 border-l border-gray-300 hover:bg-gray-200"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>
//                   <button
//                     onClick={addToCart}
//                     disabled={addingToCart || product.stock === 0}
//                     className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center transition-colors duration-300 disabled:opacity-50"
//                   >
//                     {addingToCart ? (
//                       <span className="flex items-center">
//                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Đang xử lý...
//                       </span>
//                     ) : (
//                       <>🛒 Thêm vào giỏ hàng</>
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Related features or more information can be added here */}
//         <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
//             <div className="bg-green-100 p-3 rounded-full mr-4">
//               <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//               </svg>
//             </div>
//             <div>
//               <h3 className="font-medium">Chất lượng đảm bảo</h3>
//               <p className="text-sm text-gray-500">Sản phẩm chính hãng</p>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
//             <div className="bg-blue-100 p-3 rounded-full mr-4">
//               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H8a2 2 0 01-2-2V7"></path>
//               </svg>
//             </div>
//             <div>
//               <h3 className="font-medium">Giao hàng nhanh</h3>
//               <p className="text-sm text-gray-500">Nhận hàng trong 24h</p>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
//             <div className="bg-purple-100 p-3 rounded-full mr-4">
//               <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
//               </svg>
//             </div>
//             <div>
//               <h3 className="font-medium">Thanh toán an toàn</h3>
//               <p className="text-sm text-gray-500">Nhiều phương thức</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Toast Notification */}
//       {showNotification && (
//         <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg transition-all transform ${
//           notificationType === "success" ? "bg-green-600" : "bg-red-600"
//         } text-white`}>
//           {notificationMessage}
//         </div>
//       )}
//     </div>
//   );
// }





"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/axiosConfig";
import axiosConfig from "@/axiosConfig";
const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;
export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  /* tải thông tin sản phẩm */
  useEffect(() => {
    async function load() {
      try {
        const res = await axiosConfig.get(`/products/${id}`);
        if (res.data.success) setProduct(res.data.data);
        else router.push("/");
      } catch (err) {
        console.error(err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  /* hiển thị thông báo */
  const showToast = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  /* thêm vào giỏ */
  const addToCart = async () => {
    if (quantity < 1 || quantity > product.stock) return;
    
    setAddingToCart(true);
    try {
      const res = await axiosConfig.post("/cart/add", {
        product_id: product.id,
        quantity: quantity,
      });
      if (res.data.success) {
        showToast("Đã thêm vào giỏ hàng!");
      } else {
        showToast("Lỗi khi thêm vào giỏ!", "error");
      }
    } catch (err) {
      console.error("Cart add error:", err);
      showToast("Vui lòng đăng nhập để thêm sản phẩm!", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  /* tăng giảm số lượng */
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product?.stock) setQuantity(quantity + 1);
  };

  /* quay về trang chủ */
  const goToHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Nút quay về trang chủ */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <button
          onClick={goToHome}
          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors duration-200 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Quay về trang chủ
        </button>
      </div> */}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="p-6 flex items-center justify-center bg-gray-50">
              <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                <img
                  src={product.image ? HOST + product.image : "/ex_img.png"}
                  alt={product.name}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Còn ít hàng
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">Hết hàng</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
                
                {/* Price */}
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-red-600">
                    {Number(product.price).toLocaleString("vi-VN")}₫
                  </span>
                  {/* Giá cũ nếu có giảm giá */}
                  {product.old_price && (
                    <span className="ml-3 text-lg text-gray-400 line-through">
                      {Number(product.old_price).toLocaleString("vi-VN")}₫
                    </span>
                  )}
                </div>

                {/* Meta info */}
                <div className="mb-6 space-y-2 text-sm text-gray-600 border-t border-b py-4">
                  <div className="flex items-center">
                    <span className="w-32 font-medium">Mã sản phẩm:</span>
                    <span>#{product.id}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 font-medium">Danh mục:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">{product.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 font-medium">Tình trạng:</span>
                    <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                      {product.stock > 0 ? `Còn hàng (${product.stock})` : "Hết hàng"}
                    </span>
                  </div>
                </div>

                {/* Chi tiết sản phẩm - NEW SECTION */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Chi tiết sản phẩm</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <table className="w-full">
                      <tbody>
                        {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
                          <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="py-2 px-3 text-sm font-medium text-gray-700">{key}</td>
                            <td className="py-2 px-3 text-sm text-gray-600">{value}</td>
                          </tr>
                        ))}
                        {!product.specifications && (
                          <>
                            <tr className="bg-gray-50">
                              <td className="py-2 px-3 text-sm font-medium text-gray-700">Thương hiệu</td>
                              <td className="py-2 px-3 text-sm text-gray-600">{product.brand || 'Đang cập nhật'}</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="py-2 px-3 text-sm font-medium text-gray-700">Xuất xứ</td>
                              <td className="py-2 px-3 text-sm text-gray-600">{product.origin || 'Đang cập nhật'}</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="py-2 px-3 text-sm font-medium text-gray-700">Bảo hành</td>
                              <td className="py-2 px-3 text-sm text-gray-600">{product.warranty || '12 tháng'}</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="py-2 px-3 text-sm font-medium text-gray-700">Đơn vị</td>
                              <td className="py-2 px-3 text-sm text-gray-600">{product.unit || 'Chiếc'}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-2">Mô tả sản phẩm</h3>
                  <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Add to cart section */}
              {product.stock > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center mb-4">
                    <span className="text-gray-700 mr-4">Số lượng:</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={decreaseQuantity}
                        className="px-3 py-1 bg-gray-100 border-r border-gray-300 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))}
                        className="w-12 text-center py-1 border-none focus:outline-none focus:ring-0"
                      />
                      <button
                        onClick={increaseQuantity}
                        className="px-3 py-1 bg-gray-100 border-l border-gray-300 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={addToCart}
                    disabled={addingToCart || product.stock === 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center transition-colors duration-300 disabled:opacity-50"
                  >
                    {addingToCart ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      <>🛒 Thêm vào giỏ hàng</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related features or more information can be added here */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Chất lượng đảm bảo</h3>
              <p className="text-sm text-gray-500">Sản phẩm chính hãng</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H8a2 2 0 01-2-2V7"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Giao hàng nhanh</h3>
              <p className="text-sm text-gray-500">Nhận hàng trong 24h</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Thanh toán an toàn</h3>
              <p className="text-sm text-gray-500">Nhiều phương thức</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showNotification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg transition-all transform ${
          notificationType === "success" ? "bg-green-600" : "bg-red-600"
        } text-white`}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
}







