"use client";
import "./globals.css";
import "./assets/app.css"
import "./assets/iconly.css"
import "./assets/auth.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html >
  );
}
