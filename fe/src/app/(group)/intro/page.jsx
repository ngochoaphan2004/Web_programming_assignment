"use client"

import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import axiosConfig from "@/axiosConfig";

export default function IntroducePage() {
  const [banners, setBanners] = useState([]);
  const [intro, setIntro] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [thanks, setThanks] = useState([]);

  useEffect(() => {
    // Load banners
    axiosConfig.get("/banner")
      .then((res) => res.data && setBanners(res.data))
      .catch((err) => console.error("Load banners:", err));

    // Load introduction data
    axiosConfig.get("/introduce")
      .then((res) => {
        const data = res.data;
        setIntro(data.intro || []);
        // Sort commitments by order_index to ensure correct order
        const sortedCommitments = (data.commitments || []).sort((a, b) => a.order_index - b.order_index);
        setCommitments(sortedCommitments);
        setThanks(data.thanks || []);
      })
      .catch((err) => console.error("Load introduce:", err));
  }, []);

  return (
    <div className="bg-white px-4 py-8 font-sans text-black">
      {/* Banner */}
      <section className="relative overflow-hidden mb-6">
        <Carousel>
          {banners.map((b, i) => (
            <Carousel.Item key={i} interval={3000}>
              <img
                src={b.image}
                alt={`banner-${i}`}
                className="w-full h-[20vw] object-cover"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Intro */}
      <h1 className="text-3xl font-bold mb-6 border-b-4 pb-2 text-center text-blue-600">Giới thiệu về cửa hàng</h1>

<div className="pt-8 pb-12">
  {/* Intro */}
  {intro.map((para, idx) => (
    <p key={idx} className="mb-6 text-2xl pl-6 text-gray-800 first:mt-0">{para.content}</p>
  ))}

  {/* Commitments */}
  {commitments.length > 0 && (
    <>
      <p className="mb-4 font-semibold text-2xl text-blue-500">Chúng tôi cam kết:</p>
      <ul className="list-disc list-inside mb-6 text-xl pl-8 space-y-2">
        {commitments.map((item, idx) => (
          <li key={idx} className="transition duration-300 ease-in-out hover:text-blue-600 hover:font-bold">{item.content}</li>
        ))}
      </ul>
    </>
  )}

  {/* Thanks */}
  {thanks.length > 0 && thanks.map((para, idx) => (
    <p key={idx} className="mb-6 text-2xl pl-6 text-gray-800">{para.content}</p>
  ))}
</div>


    </div>
  );
}
