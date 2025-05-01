"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosConfig from "@/axiosConfig";
const categories = [
  { key: "sneaker", label: "Sneaker" },
  { key: "sandal", label: "Sandal" },
  { key: "balo", label: "Balo" },
  { key: "phukien", label: "Phụ kiện" },
];

export default function AllProductsPage() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [pageByCategory, setPageByCategory] = useState({});

  useEffect(() => {
    categories.forEach(({ key }) => loadProducts(key, 1));
  }, []);

  const loadProducts = async (category, page) => {
    try {
      const res = await axiosConfig.get(`http://localhost:80/api/products/category/${category}/paginate?limit=5&page=${page}`);
      if (res.data.success) {
        setProductsByCategory((prev) => ({ ...prev, [category]: res.data.data }));
        setPageByCategory((prev) => ({ ...prev, [category]: page }));
      }
    } catch (err) {
      console.error(`Lỗi khi tải ${category}:`, err);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Tất cả sản phẩm</h1>

      {categories.map(({ key, label }) => (
        <div key={key} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{label}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(productsByCategory[key] || []).map((p) => (
              <div key={p.id} className="text-black">
                <img src={p.image || "/ex_img.png"} alt={p.name} className="mx-auto" />
                <p className="mt-2 text-sm line-clamp-2">{p.name}</p>
                <p className="font-bold">
                  {Number(p.price).toLocaleString("vi-VN")}₫
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => loadProducts(key, (pageByCategory[key] || 1) + 1)}
              className="bg-black text-white px-6 py-2 rounded"
            >
              Xem thêm
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
