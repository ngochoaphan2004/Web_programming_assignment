"use client"
import React, { useEffect, useState } from "react";
import Carousel from 'react-bootstrap/Carousel';

export default function Home() {
  const adsData = [
    {
      title: "Travis Scott x Nike",
      description: "AIR JORDAN 1 LOW OG SP \"REVERSE OLIVE\"",
      bg: "bg-gray-100",
    },
    {
      title: "VERDY x Nike SB Dunk Low",
      description: "\"Visty\"",
      bg: "bg-pink-100",
    },
    {
      title: "AJ1 Yellow Ochre",
      description: <button className="mt-2 bg-black text-white px-3 py-1 text-sm rounded">Buy & Sell Now</button>,
      bg: "bg-yellow-100",
    },
  ];


  const [currentAd, setCurrentAd] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentAd((prev) => ((prev + 1) % adsData.length));
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);

  const nextSlide = () => {
    setCurrentAd((prev) => (prev + 1) % adsData.length);
  }

  return (
    <div className="bg-white font-sans">
      <section className="relative overflow-hidden px-4 py-6">
        <Carousel>
          <Carousel.Item interval={3000}>
            <img src="/banner/banner1.png" alt="banner1" className="w-full h-[20vw] object-cover" />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img src="/banner/banner2.png" alt="banner2" className="w-full h-[20vw] object-cover" />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img src="/banner/banner3.png" alt="banner3" className="w-full h-[20vw] object-cover" />
          </Carousel.Item>
        </Carousel>
      </section>



      {/* Popular Products */}
      <section className="px-4">
        <h2 className="text-xl font-semibold border-b pb-2">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="text-black" key={`popular-${i}`}>
              <img src="ex_img.png" className="mx-auto" alt="shoe" />
              <p className="mt-2 text-sm" style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                WebkitLineClamp: 2,
                lineHeight: '1.5em',
                maxHeight: '3em'
              }}>
                Giày Sneaker Nữ Adidas Runfalcon 3.0 “Green Spaner" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="font-bold">999.000₫</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <button className="bg-black text-white px-[6vw] py-2 rounded">Xem Thêm</button>
        </div>
      </section>

      {/* Free ship note */}
      <div className="flex flex-row items-center justify-center gap-3 m-6 text-center md:text-left px-4">
        <img src="freeship.png" className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" alt="truck" />
        <p className="font-bold text-xs md:text-base m-0">
          FREE SHIP TOÀN QUỐC CHO TẤT CẢ CÁC ĐƠN
        </p>
      </div>


      {/* More products */}
      <section className="px-4 mt-6">
        <h2 className="text-xl font-semibold border-b pb-2">Bán chạy</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="text-black" key={`popular-${i}`}>
              <img src="ex_img.png" className="mx-auto" alt="shoe" />
              <p className="mt-2 text-sm" style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                WebkitLineClamp: 2,
                lineHeight: '1.5em',
                maxHeight: '3em'
              }}>
                Giày Sneaker Nữ Adidas Runfalcon 3.0 “Green Spaner" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="font-bold">999.000₫</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <button className="bg-black text-white px-[6vw] py-2 rounded">Xem Thêm</button>
        </div>
      </section>
    </div>
  );
}
