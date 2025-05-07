// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import axiosConfig from "@/axiosConfig";
// const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

// const categories = [
//   { key: "sneaker", label: "Sneaker" },
//   { key: "sandal", label: "Sandal" },
//   { key: "balo", label: "Balo" },
//   { key: "phukien", label: "Phụ kiện" },
// ];

// export default function AllProductsPage() {
//   const [productsByCategory, setProductsByCategory] = useState({});
//   const [pageByCategory, setPageByCategory] = useState({});

//   useEffect(() => {
//     categories.forEach(({ key }) => loadProducts(key, 1));
//   }, []);

//   const loadProducts = async (category, page) => {
//     try {
//       const res = await axiosConfig.get(`http://localhost:80/api/products/category/${category}/paginate?limit=5&page=${page}`);
//       if (res.data.success) {
//         setProductsByCategory((prev) => ({ ...prev, [category]: res.data.data }));
//         setPageByCategory((prev) => ({ ...prev, [category]: page }));
//       }
//     } catch (err) {
//       console.error(`Lỗi khi tải ${category}:`, err);
//     }
//   };

//   return (
//     <div className="px-4 py-6">
//       <h1 className="text-2xl font-bold mb-4">Tất cả sản phẩm</h1>

//       {categories.map(({ key, label }) => (
//         <div key={key} className="mb-8">
//           <h2 className="text-xl font-semibold mb-2">{label}</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {(productsByCategory[key] || []).map((p) => (
//               <div key={p.id} className="text-black">
//                 <img src={p.image ? HOST + p.image : "/ex_img.png"} alt={p.name} className="mx-auto" />
//                 <p className="mt-2 text-sm line-clamp-2">{p.name}</p>
//                 <p className="font-bold">
//                   {Number(p.price).toLocaleString("vi-VN")}₫
//                 </p>
//               </div>
//             ))}
//           </div>
//           <div className="text-center mt-4">
//             <button
//               onClick={() => loadProducts(key, (pageByCategory[key] || 1) + 1)}
//               className="bg-black text-white px-6 py-2 rounded"
//             >
//               Xem thêm
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }










"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosConfig from "@/axiosConfig";

const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

/* ───────── 1. Cấu hình danh mục ───────── */
const categories = [
  { key: "sneaker",  label: "Sneaker"   },
  { key: "sandal",   label: "Sandal"    },
  { key: "balo",     label: "Balo"      },
  { key: "phukien",  label: "Phụ kiện"  },
];

/* ───────── 2. Hook mini‑toast ───────── */
const useToast = () => {
  const [toast, setToast] = useState(null);           // {msg,color}
  const show = (msg, color = "bg-green-600") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2000);
  };
  return { toast, show };
};

/* ───────── 3. Component Card sản phẩm ───────── */
const ProductCard = ({ p, addCart }) => (
  <div className="text-black flex flex-col items-center">
    {/* Ảnh + tên */}
    <a href={`/product/${p.id}`} className="block w-full">
      <div className="aspect-square w-full overflow-hidden rounded-xl shadow">
        <motion.img
          src={p.image ? HOST + p.image : "/ex_img.png"}
          alt={p.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: .2 }}
        />
      </div>
      <p className="mt-2 text-sm line-clamp-2 text-center">{p.name}</p>
    </a>

    {/* Giá */}
    <p className="font-bold text-center">
      {Number(p.price).toLocaleString("vi-VN")}₫
    </p>

    {/* Nút + tồn kho */}
    <div className="flex items-center gap-2 mt-1">
      <motion.button
        onClick={e => { e.preventDefault(); addCart(p.id); }}
        disabled={p.stock === 0}
        className="text-xs text-white bg-green-600 px-2 py-1 rounded-xl
                   hover:bg-green-700 disabled:opacity-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Thêm vào giỏ
      </motion.button>

      <span className={`text-xs ${p.stock>0 ? "text-green-600":"text-red-600"}`}>
        {p.stock>0 ? `Còn ${p.stock}` : "Hết hàng"}
      </span>
    </div>
  </div>
);

/* ───────── 4. Trang ALL ───────── */
export default function AllProductsPage() {
  const { toast, show }          = useToast();
  const [data, setData]          = useState({});   // {sneaker:[...], balo:[...]}
  const [loading, setLoading]    = useState(true);

  /* lấy toàn bộ cho 4 loại */
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosConfig.get("/products/grouped"); // đã có route này
        if (res.data.success) setData(res.data.data);
      } finally { setLoading(false); }
    })();
  }, []);

  /* thêm 1 sp */
  const addCart = async (id) => {
    try {
      const r = await axiosConfig.post("/cart/add", { product_id:id, quantity:1 });
      r.data.success ? show("Đã thêm vào giỏ!") : show("Thêm lỗi!", "bg-red-600");
    } catch { show("Bạn cần đăng nhập!", "bg-red-600"); }
  };

  if (loading) return <p className="p-4">Đang tải...</p>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h1>

      {categories.map(({ key, label }) => (
        <div key={key}>
          {/* ── TIÊU ĐỀ + VẠCH ── */}
          <div className="flex items-center gap-4 my-8">
            <span className="flex-grow h-px bg-gray-300" />
            <h2 className="text-2xl font-bold uppercase text-center whitespace-nowrap">
              {label}
            </h2>
            <span className="flex-grow h-px bg-gray-300" />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(data[key] || []).map(p => (
              <ProductCard key={p.id} p={p} addCart={addCart} />
            ))}
          </div>
        </div>
      ))}

      {/* Toast mini */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50
                         ${toast.color} text-white px-4 py-2 rounded shadow-lg`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
