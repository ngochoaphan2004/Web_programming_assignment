// src/app/cart/page.jsx
"use client";
import { useEffect, useState } from "react";
import axios from "@/axiosConfig"; // axios instance with baseURL and withCredentials
import axiosConfig from "@/axiosConfig";
const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL;

export default function CartPage() {
  const [pendingItems, setPendingItems] = useState([]); // Current cart items
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]); // Orders being processed
  const [loading, setLoading] = useState(true);

  // Gửi yêu cầu thanh toán (đổi trạng thái đơn => processing)
  const handlePay = async () => {
    try {
      const res = await axiosConfig.post(`/orders/${pendingOrderId}/pay`);
      if (res.data.success) {
        alert("Đã gửi đơn! Shop sẽ xử lý sớm.");
        fetchOrders(); // Reload both cart and active orders
      } else {
        alert("Có lỗi khi thanh toán!");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi, vui lòng thử lại!");
    }
  };

  /* lấy giỏ hàng và đơn đang xử lý khi trang mở */
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Fetch pending cart
      const cartRes = await axiosConfig.get("/cart");
      if (cartRes.data.success) {
        setPendingOrderId(cartRes.data.data.order_id);
        setPendingItems(cartRes.data.data.items);
      }

      // Fetch user's active orders
      const ordersRes = await axiosConfig.get("/user/orders");
      if (ordersRes.data.success) {
        setActiveOrders(ordersRes.data.data);
      }
    } catch (err) {
      console.error("Load orders error", err);
      alert("Bạn cần đăng nhập để xem giỏ hàng và đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  /* sửa số lượng */
  const updateQty = async (itemId, qty) => {
    qty = Math.max(1, qty);
    try {
      await axiosConfig.post(`/cart/item/${itemId}`, { quantity: qty });
      setPendingItems(prev => prev.map(i => (i.id === itemId ? { ...i, quantity: qty } : i)));
    } catch (err) {
      console.error(err);
    }
  };

  /* xoá item */
  const deleteItem = async (itemId) => {
    if (!confirm("Xoá sản phẩm khỏi giỏ?")) return;
    try {
      await axiosConfig.delete(`/cart/item/${itemId}`);
      setPendingItems(prev => prev.filter(i => i.id !== itemId));
    } catch (err) {
      console.error(err);
    }
  };

  /* tính tổng */
  const total = pendingItems.reduce((s, it) => s + it.price * it.quantity, 0);

  if (loading) return <p className="p-4">Đang tải...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>

      {pendingItems.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <div className="overflow-x-auto">
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
                    <img src={it.image ? HOST + it.image : "/ex_img.png"} alt="img" className="h-12 w-12 object-cover" />
                    <span>{it.name}</span>
                  </td>

                  <td className="p-2">{Number(it.price).toLocaleString("vi-VN")}₫</td>

                  <td className="p-2">
                    <input
                      type="number"
                      value={it.quantity}
                      min={1}
                      onChange={e => updateQty(it.id, parseInt(e.target.value))}
                      className="border w-16 px-1"
                    />
                  </td>

                  <td className="p-2">
                    {(it.price * it.quantity).toLocaleString("vi-VN")}₫
                  </td>

                  <td className="p-2">
                    <button
                      onClick={() => deleteItem(it.id)}
                      className="text-red-600 hover:underline"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TỔNG */}
          <div className="text-right mt-4">
            <span className="font-semibold mr-2">Tổng cộng:</span>
            <span className="text-xl font-bold">
              {total.toLocaleString("vi-VN")}₫
            </span>
          </div>

          {/* Nút thanh toán */}
          <div className="text-right mt-4">
            <button
              onClick={handlePay}
              disabled={!pendingItems.length}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Thanh toán
            </button>
          </div>
        </div>
      )}

      {/* Đơn hàng đang xử lý */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Đơn hàng của bạn</h2>
        
        {activeOrders.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div>
            {activeOrders.map(order => (
              <div key={order.id} className="border rounded mb-4">
                <div className="bg-gray-100 p-2 flex flex-wrap gap-4 items-center">
                  <span><b>Mã đơn:</b> #{order.id}</span>
                  <span><b>Ngày đặt:</b> {new Date(order.created_at).toLocaleDateString("vi-VN")}</span>
                  <span><b>Tổng tiền:</b> {Number(order.total_price).toLocaleString("vi-VN")}₫</span>
                  <span className="ml-auto">
                    <span className={`px-2 py-1 rounded text-white ${
                      order.status === 'pending' ? 'bg-yellow-500' :
                      order.status === 'processing' ? 'bg-blue-500' :
                      order.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {order.status === 'pending' ? 'Chờ thanh toán' :
                       order.status === 'processing' ? 'Đang xử lý' :
                       order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                    </span>
                  </span>
                </div>
                
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2">Sản phẩm</th>
                      <th className="p-2 w-24">Giá</th>
                      <th className="p-2 w-16">SL</th>
                      <th className="p-2 w-24">Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2 flex items-center gap-2">
                          <img src={item.image ? HOST + item.image : "/ex_img.png"} alt="img" className="h-12 w-12 object-cover" />
                          <span>{item.name}</span>
                        </td>
                        <td className="p-2">{Number(item.price).toLocaleString("vi-VN")}₫</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2">{(item.price * item.quantity).toLocaleString("vi-VN")}₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}