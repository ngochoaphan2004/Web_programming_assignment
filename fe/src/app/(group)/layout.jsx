"use client";

import "../globals.css";
import "../assets/app.css"
import "../assets/app-dark.css"
import "../assets/iconly.css"

import Header from "../components/navbar/header";
import Footter from "../components/footter/footer";

import Cookies from 'js-cookie';
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const [token, setToken] = useState()
  useEffect(() => {
    Cookies.get('auth_token')
  },[])
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div id="main" className="layout-horizontal">
          <Header authen={token ? true : false} />
          <div className="page-content container bg-white rounded-md">
            {children}
          </div>
          <Footter />
        </div>
      </body>
    </html>
  );
}
