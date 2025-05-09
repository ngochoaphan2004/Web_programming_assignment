"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import axiosConfig from "@/axiosConfig";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
// Tạo context
const AuthContext = createContext();

// Tạo Provider
export const AuthProvider = ({ children }) => {
  const [authen, setAuthen] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [logo, setLogo] = useState("");
  const urlPath = usePathname()
  const router = useRouter();

  useEffect(() => {
    if (!['/sign-in', '/sign-up', '/forgot-password'].includes(urlPath)) {
      console.log("Đang gọi API kiểm tra session...");
      axiosConfig.get("/user/session-check", {
        withCredentials: true, // Giống fetch: credentials: 'include'
      })
        .then((response) => {
          const data = response.data;
          console.log("Kết quả session:", data);

          if ((urlPath === '/profile' && !data.authenticated) ||
            (urlPath.startsWith('/admin') && !data.admin)
          ) {
            router.push('/404')
            return;
          }

          setAuthen(data.authenticated);
          setAdmin(data.admin);
          setUser(data.user);
          setLogo(data.logo);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API session-check:", error);
          setLoading(false);
          router.push('/404')
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authen, admin, loading, user, logo}}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tiện dụng
export const useAuth = () => useContext(AuthContext);