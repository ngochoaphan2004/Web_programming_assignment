// "use client";
// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import axiosConfig from "@/axiosConfig";

// const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

// /* mini‑toast reuse */
// const useToast = () => {
//   const [toast, setToast] = useState(null);
//   const show = (m, c = "bg-green-600") => {
//     setToast({ m, c });
//     setTimeout(() => setToast(null), 2000);
//   };
//   return { toast, show };
// };

// /* ADD‑CART helper */
// const addCart = async (id, toast) => {
//   try {
//     const r = await axiosConfig.post("/cart/add", { product_id: id, quantity: 1 });
//     r.data.success ? toast("Đã thêm vào giỏ!") : toast("Thêm lỗi!", "bg-red-600");
//   } catch {
//     toast("Bạn cần đăng nhập!", "bg-red-600");
//   }
// };

// /* static options */
// const CATEGORIES = ["sneaker", "sandal", "balo", "phukien"];
// const PRICE_OPTS = [
//   { label: "0 – 200 k", range: [0, 200000] },
//   { label: "200 k – 500 k", range: [200000, 500000] },
//   { label: "500 k – 1 tr", range: [500000, 1000000] },
//   { label: "≥ 1 tr", range: [1000000, 999999999] },
// ];

// export default function SearchPage() {
//   const router = useRouter();
//   const sp = useSearchParams();
//   const { toast, show } = useToast();

//   /* form state (init từ query‑string) */
//   const [kw, setKw] = useState(sp.get("kw") || "");
//   const [cats, setCats] = useState(sp.getAll("cat"));       // array
//   const [prices, setPrices] = useState(sp.getAll("price")); // e.g. ["0-200000"]

//   const [list, setList] = useState([]);

//   /* fetch each time filter change */
//   const fetchData = () => {
//     const params = new URLSearchParams();
//     if (kw) params.append("kw", kw);
//     cats.forEach((c) => params.append("cat[]", c));
//     prices.forEach((p) => params.append("price[]", p)); // backend nhận multi price

//     axiosConfig
//       .get("/products/search?" + params.toString())
//       .then((r) => r.data.success && setList(r.data.data))
//       .catch((e) => console.error(e));
//     /* push url for shareable link */
//     router.replace("/search?" + params.toString());
//   };

//   /* run on first mount */
//   useEffect(fetchData, []);

//   /* -------- handler toggle checkbox -------- */
//   const toggle = (arr, val, setArr) =>
//     setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

//   return (
//     <div className="flex flex-col lg:flex-row p-4 gap-6">
//       {/* ============== FILTER SIDEBAR ============== */}
//       <aside className="lg:w-60 shrink-0">
//         <h2 className="font-semibold mb-2">Bộ lọc</h2>

//         {/* từ khoá */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Từ khoá</label>
//           <input
//             value={kw}
//             onChange={(e) => setKw(e.target.value)}
//             className="border px-2 py-1 w-full rounded"
//             placeholder="Tên, mô tả…"
//           />
//         </div>

//         {/* loại */}
//         <div className="mb-4">
//           <p className="text-sm font-medium mb-1">Loại sản phẩm</p>
//           {CATEGORIES.map((c) => (
//             <label key={c} className="block text-sm">
//               <input
//                 type="checkbox"
//                 checked={cats.includes(c)}
//                 onChange={() => toggle(cats, c, setCats)}
//                 className="mr-2"
//               />
//               {c}
//             </label>
//           ))}
//         </div>

//         {/* khoảng giá */}
//         <div className="mb-4">
//           <p className="text-sm font-medium mb-1">Khoảng giá</p>
//           {PRICE_OPTS.map(({ label, range }) => {
//             const val = range.join("-");
//             return (
//               <label key={label} className="block text-sm">
//                 <input
//                   type="checkbox"
//                   checked={prices.includes(val)}
//                   onChange={() => toggle(prices, val, setPrices)}
//                   className="mr-2"
//                 />
//                 {label}
//               </label>
//             );
//           })}
//         </div>

//         <button
//           onClick={fetchData}
//           className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
//         >
//           Tìm kiếm
//         </button>
//       </aside>

//       {/* ============== RESULT GRID ============== */}
//       <section className="flex-1">
//         <h1 className="text-xl font-bold mb-4">
//           Kết quả ({list.length})
//         </h1>

//         {list.length === 0 ? (
//           <p>Không tìm thấy sản phẩm nào.</p>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {list.map((p) => (
//               <div key={p.id} className="text-black">
//                 <a href={`/product/${p.id}`}>
//                   <img
//                     src={p.image ? HOST + p.image : "/ex_img.png"}
//                     alt={p.name}
//                     className="mx-auto"
//                   />
//                   <p className="mt-2 text-sm line-clamp-2">{p.name}</p>
//                 </a>
//                 <p className="font-bold">
//                   {Number(p.price).toLocaleString("vi-VN")}₫
//                 </p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <button
//                     onClick={() => addCart(p.id, show)}
//                     disabled={p.stock === 0}
//                     className="text-xs text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700 disabled:opacity-40"
//                   >
//                     Thêm vào giỏ
//                   </button>
//                   <span className={`text-xs ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}>
//                     {p.stock > 0 ? `Còn ${p.stock}` : "Hết hàng"}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* toast */}
//       {toast && (
//         <div
//           className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${toast.c} text-white px-4 py-2 rounded shadow-lg animate-fade`}
//         >
//           {toast.m}
//         </div>
//       )}
//     </div>
//   );
// }







// "use client";
// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import axiosConfig from "@/axiosConfig";

// /* đường dẫn ảnh */
// const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

// /* ───────── mini-toast ───────── */
// const useToast = () => {
//   const [t, setT] = useState(null);
//   const show = (m, c = "bg-green-600") => {
//     setT({ m, c });
//     setTimeout(() => setT(null), 2000);
//   };
//   return { t, show };
// };

// /* ───────── add-cart helper ───────── */
// const addCart = async (id, toast) => {
//   try {
//     const r = await axiosConfig.post("/cart/add", { product_id: id, quantity: 1 });
//     r.data.success ? toast("Đã thêm vào giỏ!") : toast("Thêm lỗi!", "bg-red-600");
//   } catch {
//     toast("Bạn cần đăng nhập!", "bg-red-600");
//   }
// };

// /* static options */
// const CATS = ["sneaker", "sandal", "balo", "phukien"];
// const PRICE = [
//   { label: "0 – 200 k", v: [0, 200000] },
//   { label: "200 k – 500 k", v: [200000, 500000] },
//   { label: "500 k – 1 triệu", v: [500000, 1000000] },
//   { label: "≥ 1 triệu", v: [1000000, 1e9] },
// ];

// export default function SearchPage() {
//   const router = useRouter();
//   const sp = useSearchParams();
//   const { t, show } = useToast();

//   /* bộ lọc state */
//   const [kw, setKw] = useState(sp.get("kw") || "");
//   const [cats, setCat] = useState(sp.getAll("cat[]"));
//   const [prs, setPr] = useState(sp.getAll("price[]")); // ["0-200000"]

//   const [list, setList] = useState([]);
//   const [loading, setLoad] = useState(false);

//   /* helper toggle */
//   const toggle = (arr, val, setter) =>
//     setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

//   /* fetch */
//   const fetchData = () => {
//     const qs = new URLSearchParams();
//     if (kw) qs.append("kw", kw.trim());
//     cats.forEach((c) => qs.append("cat[]", c));
//     prs.forEach((p) => qs.append("price[]", p));

//     setLoad(true);
//     axiosConfig
//       .get("/products/search?" + qs.toString())
//       .then((r) => r.data.success && setList(r.data.data))
//       .catch(console.error)
//       .finally(() => setLoad(false));

//     router.replace("/search?" + qs.toString());
//   };

//   useEffect(() => {
//     fetchData();
//   }, []); // mount lần đầu

//   return (
//     <div className="px-4 py-6 lg:flex gap-8">
//       {/* -------- SIDEBAR -------- */}
//       <aside className="lg:w-64 shrink-0 mb-6 lg:mb-0 bg-white rounded-xl shadow-md p-6 transition-all duration-300">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Bộ lọc</h2>

//         {/* từ khoá */}
//         <div className="mb-6">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Từ khoá</label>
//           <input
//             value={kw}
//             onChange={(e) => setKw(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-400"
//             placeholder="Tên, mô tả..."
//           />
//         </div>

//         {/* loại */}
//         <div className="mb-6">
//           <p className="text-sm font-semibold text-gray-700 mb-3">Loại sản phẩm</p>
//           {CATS.map((c) => (
//             <label key={c} className="flex items-center text-sm capitalize mb-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={cats.includes(c)}
//                 onChange={() => toggle(cats, c, setCat)}
//                 className="mr-2 h-4 w-4 accent-blue-600 rounded focus:ring-blue-500 transition duration-200"
//               />
//               <span className="text-gray-600 hover:text-blue-600 transition duration-200">{c}</span>
//             </label>
//           ))}
//         </div>

//         {/* giá */}
//         <div className="mb-6">
//           <p className="text-sm font-semibold text-gray-700 mb-3">Khoảng giá</p>
//           {PRICE.map(({ label, v }) => {
//             const val = v.join("-");
//             return (
//               <label key={label} className="flex items-center text-sm mb-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={prs.includes(val)}
//                   onChange={() => toggle(prs, val, setPr)}
//                   className="mr-2 h-4 w-4 accent-blue-600 rounded focus:ring-blue-500 transition duration-200"
//                 />
//                 <span className="text-gray-600 hover:text-blue-600 transition duration-200">{label}</span>
//               </label>
//             );
//           })}
//         </div>

//         <button
//           onClick={fetchData}
//           className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
//         >
//           Tìm kiếm
//         </button>
//       </aside>

//       {/* -------- RESULT GRID -------- */}
//       <section className="flex-1">
//         <h1 className="text-xl font-bold mb-4">
//           Kết quả {loading ? "…" : `(${list.length})`}
//         </h1>

//         {list.length === 0 && !loading && (
//           <p className="text-gray-500 italic">Không tìm thấy sản phẩm.</p>
//         )}

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
//           {list.map((p) => (
//             <div
//               key={p.id}
//               className="group rounded-lg border hover:shadow-lg transition overflow-hidden"
//             >
//               <a href={`/product/${p.id}`}>
//                 <div className="aspect-square bg-gray-50 overflow-hidden">
//                   <img
//                     src={p.image ? HOST + p.image : "/ex_img.png"}
//                     alt={p.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
//                   />
//                 </div>
//                 <div className="p-3">
//                   <p className="text-sm font-medium line-clamp-2 h-10">{p.name}</p>
//                   <p className="font-bold text-blue-600">
//                     {Number(p.price).toLocaleString("vi-VN")}₫
//                   </p>
//                 </div>
//               </a>
//               <div className="flex items-center justify-between px-3 pb-3">
//                 <button
//                   onClick={() => addCart(p.id, show)}
//                   disabled={p.stock === 0}
//                   className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-40"
//                 >
//                   Thêm vào giỏ
//                 </button>
//                 <span
//                   className={`text-xs ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}
//                 >
//                   {p.stock > 0 ? `Còn ${p.stock}` : "Hết hàng"}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* -------- TOAST -------- */}
//       {t && (
//         <div
//           className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${t.c} text-white px-4 py-2 rounded shadow-lg animate-fade`}
//         >
//           {t.m}
//         </div>
//       )}
//     </div>
//   );
// }   








"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosConfig from "@/axiosConfig";
import { motion } from "framer-motion";

/* đường dẫn ảnh */
const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

/* ───────── mini-toast ───────── */
const useToast = () => {
  const [t, setT] = useState(null);
  const show = (m, c = "bg-green-600") => {
    setT({ m, c });
    setTimeout(() => setT(null), 2000);
  };
  return { t, show };
};

/* ───────── add-cart helper ───────── */
const addCart = async (id, toast) => {
  try {
    const r = await axiosConfig.post("/cart/add", { product_id: id, quantity: 1 });
    r.data.success ? toast("Đã thêm vào giỏ!") : toast("Thêm lỗi!", "bg-red-600");
  } catch {
    toast("Bạn cần đăng nhập!", "bg-red-600");
  }
};

/* static options */
const CATS = ["sneaker", "sandal", "balo", "phukien"];
const PRICE = [
  { label: "0 – 200.000", v: [0, 200000] },
  { label: "200.000 – 500.000", v: [200000, 500000] },
  { label: "500.000 – 1.000.000", v: [500000, 1000000] },
  { label: "≥ 1 triệu", v: [1000000, 1e9] },
];

export default function SearchPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const { t, show } = useToast();

  /* bộ lọc state */
  const [kw, setKw] = useState(sp.get("kw") || "");
  const [cats, setCat] = useState(sp.getAll("cat[]"));
  const [prs, setPr] = useState(sp.getAll("price[]")); // ["0-200000"]

  const [list, setList] = useState([]);
  const [loading, setLoad] = useState(false);

  /* helper toggle */
  const toggle = (arr, val, setter) =>
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  /* fetch */
  const fetchData = () => {
    const qs = new URLSearchParams();
    if (kw) qs.append("kw", kw.trim());
    cats.forEach((c) => qs.append("cat[]", c));
    prs.forEach((p) => qs.append("price[]", p));

    setLoad(true);
    axiosConfig
      .get("/products/search?" + qs.toString())
      .then((r) => r.data.success && setList(r.data.data))
      .catch(console.error)
      .finally(() => setLoad(false));

    router.replace("/search?" + qs.toString());
  };

  useEffect(() => {
    fetchData();
  }, []); // mount lần đầu

  return (
    <div className="px-4 py-6 lg:flex gap-8">
      {/* -------- SIDEBAR -------- */}
      <motion.aside
        className="lg:w-64 shrink-0 mb-6 lg:mb-0 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg p-6"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Bộ lọc
        </motion.h2>

        {/* từ khoá */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Từ khoá</label>
          <motion.input
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-400"
            placeholder="Tên, mô tả..."
            whileFocus={{ scale: 1.02, transition: { duration: 0.2 } }}
          />
        </div>

        {/* loại */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Loại sản phẩm</p>
          <div className="grid grid-cols-2 gap-2">
            {CATS.map((c) => (
              <motion.button
                key={c}
                onClick={() => toggle(cats, c, setCat)}
                className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors duration-200 ${
                  cats.includes(c)
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </div>

        {/* giá */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Khoảng giá</p>
          <div className="grid grid-cols-2 gap-2">
            {PRICE.map(({ label, v }) => {
              const val = v.join("-");
              return (
                <motion.button
                  key={label}
                  onClick={() => toggle(prs, val, setPr)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    prs.includes(val)
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label}
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.button
          onClick={fetchData}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg font-semibold shadow-md"
          whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Tìm kiếm
        </motion.button>
      </motion.aside>

      {/* -------- RESULT GRID -------- */}
      <section className="flex-1">
        <h1 className="text-xl font-bold mb-4">
          Kết quả {loading ? "…" : `(${list.length})`}
        </h1>

        {list.length === 0 && !loading && (
          <p className="text-gray-500 italic">Không tìm thấy sản phẩm.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {list.map((p) => (
            <div
              key={p.id}
              className="group rounded-lg border hover:shadow-lg transition overflow-hidden"
            >
              <a href={`/product/${p.id}`}>
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={p.image ? HOST + p.image : "/ex_img.png"}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2 h-10">{p.name}</p>
                  <p className="font-bold text-blue-600">
                    {Number(p.price).toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </a>
              <div className="flex items-center justify-between px-3 pb-3">
                <button
                  onClick={() => addCart(p.id, show)}
                  disabled={p.stock === 0}
                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-40"
                >
                  Thêm vào giỏ
                </button>
                <span
                  className={`text-xs ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {p.stock > 0 ? `Còn ${p.stock}` : "Hết hàng"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------- TOAST -------- */}
      {t && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${t.c} text-white px-4 py-2 rounded shadow-lg animate-fade`}
        >
          {t.m}
        </div>
      )}
    </div>
  );
}