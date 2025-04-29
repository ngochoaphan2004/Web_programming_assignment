// src/app/cart/page.jsx
"use client";
import { useEffect, useState } from "react";
import axios from "@/axiosConfig"; // axios instance with baseURL=http://localhost:80/api and withCredentials
import axiosConfig from "@/axiosConfig";

export default function CartPage() {
  const [items, setItems] = useState([]); // [{id,item fields}]
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  /* lấy giỏ hàng khi trang mở */
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axiosConfig.get("/cart");
      if (res.data.success) {
        setOrderId(res.data.data.order_id);
        setItems(res.data.data.items);
      }
    } catch (err) {
      console.error("Load cart error", err);
      alert("Bạn cần đăng nhập để xem giỏ hàng!");
    } finally {
      setLoading(false);
    }
  };

  /* sửa số lượng */
  const updateQty = async (itemId, qty) => {
    qty = Math.max(1, qty);
    try {
      await axiosConfig.post(`/cart/item/${itemId}`, { quantity: qty });
      setItems(prev => prev.map(i => (i.id === itemId ? { ...i, quantity: qty } : i)));
    } catch (err) {
      console.error(err);
    }
  };

  /* xoá item */
  const deleteItem = async (itemId) => {
    if (!confirm("Xoá sản phẩm khỏi giỏ?")) return;
    try {
      await axiosConfig.delete(`/cart/item/${itemId}`);
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (err) {
      console.error(err);
    }
  };

  /* tính tổng */
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

  if (loading) return <p className="p-4">Đang tải giỏ hàng...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
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
              {items.map(it => (
                <tr key={it.id} className="border-b">
                  <td className="p-2 flex items-center gap-2">
                    <img src={it.image || "/ex_img.png"} alt="img" className="h-12 w-12 object-cover" />
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

          {/* Nút thanh toán giả */}
          <div className="text-right mt-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
