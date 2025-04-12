"use client";

import "../globals.css";
import "../assets/app.css"
import "../assets/app-dark.css"
import "../assets/iconly.css"

import Header from "../components/navbar/header";
import Footter from "../components/footter/footer";

import Cookies from 'js-cookie';

export default function RootLayout({ children }) {
  const token = Cookies.get('auth_token');
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div id="main" className="layout-horizontal">
          <Header authen={token ? true : false}/>
          <div className="page-content container">
            {children}
          </div>
          <Footter/>
        </div>
      </body>
    </html>
  );
}
