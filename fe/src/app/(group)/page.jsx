"use client";
import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";

export default function Home() {
  /* --- state --- */
  const [newestProducts, setNewestProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  /* --- load dữ liệu khi component mount --- */
  useEffect(() => {
    /* sản phẩm mới nhất */
    axios
      .get("http://localhost:80/api/products/newest")      // ← API mới
      .then((res) => res.data.success && setNewestProducts(res.data.data))
      .catch((err) => console.error("Load newest:", err));

    /* sản phẩm bán chạy */
    axios
      .get("http://localhost:80/api/products/popular")     // ← đã có sẵn
      .then((res) => res.data.success && setBestSellerProducts(res.data.data))
      .catch((err) => console.error("Load bestseller:", err));
  }, []);

  /* --- component nhỏ render 1 grid sản phẩm --- */
  const ProductGrid = ({ data }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
      {data.map((p) => (
        <div className="text-black" key={p.id}>
          <img src={p.image || "/ex_img.png"} className="mx-auto" alt={p.name} />
          <p
            className="mt-2 text-sm line-clamp-2"
            /* tailwind line-clamp nếu có plugin; nếu không giữ inline-style như cũ */
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 2,
              lineHeight: "1.5em",
              maxHeight: "3em",
            }}
          >
            {p.name}
          </p>
          <p className="font-bold">
            {Number(p.price).toLocaleString("vi-VN")}₫
          </p>
        </div>
      ))}
    </div>
  );

  /* --- UI --- */
  return (
    <div className="bg-white font-sans">

      {/* Banner */}
      <section className="relative overflow-hidden px-4 py-6">
        <Carousel>
          {["banner1", "banner2", "banner3"].map((b) => (
            <Carousel.Item key={b} interval={3000}>
              <img
                src={`/banner/${b}.png`}
                alt={b}
                className="w-full h-[20vw] object-cover"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* ───────── SẢN PHẨM NỔI BẬT (mới nhất) ───────── */}
      <section className="px-4">
        <h2 className="text-xl font-semibold border-b pb-2">Sản phẩm nổi bật</h2>
        <ProductGrid data={newestProducts} />

        <div className="text-center mt-4">
          <a href="/all" className="inline-block bg-black text-white px-[6vw] py-2 rounded">
            Xem Thêm
          </a>
        </div>
      </section>

      {/* Free-ship note */}
      <div className="flex items-center justify-center gap-3 m-6 px-4">
        <img src="freeship.png" className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" alt="truck" />
        <p className="font-bold text-xs md:text-base m-0">
          FREE SHIP TOÀN QUỐC CHO TẤT CẢ CÁC ĐƠN
        </p>
      </div>

      {/* ───────── BÁN CHẠY (sold cao) ───────── */}
      <section className="px-4 mt-6">
        <h2 className="text-xl font-semibold border-b pb-2">Bán chạy</h2>
        <ProductGrid data={bestSellerProducts} />

        <div className="text-center mt-4">
          <a href="/all" className="inline-block bg-black text-white px-[6vw] py-2 rounded">
            Xem Thêm
          </a>
        </div>
      </section>
    </div>
  );
}
