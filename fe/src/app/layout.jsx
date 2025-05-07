"use client";
import "./globals.css";
import "./assets/app.css"
import "./assets/iconly.css"
import "./assets/auth.css"
import { AuthProvider } from "./contexts/auth";
import axiosConfig from "@/axiosConfig";
import { useEffect, useState } from "react";

function ThisHead() {
  // const [title, setTitle] = useState("Shop");

  // useEffect(() => {
  //   async function fetchData() {
  //     await axiosConfig.get('shop/info')
  //       .then((response) => {
  //         const data = response.data
          
  //         setTitle(data['name'])
  //       })
  //   }
  //   fetchData()
  // }, [])

  return (
    <>
      <title>Shoes</title>
      <meta charSet="UTF-8"></meta>
      <link rel="icon" href="/shoes.png" type="image/png" />
    </>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThisHead />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html >
  );
}
