
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
              className="text-xs text-white bg-green-600 px-2 py-1 !rounded-md hover:bg-green-700 disabled:opacity-40 transition-colors duration-200"
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

      {/* freeship */}
      <div className="flex items-center justify-center gap-3 mt-8 px-4">
        <img src="/freeship.png" className="w-10 h-auto md:w-[50px]" alt="" />
        <p className="font-bold text-sm md:text-lg m-0">
          FREE SHIP TOÀN QUỐC CHO TẤT CẢ CÁC ĐƠN
        </p>
      </div>

      {/* bán chạy */}
      <section className="px-4 my-6">
        <h2 className="text-xl font-semibold border-b pb-2">Bán chạy</h2>
        <ProductGrid data={bestSellerProducts} />
      </section>

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