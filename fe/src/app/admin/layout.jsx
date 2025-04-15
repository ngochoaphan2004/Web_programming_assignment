"use client";
import Header from "../components/navbar/header";
import "../globals.css";
import "../assets/app.css"
import "../assets/iconly.css"
import "../assets/auth.css"
import Footter from "../components/footter/footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div id="main" className="layout-horizontal">
          <Header admin authen />
          <div className="page-content container bg-white rounded-md">
            {children}
          </div>
          <Footter />
        </div>
      </body>
    </html>
  );
}
