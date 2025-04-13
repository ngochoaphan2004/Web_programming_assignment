"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Tạo context
const AuthContext = createContext();

// Tạo Provider
export const AuthProvider = ({ children }) => {
  const [authen, setAuthen] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/BTL_LTW/src/public/user/session-check", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setAuthen(data.authenticated);
        setAdmin(data.admin);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API session-check:", err);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ authen, admin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
