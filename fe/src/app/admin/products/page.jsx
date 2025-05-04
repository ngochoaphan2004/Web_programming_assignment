"use client";
import { useEffect, useState } from "react";
import axios from "@/axiosConfig";              // baseURL = http://localhost:80/api
import AddProductForm from "./AddProductForm";
/* 4 loại sản phẩm (khớp cột category) */
const categories = [
  { key: "sneaker", label: "Sneaker" },
  { key: "sandal",  label: "Sandal"  },
  { key: "balo",    label: "Balo"    },
  { key: "phukien", label: "Phụ kiện"},
];

/* ───────────────────────────────────────── */
/* 1. Component 1 hàng sản phẩm (giữ state cục bộ) */
const ProductRow = ({ prod, onSaved, onDeleted, toast }) => {
  const [form, setForm] = useState({
    name:        prod.name,
    description: prod.description,
    price:       prod.price,
    stock:       prod.stock,
    image:       prod.image,  // link hiện tại
    file: null                // file mới (nếu có)
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      /* tạo form-data */
      const fd = new FormData();
      fd.append("name",        form.name);
      fd.append("description", form.description);
      fd.append("price",       form.price);
      fd.append("stock",       form.stock);
      fd.append("image_url",   form.image);          // link ảnh (nếu gõ tay)
      if (form.file) fd.append("image", form.file);  // file mới

      await axios.post(`/products/${prod.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSaved({ ...prod, ...form });                 // báo lên component cha
      toast("Đã lưu sản phẩm!");
    } catch (err) {
      console.error(err);
      toast("Lỗi khi lưu!", "bg-red-600");
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm("Xoá sản phẩm này?")) return;
    try {
      await axios.delete(`/products/${prod.id}`);
      onDeleted(prod.id);               // báo trang cha xoá khỏi list
      toast("Đã xoá sản phẩm!");
    } catch (err) {
      console.error(err);
      toast("Lỗi xoá!", "bg-red-600");
    }
  };

  return (
    <tr className="border-b">
      <td className="p-2">{prod.id}</td>

      {/* Name */}
      <td className="p-2 w-52">
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border px-1 w-full"
        />
      </td>

      {/* Description */}
      <td className="p-2 w-80">
        <textarea
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="border px-1 w-full text-xs"
        />
      </td>

      {/* Price */}
      <td className="p-2 w-24">
        <input
          type="number"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="border px-1 w-full"
        />
      </td>

      {/* Stock */}
      <td className="p-2 w-16">
        <input
          type="number"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })}
          className="border px-1 w-full"
        />
      </td>

      {/* Image  +  upload */}
      <td className="p-2">
        <img
          src={form.file ? URL.createObjectURL(form.file) : form.image || "/ex_img.png"}
          alt=""
          className="h-12 mx-auto mb-1"
        />

        {/* link ảnh */}
        <input
          type="text"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })}
          placeholder="Link ảnh..."
          className="border px-1 text-xs w-full mb-1"
        />

        {/* upload file */}
        <input
          type="file"
          accept="image/*"
          className="text-xs"
          onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            setForm({ ...form, file, image: form.image }); // giữ link cũ (nếu cần)
          }}
        />
      </td>

      {/* Modify */}
      <td className="p-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded"
        >
          {saving ? "..." : "Save"}
        </button>
        {/*  NÚT XOÁ */}
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded"
        >
          Xoá
        </button>
      </td>
    </tr>
  );
};

/* ───────────────────────────────────────── */
/* 2. Trang Products (Admin) */
// export default function AdminProducts() {
//   const [products, setProducts] = useState({});   // { sneaker:[...], sandal:[...], ... }

//   /* load danh sách 1 lần */
//   useEffect(() => {
//     axios
//       .get("/products/grouped")
//       .then(res => res.data.success && setProducts(res.data.data))
//       .catch(err => console.error("Load products:", err));
//   }, []);

//   /* cập nhật khi 1 hàng save xong */
//   const handleRowSaved = (cat, updated) => {
//     setProducts(prev => ({
//       ...prev,
//       [cat]: prev[cat].map(p => (p.id === updated.id ? updated : p)),
//     }));
//   };

//   return (
//     <div className="px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6">Products (Admin)</h1>

//       {categories.map(({ key, label }) => (
//         <div key={key} className="mb-10">
//           <h2 className="text-lg font-semibold mb-2">{label}</h2>

//           <div className="overflow-x-auto">
//             <table className="min-w-[900px] w-full text-xs">
//               <thead className="bg-gray-100 text-left">
//                 <tr>
//                   <th className="p-2">ID</th>
//                   <th className="p-2">Name</th>
//                   <th className="p-2">Description</th>
//                   <th className="p-2">Price</th>
//                   <th className="p-2">Stock</th>
//                   <th className="p-2">Image</th>
//                   <th className="p-2" />
//                 </tr>
//               </thead>

//               <tbody>
//                 {(products[key] || []).map(prod => (
//                   <ProductRow
//                     key={prod.id}
//                     prod={prod}
//                     onSaved={upd => handleRowSaved(key, upd)}
//                   />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }





export default function ProductsAdmin() {
  const [products, setProducts] = useState({});
  const [toast, setToast] = useState(null); // { msg, color }

  const showToast = (msg, color = "bg-green-600") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2000); // Tự ẩn sau 2 giây
  };

  const load = () => {
    axios.get("/products/grouped")
      .then(res => res.data.success && setProducts(res.data.data))
      .catch(err => console.error(err));
  };
  useEffect(() => { load(); }, []);

  const handleRowSaved = (cat, upd) =>
    setProducts(prev => ({
      ...prev,
      [cat]: prev[cat].map(p => (p.id === upd.id ? upd : p)),
    }));

  /* xoá khỏi state khi backend xoá thành công */
  const handleRowDeleted = (idCat, prodId) =>
    setProducts(prev => ({
      ...prev,
      [idCat]: prev[idCat].filter(p => p.id !== prodId),
    }));

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Products (Admin)</h1>

      {/* FORM THÊM SẢN PHẨM */}
      <AddProductForm onAdded={load} />

      {/* BẢNG TỪNG LOẠI */}
      {categories.map(({ key, label }) => (
        <div key={key} className="mb-10">
          <h2 className="text-lg font-semibold mb-2">{label}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-xs">
              {/* thead giữ nguyên */}
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Image</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {(products[key] || []).map(p => (
                  <ProductRow
                    key={p.id}
                    prod={p}
                    onSaved={u => handleRowSaved(key, u)}
                    onDeleted={pid => handleRowDeleted(key, pid)}
                    toast={showToast}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {/* Toast hiển thị thông báo */}
      {toast && (
        <div
          className={`
            fixed top-4 left-1/2 -translate-x-1/2 z-50
            ${toast.color} text-white px-4 py-2 rounded shadow-lg
            animate-fade
          `}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
