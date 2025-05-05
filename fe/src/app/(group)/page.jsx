// // "use client";
// // import React, { useEffect, useState } from "react";
// // import Carousel from "react-bootstrap/Carousel";
// // import axios from "axios";
// // import axiosConfig from "@/axiosConfig";
// // const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

// // const handleAddToCart = async (productId) => {
// //   try {
// //     const res = await axiosConfig.post("/cart/add", { product_id: productId, quantity: 1 });
// //     if (res.data.success) {
// //       alert("Đã thêm vào giỏ hàng!");
// //     } else {
// //       alert("Lỗi khi thêm vào giỏ!");
// //     }
// //   } catch (err) {
// //     console.error("Cart add error:", err);
// //     alert("Vui lòng đăng nhập để thêm sản phẩm!");
// //   }
// // };

// // export default function Home() {
// //   /* --- state --- */
// //   const [newestProducts, setNewestProducts] = useState([]);
// //   const [bestSellerProducts, setBestSellerProducts] = useState([]);

// //   /* --- load dữ liệu khi component mount --- */
// //   useEffect(() => {
// //     /* sản phẩm mới nhất */
// //     axiosConfig.get("/products/newest")      // ← API mới
// //       .then((res) => res.data.success && setNewestProducts(res.data.data))
// //       .catch((err) => console.error("Load newest:", err));

// //     /* sản phẩm bán chạy */
// //     axiosConfig.get("/products/popular")     // ← đã có sẵn
// //       .then((res) => res.data.success && setBestSellerProducts(res.data.data))
// //       .catch((err) => console.error("Load bestseller:", err));
// //   }, []);

// //   /* --- component nhỏ render 1 grid sản phẩm --- */
// //   const ProductGrid = ({ data }) => (
// //     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
// //       {data.map((p) => (
// //         <div className="text-black" key={p.id}>
// //         <a href={`/product/${p.id}`}>
// //           <img
// //             src={p.image ? HOST + p.image : "/ex_img.png"}
// //             className="mx-auto"
// //             alt={p.name}
// //           />
// //           <p
// //             className="mt-2 text-sm line-clamp-2"
// //             style={{
// //               display: "-webkit-box",
// //               WebkitBoxOrient: "vertical",
// //               overflow: "hidden",
// //               WebkitLineClamp: 2,
// //               lineHeight: "1.5em",
// //               maxHeight: "3em",
// //             }}
// //           >
// //             {p.name}
// //           </p>
// //         </a>
// //         <p className="font-bold">
// //           {Number(p.price).toLocaleString("vi-VN")}₫
// //         </p>
// //         {/* Nút thêm vào giỏ */}
// //         <button
// //           onClick={() => handleAddToCart(p.id)}
// //           className="mt-1 text-sm text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700"
// //         >
// //           Thêm vào giỏ
// //         </button>
// //       </div>      
// //       ))}
// //     </div>
// //   );

// //   /* --- UI --- */
// //   return (
// //     <div className="bg-white font-sans">

// //       {/* Banner */}
// //       <section className="relative overflow-hidden px-4 py-6">
// //         <Carousel>
// //           {["banner1", "banner2", "banner3"].map((b) => (
// //             <Carousel.Item key={b} interval={3000}>
// //               <img
// //                 src={`/banner/${b}.png`}
// //                 alt={b}
// //                 className="w-full h-[20vw] object-cover"
// //               />
// //             </Carousel.Item>
// //           ))}
// //         </Carousel>
// //       </section>

// //       {/* ───────── SẢN PHẨM NỔI BẬT (mới nhất) ───────── */}
// //       <section className="px-4">
// //         <h2 className="text-xl font-semibold border-b pb-2">Sản phẩm nổi bật</h2>
// //         <ProductGrid data={newestProducts} />

// //         <div className="text-center mt-4">
// //           <a href="/all" className="inline-block bg-black text-white px-[6vw] py-2 rounded">
// //             Xem Thêm
// //           </a>
// //         </div>
// //       </section>

// //       {/* Free-ship note */}
// //       <div className="flex items-center justify-center gap-3 m-6 px-4">
// //         <img src="freeship.png" className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" alt="truck" />
// //         <p className="font-bold text-xs md:text-base m-0">
// //           FREE SHIP TOÀN QUỐC CHO TẤT CẢ CÁC ĐƠN
// //         </p>
// //       </div>

// //       {/* ───────── BÁN CHẠY (sold cao) ───────── */}
// //       <section className="px-4 mt-6">
// //         <h2 className="text-xl font-semibold border-b pb-2">Bán chạy</h2>
// //         <ProductGrid data={bestSellerProducts} />

// //         <div className="text-center mt-4">
// //           <a href="/all" className="inline-block bg-black text-white px-[6vw] py-2 rounded">
// //             Xem Thêm
// //           </a>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }






// "use client";
// import { useEffect, useState } from "react";
// import Carousel from "react-bootstrap/Carousel";
// import axiosConfig from "@/axiosConfig";

// const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

// /* ───────────────── Toast hook (mini, no library) ───────────────── */
// const useToast = () => {
//   const [toast, setToast] = useState(null); // { msg, color }
//   const showToast = (msg, color = "bg-green-600") => {
//     setToast({ msg, color });
//     setTimeout(() => setToast(null), 2000);
//   };
//   return { toast, showToast };
// };

// /* ───────────────── Main Page ───────────────── */
// export default function Home() {
//   /* toast */
//   const { toast, showToast } = useToast();

//   /* state */
//   const [newestProducts, setNewestProducts] = useState([]);
//   const [bestSellerProducts, setBestSellerProducts] = useState([]);

//   /* add to cart */
//   const handleAddToCart = async (productId) => {
//     try {
//       const res = await axiosConfig.post("/cart/add", {
//         product_id: productId,
//         quantity: 1,
//       });
//       if (res.data.success) showToast("Đã thêm vào giỏ hàng!");
//       else showToast("Lỗi khi thêm!", "bg-red-600");
//     } catch {
//       showToast("Bạn cần đăng nhập!", "bg-red-600");
//     }
//   };

//   /* fetch data */
//   useEffect(() => {
//     axiosConfig
//       .get("/products/newest")
//       .then((r) => r.data.success && setNewestProducts(r.data.data))
//       .catch((e) => console.error("newest", e));

//     axiosConfig
//       .get("/products/popular")
//       .then((r) => r.data.success && setBestSellerProducts(r.data.data))
//       .catch((e) => console.error("popular", e));
//   }, []);

//   /* grid component */
//   const ProductGrid = ({ data }) => (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
//       {data.map((p) => (
//         <div key={p.id} className="text-black">
//           <a href={`/product/${p.id}`}>
//             <img
//               src={p.image ? HOST + p.image : "/ex_img.png"}
//               alt={p.name}
//               className="mx-auto"
//             />
//             <p className="mt-2 text-sm line-clamp-2">{p.name}</p>
//           </a>
//           <p className="font-bold">
//             {Number(p.price).toLocaleString("vi-VN")}₫
//           </p>
//           <div className="flex items-center gap-2 mt-1">
//             <button
//               onClick={() => handleAddToCart(p.id)}
//               disabled={p.stock === 0}
//               className="text-xs text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700 disabled:opacity-40"
//             >
//               Thêm vào giỏ
//             </button>
//             <span className={`text-xs ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}>
//               {p.stock > 0 ? `Còn ${p.stock}` : "Hết hàng"}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   /* UI */
//   return (
//     <div className="bg-white font-sans">
//       {/* banner */}
//       <section className="relative overflow-hidden px-4 py-6">
//         <Carousel>
//           {["banner1", "banner2", "banner3"].map((b) => (
//             <Carousel.Item key={b} interval={3000}>
//               <img src={`/banner/${b}.png`} className="w-full h-[20vw] object-cover" />
//             </Carousel.Item>
//           ))}
//         </Carousel>
//       </section>

//       {/* mới nhất */}
//       <section className="px-4">
//         <h2 className="text-xl font-semibold border-b pb-2">Sản phẩm mới</h2>
//         <ProductGrid data={newestProducts} />

//         {/* <div className="text-center mt-4">
//           <a href="/all" className="inline-block bg-black text-white px-[6vw] py-2 rounded">
//             Xem Thêm
//           </a>
//         </div> */}

//       </section>

//       {/* bán chạy */}
//       <section className="px-4 mt-6">
//         <h2 className="text-xl font-semibold border-b pb-2">Bán chạy</h2>
//         <ProductGrid data={bestSellerProducts} />

//         {/* <div className="text-center mt-4">
//           <a href="/all" className="inline-block bg-black text-white px-[6vw] py-2 rounded">
//             Xem Thêm
//           </a>
//         </div> */}

//       </section>
       
//       {/* freeship */}
//       <div className="flex items-center justify-center gap-3 m-6 px-4">
//         <img src="/freeship.png" className="w-10 h-10 md:w-[50px]" alt="" />
//         <p className="font-bold text-xs md:text-base m-0">
//           FREE SHIP TOÀN QUỐC CHO TẤT CẢ CÁC ĐƠN
//         </p>
//       </div>

//       {/* Toast */}
//       {toast && (
//         <div
//           className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${toast.color} text-white px-4 py-2 rounded shadow-lg animate-fade`}
//         >
//           {toast.msg}
//         </div>
//       )}
//     </div>
//   );
// }









"use client";
import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import axiosConfig from "@/axiosConfig";
import { motion } from "framer-motion";

const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

/* ───────────────── Toast hook (mini, no library) ───────────────── */
const useToast = () => {
  const [toast, setToast] = useState(null); // { msg, color }
  const showToast = (msg, color = "bg-green-600") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2000);
  };
  return { toast, showToast };
};

/* ───────────────── Main Page ───────────────── */
export default function Home() {
  /* toast */
  const { toast, showToast } = useToast();

  /* state */
  const [newestProducts, setNewestProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  /* add to cart */
  const handleAddToCart = async (productId) => {
    try {
      const res = await axiosConfig.post("/cart/add", {
        product_id: productId,
        quantity: 1,
      });
      if (res.data.success) showToast("Đã thêm vào giỏ hàng!");
      else showToast("Lỗi khi thêm!", "bg-red-600");
    } catch {
      showToast("Bạn cần đăng nhập!", "bg-red-600");
    }
  };

  /* fetch data */
  useEffect(() => {
    axiosConfig
      .get("/products/newest")
      .then((r) => r.data.success && setNewestProducts(r.data.data))
      .catch((e) => console.error("newest", e));

    axiosConfig
      .get("/products/popular")
      .then((r) => r.data.success && setBestSellerProducts(r.data.data))
      .catch((e) => console.error("popular", e));
  }, []);

  /* grid component */
  const ProductGrid = ({ data }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
      {data.map((p) => (
        <div key={p.id} className="text-black flex flex-col items-center">
          <a href={`/product/${p.id}`} className="block w-full">
            <div className="aspect-square w-full overflow-hidden">
              <motion.img
                src={p.image ? HOST + p.image : "/ex_img.png"}
                alt={p.name}
                className="w-full h-full object-cover rounded-xl transition-transform duration-200"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            <p className="mt-2 text-sm line-clamp-2 text-center">{p.name}</p>
          </a>
          <p className="font-bold text-center">
            {Number(p.price).toLocaleString("vi-VN")}₫
          </p>
          <div className="flex items-center gap-2 mt-1">
            <motion.button
              onClick={(e) => { e.preventDefault(); handleAddToCart(p.id); }}
              disabled={p.stock === 0}
              className="text-xs text-white bg-green-600 px-2 py-1 rounded-xl hover:bg-green-700 disabled:opacity-40 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Thêm vào giỏ
            </motion.button>
            <span className={`text-xs ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {p.stock > 0 ? `Còn ${p.stock}` : "Hết hàng"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  /* UI */
  return (
    <div className="bg-white font-sans">
      {/* banner */}
      <section className="relative overflow-hidden px-4 py-6">
        <Carousel>
          {["banner1", "banner2", "banner3"].map((b) => (
            <Carousel.Item key={b} interval={3000}>
              <img src={`/banner/${b}.png`} className="w-full h-[20vw] object-cover" />
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* mới nhất */}
      <section className="px-4">
        <h2 className="text-xl font-semibold border-b pb-2">Sản phẩm mới</h2>
        <ProductGrid data={newestProducts} />
      </section>

      {/* bán chạy */}
      <section className="px-4 mt-6">
        <h2 className="text-xl font-semibold border-b pb-2">Bán chạy</h2>
        <ProductGrid data={bestSellerProducts} />
      </section>
       
      {/* freeship */}
      <div className="flex items-center justify-center gap-3 mt-8 px-4">
        <img src="/freeship.png" className="w-10 h-10 md:w-[50px]" alt="" />
        <p className="font-bold text-sm md:text-lg m-0">
          FREE SHIP TOÀN QUỐC CHO TẤT CẢ CÁC ĐƠN
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${toast.color} text-white px-4 py-2 rounded shadow-lg animate-fade`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}