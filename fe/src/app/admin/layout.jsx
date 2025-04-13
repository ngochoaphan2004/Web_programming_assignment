"use client";
import Header from "../components/navbar/header";
import "../globals.css";
import "../assets/app.css"
import "../assets/iconly.css"
import "../assets/auth.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div id="main" className="layout-horizontal">
          <Header/>
          <div className="page-content container">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
