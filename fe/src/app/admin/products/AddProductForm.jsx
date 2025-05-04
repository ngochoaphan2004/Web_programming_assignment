"use client";
import { useState } from "react";
import axios from "@/axiosConfig";

export default function AddProductForm({ onAdded }) {
  /* state */
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "", category: "sneaker",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  /* validate đơn giản */
  const validate = () => {
    if (!form.name.trim()) return "Nhập tên sản phẩm";
    if (Number(form.price) <= 0) return "Giá phải > 0";
    if (Number(form.stock) < 0) return "Tồn kho không âm";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);

    setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("image", file);

    try {
      const res = await axios.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        alert("Đã thêm sản phẩm!");
        setForm({ name: "", description: "", price: "", stock: "", category: "sneaker" });
        setFile(null);
        onAdded();           // reload list
        setOpen(false);      // thu gọn form
      } else setError("Thêm thất bại!");
    } catch {
      setError("Lỗi máy chủ!");
    }
  };

  return (
    <div className="mb-6">
      {/* nút toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-2"
      >
        {open ? "Đóng ▴" : "➕ Thêm sản phẩm ▾"}
      </button>

      {/* form ẩn/hiện với animation đơn giản */}
      {open && (
        <div className="overflow-hidden animate-slide-down">
          <form onSubmit={handleSubmit} className="grid gap-4 bg-gray-50 p-4 rounded-lg shadow">
            {/* hàng 2 cột */}
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="name" placeholder="Tên" value={form.name} required
                onChange={(e)=>setForm({...form,name:e.target.value})}
                className="border p-2 rounded"
              />
              <input
                name="price" type="number" placeholder="Giá" value={form.price} required
                onChange={(e)=>setForm({...form,price:e.target.value})}
                className="border p-2 rounded"
              />
              <input
                name="stock" type="number" placeholder="Tồn kho" value={form.stock} required
                onChange={(e)=>setForm({...form,stock:e.target.value})}
                className="border p-2 rounded"
              />
              {/* select category */}
              <select
                name="category" value={form.category}
                onChange={(e)=>setForm({...form,category:e.target.value})}
                className="border p-2 rounded"
              >
                {["sneaker","sandal","balo","phukien"].map(c=>(
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* mô tả */}
            <textarea
              name="description" placeholder="Mô tả"
              value={form.description}
              onChange={(e)=>setForm({...form,description:e.target.value})}
              className="border p-2 rounded h-24"
            />

            {/* chọn file */}
            <input
              type="file" accept="image/*"
              onChange={(e)=>setFile(e.target.files?.[0])}
            />

            {/* lỗi */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button className="bg-green-600 text-white px-4 py-2 rounded w-max">
              Lưu
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* Tailwind keyframes đơn giản (bạn có thể thêm vào globals.css)
@keyframes slide-down{from{opacity:0;transform:translateY(-6px)}
to{opacity:1;transform:translateY(0)}} 
.animate-slide-down{animation:slide-down .25s ease-out;} */
