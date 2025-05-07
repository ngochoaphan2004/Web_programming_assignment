"use client";

import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import axiosConfig from "@/axiosConfig";

export default function IntroducePage() {
  const [banners, setBanners] = useState([]);
  const [intro, setIntro] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [thanks, setThanks] = useState([]);

  // Load animate.css via CDN
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Cleanup to remove the link when component unmounts
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Load banners and introduction data
  useEffect(() => {
    // Load banners
    axiosConfig
      .get("/banner")
      .then((res) => res.data && setBanners(res.data))
      .catch((err) => console.error("Load banners:", err));

    // Load introduction data
    axiosConfig
      .get("/introduce")
      .then((res) => {
        const data = res.data;
        setIntro(data.intro || []);
        const sortedCommitments = (data.commitments || []).sort(
          (a, b) => a.order_index - b.order_index
        );
        setCommitments(sortedCommitments);
        setThanks(data.thank || []);
      })
      .catch((err) => console.error("Load introduce:", err));
  }, []);

  return (
    <div className="bg-gray-100 px-4 sm:px-6 lg:px-8 py-12 font-sans text-gray-900 min-h-screen">
      {/* Banner Carousel */}
      <section className="relative mb-10 rounded-xl overflow-hidden shadow-lg">
        <Carousel fade interval={3000} pause="hover">
          {banners.map((b, i) => (
            <Carousel.Item key={i}>
              <img
                src={b.image}
                alt={`banner-${i}`}
                className="w-full h-[30vw] sm:h-[25vw] lg:h-[20vw] object-cover"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Introduction Section */}
      <section className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 pb-3 text-center text-blue-600 border-b-4 border-blue-200 animate__animated animate__fadeIn">
          Giới thiệu về cửa hàng
        </h1>

        <div className="pt-6 pb-12 space-y-8">
          {/* Intro Paragraphs */}
          {intro.map((para, idx) => (
            <p
              key={idx}
              className="text-lg sm:text-xl text-gray-700 leading-relaxed mx-auto max-w-3xl animate__animated animate__fadeIn animate__delay-1s"
            >
              {para.content}
            </p>
          ))}

          {/* Commitments */}
          {commitments.length > 0 && (
            <div className="mt-10">
              <p className="text-xl sm:text-2xl font-semibold text-blue-500 mb-6 animate__animated animate__fadeIn animate__delay-2s">
                Chúng tôi cam kết:
              </p>
              <ul className="list-disc list-inside space-y-4 max-w-3xl mx-auto">
                {commitments.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-lg sm:text-xl text-gray-700 transition duration-300 ease-in-out hover:text-blue-600 hover:scale-105 hover:shadow-md p-2 rounded-lg"
                  >
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Thanks */}
          {thanks.length > 0 && (
            <div className="mt-10">
              {thanks.map((para, idx) => (
                <p
                  key={idx}
                  className="text-lg sm:text-xl text-gray-700 leading-relaxed mx-auto max-w-3xl animate__animated animate__fadeIn animate__delay-3s"
                >
                  {para.content}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}