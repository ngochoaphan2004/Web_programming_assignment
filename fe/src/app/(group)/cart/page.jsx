// // src/app/cart/page.jsx
// "use client";
// import { useEffect, useState } from "react";
// import axiosConfig from "@/axiosConfig";          // ✅ luôn dùng bản đã cấu hình
// const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

// export default function CartPage() {
//   /* STATE */
//   const [pendingItems, setPendingItems]   = useState([]);
//   const [pendingOrderId, setPendingOrderId] = useState(null);
//   const [activeOrders,  setActiveOrders]  = useState([]);
//   const [loading, setLoading]             = useState(true);

//   /* ───────── 1. LẤY ĐƠN ───────── */
//   const fetchOrders = async () => {
//     try {
//       setLoading(true);

//       /* giỏ (pending) */
//       const cartRes = await axiosConfig.get("/cart");
//       if (cartRes.data.success) {
//         setPendingOrderId(cartRes.data.data.order_id);
//         setPendingItems(cartRes.data.data.items);
//       }

//       /* đơn đã gửi */
//       const ordRes = await axiosConfig.get("/user/orders");
//       if (ordRes.data.success) {
//         setActiveOrders(ordRes.data.data);
//       }
//     } catch (e) {
//       alert("Bạn cần đăng nhập để xem giỏ!");
//     } finally { setLoading(false); }
//   };

//   useEffect(() => { fetchOrders(); }, []);

//   /* ───────── 2. THANH TOÁN ───────── */
//   const handlePay = async () => {
//     if (!pendingOrderId) return;
//     try {
//       const res = await axiosConfig.post(`/orders/${pendingOrderId}/pay`);
//       if (res.data.success) {
//         alert("Đặt hàng thành công!");
//         /* xoá giỏ & reload danh sách */
//         setPendingOrderId(null);
//         setPendingItems([]);
//         fetchOrders();
//       } else {
//         alert(res.data.message || "Không thể thanh toán!");
//       }
//     } catch (e) {
//       alert("Lỗi kết nối máy chủ!");
//     }
//   };

//   /* ───────── 3. CẬP NHẬT SỐ LƯỢNG / XOÁ ───────── */
//   const updateQty = async (itemId, qty) => {
//     qty = Math.max(1, qty);
//     try {
//       await axiosConfig.post(`/cart/item/${itemId}`, { quantity: qty });
//       setPendingItems(p =>
//         p.map(i => (i.id === itemId ? { ...i, quantity: qty } : i))
//       );
//     } catch { alert("Lỗi mạng"); }
//   };

//   const deleteItem = async id => {
//     if (!confirm("Xoá sản phẩm?")) return;
//     try {
//       await axiosConfig.delete(`/cart/item/${id}`);
//       setPendingItems(p => p.filter(i => i.id !== id));
//     } catch { alert("Lỗi mạng"); }
//   };

//   const total = pendingItems.reduce((s,i)=>s+i.price*i.quantity,0);

//   if (loading) return <p className="p-4">Đang tải...</p>;

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>

//       {pendingItems.length === 0 ? (
//         <p>Giỏ hàng trống.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-[700px] w-full text-sm">
//             <thead className="bg-gray-100 text-left">
//               <tr>
//                 <th className="p-2">Sản phẩm</th>
//                 <th className="p-2 w-24">Giá</th>
//                 <th className="p-2 w-24">Số lượng</th>
//                 <th className="p-2 w-24">Tổng</th>
//                 <th className="p-2 w-10" />
//               </tr>
//             </thead>
//             <tbody>
//               {pendingItems.map(it => (
//                 <tr key={it.id} className="border-b">
//                   <td className="p-2 flex items-center gap-2">
//                     <img src={it.image ? HOST + it.image : "/ex_img.png"} alt="img" className="h-12 w-12 object-cover" />
//                     <span>{it.name}</span>
//                   </td>

//                   <td className="p-2">{Number(it.price).toLocaleString("vi-VN")}₫</td>

//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={it.quantity}
//                       min={1}
//                       onChange={e => updateQty(it.id, parseInt(e.target.value))}
//                       className="border w-16 px-1"
//                     />
//                   </td>

//                   <td className="p-2">
//                     {(it.price * it.quantity).toLocaleString("vi-VN")}₫
//                   </td>

//                   <td className="p-2">
//                     <button
//                       onClick={() => deleteItem(it.id)}
//                       className="text-red-600 hover:underline"
//                     >
//                       Xoá
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* TỔNG */}
//           <div className="text-right mt-4">
//             <span className="font-semibold mr-2">Tổng cộng:</span>
//             <span className="text-xl font-bold">
//               {total.toLocaleString("vi-VN")}₫
//             </span>
//           </div>

//           {/* Nút thanh toán */}
//           <div className="text-right mt-4">
//             <button
//               onClick={handlePay}
//               disabled={!pendingItems.length}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
//             >
//               Thanh toán
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Đơn hàng đang xử lý */}
//       <div className="mt-10">
//         <h2 className="text-xl font-bold mb-4">Đơn hàng của bạn</h2>
        
//         {activeOrders.length === 0 ? (
//           <p>Bạn chưa có đơn hàng nào.</p>
//         ) : (
//           <div>
//             {activeOrders.map(order => (
//               <div key={order.id} className="border rounded mb-4">
//                 <div className="bg-gray-100 p-2 flex flex-wrap gap-4 items-center">
//                   <span><b>Mã đơn:</b> #{order.id}</span>
//                   <span><b>Ngày đặt:</b> {new Date(order.created_at).toLocaleDateString("vi-VN")}</span>
//                   <span><b>Tổng tiền:</b> {Number(order.total_price).toLocaleString("vi-VN")}₫</span>
//                   <span className="ml-auto">
//                     <span className={`px-2 py-1 rounded text-white ${
//                       order.status === 'pending' ? 'bg-yellow-500' :
//                       order.status === 'processing' ? 'bg-blue-500' :
//                       order.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
//                     }`}>
//                       {order.status === 'pending' ? 'Chờ thanh toán' :
//                        order.status === 'processing' ? 'Đang xử lý' :
//                        order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
//                     </span>
//                   </span>
//                 </div>
                
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="p-2">Sản phẩm</th>
//                       <th className="p-2 w-24">Giá</th>
//                       <th className="p-2 w-16">SL</th>
//                       <th className="p-2 w-24">Tổng</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {order.items.map(item => (
//                       <tr key={item.id} className="border-b">
//                         <td className="p-2 flex items-center gap-2">
//                           <img src={item.image ? HOST + item.image : "/ex_img.png"} alt="img" className="h-12 w-12 object-cover" />
//                           <span>{item.name}</span>
//                         </td>
//                         <td className="p-2">{Number(item.price).toLocaleString("vi-VN")}₫</td>
//                         <td className="p-2 text-center">{item.quantity}</td>
//                         <td className="p-2">{(item.price * item.quantity).toLocaleString("vi-VN")}₫</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }











"use client";
import { useEffect, useState } from "react";
import axiosConfig from "@/axiosConfig";
const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

/* ─── mini toast rất gọn, tuỳ thích dùng/không ─── */
const useToast = () => {
  const [toast, setToast] = useState(null); // {msg,color}
  const show = (m, c = "bg-green-600") => {
    setToast({ m, c });
    setTimeout(() => setToast(null), 2000);
  };
  return { toast, show };
};

export default function CartPage() {
  /* --------------- STATE --------------- */
  const [pendingItems, setPendingItems]   = useState([]);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [activeOrders,  setActiveOrders]  = useState([]);
  const [loading,       setLoading]       = useState(true);

  /* UI‑only radio (bank | momo | cod)  */
  const [payMethod, setPayMethod] = useState("bank");

  const {toast, show } = useToast();

  /* --------------- LẤY ĐƠN --------------- */
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const cart = await axiosConfig.get("/cart");
      if (cart.data.success) {
        setPendingOrderId(cart.data.data.order_id);
        setPendingItems(cart.data.data.items);
      }

      const his = await axiosConfig.get("/user/orders");
      if (his.data.success) setActiveOrders(his.data.data);
    } catch {
      show("Bạn cần đăng nhập!", "bg-red-600");
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchOrders(); }, []);

  /* --------------- THANH TOÁN --------------- */
  const handlePay = async () => {
    if (!pendingOrderId) return;
    try {
      const r = await axiosConfig.post(`/orders/${pendingOrderId}/pay`);
      r.data.success
        ? show("Đặt hàng thành công!")
        : show(r.data.message || "Không thể thanh toán!", "bg-red-600");

      if (r.data.success) {
        setPendingItems([]); setPendingOrderId(null);
        fetchOrders(); // refresh đơn xử lý
      }
    } catch { show("Lỗi kết nối!", "bg-red-600"); }
  };

  /* --------------- SỬA SỐ LƯỢNG & XOÁ --------------- */
  const updateQty = async (id, q) => {
    q = Math.max(1, q);
    await axiosConfig.post(`/cart/item/${id}`, { quantity: q });
    setPendingItems(p => p.map(it => it.id === id ? { ...it, quantity: q } : it));
  };
  const deleteItem = async id => {
    if (!confirm("Xoá sản phẩm?")) return;
    await axiosConfig.delete(`/cart/item/${id}`);
    setPendingItems(p => p.filter(it => it.id !== id));
  };

  const total = pendingItems.reduce((s,i)=>s+i.price*i.quantity,0);
  if (loading) return <p className="p-4">Đang tải…</p>;

  /* ------------------------------------------------------------------ */
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>

      {/* =============== PENDING – CHỈ KHI CHƯA PAY =============== */}
      {pendingItems.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* ---- table ---- */}
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">Sản phẩm</th>
                <th className="p-2 w-24">Giá</th>
                <th className="p-2 w-24">Số lượng</th>
                <th className="p-2 w-24">Tổng</th>
                <th className="p-2 w-10" />
              </tr>
            </thead>
            <tbody>
              {pendingItems.map(it => (
                <tr key={it.id} className="border-b">
                  <td className="p-2 flex items-center gap-2">
                    <img src={it.image ? HOST + it.image : "/ex_img.png"}
                         className="h-12 w-12 object-cover" />
                    <span>{it.name}</span>
                  </td>
                  <td className="p-2">{Number(it.price).toLocaleString("vi-VN")}₫</td>
                  <td className="p-2">
                    <input type="number" min={1} value={it.quantity}
                           onChange={e=>updateQty(it.id,+e.target.value)}
                           className="border w-16 px-1" />
                  </td>
                  <td className="p-2">
                    {(it.price*it.quantity).toLocaleString("vi-VN")}₫
                  </td>
                  <td className="p-2">
                    <button onClick={()=>deleteItem(it.id)}
                            className="text-red-600 hover:underline">Xoá</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ---- tổng ---- */}
          <div className="text-right mt-4">
            <span className="font-semibold mr-2">Tổng cộng:</span>
            <span className="text-xl font-bold">{total.toLocaleString("vi-VN")}₫</span>
          </div>

          {/* ---- 3 PHƯƠNG THỨC (UI‑ONLY) ---- */}
          <div className="flex flex-col items-end gap-4 mt-6">
            <div className="flex gap-8">
              {/* Bank */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="pay" value="bank"
                       checked={payMethod==="bank"}
                       onChange={()=>setPayMethod("bank")} />
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEFaf0MFHgrZ5wv6tTuXgoynaqldmnROJuIg&s"
                  className="h-8 w-auto" />
                <span className="text-sm">Ngân hàng</span>
              </label>

              {/* Momo */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="pay" value="momo"
                       checked={payMethod==="momo"}
                       onChange={()=>setPayMethod("momo")} />
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCbN3sfa0iwFLjfa9h3osHIiMig0UxgXs_hw&s"  // ← giữ full chuỗi của bạn
                  className="h-8 w-auto" />
                <span className="text-sm">Momo</span>
              </label>

              {/* COD */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="pay" value="cod"
                       checked={payMethod==="cod"}
                       onChange={()=>setPayMethod("cod")} />
                <img
                  src="https://i.pinimg.com/564x/5d/8b/85/5d8b85728f347ea9f02f0aa17fe06d5e.jpg" // ← giữ full
                  className="h-8 w-auto" />
                <span className="text-sm">Ship COD</span>
              </label>
            </div>

            {/* ---- nút pay ---- */}
            <button
              onClick={handlePay}
              disabled={!pendingItems.length}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Thanh toán
            </button>
          </div>
        </div>
      )}

      {/* =============== ĐƠN ĐÃ GỬI (giữ nguyên UI cũ) =============== */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Đơn hàng của bạn</h2>
        {activeOrders.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào.</p>
        ) : activeOrders.map(o => (
          <div key={o.id} className="border rounded mb-4">
            <div className="bg-gray-100 p-2 flex flex-wrap gap-4 items-center">
              <span><b>Mã đơn:</b> #{o.id}</span>
              <span><b>Ngày đặt:</b> {new Date(o.created_at).toLocaleDateString("vi-VN")}</span>
              <span><b>Tổng tiền:</b> {Number(o.total_price).toLocaleString("vi-VN")}₫</span>
              <span className="ml-auto">
                <span className={`px-2 py-1 rounded text-white ${
                  o.status==='pending'    ? 'bg-yellow-500' :
                  o.status==='processing' ? 'bg-blue-500'   :
                  o.status==='completed'  ? 'bg-green-500'  : 'bg-red-500'
                }`}>
                  {o.status==='pending'    ? 'Chờ thanh toán' :
                   o.status==='processing' ? 'Đang xử lý'     :
                   o.status==='completed'  ? 'Hoàn thành'     : 'Đã hủy'}
                </span>
              </span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2">Sản phẩm</th><th className="p-2 w-24">Giá</th>
                  <th className="p-2 w-16">SL</th><th className="p-2 w-24">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {o.items.map(it=>(
                  <tr key={it.id} className="border-b">
                    <td className="p-2 flex items-center gap-2">
                      <img src={it.image?HOST+it.image:"/ex_img.png"}
                           className="h-12 w-12 object-cover"/><span>{it.name}</span>
                    </td>
                    <td className="p-2">{Number(it.price).toLocaleString("vi-VN")}₫</td>
                    <td className="p-2 text-center">{it.quantity}</td>
                    <td className="p-2">
                      {(it.price*it.quantity).toLocaleString("vi-VN")}₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* toast hiển thị */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${toast.c}
                         text-white px-4 py-2 rounded shadow-lg`}>
          {toast.m}
        </div>
      )}
    </div>
  );
}