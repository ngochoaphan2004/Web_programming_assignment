"use client";
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import axiosConfig from "@/axiosConfig";

export default function SneakerPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosConfig
      .get("http://localhost:80/api/products/category/sneaker")
      .then((res) => {
        if (res.data.success) setProducts(res.data.data);
      })
      .catch((err) => console.error("Lỗi khi tải sneaker:", err));
  }, []);

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Sneaker</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="text-black">
            <img
              src={p.image || "/ex_img.png"}
              alt={p.name}
              className="mx-auto"
            />
            <p className="mt-2 text-sm line-clamp-2">
              {p.name}
            </p>
            <p className="font-bold">
              {Number(p.price).toLocaleString("vi-VN")}₫
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

