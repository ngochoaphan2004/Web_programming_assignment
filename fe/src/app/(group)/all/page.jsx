"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosConfig from "@/axiosConfig";

const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL || "http://localhost:80";

const categories = [
  { key: "sneaker", label: "Sneaker" },
  { key: "sandal", label: "Sandal" },
  { key: "balo", label: "Balo" },
];

/* Mini-toast */
const useToast = () => {
  const [toast, setToast] = useState(null); // {msg, color}
  const show = (msg, color = "bg-green-600") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2000);
  };
  return { toast, show };
};

export default function AllProductsPage() {
  const { toast, show } = useToast();
  const [productsByCategory, setProductsByCategory] = useState({});
  const [pageByCategory, setPageByCategory] = useState(
    categories.reduce((acc, { key }) => ({ ...acc, [key]: 1 }), {})
  );
  const [hasMoreByCategory, setHasMoreByCategory] = useState(
    categories.reduce((acc, { key }) => ({ ...acc, [key]: true }), {})
  );
  const [isLoadingByCategory, setIsLoadingByCategory] = useState(
    categories.reduce((acc, { key }) => ({ ...acc, [key]: false }), {})
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("useEffect running, initial load");
    Promise.all(categories.map(({ key }) => loadProducts(key, 1))).catch((err) => {
      console.error("Error loading initial products:", err);
      setError("Không thể tải sản phẩm ban đầu");
    });
  }, []);

  const loadProducts = async (category, page) => {
    if (!hasMoreByCategory[category] || isLoadingByCategory[category]) {
      console.log(
        `Skipped loading ${category}: hasMore=${hasMoreByCategory[category]}, isLoading=${isLoadingByCategory[category]}`
      );
      return;
    }

    console.log(`Loading ${category}, page ${page}`);
    setIsLoadingByCategory((prev) => ({ ...prev, [category]: true }));
    setError(null);
    try {
      console.log(`Calling API: /api/products/category/${category}/paginate?limit=5&page=${page}`);
      const res = await axiosConfig.get(
        `/api/products/category/${category}/paginate?limit=5&page=${page}`
      );
      console.log(`Response for ${category}:`, res.data);

      if (res.data.success) {
        const { data, meta } = res.data;
        console.log(`Data received for ${category}:`, data);

        setProductsByCategory((prev) => {
          const existingIds = new Set((prev[category] || []).map((p) => p.id));
          const newData = data.filter((p) => !existingIds.has(p.id));
          const newProducts = [...(prev[category] || []), ...newData];
          console.log(`New products for ${category}:`, newProducts);
          return { ...prev, [category]: newProducts };
        });

        setPageByCategory((prev) => ({ ...prev, [category]: page }));

        const hasMore = meta.current_page < meta.last_page;
        setHasMoreByCategory((prev) => ({ ...prev, [category]: hasMore }));
      } else {
        setError(`Lỗi khi tải ${category}: ${res.data.message || "Không thể tải sản phẩm"}`);
      }
    } catch (err) {
      console.error(`Lỗi khi tải ${category}:`, err);
      setError(`Lỗi khi tải ${category}: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setIsLoadingByCategory((prev) => ({ ...prev, [category]: false }));
    }
  };

  /* Thêm sản phẩm vào giỏ */
  const addCart = async (id) => {
    try {
      const r = await axiosConfig.post("/cart/add", { product_id: id, quantity: 1 });
      r.data.success ? show("Đã thêm vào giỏ!") : show("Thêm lỗi!", "bg-red-600");
    } catch {
      show("Bạn cần đăng nhập!", "bg-red-600");
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Tất cả sản phẩm</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${toast.color} text-white px-4 py-2 rounded shadow-lg`}
        >
          {toast.msg}
        </div>
      )}

      {categories.map(({ key, label }) => (
        <div key={key} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{label}</h2>
          {productsByCategory[key]?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {productsByCategory[key].map((p) => (
                  <div key={p.id} className="text-black flex flex-col items-center">
                    {/* Ảnh + Tên */}
                    <a href={`/product/${p.id}`} className="block w-full">
                      <div className="aspect-square w-full overflow-hidden rounded-xl shadow">
                        <motion.img
                          src={p.image ? `${HOST}${p.image}` : "/ex_img.png"}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                      <p className="mt-2 text-sm line-clamp-2 text-center">{p.name}</p>
                    </a>

                    {/* Giá */}
                    <p className="font-bold text-center">
                      {Number(p.price).toLocaleString("vi-VN")}₫
                    </p>

                    {/* Nút + Tồn kho */}
                    <div className="flex items-center gap-2 mt-1">
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          addCart(p.id);
                        }}
                        disabled={p.stock === 0}
                        className="text-xs text-white bg-green-600 px-2 py-1 rounded-xl hover:bg-green-700 disabled:opacity-40"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Thêm vào giỏ
                      </motion.button>
                      <span
                        className={`text-xs ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {p.stock > 0 ? `Còn ${p.stock}` : "Hết hàng"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                {hasMoreByCategory[key] ? (
                  <button
                    onClick={() => loadProducts(key, (pageByCategory[key] || 1) + 1)}
                    disabled={isLoadingByCategory[key]}
                    className={`px-6 py-2 rounded text-white font-medium ${
                      isLoadingByCategory[key] ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                    } transition`}
                  >
                    {isLoadingByCategory[key] ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang tải...
                      </span>
                    ) : (
                      "Xem thêm"
                    )}
                  </button>
                ) : (
                  <p className="text-gray-500">Đã tải hết sản phẩm</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500">Không có sản phẩm nào trong danh mục này</p>
          )}
        </div>
      ))}
    </div>
  );
}