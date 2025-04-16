"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Tạo context
const AuthContext = createContext();

// Tạo Provider
export const AuthProvider = ({ children }) => {
  const [authen, setAuthen] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");

  useEffect(() => {
    console.log("Đang gọi API kiểm tra session...");
    axios.get("http://localhost/api/user/session-check", {
      withCredentials: true, // Giống fetch: credentials: 'include'
    })
      .then((response) => {
        const data = response.data;
        console.log("Kết quả session:", data);
        setAuthen(data.authenticated);
        setAdmin(data.admin);
        setUser(data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API session-check:", error);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ authen, admin, loading,user}}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tiện dụng
export const useAuth = () => useContext(AuthContext);
