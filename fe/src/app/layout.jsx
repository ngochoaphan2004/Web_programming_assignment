"use client";

import { ThemeProvider } from "@emotion/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });


const theme = {
  colors: {
    primary: "#0070f3",
    background: "#ffffff",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="light"
          theme={theme}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
