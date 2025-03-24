"use client";

import "../globals.css";
import "../assets/app.css"
import "../assets/app-dark.css"
import "../assets/iconly.css"

import Header from "../components/navbar/header";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div id="main" className="layout-horizontal">
          <Header authen={false} />
          <div className="page-content container">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
