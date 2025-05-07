// "use client";
// import { useEffect, useState } from "react";
// import axios from "@/axiosConfig";
// import axiosConfig from "@/axiosConfig";
// const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

// const statusOptions = ["pending", "processing", "completed", "cancel"];
// const statusTranslations = {
//   "pending": "Chờ thanh toán",
//   "processing": "Đang xử lý",
//   "completed": "Hoàn thành",
//   "cancel": "Đã hủy"
// };

// export default function ReceiptsPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => { 
//     load(); 
//   }, []);
  
//   const load = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const res = await axiosConfig.get("/orders");
//       if (res.data.success) {
//         setOrders(res.data.data);
//       } else {
//         setError("Không thể tải danh sách đơn hàng.");
//       }
//     } catch (err) {
//       console.error("Error loading orders:", err);
//       setError("Lỗi khi tải danh sách đơn hàng.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveStatus = async (id, status) => {
//     try {
//       console.log(`Saving status for order ${id}: ${status}`);
      
//       const res = await axiosConfig.post(`/orders/${id}/status`, { status });
//       console.log("Status update response:", res.data);
      
//       if (res.data.success) {
//         setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
//         console.log("Updated orders state successfully");
//       } else {
//         alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
//         console.error("Failed to update status:", res.data);
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Lỗi khi cập nhật trạng thái đơn hàng.");
//     }
//   };

//   const updateQty = async (orderId, itemId, qty) => {
//     try {
//       qty = Math.max(1, parseInt(qty) || 1);
//       await axiosConfig.post(`/orders/${orderId}/item/${itemId}`, { quantity: qty });
//       await load(); // Reload all data to ensure everything is synced
//     } catch (err) {
//       console.error("Error updating quantity:", err);
//       alert("Lỗi khi cập nhật số lượng sản phẩm.");
//     }
//   };

//   const delItem = async (orderId, itemId) => {
//     if (!confirm("Xoá sản phẩm này?")) return;
    
//     try {
//       await axiosConfig.delete(`/orders/${orderId}/item/${itemId}`);
//       await load(); // Reload all data
//     } catch (err) {
//       console.error("Error deleting item:", err);
//       alert("Lỗi khi xoá sản phẩm.");
//     }
//   };

//   if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;
//   if (error) return <div className="p-4 text-red-600">{error}</div>;

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
//         <button 
//           onClick={load}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Làm mới
//         </button>
//       </div>

//       {orders.length === 0 ? (
//         <div className="text-center py-10">
//           <p>Không có đơn hàng nào</p>
//         </div>
//       ) : (
//         orders.map(o => (
//           <div key={o.id} className="mb-8 border rounded shadow-sm">
//             <div className="bg-gray-100 p-3 flex flex-wrap gap-4 items-center">
//               <span><b>ID:</b> {o.id}</span>
//               <span><b>Khách:</b> {o.name}</span>
//               <span><b>SĐT:</b> {o.phone}</span>
//               <span><b>Địa chỉ:</b> {o.address}</span>
//               <span><b>Ngày đặt:</b> {new Date(o.created_at).toLocaleString("vi-VN")}</span>

//               <div className="ml-auto flex items-center gap-2">
//                 <span className="text-sm">Trạng thái:</span>
//                 <select 
//                   value={o.status}
//                   onChange={e => saveStatus(o.id, e.target.value)}
//                   className={`border px-2 py-1 text-sm rounded ${
//                     o.status === 'pending' ? 'bg-yellow-100' :
//                     o.status === 'processing' ? 'bg-blue-100' :
//                     o.status === 'completed' ? 'bg-green-100' :
//                     'bg-red-100'
//                   }`}
//                 >
//                   {statusOptions.map(s => (
//                     <option key={s} value={s}>
//                       {statusTranslations[s]}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* items */}
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="p-2 w-10">#</th>
//                   <th className="p-2 text-left">Tên SP</th>
//                   <th className="p-2 w-24">Giá</th>
//                   <th className="p-2 w-24">Số lượng</th>
//                   <th className="p-2 w-24">Tổng</th>
//                   <th className="p-2 w-16"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {o.items.map(it => (
//                   <tr key={it.id} className="border-b">
//                     <td className="p-2 text-center">{it.id}</td>
//                     <td className="p-2 flex items-center gap-2">
//                       <img 
//                         src={it.image ? HOST + it.image : "/ex_img.png"} 
//                         alt={it.name} 
//                         className="h-10 w-10 object-cover rounded" 
//                       />
//                       <span>{it.name}</span>
//                     </td>
//                     <td className="p-2 text-right">{Number(it.price).toLocaleString("vi-VN")}₫</td>
//                     <td className="p-2">
//                       <input 
//                         type="number" 
//                         value={it.quantity} 
//                         min={1}
//                         onChange={e => updateQty(o.id, it.id, e.target.value)}
//                         className="border w-16 px-1 rounded"
//                       />
//                     </td>
//                     <td className="p-2 text-right">
//                       {(it.price * it.quantity).toLocaleString("vi-VN")}₫
//                     </td>
//                     <td className="p-2 text-center">
//                       <button 
//                         onClick={() => delItem(o.id, it.id)}
//                         className="text-red-600 hover:underline"
//                       >
//                         Xoá
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 <tr className="font-semibold bg-gray-50">
//                   <td colSpan={4} className="p-2 text-right">Tổng cộng:</td>
//                   <td className="p-2 text-right">{Number(o.total_price).toLocaleString("vi-VN")}₫</td>
//                   <td></td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }






"use client";
import { useEffect, useState } from "react";
import axios from "@/axiosConfig";           // <‑ chỉ 1 import thôi

const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

/* cấu hình trạng thái */
const STATUS = ["pending", "processing", "completed", "cancel"];
const LABEL  = {
  pending:    "Chờ thanh toán",
  processing: "Đang xử lý",
  completed:  "Hoàn thành",
  cancel:     "Đã huỷ",
};

export default function ReceiptsPage() {
  /* state */
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [statusFilter, setSF]   = useState("processing"); // mặc định
  const [sortMode, setSort]     = useState("desc");       // desc = mới nhất

  /* ---------------- LOAD ---------------- */
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const r = await axios.get("/orders");
      if (r.data.success) setOrders(r.data.data);
      else setError("Không thể tải danh sách đơn hàng.");
    } catch (e) {
      console.error(e);
      setError("Lỗi khi tải đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  /* gọi 1 lần khi mount */
  useEffect(() => { loadOrders(); }, []);

  /* ---------------- API helpers ---------------- */
  const saveStatus = async (id, status) => {
    try {
      const r = await axios.post(`/orders/${id}/status`, { status });
      if (r.data.success) {
        setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
      } else alert("Không cập nhật được trạng thái.");
    } catch (e) {
      console.error(e);
      alert("Lỗi cập nhật trạng thái!");
    }
  };

  const updateQty = async (orderId, itemId, qty) => {
    qty = Math.max(1, parseInt(qty) || 1);
    try {
      await axios.post(`/orders/${orderId}/item/${itemId}`, { quantity: qty });
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId
            ? {
                ...o,
                items: o.items.map(it =>
                  it.id === itemId ? { ...it, quantity: qty } : it
                ),
              }
            : o
        )
      );
    } catch (e) {
      console.error(e);
      alert("Lỗi đổi số lượng!");
    }
  };

  const delItem = async (orderId, itemId) => {
    if (!confirm("Xoá sản phẩm?")) return;
    try {
      await axios.delete(`/orders/${orderId}/item/${itemId}`);
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId
            ? { ...o, items: o.items.filter(it => it.id !== itemId) }
            : o
        )
      );
    } catch (e) {
      console.error(e);
      alert("Lỗi xoá sản phẩm!");
    }
  };

  /* ---------------- FILTER + SORT ---------------- */
  const shown = orders
    .filter(o => (statusFilter ? o.status === statusFilter : true))
    .sort((a, b) =>
      sortMode === "desc"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  /* ---------------- RENDER ---------------- */
  if (loading) return <p className="p-4">Đang tải...</p>;
  if (error)   return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      {/* ---------- Action bar ---------- */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold shrink-0">Quản lý đơn hàng</h1>

        {/* lọc trạng thái */}
        <select
          value={statusFilter}
          onChange={e => setSF(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          {STATUS.map(s => (
            <option key={s} value={s}>{LABEL[s]}</option>
          ))}
        </select>

        {/* sort */}
        <select
          value={sortMode}
          onChange={e => setSort(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="desc">Mới nhất</option>
          <option value="asc">Cũ nhất</option>
        </select>

        {/* refresh */}
        <button
          onClick={loadOrders}
          className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
        >
          Làm mới
        </button>
      </div>

      {/* ---------- List ---------- */}
      {shown.length === 0 ? (
        <p>Không có đơn nào.</p>
      ) : (
        shown.map(o => (
          <div key={o.id} className="border rounded mb-8 shadow-sm">
            {/* header đơn */}
            <div className="bg-gray-100 p-3 flex flex-wrap gap-4 items-center">
              <span><b>ID:</b> #{o.id}</span>
              <span><b>Khách:</b> {o.name}</span>
              <span><b>SĐT:</b> {o.phone}</span>
              <span><b>Địa chỉ:</b> {o.address}</span>
              <span><b>Ngày đặt:</b> {new Date(o.created_at).toLocaleString("vi-VN")}</span>

              {/* status combobox */}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm">Trạng thái:</span>
                <select
                  value={o.status}
                  onChange={e => saveStatus(o.id, e.target.value)}
                  className={`border px-2 py-1 text-sm rounded ${
                    o.status === "pending"
                      ? "bg-yellow-100"
                      : o.status === "processing"
                      ? "bg-blue-100"
                      : o.status === "completed"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {STATUS.map(s => (
                    <option key={s} value={s}>{LABEL[s]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* table items */}
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 w-10">#</th>
                  <th className="p-2 text-left">Tên SP</th>
                  <th className="p-2 w-24">Giá</th>
                  <th className="p-2 w-24">SL</th>
                  <th className="p-2 w-24">Tổng</th>
                  <th className="p-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {o.items.map(it => (
                  <tr key={it.id} className="border-b">
                    <td className="p-2 text-center">{it.id}</td>
                    <td className="p-2 flex items-center gap-2">
                      <img
                        src={it.image ? HOST + it.image : "/ex_img.png"}
                        alt={it.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                      {it.name}
                    </td>
                    <td className="p-2 text-right">
                      {Number(it.price).toLocaleString("vi-VN")}₫
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={it.quantity}
                        min={1}
                        onChange={e => updateQty(o.id, it.id, e.target.value)}
                        className="border w-16 px-1 rounded"
                      />
                    </td>
                    <td className="p-2 text-right">
                      {(it.price * it.quantity).toLocaleString("vi-VN")}₫
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => delItem(o.id, it.id)}
                        className="text-red-600 hover:underline"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50">
                  <td colSpan={4} className="p-2 text-right">Tổng cộng:</td>
                  <td className="p-2 text-right">
                    {Number(o.total_price).toLocaleString("vi-VN")}₫
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}