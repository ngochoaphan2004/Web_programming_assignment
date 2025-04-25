"use client";

import { useState } from "react";
import axios from "axios";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await axios.post(
        "http://localhost:80/api/user/login",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Phản hồi từ backend:", response.data);

      if (response.data.success) {
        alert("Đăng nhập thành công");
        if(response.data.user.role == 1)
          window.location.href = "admin/accounts"
        else
          window.location.href = "/"; // điều hướng về trang chủ
      } else {
        alert("Sai thông tin đăng nhập");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Lỗi đăng nhập");
    }
  };

  return (
    <div className="row align-items-center justify-content-center">
      <div id="auth" className="hiddenscroll col-lg-6 col-12">
        <div className="auth-left">
          <h1 className="auth-title">Sign in.</h1>
          <p className="auth-subtitle mb-5">
            Log in with your data that you entered during registration.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group position-relative has-icon-left mb-4">
              <input
                type="text"
                className="form-control form-control-xl"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="form-control-icon">
                <i className="bi bi-person"></i>
              </div>
            </div>
            <div className="form-group position-relative has-icon-left mb-4">
              <input
                type="password"
                className="form-control form-control-xl"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="form-control-icon">
                <i className="bi bi-shield-lock"></i>
              </div>
            </div>
            <div className="form-check form-check-lg d-flex align-items-end">
              <input
                className="form-check-input me-2"
                type="checkbox"
                id="flexCheckDefault"
              />
              <label
                className="form-check-label text-gray-600"
                htmlFor="flexCheckDefault"
              >
                Keep me logged in
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg shadow-lg mt-5"
            >
              Log in
            </button>
          </form>

          <div className="text-center mt-5 text-lg fs-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/sign-up" className="font-bold">
                Sign up
              </a>
              .
            </p>
            <p>
              <a className="font-bold" href="/forgot-password">
                Forgot password?
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
