"use client";
import "./globals.css";
import "./assets/app.css"
import "./assets/iconly.css"
import "./assets/auth.css"
import { AuthProvider } from "./contexts/auth";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html >
  );
}
