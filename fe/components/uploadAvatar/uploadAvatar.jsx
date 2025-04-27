import { useState } from "react";

export default function UploadFileAvatar() {
    const [logoPreview, setLogoPreview] = useState(null);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="group hover:bg-gray-500 hover:opacity-50 transition-all duration-300 border border-gray-300 flex-1 absolute w-32 h-32 rounded-full relative overflow-hidden">
            <img
                src={logoPreview || "/../../../../../avatar.png"}
                alt="Avatar"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                    e.target.src = '/images/default-logo.png';
                }}
            />
            <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
            />
            <label
                htmlFor="logo-upload"
                className="group opacity-0 hover:opacity-100 transition-all duration-300 hidden group-hover:inline-block text-sm font-medium text-gray-700 cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            >
                Chọn ảnh
            </label>
        </div>
    )
}