// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import axiosConfig from "@/axiosConfig";
// const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;
// export default function SandalPage() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axiosConfig
//       .get("http://localhost:80/api/products/category/sandal")
//       .then((res) => {
//         if (res.data.success) setProducts(res.data.data);
//       })
//       .catch((err) => console.error("Lỗi khi tải sandal:", err));
//   }, []);

//   return (
//     <div className="px-4 py-6">
//       <h1 className="text-2xl font-bold mb-4">Sandal</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//         {products.map((p) => (
//           <div key={p.id} className="text-black">
//             <img
//               src={p.image ? HOST + p.image : "/ex_img.png"}
//               alt={p.name}
//               className="mx-auto"
//             />
//             <p className="mt-2 text-sm line-clamp-2">{p.name}</p>
//             <p className="font-bold">
//               {Number(p.price).toLocaleString("vi-VN")}₫
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }





"use client";
import { useEffect, useState } from "react";
import axiosConfig from "@/axiosConfig";

const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

/* mini‑toast hook */
const useToast = () => {
  const [toast, setToast] = useState(null);
  const show = (msg, color = "bg-green-600") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2000);
  };
  return { toast, show };
};

export default function SandalPage() {
  const { toast, show } = useToast();
  const [products, setProducts] = useState([]);

  /* add cart */
  const addCart = async (id) => {
    try {
      const r = await axiosConfig.post("/cart/add", { product_id: id, quantity: 1 });
      r.data.success ? show("Đã thêm vào giỏ!") : show("Thêm lỗi!", "bg-red-600");
    } catch {
      show("Bạn cần đăng nhập!", "bg-red-600");
    }
  };

  useEffect(() => {
    axiosConfig
      .get("/products/category/sandal")
      .then((r) => r.data.success && setProducts(r.data.data))
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Sandal</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="text-black">
            <a href={`/product/${p.id}`}>
              <img src={p.image ? HOST + p.image : "/ex_img.png"} alt={p.name} className="mx-auto" />
              <p className="mt-2 text-sm line-clamp-2">{p.name}</p>
            </a>
            <p className="font-bold">{Number(p.price).toLocaleString("vi-VN")}₫</p>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => addCart(p.id)}
                disabled={p.stock === 0}
                className="text-xs text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700 disabled:opacity-40"
              >
                Thêm vào giỏ
              </button>
              <span className={`text-xs ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {p.stock > 0 ? `Còn ${p.stock}` : "Hết hàng"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${toast.color} text-white px-4 py-2 rounded shadow-lg animate-fade`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}