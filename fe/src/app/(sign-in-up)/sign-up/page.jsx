"use client"

import { useState } from "react";
import axiosConfig from "@/axiosConfig";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameCharRegex = /^[a-zA-Z0-9\s\u00C0-\u1EF9]+$/;
    const userNameCharRegex = /^[a-zA-Z0-9\u00C0-\u1EF9]+$/;
    const addressCharRegex = /^[a-zA-Z0-9\s,\u00C0-\u1EF9]+$/;
    const phoneRegex = /^\d{10}$/;

    let errors = [];

    if (!email || !password || !confirm_password || !name || !username || !phone || !dob || !address) {
      errors.push("All fields must be filled out.");
    }
    if (name && !nameCharRegex.test(name)) {
      errors.push("Name must not contain special characters.");
    }
    if (username && !userNameCharRegex.test(username)) {
      errors.push("Username must not contain spaces or special characters.");
    }
    if (address && !addressCharRegex.test(address)) {
      errors.push("Address must not contain special characters (except comma).");
    }
    if (phone && !phoneRegex.test(phone)) {
      errors.push("Phone number must contain exactly 10 digits.");
    }
    if (password && confirm_password && password !== confirm_password) {
      errors.push("Password and confirm password do not match.");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }


    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("username", username);
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("dob", dob);
      formData.append("address", address);

      const response = await axiosConfig.post(
        "user/register",
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
        alert("Register successful!");
        window.location.href = "/";
      } else {
        alert(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };
  return (
    <div className="row align-items-center justify-content-center">
      <div id="auth" className="hiddenscroll col-lg-6 col-12 content-center">
        <div className="auth-left">
          <h1 className="auth-title">Sign Up</h1>
          <p className="auth-subtitle mb-5">Input your data to register to our website.</p>

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
                <i className="bi bi-envelope"></i>
              </div>
            </div>

            <div className="form-group position-relative has-icon-left mb-4">
              <input type="text" className="form-control form-control-xl" placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="form-control-icon">
                <i className="bi bi-person-vcard"></i>
              </div>
            </div>

            <div className="form-group position-relative has-icon-left mb-4">
              <input type="text" className="form-control form-control-xl" placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="form-control-icon">
                <i className="bi bi-person"></i>
              </div>
            </div>

            <div className="form-group position-relative has-icon-left mb-4">
              <input type="password" className="form-control form-control-xl" placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="form-control-icon">
                <i className="bi bi-lock"></i>
              </div>
            </div>

            <div className="form-group position-relative has-icon-left mb-4">
              <input type="password" className="form-control form-control-xl" placeholder="Confirm Password"
                value={confirm_password}
                onChange={(e) => setConfirm_password(e.target.value)}
              />
              <div className="form-control-icon">
                <i className="bi bi-lock-fill"></i>
              </div>
            </div>

            <div className="form-group position-relative has-icon-left mb-4">
              <input
                type="date"
                className="form-control form-control-xl"
                placeholder="Birthday"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <div className="form-control-icon">
                <i className="bi bi-calendar-date"></i>
              </div>
            </div>

            <div className="form-group position-relative has-icon-left mb-4">
              <input
                type="text"
                className="form-control form-control-xl"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="form-control-icon">
                <i className="bi bi-telephone"></i>
              </div>
            </div>

            <div className="form-group position-relative has-icon-left mb-4">
              <input
                type="text"
                className="form-control form-control-xl"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="form-control-icon">
                <i className="bi bi-geo-alt"></i>
              </div>
            </div>


            <button className="btn btn-primary btn-block btn-lg shadow-lg mt-5">Sign Up</button>
          </form>
          <div className="text-center mt-5 text-lg fs-4">
            <p className='text-gray-600'>Already have an account? <a href="/sign-in" className="font-bold">Log
              in</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};