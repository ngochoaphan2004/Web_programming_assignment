"use client";

import "../globals.css";
import "../assets/app.css";
import "../assets/app-dark.css";
import "../assets/iconly.css";
import { useState } from "react";
import Header from "../../../components/navbar/header";
import Footter from "../../../components/footter/footer";
import { AuthProvider, useAuth } from "../contexts/auth"; // Đường dẫn đúng với bạn nhé

function LayoutWithAuth({ children }) {
  const { authen, loading, user, admin } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex overflow-hidden flex-col gap-4 justify-center place-items-center  ">
        <div className="w-fit h-fit p-20 gap-10 items-center justify-center  flex flex-col">
          <div className="flex justify-center items-center h-full">
            <div className="rounded-full h-20 w-20 bg-red-600 animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div id="main" className="layout-horizontal flex flex-col">
      <Header authen={authen} user={user} admin={admin} />
      <div className="page-content container bg-white rounded-md flex-1">
        {children}
      </div>
      <Footter />
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <LayoutWithAuth>{children}</LayoutWithAuth>
  );
}
