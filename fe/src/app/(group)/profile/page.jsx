"use client";

import { useEffect, useState } from "react";
import UploadFileAvatar from "../../../../components/uploadAvatar/uploadAvatar";
import axiosConfig from "@/axiosConfig";
import { usePathname, useRouter } from "next/navigation";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  const urlPath = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosConfig.get("/user/now", {
          withCredentials: true,
        });
        const data = response.data.data;
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setDob(data.dob ? data.dob.slice(0, 10) : "");
        setGender(data.gender || "");
        setAddress(data.address || "");
        setAvatar(data.avatar || "");
      } catch (error) {
        console.error("Lỗi khi gọi API user/now:", error);
        router.push("/404");
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameCharRegex = /^[a-zA-Z0-9\s\u00C0-\u1EF9]+$/;
    // const userNameCharRegex = /^[a-zA-Z0-9\u00C0-\u1EF9]+$/;
    const addressCharRegex = /^[a-zA-Z0-9\s,\u00C0-\u1EF9]+$/;
    const phoneRegex = /^\d{10}$/;

    let errors = [];
    if (name && !nameCharRegex.test(name)) {
        errors.push("Name must not contain special characters.");
      }
      // if (username && !userNameCharRegex.test(username)) {
      //   errors.push("Username must not contain spaces or special characters.");
      // }
      if (address && !addressCharRegex.test(address)) {
        errors.push("Address must not contain special characters (except comma).");
      }
      if (phone && !phoneRegex.test(phone)) {
        errors.push("Phone number must contain exactly 10 digits.");
      }
  
      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }
    try {
        const formData = new FormData();
        // formData.append("username", username);
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("dob", dob);
        formData.append("address", address);
        formData.append("gender", gender);
      const response = await axiosConfig.post("/user/profile",formData, {
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data",
          },
      });
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="page-heading px-4 py-8">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Account Profile</h3>
            <p className="text-subtitle text-muted">
              A page where users can change profile information
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-12 col-lg-4">
            <div className="card">
              <div className="card-body d-flex justify-content-center align-items-center flex-column">
                <UploadFileAvatar avatar={avatar} />
                <h3 className="mt-3">{name}</h3>
                <p className="text-small">Junior Software Engineer</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dob">Birthday</label>
                    <input
                      type="date"
                      id="dob"
                      className="form-control"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      className="form-control"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="form-group mt-4">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
