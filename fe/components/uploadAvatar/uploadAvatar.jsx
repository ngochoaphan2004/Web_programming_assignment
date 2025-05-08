import axiosConfig from "@/axiosConfig";
import { useEffect, useState } from "react";

const HOST = process.env.NEXT_PUBLIC_BASE_BE_URL

export default function UploadFileAvatar({avatar, setFile}) {
    const [logoPreview, setLogoPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
                setFile(file)
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
        <div className="group hover:bg-gray-500 hover:opacity-50 transition-all duration-300 border border-gray-300 flex-1 absolute w-32 h-32 rounded-full relative overflow-hidden">
            <img
                src={logoPreview || HOST + avatar}
                alt="Avatar"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                    e.target.src = '/avatar.png';
                }}
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
                className="group opacity-0 hover:opacity-100 transition-all duration-300 hidden group-hover:inline-block text-sm font-medium text-gray-700 cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            >
                Chọn ảnh
            </label>
        </div>
    );
}
