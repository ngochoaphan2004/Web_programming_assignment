import { useState } from "react";
import axiosConfig from "@/axiosConfig";

export default function UploadFileAvatar({ avatar }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadConfirm = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("avatar", selectedFile);

        try {
            const res = await axiosConfig.post("/user/avatar", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Upload thành công", res.data);
            window.location.reload();
        } catch (err) {
            console.error("Upload thất bại", err);
            alert("Có lỗi xảy ra khi tải ảnh lên");
        }
    };

    return (
        <div className="flex flex-col items-center space-y-2 relative">
            <div className="group hover:bg-gray-500 hover:opacity-50 transition-all duration-300 border border-gray-300 w-32 h-32 rounded-full relative overflow-hidden">
                <img
                    src={logoPreview || avatar || "avatar.png"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "avatar.png")}
                />
                <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <label
                    htmlFor="logo-upload"
                    className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white bg-black bg-opacity-40 opacity-0 hover:opacity-100 cursor-pointer"
                >
                    Chọn ảnh
                </label>
            </div>

            {/* Nút xác nhận chỉ hiện khi đã chọn file */}
            {selectedFile && (
                <button
                    onClick={handleUploadConfirm}
                    className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Save Change
                </button>
            )}
        </div>
    );
}