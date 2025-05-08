"use client";

import React, { useEffect, useState } from "react";
import axiosConfig from "@/axiosConfig";

export default function AdminIntroducePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [banners, setBanners] = useState([]);
  const [intro, setIntro] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [thank, setThanks] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ type: "", content: "", image: null, order_index: '' });
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  // Load animate.css via CDN
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Check admin role and load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosConfig.get("/user/now", { withCredentials: true });
        const isAdminStatus = userRes.data.data.role === 1;
        setIsAdmin(isAdminStatus);
        console.log("isAdmin:", isAdminStatus);

        if (!isAdminStatus) {
          setMessage("Bạn không có quyền truy cập trang này.");
          setShowAlert(true);
          return;
        }

        const bannerRes = await axiosConfig.get("/banner");
        if (Array.isArray(bannerRes.data)) {
          setBanners(bannerRes.data);
        } else {
          throw new Error("Dữ liệu banner không hợp lệ.");
        }

        const introRes = await axiosConfig.get("/introduce");
        const data = introRes.data || {};
        setIntro(data.intro || []);
        setCommitments((data.commitments || []).sort((a, b) => a.order_index - b.order_index));
        setThanks(data.thank || []);
      } catch (error) {
        console.error("Error loading data:", error);
        setMessage(error.message || "Không thể tải dữ liệu. Vui lòng thử lại.");
        setShowAlert(true);
      }
    };

    fetchData();
  }, []);

  // Handle edit item
  const handleEdit = async (type, item) => {
    // Kiểm tra thông tin bắt buộc
    if (type === "banner" && !editingItem.image) {
      setMessage("Vui lòng chọn hình ảnh để cập nhật banner.");
      setShowAlert(true);
      return;
    }
    if (type !== "banner" && !editingItem.content) {
      setMessage("Vui lòng nhập nội dung.");
      setShowAlert(true);
      return;
    }

    try {
      let response;
      if (type === "banner") {
        const formData = new FormData();
        formData.append("id", item.id);
        if (editingItem.image) {
          formData.append("image", editingItem.image);
        }
        response = await axiosConfig.post("/banner/update", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axiosConfig.put(`/introduce/${type}/${item.order_index}`, {
          content: editingItem.content,
          order_index: editingItem.order_index,
        }, { withCredentials: true });
      }
      setMessage(response.data.message || "Cập nhật thành công!");
      setShowAlert(true);
      setEditingItem(null);

      if (type === "banner") {
        const res = await axiosConfig.get("/banner");
        setBanners(res.data || []);
      } else {
        const res = await axiosConfig.get("/introduce");
        const data = res.data || {};
        setIntro(data.intro || []);
        setCommitments((data.commitments || []).sort((a, b) => a.order_index - b.order_index));
        setThanks(data.thank || []);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi cập nhật. Vui lòng thử lại.");
      setShowAlert(true);
      console.error("Edit error:", error);
    }
  };

  // Handle delete item
  const handleDelete = async (type, id) => {
    try {
      let response;
      if (type === "banner") {
        response = await axiosConfig.delete("/banner", {
          data: { id },
          withCredentials: true,
        });
      } else {
        response = await axiosConfig.delete(`/introduce/${type}/${id}`, { withCredentials: true });
      }
      setMessage(response.data.message || "Xóa thành công!");
      setShowAlert(true);

      if (type === "banner") {
        const res = await axiosConfig.get("/banner");
        setBanners(res.data || []);
      }  else {
        const res = await axiosConfig.get("/introduce");
        const data = res.data || {};
        setIntro(data.intro || []);
        setCommitments((data.commitments || []).sort((a, b) => a.order_index - b.order_index));
        setThanks(data.thank || []);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi xóa. Vui lòng thử lại.");
      setShowAlert(true);
      console.error("Delete error:", error);
    }
  };

  // Handle add new item
  const handleAdd = async (e) => {
    e.preventDefault();

    // Kiểm tra thông tin bắt buộc
    if (!newItem.type) {
      setMessage("Vui lòng chọn loại nội dung.");
      setShowAlert(true);
      return;
    }
    if (newItem.type === "banner" && !newItem.image) {
      setMessage("Vui lòng chọn hình ảnh cho banner.");
      setShowAlert(true);
      return;
    }
    if (newItem.type !== "banner" && !newItem.content) {
      setMessage("Vui lòng nhập nội dung.");
      setShowAlert(true);
      return;
    }
    if (newItem.type !== "banner" && (newItem.order_index === undefined || newItem.order_index === '')) {
      setMessage("Vui lòng nhập thứ tự hiển thị.");
      setShowAlert(true);
      return;
    }

    try {
      let response;
      if (newItem.type === "banner") {
        const formData = new FormData();
        if (newItem.image) {
          formData.append("image", newItem.image);
        }
        response = await axiosConfig.post("/banner", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axiosConfig.post("/introduce", {
          content: newItem.content,
          section: newItem.type,
          order_index: newItem.order_index,
        }, { withCredentials: true , headers: { "Content-Type": "multipart/form-data" }});
      }
      setMessage(response.data.message || "Thêm mới thành công!");
      setShowAlert(true);
      setNewItem({ type: "", content: "", image: null, order_index: '' });

      if (newItem.type === "banner") {
        const res = await axiosConfig.get("/banner");
        setBanners(res.data || []);
      } else {
        const res = await axiosConfig.get("/introduce");
        const data = res.data || {};
        setIntro(data.intro || []);
        setCommitments((data.commitments || []).sort((a, b) => a.order_index - b.order_index));
        setThanks(data.thank || []);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi thêm mới. Vui lòng thử lại.");
      setShowAlert(true);
      console.error("Add error:", error);
    }
  };

  // Close alert
  const closeAlert = () => {
    setShowAlert(false);
    setMessage("");
  };

  // Auto-close alert after 3 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => closeAlert(), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  if (!isAdmin) {
    return (
      <div className="bg-gray-100 px-4 sm:px-6 lg:px-8 py-12 font-sans text-gray-900 min-h-screen">
        {showAlert && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
              <p className="text-center text-red-600">{message}</p>
              <button
                onClick={closeAlert}
                className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold text-center text-red-600">Truy cập bị từ chối</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 px-4 sm:px-6 lg:px-8 py-12 font-sans text-gray-900 min-h-screen">
      {/* Alert */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <p
              className={`text-center ${
                message.includes("thành công") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
            <button
              onClick={closeAlert}
              className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-center text-gray-800">
              Bạn có chắc muốn xóa nội dung này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  handleDelete(confirmation.type, confirmation.id);
                  setConfirmation(null);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setConfirmation(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all duration-200"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold mb-8 pb-3 text-center text-blue-600 border-b-4 border-blue-200 animate__animated animate__fadeIn">
        Quản lý nội dung trang giới thiệu
      </h1>

      <section className="max-w-5xl mx-auto space-y-12">
        {/* Banners */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-500 animate__animated animate__fadeIn animate__delay-1s">
            Banner
          </h2>
          {banners.map((b) => (
            <div
              key={b.id}
              className="group bg-white p-6 rounded-lg shadow-md mb-4 relative animate__animated animate__fadeIn animate__delay-2s"
            >
              {editingItem && editingItem.id === b.id && editingItem.type === "banner" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit("banner", b);
                  }}
                  className="space-y-4"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border p-3 rounded"
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.files[0] })}
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={!editingItem.image}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <img src={b.image} alt={`banner-${b.id}`} className="w-32 h-16 object-cover mb-2" />
                  <div className="absolute top-4 right-4 flex space-x-2 z-10 hidden group-hover:block">
                    <button
                      onClick={() => setEditingItem({ type: "banner", id: b.id, image: null })}
                      className="bg-transparent border border-yellow-600 text-yellow-600 font-semibold px-4 py-2 rounded hover:bg-yellow-600 hover:text-white"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => setConfirmation({ type: "banner", id: b.id })}
                      className="bg-transparent border border-red-600 text-red-600 font-semibold px-4 py-2 rounded hover:bg-red-600 hover:text-white"
                    >
                      Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Intro */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-500 animate__animated animate__fadeIn animate__delay-1s">
            Giới thiệu
          </h2>
          {intro.map((item) => (
            <div
              key={item.order_index}
              className="group bg-white p-6 rounded-lg shadow-md mb-4 relative animate__animated animate__fadeIn animate__delay-2s"
            >
              {editingItem && editingItem.order_index === item.order_index && editingItem.type === "intro" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit("intro", item);
                  }}
                  className="space-y-4"
                >
                  <textarea
                    rows={4}
                    placeholder="Nội dung"
                    className="w-full border p-3 rounded"
                    value={editingItem.content}
                    onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={!editingItem.content}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-lg font-medium text-gray-900">{item.content}</p>
                  <p className="text-sm text-gray-600">Thứ tự: {item.order_index}</p>
                  <div className="absolute top-4 right-4 flex space-x-2 z-10 hidden group-hover:block">
                    <button
                      onClick={() => setEditingItem({ type: "intro", order_index: item.order_index, content: item.content })}
                      className="bg-transparent border border-yellow-600 text-yellow-600 font-semibold px-4 py-2 rounded hover:bg-yellow-600 hover:text-white"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => setConfirmation({ type: "intro", id: item.order_index })}
                      className="bg-transparent border border-red-600 text-red-600 font-semibold px-4 py-2 rounded hover:bg-red-600 hover:text-white"
                    >
                      Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Commitments */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-500 animate__animated animate__fadeIn animate__delay-1s">
            Cam kết
          </h2>
          {commitments.map((item) => (
            <div
              key={item.order_index}
              className="group bg-white p-6 rounded-lg shadow-md mb-4 relative animate__animated animate__fadeIn animate__delay-2s"
            >
              {editingItem && editingItem.order_index === item.order_index && editingItem.type === "commitment" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit("commitment", item);
                  }}
                  className="space-y-4"
                >
                  <textarea
                    rows={3}
                    placeholder="Nội dung"
                    className="w-full border p-3 rounded"
                    value={editingItem.content}
                    onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={!editingItem.content}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity  disabled:opacity-50"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-lg font-medium text-gray-900">{item.content}</p>
                  <p className="text-sm text-gray-600">Thứ tự: {item.order_index}</p>
                  <div className="absolute top-4 right-4 flex space-x-2 z-10 hidden group-hover:block">
                    <button
                      onClick={() =>
                        setEditingItem({ type: "commitment", order_index: item.order_index, content: item.content })
                      }
                      className="bg-transparent border border-yellow-600 text-yellow-600 font-semibold px-4 py-2 rounded hover:bg-yellow-600 hover:text-white"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => setConfirmation({ type: "commitment", id: item.order_index })}
                      className="bg-transparent border border-red-600 text-red-600 font-semibold px-4 py-2 rounded hover:bg-red-600 hover:text-white"
                    >
                      Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Thanks */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-500 animate__animated animate__fadeIn animate__delay-1s">
            Lời cảm ơn
          </h2>
          {thank.map((item) => (
            <div
              key={item.order_index}
              className="group bg-white p-6 rounded-lg shadow-md mb-4 relative animate__animated animate__fadeIn animate__delay-2s"
            >
              {editingItem && editingItem.order_index === item.order_index && editingItem.type === "thank" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit("thank", item);
                  }}
                  className="space-y-4"
                >
                  <textarea
                    rows={4}
                    placeholder="Nội dung"
                    className="w-full border p-3 rounded"
                    value={editingItem.content}
                    onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={!editingItem.content}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-lg font-medium text-gray-900">{item.content}</p>
                  <p className="text-sm text-gray-600">Thứ tự: {item.order_index}</p>
                  <div className="absolute top-4 right-4 flex space-x-2 z-10 hidden group-hover:block">
                    <button
                      onClick={() => setEditingItem({ type: "thank", order_index: item.order_index, content: item.content })}
                      className="bg-transparent border border-yellow-600 text-yellow-600 font-semibold px-4 py-2 rounded hover:bg-yellow-600 hover:text-white"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => setConfirmation({ type: "thank", id: item.order_index })}
                      className="bg-transparent border border-red-600 text-red-600 font-semibold px-4 py-2 rounded hover:bg-red-600 hover:text-white"
                    >
                      Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add New Item Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-blue-500">Thêm nội dung mới</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              className="w-full border p-3 rounded"
            >
              <option value="">Chọn loại nội dung</option>
              <option value="banner">Banner</option>
              <option value="intro">Giới thiệu</option>
              <option value="commitment">Cam kết</option>
              <option value="thank">Lời cảm ơn</option>
            </select>
            {newItem.type === "banner" ? (
              <input
                type="file"
                accept="image/*"
                className="w-full border p-3 rounded"
                onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
              />
            ) : (
              <>
                <textarea
                  rows={4}
                  placeholder="Nội dung"
                  className="w-full border p-3 rounded"
                  value={newItem.content}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Thứ tự hiển thị"
                  className="w-full border p-3 rounded"
                  value={newItem.order_index ?? ''}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      order_index: e.target.value === '' ? '' : parseInt(e.target.value),
                    })
                  }
                />
              </>
            )}
            <button
              type="submit"
              disabled={
                !newItem.type ||
                (newItem.type === "banner" && !newItem.image) ||
                (newItem.type !== "banner" && (!newItem.content || newItem.order_index === undefined || newItem.order_index === ''))
              }
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Thêm mới
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}